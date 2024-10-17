"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";

export default function LiveChatWidget({ idToken }: { idToken: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();
  const [unseenMessages, setUnseenMessages] = useState(0);

  type SupportChatMessage = {
    id: string;
    conversationId: string;
    isSenderSupport: boolean;
    content: string | null;
    read: boolean;
    isImage: boolean;
    readAt: string;
    sentAt: string;
  };

  const viewportRef = useRef<HTMLDivElement>(null); // Ref for ScrollArea Viewport

  const API_URL = process.env.NEXT_PUBLIC_WS_URL!;

  useEffect(() => {
    if (!user) {
      console.log("user not found");
      return;
    }

    if (!socketRef.current) {
      console.log("socket not initialized");
      const newSocket = io(API_URL, {
        query: { userId: user.id },
        auth: { token: idToken },
      });

      newSocket.on("connect", () => {
        console.log(
          "Connected to socket server with id",
          newSocket.id,
          "user",
          user.id
        );
      });

      console.log("Joining chat", "userId: ", user.id, "isSupportChat: ", true);
      newSocket.emit("join", { userId: user.id, isSupportChat: true });

      newSocket.on("chatHistory", (newMessages: SupportChatMessage[]) => {
        console.log("got chatHistory", newMessages);
        setMessages(newMessages);
        scrollToBottom(); // Scroll to bottom after loading history
      });

      newSocket.on("newSupportMessage", (newMessage: SupportChatMessage) => {
        setMessages((prevMessages: SupportChatMessage[]) => [
          ...prevMessages,
          newMessage,
        ]);
        if (newMessage.isSenderSupport && !isOpen) {
          setUnseenMessages((prev) => prev + 1);
        }
        // Removed scrollToBottom() here; handled by useLayoutEffect
      });

      // Add typing event listener
      newSocket.on("userTyping", ({ userId, isTyping }) => {
        // Handle typing indicator
        // You might want to add a state for this and display it in the UI
      });

      socketRef.current = newSocket;
    } else {
      console.log("socket already initialized");
    }

    return () => {
      if (socketRef.current) {
        console.log("disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      } else {
        console.error("Socket not initialized");
      }
    };
  }, [user, isOpen, API_URL, idToken]);

  // Use useLayoutEffect to ensure scrolling happens after DOM mutations
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSendMessage = (msgContent: string) => {
    if (!msgContent) {
      console.log("No content");
      return;
    }

    if (!socketRef.current) {
      console.error("Socket not initialized");
      return;
    }
    if (!user) {
      console.error("User not found");
      return;
    }
    socketRef.current.emit("supportMessage", {
      userId: user.id,
      content: msgContent,
      isSenderSupport: false,
      isImage: false,
    });
    socketRef.current?.emit("typing", {
      conversationId: user.id,
      userId: user.id,
      isTyping: false,
      isSupportChat: true,
    });
    setInputMessage("");
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnseenMessages(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Chat</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="">
            <ScrollArea
              className="h-[300px] w-full pr-4"
              viewportRef={viewportRef} // Pass viewportRef here
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.isSenderSupport ? "text-left" : "text-right"
                  }`}
                >
                  <span
                    className={`inline-block break-all rounded-lg px-3 py-2 text-sm ${
                      message.isSenderSupport
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="rounded-full w-12 h-12 p-0 bg-yellow-500 relative"
          onClick={handleOpenChat}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
          {unseenMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unseenMessages}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
