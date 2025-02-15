"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.auth.login(email, password)
      login(response.jwt, response.user)
      router.push("/chat")
    } catch (err) {
      setError(`${err}`)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 p-4">
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="pt-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              <LogIn className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="text-center mb-6 text-black">
            <h1 className="text-2xl font-semibold mb-2 text-black">Sign in with email</h1>
            <p className="text-gray-600">Make a new doc to bring your words, data, and teams together. For free</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50/50 text-black"
              />
            </div>
            <div className="space-y-2 relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50/50 text-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full bg-gray-900 hover:bg-gray-800" type="submit">
              Get Started
            </Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
          <div className="mt-6 text-center">
            <p  className="text-sm text-gray-600 mb-4"><a href="/register">Register</a></p>
           
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

