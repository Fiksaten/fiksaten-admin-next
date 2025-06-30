"use client"

import { useAuth } from "@/components/AuthProvider"

export function UserBox() {
  const {user} = useAuth()
  return (
    <div className="bg-gradient-to-t from-white to-blue-100 w-full  p-4 shadow-md text-black">
      <h1 className="text-2xl font-bold">Hei, {user?.firstname}</h1>
      <p className="text-gray-500">{`${user?.email} ${user?.addressStreet ? `| ${user?.addressStreet}, ${user?.addressZip}` : ""}`}</p>
    </div>
  )
}