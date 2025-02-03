import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { SYSTEM_PROMPT } from './constants'
import useConversationStore from '@/stores/useConversationStore'
import { handleTool } from './tools'

export interface MessageItem {
  type: 'message'
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface FunctionCallItem {
  type: 'function_call'
  status: 'in_progress' | 'completed' | 'failed'
  id: string
  name: string
  arguments: string
  parsedArguments: any
  output: string | null
}

export type Item = MessageItem | FunctionCallItem

export const handleTurn = async () => {
  const {
    chatMessages,
    conversationItems,
    setChatMessages,
    setConversationItems
  } = useConversationStore.getState()

  const allConversationItems: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...conversationItems
  ]

  try {
    // To use the python backend, replace by
    //const response = await fetch('http://localhost:8000/get_response', {
    const response = await fetch('/api/get_response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: allConversationItems })
    })

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`)
      return
    }

    const data: MessageItem = await response.json()

    // Update conversation items
    conversationItems.push(data)
    setConversationItems([...conversationItems])

    const lastMessage = conversationItems[conversationItems.length - 1]
    if (
      lastMessage &&
      lastMessage.role === 'assistant' &&
      lastMessage.tool_calls &&
      lastMessage.tool_calls.length > 0
    ) {
      // Get tool call result
      const toolCallResult = await handleTool(
        lastMessage.tool_calls[0].function.name,
        lastMessage.tool_calls[0].function.arguments
      )

      conversationItems.push({
        role: 'tool',
        tool_call_id: lastMessage.tool_calls[0].id,
        content: JSON.stringify(toolCallResult)
      })

      setConversationItems([...conversationItems])
      await handleTurn()
    } else {
      // Update chat messages
      chatMessages.push(data)
      setChatMessages([...chatMessages])
    }
  } catch (error) {
    console.error('Error processing messages:', error)
  }
}
