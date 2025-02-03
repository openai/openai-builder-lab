import { create } from 'zustand'
import { Item } from '@/lib/assistant'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { INITIAL_MESSAGE } from '@/lib/constants'

interface ConversationState {
  // Items displayed in the chat
  chatMessages: Item[]
  // Items sent to the Chat Completions API
  conversationItems: ChatCompletionMessageParam[]

  setChatMessages: (items: Item[]) => void
  setConversationItems: (messages: ChatCompletionMessageParam[]) => void
  addChatMessage: (item: Item) => void
  addConversationItem: (message: ChatCompletionMessageParam) => void
}

const useConversationStore = create<ConversationState>((set, get) => ({
  chatMessages: [
    {
      type: 'message',
      role: 'assistant',
      content: INITIAL_MESSAGE
    }
  ],
  conversationItems: [],
  setChatMessages: items => set({ chatMessages: items }),
  setConversationItems: messages => set({ conversationItems: messages }),
  addChatMessage: item =>
    set(state => ({ chatMessages: [...state.chatMessages, item] })),
  addConversationItem: message =>
    set(state => ({ conversationItems: [...state.conversationItems, message] }))
}))

export default useConversationStore
