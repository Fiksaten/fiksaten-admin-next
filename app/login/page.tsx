'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import Image from "next/image"
import LoginImage from "@/public/images/login.webp"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const { login } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    } finally{
      setLoading(false)
    }
  }
  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/2 flex flex-col justify-center p-12 space-y-6">
        <h1 className="text-3xl font-bold text-[#F3D416]">Fiksaten</h1>
        <p className="text-sm text-black">Kirjaudu Fiksaten sovellukseen</p>
        <input
          className="border p-2"
          type="text"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-white p-3 font-semibold"
          onClick={handleSubmit}
          disabled={loading}
        >
          Kirjaudu sisään
        </button>
        <Link href={"/register"}>
          <h3 className="text-blue-500 underline">Eikö sinulla ole vielä tiliä?</h3>
        </Link>
      </div>
      <div className="w-1/2">
        <Image src={LoginImage} alt="Login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}