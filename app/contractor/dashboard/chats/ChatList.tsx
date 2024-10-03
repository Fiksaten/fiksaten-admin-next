"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { buildApiUrl } from "@/app/lib/utils";
import { useAuth } from "@/components/AuthProvider";

type OtherUser = {
  firstname: string;
  lastname: string;
  email: string;
  contractorName: string | null;
  contractorImageUrl: string | null;
};

type Chat = {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessage: string;
  lastMessageAt: string;
  created_at: string;
  updated_at: string;
  otherUser: OtherUser;
};

export default function ChatList({
  chats,
  idToken,
  onSelectChat,
}: {
  chats: Chat[];
  idToken: string;
  onSelectChat: (chatId: string, partnerId: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const removeChat = async (id: string) => {
    const url = buildApiUrl(`/chats/conversation/hide`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ conversationId: id }),
    });
    if (response.ok) {
      console.log("Chat removed successfully");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold p-4 border-b border-gray-200">
          Chats
        </h1>
        <Button
          variant="outline"
          onClick={() => setDeleting(!deleting)}
          className="mr-3"
        >
          <p className="mr-2">Delete chats</p>
          <Trash className="w-4 h-4 text-red-600" />
        </Button>
      </div>
      <ul className="divide-y divide-gray-200">
        {chats.map((chat) => (
          <li key={chat.id} className="flex justify-between">
            <div
              onClick={() =>
                onSelectChat(
                  chat.id,
                  user?.id === chat.user1Id ? chat.user2Id : chat.user1Id
                )
              }
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center bg-gray-400 mr-3 rounded-full w-10 h-10">
                <p className="text-white text-lg font-bold">
                  {chat?.otherUser?.firstname?.charAt(0)}
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  {chat?.otherUser?.firstname}{" "}
                  {chat?.otherUser?.lastname?.charAt(0)}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {chat?.lastMessage}
                </p>
              </div>
            </div>
            {deleting && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeChat(chat.id)}
                className="mr-3"
              >
                <Trash className="w-4 h-4 text-red-600" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
