import { formatMessageDate } from "@/lib/utils"
import { Avatar } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { Chat } from "./CustomerServiceChat"

const ChatList = ({ chats, selectedChat, handleChatSelect }: { chats: Chat[], selectedChat: Chat | undefined, handleChatSelect: (chat: Chat) => void }) => {
  return (
    <div className="w-1/4 bg-white border-r  border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 text-black">Active Chats</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
              selectedChat?.id === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            onClick={() => handleChatSelect(chat)}
          >
            <>{selectedChat?.contractorImageUrl  
            ?<Avatar className="w-10 h-10 mr-3">
              <h3 className="text-black">{chat?.firstname}</h3>
            </Avatar>
            :<Avatar className="w-10 h-10 mr-3 bg-gray-600 items-center justify-center">
              <h3 className="text-white">{chat?.firstname.charAt(0) + chat?.lastname.charAt(0)}</h3>
            </Avatar>
            
            }
            </>
            <div>
              <p className="text-sm text-black">{chat.firstname} {chat.lastname}</p>
              <p className="text-sm text-gray-500">{chat.lastMessage}</p>
            </div>
            <span className="ml-auto text-xs text-gray-400">
              {formatMessageDate(chat.lastMessageAt)}
            </span>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default ChatList
