"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getChats } from "@/app/lib/actions";
import CustomerServiceChatWindow from "./CustomerServiceChatWindow";
import ChatList from "./ChatList";

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

const CustomerServiceChat = ({ accessToken }: { accessToken: string }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [userId, setUserId] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setUserId(user.id);
  }, [user]);

  useEffect(() => {
    const fetchChats = async () => {
      const fetchedChats = await getChats();
      console.log("chats", fetchedChats);
      setChats(fetchedChats);
    };

    fetchChats();

    const intervalId = setInterval(fetchChats, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        handleChatSelect={handleChatSelect}
      />

      <div className="w-full flex flex-col">
        <CustomerServiceChatWindow
          selectedChat={selectedChat}
          userId={userId}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
};

export default CustomerServiceChat;
