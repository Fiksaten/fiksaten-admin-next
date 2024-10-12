'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      await logout()
      router.push('/login')
    }

    performLogout()
  }, [logout, router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Logging out...</p>
    </div>
  )
}