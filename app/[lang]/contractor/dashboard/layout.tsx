'use client'

import { useEffect, useCallback, useState } from 'react'
import Link from "next/link"
import { Menu, ChevronDown, LayoutDashboard, Settings, Bell, Search, ListOrdered, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import LiveChatWidget from "@/components/LiveChatWidget"
import { buildApiUrl } from "@/app/lib/utils"
import Cookies from "js-cookie"
import { toast } from "@/hooks/use-toast"

export default function AdminPanel({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const { user } = useAuth()
  const router = useRouter()
  const idToken = Cookies.get("idToken")
  const [numberOfNotificationsChatsUnread, setNumberOfNotificationsChatsUnread] = useState(0)
  const [numberOfNotificationsRequestsUnread, setNumberOfNotificationsRequestsUnread] = useState(0)

  useEffect(() => {
    if (!user) {
      console.log("user not found")
    } else if (user.role !== "contractor") {
      console.log("user is not a contractor")
      router.replace("/contractor/waiting-for-approval")
    }
  }, [user, router])

  const fetchUserBadges = useCallback(async () => {
    console.log("Fetching badges...")
    try {
      const url = buildApiUrl("/users/me/badges")
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      })
      const data = await response.json()

      if (data) {
        const messages = data?.messages ? data.messages : 0
        const offers = data?.offers ? data.offers : 0
        setNumberOfNotificationsChatsUnread(messages)
        setNumberOfNotificationsRequestsUnread(offers)
        if (messages > 0) {
          toast({
            title: "You have new messages",
            description: "You have new messages",
          })
        }
        if (offers > 0) {
          toast({
            title: "You have new offers",
            description: "You have new offers",
          })
        }
      } else {
        setNumberOfNotificationsChatsUnread(0)
        setNumberOfNotificationsRequestsUnread(0)
      }
    } catch (error) {
      console.error(error)
    }
  }, [idToken])

  useEffect(() => {
    const intervalId = setInterval(fetchUserBadges, 30000)
    fetchUserBadges()
    return () => clearInterval(intervalId)
  }, [fetchUserBadges])

  const [unreadCounts, setUnreadCounts] = useState({
    dashboard: 0,
    orders: numberOfNotificationsRequestsUnread,
    reviews: 0,
    settings: 0,
    chats: numberOfNotificationsChatsUnread,
  })

  const resetUnreadCount = useCallback(
    (key: keyof typeof unreadCounts) => {
      setUnreadCounts((prev) => ({ ...prev, [key]: 0 }))
      ;(async () => {
        let url
        if (key === "chats") {
          url = buildApiUrl("users/me/badges/chats")
        } else if (key === "orders") {
          url = buildApiUrl("users/me/badges/offers")
        }
        if (url) {
          await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          })
        }
      })()
    },
    [idToken]
  )

  useEffect(() => {
    setUnreadCounts((prev) => ({
      ...prev,
      orders: numberOfNotificationsRequestsUnread,
    }))
  }, [numberOfNotificationsRequestsUnread])

  const NavLink: React.FC<{
    href: string
    icon: React.ReactNode
    text: string
    countKey: keyof typeof unreadCounts
  }> = ({ href, icon, text, countKey }) => (
    <Link
      href={href}
      className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 relative"
      onClick={() => resetUnreadCount(countKey)}
    >
      {icon}
      {text}
      {unreadCounts[countKey] > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCounts[countKey]}
        </span>
      )}
    </Link>
  )

  if (!user || user.role !== "contractor") {
    return null // or a loading spinner
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden w-64 overflow-y-auto border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-2xl font-bold text-yellow-400">Fiksaten</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <NavLink
              href="/contractor/dashboard"
              icon={<LayoutDashboard className="mr-3 h-5 w-5" />}
              text="Dashboard"
              countKey="dashboard"
            />
            <NavLink
              href="/contractor/dashboard/orders"
              icon={<ListOrdered className="mr-3 h-5 w-5" />}
              text="Orders"
              countKey="orders"
            />
            <NavLink
              href="/contractor/dashboard/reviews"
              icon={<Star className="mr-3 h-5 w-5" />}
              text="Reviews"
              countKey="reviews"
            />
            <NavLink
              href="/contractor/dashboard/settings"
              icon={<Settings className="mr-3 h-5 w-5" />}
              text="Settings"
              countKey="settings"
            />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center justify-center border-b">
                  <h1 className="text-2xl font-bold text-gray-800">Fiksaten</h1>
                </div>
                <nav className="flex-1 space-y-1 px-2 py-4">
                  <Link
                    href="/contractor/dashboard"
                    className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/contractor/dashboard/settings"
                    className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="w-full appearance-none pl-8 text-sm leading-6"
                type="search"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">View notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="hidden text-sm font-medium text-gray-700 lg:block">{`${user?.firstname} ${user?.lastname}`}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Link href="/admin/dashboard/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/contractor/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <LiveChatWidget />
          {children}
        </main>
      </div>
    </div>
  )
}