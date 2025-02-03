import React from 'react'

import { FunctionCallItem, Item } from '@/lib/assistant'
import { ChevronRight, Code, LoaderCircle, X, Zap } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface FunctionCallProps {
  functionCall: FunctionCallItem
  previousItem: Item
}

const ToolCall: React.FC<FunctionCallProps> = ({
  functionCall,
  previousItem
}: FunctionCallProps) => {
  const [showDetails, setShowDetails] = React.useState(false)
  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="flex justify-start pt-8">
      <div className="flex flex-col bg-white rounded-[16px] w-[70%] relative my-3">
        <div>
          {previousItem.type === 'function_call' ? (
            <div className="absolute -top-16 pt-1.5 z-0 left-5">
              <div className="w-1 h-14 bg-gray-500 bg-opacity-50"></div>
            </div>
          ) : null}

          <div className="flex flex-col text-sm overflow-x-hidden rounded-[16px]  z-10">
            <div className="font-semibold p-3 pl-4 text-gray-700 rounded-b-none flex justify-between">
              <div className="flex items-center">
                <Zap size={16} />
                <span className="ml-2">
                  {functionCall.name
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
              </div>
              <span
                className={`mt-0.5 transform text-gray-500 cursor-pointer transition-transform duration-300 ${
                  showDetails ? 'rotate-90' : 'rotate-0'
                }`}
                onClick={toggleShowDetails}
              >
                <ChevronRight size={16} />
              </span>
            </div>
            {showDetails && (
              <div>
                <div className="max-h-72 overflow-y-scroll text-xs border-b-[1.5px]">
                  <SyntaxHighlighter
                    customStyle={{
                      backgroundColor: '#fff',
                      padding: '8px',
                      paddingLeft: '4px',
                      borderRadius: '0.5rem',
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      marginTop: 0,
                      marginBottom: 0
                    }}
                    language="json"
                    style={coy}
                  >
                    {JSON.stringify(functionCall.parsedArguments, null, 2)}
                  </SyntaxHighlighter>
                </div>
                <div className="max-h-96 overflow-y-scroll min-h-20 rounded-lg rounded-t-none">
                  {functionCall.output ? (
                    <SyntaxHighlighter
                      customStyle={{
                        backgroundColor: '#fff',
                        padding: '8px',
                        paddingLeft: '4px',
                        borderRadius: '0.5rem',
                        marginTop: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                      }}
                      language="json"
                      style={coy}
                    >
                      {JSON.stringify(JSON.parse(functionCall.output), null, 2)}
                    </SyntaxHighlighter>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolCall
