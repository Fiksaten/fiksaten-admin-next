/* eslint-disable @typescript-eslint/no-explicit-any */ 
'use client'

import { buildApiUrl } from '@/app/lib/utils'
import { useAuth } from '@/components/AuthProvider'
import { toast } from '@/hooks/use-toast'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export default function ChatComponent({chatId, partnerId, idToken}: {chatId: string, partnerId: string, idToken: string}) {
	const {user} = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [partnerInfo, setPartnerInfo] = useState<any>(null)
  const [inputMessage, setInputMessage] = useState('')
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  

  useEffect(() => {
    const fetchPartnerInfo = async () => {
		const url = buildApiUrl(`/users/${partnerId}`)
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
		})
		const data = await response.json()
		setPartnerInfo(data)
	}

	fetchPartnerInfo()
  }, [partnerId, idToken])

  useEffect(() => {
		if (!chatId || !user) return undefined;

		if (!socketRef.current) {
			socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL!);
			socketRef.current.emit("join", {
				conversationId: chatId,
				userId: user?.id,
			});

			socketRef.current.on("chatHistory", (fetchedMessages: any[]) => {
				setMessages(fetchedMessages);
				fetchedMessages.forEach((message) => {
					if (message.receiverId === user?.id && !message.read) {
						socketRef.current?.emit("read", {
							conversationId: chatId,
							userId: user?.id,
							messageId: message.id,
						});
					}
				});
			});

			socketRef.current.on("newMessage", (newMessage: any) => {
				setMessages((prevMessages: any[]) => [
					...prevMessages,
					newMessage,
				]);

				if (newMessage.receiverId === user?.id && !newMessage.read) {
					socketRef.current?.emit("read", {
						conversationId: chatId,
						userId: user?.id,
						messageId: newMessage.id,
					});
				}
			});
		}

		// eslint-disable-next-line consistent-return
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			} else {
				toast({
					title: "Unable to disconnect socket",
					description: "Please try again",
					variant: "destructive",
				});
				return undefined;
			}
		};
	}, [chatId, user]);

	useEffect(() => {
		const timer = setTimeout(() => {
			for (const message of messages) {
				if (message.receiverId === user?.id && !message.read) {
					socketRef.current?.emit("read", {
						conversationId: chatId,
						userId: user?.id,
						messageId: message.id,
					});
				}
			}
			socketRef.current?.emit("typing", {
				conversationId: chatId,
				userId: user?.id,
				isTyping: false,
			});
		}, 35000);
		return () => clearTimeout(timer);
	}, [messages, user, chatId]);

	const handleSendMessage = (msgContent: string) => {
		if (!msgContent || !partnerId) {
			console.log("No content, or partnerId");
			return;
		}

		if (!socketRef.current) {
			console.error("Socket not initialized");
			toast({
				title: "Viestin lähetys epäonnistui, yritä uudelleen",
				description: "Please try again",
				variant: "destructive",
			});
			return;
		}

		socketRef.current.emit("message", {
			conversationId: chatId,
			content: msgContent,
			senderId: user?.id,
			receiverId: partnerId,
			isImage: false,
		});
		socketRef.current?.emit("typing", {
			conversationId: chatId,
			userId: user?.id,
			isTyping: false,
		});
		setInputMessage("");
	};
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-gray-200">
        <p>kpok</p>
        <h2 className="text-xl font-semibold">{partnerInfo?.firstname} {partnerInfo?.lastname}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === 'currentUser' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === 'currentUser'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={() => handleSendMessage(inputMessage)} className="border-t border-gray-200 p-4">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Type a message"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}