"use client"
import { useEffect, useRef, useState } from "react"
import { Chat, Conversation, Message } from "./CustomerServiceChat"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Paperclip, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { formatMessageDate } from "@/app/lib/utils"
import Image from "next/image"
import { io, Socket } from "socket.io-client"

const CustomerServiceChatWindow = ({ 
  selectedChat, 
  userId, 
  idToken 
}: { 
  selectedChat: Chat | undefined, 
  userId: string, 
  idToken: string | undefined
}) => {
  const [messages, setMessages] = useState<any[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [typingSent, setTypingSent] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (value: string) => {
    setInputMessage(value);
    if (!typingSent) {
      try {
        socketRef.current?.emit("typing", {
          conversationId: selectedChat?.id,
          userId,
          isTyping: value.length > 0,
        });
        setTypingSent(true);
      } catch (error) {
        console.error(error);
      }
    } else if (value.length === 0) {
      socketRef.current?.emit("typing", {
        conversationId: selectedChat?.id,
        userId,
        isTyping: false,
      });
      setTypingSent(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current || !selectedChat) return;
    try {
      socketRef.current?.emit("supportMessage", {
        userId, content: inputMessage, isSenderSupport: true, isImage: false
      });
      socketRef.current?.emit("typing", {
        conversationId: selectedChat.id,
        userId,
        isTyping: false,
      });
      setTypingSent(false);
      setInputMessage("");
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (!idToken) return
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_WS_URL!

  useEffect(() => {
    console.log("Userid", userId)
    const newSocket = io(API_URL!, {
      query: { userId: userId },
      auth: { token: idToken },
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    if(!selectedChat || !userId) return;
    console.log("Joining chat", selectedChat.id)
    newSocket.emit("join", { userId: userId, conversationId: selectedChat?.id, isSupportChat: true });

    newSocket.on("chatHistory", (fetchedMessages: Conversation[]) => {
      console.log("history received", fetchedMessages)
      if (fetchedMessages.length > 1) {
        console.log("Chat history received:", fetchedMessages);
      }
      setMessages(fetchedMessages);
    });

    newSocket.on("userTyping", ({ conversationId, userId: typingUserId, isTyping }) => {
      console.log("User typing:", { conversationId, userId: typingUserId, isTyping });
      if (userId !== typingUserId) {
        console.log("userid not equal to user.id", userId, typingUserId);
        setIsTyping(isTyping);
      }
    });

    newSocket.on("newSupportMessage", (message) => {
      console.log("New support message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current = newSocket;

  }, [selectedChat]);


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
                key={message.sentAt}
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
                    <Image src={message.content} alt="Shared image" className="max-w-full rounded" width={300} height={300} />
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