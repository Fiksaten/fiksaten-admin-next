"use client"
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/AuthProvider';
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

const CustomerServiceChat = ({idToken}: {idToken: string}) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const [selectedChat, setSelectedChat] = useState<Chat>(); 
  const [userId, setUserId] = useState("");
  const [selectedChatMessages, setSelectedChatMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('');
  const [typingSent, setTypingSent] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTyping, setIsTyping] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      auth: { token: idToken },
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



    socketRef.current = newSocket;

    return () => {
      socketRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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


  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedChatMessages([]);
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
      userId={userId}
      idToken={idToken}
      />
    </div>
  );
};

export default CustomerServiceChat;