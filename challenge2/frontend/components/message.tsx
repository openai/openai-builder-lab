import { MessageItem } from '@/lib/assistant'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import './message.css'

interface MessageProps {
  message: MessageItem
  loading?: boolean
}

const Message: React.FC<MessageProps> = ({ message, loading }) => {
  return (
    <div className="text-sm">
      {message.role === 'user' ? (
        <div className="flex justify-end">
          <div>
            <div className="my-2 flex justify-end text-xs text-zinc-600 font-medium">
              Me
            </div>
            <div className="ml-4 rounded-[18px] px-4 py-2 md:ml-24 bg-white text-zinc-900  font-light">
              <div>
                <div>
                  <ReactMarkdown>{message.content as string}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="my-2 text-xs text-zinc-600 font-medium">
            Assistant
          </div>
          <div className="flex">
            <div className="mr-4 rounded-[18px] px-4 py-2 md:mr-24 text-white bg-black font-light">
              <div>
                {loading ? (
                  <div className="min-h-4 flex justify-center items-center h-full">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                ) : (
                  <ReactMarkdown>{message.content as string}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message
