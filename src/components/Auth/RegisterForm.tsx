"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, UserPlus } from "lucide-react"
interface RegisterFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
export function RegisterForm({ formData, handleChange, handleSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 p-4">
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg border-0 shadow-lg">
        <CardContent className="pt-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              <UserPlus className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl text-black font-semibold mb-2">Create your account</h1>
            <p className="text-gray-600">Join us to bring your words, data, and teams together</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="bg-gray-50/50 text-black"
              />

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-gray-50/50 text-black"
              />

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
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

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50/50 text-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button className="w-full bg-gray-900 hover:bg-gray-800" type="submit">
              Get Started
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p  className="text-sm text-gray-600 mb-4"><a href="/login">Sign In</a></p>
           
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

