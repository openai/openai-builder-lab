'use client'

import { Item } from '@/lib/assistant'
import React, { useEffect, useRef, useState } from 'react'
import ToolCall from './tool-call'
import Message from './message'
import './message.css'

interface ChatProps {
  items: Item[]
  onSendMessage: (message: string) => void
  loading: boolean
}

const Chat: React.FC<ChatProps> = ({ items, onSendMessage, loading }) => {
  const itemsEndRef = useRef<HTMLDivElement>(null)
  const [inputMessageText, setinputMessageText] = useState<string>('')

  const scrollToBottom = () => {
    itemsEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [items])

  return (
    <div className="flex justify-center items-center size-full">
      <div className="flex grow flex-col h-full max-w-[750px] gap-2">
        <div className="h-[90vh] overflow-y-scroll px-10">
          <div className="space-y-1 pt-4 ">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.type === 'function_call' ? (
                  <ToolCall
                    functionCall={item}
                    previousItem={items[index - 1]}
                  />
                ) : (
                  <Message message={item} />
                )}
              </React.Fragment>
            ))}
            {loading && (
              <Message
                message={{ type: 'message', role: 'assistant', content: '' }}
                loading={loading}
              />
            )}
            <div ref={itemsEndRef} />
          </div>
        </div>
        <div className="flex-1 p-4 px-10">
          <div className="flex items-center">
            <div className="flex w-full items-center">
              <div className="flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-white">
                <div className="flex items-center gap-1.5 md:gap-2 pl-4">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <textarea
                      id="prompt-textarea"
                      tabIndex={0}
                      dir="auto"
                      rows={1}
                      placeholder="Send message"
                      className="m-0 resize-none border-0 focus:outline-none text-sm bg-transparent px-0 py-2 max-h-[20dvh]"
                      value={inputMessageText}
                      onChange={e => setinputMessageText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          onSendMessage(inputMessageText)
                          setinputMessageText('')
                        }
                      }}
                    />
                  </div>
                  <button
                    disabled={!inputMessageText}
                    data-testid="send-button"
                    className="flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:bg-[#D7D7D7] disabled:text-[#f4f4f4] disabled:hover:opacity-100"
                    onClick={() => {
                      onSendMessage(inputMessageText)
                      setinputMessageText('')
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 32 32"
                      className="icon-2xl"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
