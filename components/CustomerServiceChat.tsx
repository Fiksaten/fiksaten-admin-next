"use client"
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { getChats } from '@/app/lib/actions';
import CustomerServiceChatWindow from './CustomerServiceChatWindow';
import ChatList from './ChatList';


export type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  sentAt: string;
  isSenderSupport: boolean;
  read: boolean;
  isImage: boolean;
};

export type Chat = {
  id: string;
  lastMessage: string;
  lastMessageAt: string;
  contractorImageUrl: string | null;
  contractorName: string | null;
  firstname: string;
  lastname: string;
};

export type Conversation = {
	conversationId: string;
	content: string;
	id: string;
	receiverId: string;
	senderId: string;
	sentAt: string;
  isSenderSupport: boolean;
	read: boolean;
	readAt: string;
	isImage: boolean;
  };

const CustomerServiceChat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat>(); 
  const [userId, setUserId] = useState("");
  const [selectedChatMessages, setSelectedChatMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('');
  const [typingSent, setTypingSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
  
  const { user, tokens } = useAuth();
  
  const API_URL = process.env.NEXT_PUBLIC_WS_URL

  const socketRef = useRef<Socket>();

  useEffect(() => {
    if(!user) return;

    setUserId(user.id);
    
    console.log("API_URL", API_URL) 
    
    const newSocket = io(API_URL!, {
      query: { userId: user.id },
      auth: { token: tokens?.idToken },
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on("newSupportMessage", (message) => {
      console.log("New support message received:", message);
      updateLastMessage(message);
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === message.conversationId) {
            return {
              ...chat,
              lastMessage: message.content,
              lastMessageAt: message.sentAt,
            };
          }
          return chat;
        });
        return updatedChats.sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
        );
      });
      setSelectedChatMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("messageRead", ({ conversationId, userId }) => {
      if (userId !== user.id) {
        setChats((prevChats) => prevChats.map((chat) => (chat.id === conversationId ? { ...chat, lastMessageRead: true } : chat)));
      }
    });

    newSocket.on("userTyping", ({ conversationId, userId, isTyping }) => {
      console.log("User typing:", { conversationId, userId, isTyping });
      if (userId !== user.id) {
        console.log("userid not equal to user.id", userId, user.id);
        setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
      }
    });

    newSocket.on("chatHistory", (fetchedMessages: Conversation[]) => {
      if(fetchedMessages.length > 1){
      console.log("Chat history received:", fetchedMessages);
      }
      setConversations([fetchedMessages[fetchedMessages.length - 1], ...conversations]);
    });

    socketRef.current = newSocket;

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && chats.length > 0) {
      chats.forEach((chat) => {
        socketRef.current?.emit("join", { userId: user?.id, conversationId: chat.id, isSupportChat: true });
      });
    }
  }, [socketRef, chats, user?.id]);

  useEffect(() => {
    (async () => {
      const chats = await getChats();
      console.log("chats", chats)
      setChats(chats)
    })()
  }, [])

  const updateLastMessage = (message: Message) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat?.id 
          ? { ...chat, lastMessage: message.content, lastMessageAt: message.sentAt }
          : chat
      )
    );
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current || !selectedChat) return;
    try {
      const newMessage = {
        id: Date.now().toString(), // Temporary ID
        content: inputMessage,
        senderId: userId,
        receiverId: selectedChat.id,
        sentAt: new Date().toISOString(),
        read: false,
        isImage: false
      };
      socketRef.current?.emit("supportMessage", {
        userId: selectedChat.id,
        content: inputMessage,
        isSenderSupport: true,
        isImage: false
      });
      updateLastMessage(newMessage);
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

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedChatMessages([]);
  };

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

  return (
    <div className="flex bg-gray-100">
       <ChatList 
    chats={chats} 
    selectedChat={selectedChat} 
    handleChatSelect={handleChatSelect} 
    />

      {/* Chat area */}
      <CustomerServiceChatWindow 
      selectedChat={selectedChat} 
      messages={selectedChatMessages} 
      inputMessage={inputMessage} 
      handleInputChange={handleInputChange} 
      handleSendMessage={handleSendMessage} 
      isTyping={isTyping} 
      userId={userId} 
      />
    </div>
  );
};

export default CustomerServiceChat;