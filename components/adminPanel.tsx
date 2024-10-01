'use client'

import Link from "next/link"
import { Menu, ChevronDown, LayoutDashboard, Users, FileText, Settings, Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "./AuthProvider"

export function AdminPanel() {
  const { user } = useAuth()
  console.log(user)
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden w-64 overflow-y-auto border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-2xl font-bold text-yellow-400">Fiksaten</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </Link>
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FileText className="mr-3 h-5 w-5" />
              Reports
            </Link>
            <Link
              href="#"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
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
                    href="/dashboard"
                    className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/users"
                    className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Users
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Reports
                  </Link>
                  <Link
                    href="/dashboard/settings"
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
                <DropdownMenuItem><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/settings">Settings</Link>
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
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          {/* Add your main content here */}
        </main>
      </div>
    </div>
  )
}