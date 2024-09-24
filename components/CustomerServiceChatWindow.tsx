"use client"
import { useEffect, useRef } from "react"
import { Chat, Message } from "./CustomerServiceChat"
import { Avatar } from "./ui/avatar"
import { Button } from "./ui/button"
import { MessageCircle, Paperclip, Send, User } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { formatMessageDate } from "@/lib/utils"

const CustomerServiceChatWindow = ({ messages, inputMessage, handleInputChange, handleSendMessage, isTyping, selectedChat, userId }: { selectedChat: Chat | undefined, messages: Message[], inputMessage: string, handleInputChange: (value: string) => void, handleSendMessage: () => void, isTyping: boolean, userId: string }) => {


  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);


  return (
    <div className="flex-1 flex flex-col">
      {selectedChat ? (
        <>
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="w-10 h-10 mr-3 bg-gray-600 items-center justify-center">
                <h1 className="text-white">{selectedChat?.firstname.charAt(0).toUpperCase()}</h1>
              </Avatar>
              <div>
                <p className="text-black">{selectedChat?.firstname} {selectedChat?.lastname}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isSenderSupport ? 'justify-end' : 'justify-start'
                  } mb-4`}
              >
                <div
                  className={`rounded-lg p-3 max-w-xs ${message.isSenderSupport
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                    }`}
                >
                  {message.isImage ? (
                    <img src={message.content} alt="Shared image" className="max-w-full rounded" />
                  ) : (
                    <p className="text-black">{message.content}</p>
                  )}
                  <span className="text-xs text-gray-400 block mt-1">
                    {formatMessageDate(message.sentAt)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="rounded-lg p-3 max-w-xs bg-gray-200">
                  <p className="text-black">Typing...</p>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-1 mx-2 text-black"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
            <p className="mt-1 text-sm text-gray-500">Select a chat from the sidebar to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerServiceChatWindow