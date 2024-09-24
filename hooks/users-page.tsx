"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

type User = {
  id: string
  sub: string
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  expoPushToken: string
  stripeCustomerId: string
  addressStreet: string
  addressDetail: string
  addressZip: string
  addressCountry: string
  badgeCountOffers: number
  badgeCountMessages: number
  role: string
  pushNotificationPermission: boolean
  smsPersmission: boolean
  emailPermission: boolean
  created_at: string
  updated_at: string
}

// Mock data for demonstration
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  sub: `sub-${i + 1}`,
  firstname: `First${i + 1}`,
  lastname: `Last${i + 1}`,
  email: `user${i + 1}@example.com`,
  phoneNumber: `+1234567890${i}`,
  expoPushToken: `expo-push-token-${i + 1}`,
  stripeCustomerId: `stripe-customer-${i + 1}`,
  addressStreet: `${i + 1} Main St`,
  addressDetail: `Apt ${i + 1}`,
  addressZip: `1000${i}`,
  addressCountry: "USA",
  badgeCountOffers: Math.floor(Math.random() * 10),
  badgeCountMessages: Math.floor(Math.random() * 20),
  role: i % 10 === 0 ? "admin" : "user",
  pushNotificationPermission: Math.random() > 0.5,
  smsPersmission: Math.random() > 0.5,
  emailPermission: Math.random() > 0.5,
  created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updated_at: new Date().toISOString(),
}))

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-violet-600" >Users</h1>
      <h1 className="text-red-400">posrdigkpodrkg</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id} className="text-black">
                <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                        Copy user ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View user details</DropdownMenuItem>
                      <DropdownMenuItem>Edit user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}