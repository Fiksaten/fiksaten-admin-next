import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Chat, Message } from "./CustomerServiceChat";
import { MessageCircle, Paperclip, Send, Smile } from "lucide-react";
import Image from "next/image";
import { formatMessageDate } from "@/app/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerServiceChatWindow = ({ 
  selectedChat, 
  userId, 
  idToken 
}: { 
  selectedChat: Chat | undefined, 
  userId: string, 
  idToken: string | undefined
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const viewportRef = useRef<HTMLDivElement>(null); // Ref for ScrollArea Viewport
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!idToken || !selectedChat) return;

    const API_URL = process.env.NEXT_PUBLIC_WS_URL!;
    const newSocket = io(API_URL, {
      query: { userId },
      auth: { token: idToken },
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server:', newSocket.id);
      newSocket.emit("join", { userId: selectedChat.id, isSupportChat: true });
    });

    newSocket.on("chatHistory", (fetchedMessages: Message[]) => {
      setMessages(fetchedMessages);
      setIsLoading(false);
      scrollToBottom(); // Scroll to bottom after loading history
    });

    newSocket.on("userTyping", ({ userId: typingUserId, isTyping }) => {
      if (userId !== typingUserId) setIsTyping(isTyping);
    });

    newSocket.on("newSupportMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom(); // Scroll to bottom when a new message arrives
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat, idToken, userId]);

  // Use useLayoutEffect to ensure scrolling happens after DOM mutations
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current || !selectedChat) return;
    
    socketRef.current.emit("supportMessage", {
      userId: selectedChat.id,
      content: inputMessage,
      isSenderSupport: true,
      isImage: false
    });

    setInputMessage("");
    handleTypingStatus(false);
  };

  const handleInputChange = (value: string) => {
    setInputMessage(value);
    handleTypingStatus(value.length > 0);
  };

  const handleTypingStatus = (isTyping: boolean) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    socketRef.current?.emit("typing", {
      conversationId: selectedChat?.id,
      userId,
      isTyping,
      isSupportChat: true
    });

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => handleTypingStatus(false), 3000);
    }
  };

  const renderMessages = () => (
    <ScrollArea className="flex-1 p-4 overflow-y-auto" viewportRef={viewportRef}>
      <div className="flex flex-col space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} isSender={message.isSenderSupport} />
        ))}
        {isTyping && <TypingIndicator />}
        {/* Dummy div removed since we're using viewportRef to scroll */}
      </div>
    </ScrollArea>
  );

  if (!selectedChat) {
    return <NoChatSelected />;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader chat={selectedChat} />
      {isLoading ? <LoadingIndicator /> : renderMessages()}
      <ChatInput 
        inputMessage={inputMessage} 
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

const ChatHeader = ({ chat }: { chat: Chat }) => (
  <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
    <div className="flex items-center">
      <Avatar className="w-10 h-10 mr-3 bg-gray-600 items-center justify-center">
        <h1 className="text-white">{chat.firstname.charAt(0).toUpperCase()}</h1>
      </Avatar>
      <div>
        <p className="text-black font-semibold">{chat.firstname} {chat.lastname}</p>
        <p className="text-sm text-gray-500">Online</p>
      </div>
    </div>
  </div>
);

const MessageBubble = ({ message, isSender }: { message: Message, isSender: boolean }) => (
  <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`rounded-lg p-3 max-w-xs ${
      isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
    }`}>
      {message.isImage ? (
        <Image src={message.content} alt="Shared image" className="max-w-full rounded" width={300} height={300} />
      ) : (
        <p className="break-all">{message.content}</p>
      )}
      <span className="text-xs text-gray-400 block mt-1">
        {formatMessageDate(message.sentAt)}
      </span>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="rounded-lg p-3 max-w-xs bg-gray-200">
      <p className="text-black">Typing...</p>
    </div>
  </div>
);

const ChatInput = ({ 
  inputMessage, 
  onInputChange, 
  onSendMessage 
}: { 
  inputMessage: string, 
  onInputChange: (value: string) => void, 
  onSendMessage: () => void 
}) => (
  <div className="border-t border-gray-200 p-4 mt-auto mb-16">
    <div className="flex items-center">
      <Button variant="ghost" size="icon">
        <Paperclip className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Smile className="h-5 w-5" />
      </Button>
      <Input
        type="text"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => onInputChange(e.target.value)}
        className="flex-1 mx-2 text-black"
        onKeyDown ={(e) => e.key === 'Enter' && onSendMessage()}
      />
      <Button onClick={onSendMessage} disabled={!inputMessage.trim()}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

const NoChatSelected = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <MessageCircle className="h-12 w-12 mx-auto text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
      <p className="mt-1 text-sm text-gray-500">Select a chat from the sidebar to start messaging</p>
    </div>
  </div>
);

const LoadingIndicator = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export default CustomerServiceChatWindow;
