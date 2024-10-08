'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatList from './ChatList'
import ChatComponent from './ChatComponent'
import { getIdToken } from '@/app/lib/actions'
import { getNonAdminChats } from '@/app/lib/chatActions'
import SearchParamsWrapper from './searchParamWrapper'

type OtherUser = {
  firstname: string
  lastname: string
  email: string
  contractorName: string | null
  contractorImageUrl: string | null
}

type Chat = {
  id: string
  user1Id: string
  user2Id: string
  lastMessage: string
  lastMessageAt: string
  created_at: string
  updated_at: string
  otherUser: OtherUser
}

export default function ChatsPage() {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [idToken, setIdToken] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const token = await getIdToken()
      const fetchedChats = await getNonAdminChats()
      console.log("fetchedChats", fetchedChats);
      setIdToken(token)
      setChats(fetchedChats)
    }
    fetchData()
  }, [])

  const handleSelectChat = (newChatId: string, newPartnerId: string) => {
    router.push(`/consumer/dashboard/chats?chatId=${newChatId}&partnerId=${newPartnerId}`)
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <Suspense fallback={<div className="p-4">Loading chats...</div>}>
          <ChatList chats={chats} idToken={idToken} onSelectChat={handleSelectChat} />
        </Suspense>
      </div>
      <div className="w-2/3">
        <Suspense fallback={<div className="p-4">Loading chat...</div>}>
          <SearchParamsWrapper>
            {({ chatId, partnerId }) => (
              chatId && partnerId ? (
                <ChatComponent chatId={chatId} partnerId={partnerId} idToken={idToken} />
              ) : (
                <div className="p-4">Select a chat to start messaging</div>
              )
            )}
          </SearchParamsWrapper>
        </Suspense>
      </div>
    </div>
  )
}