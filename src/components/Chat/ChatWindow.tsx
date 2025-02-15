"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useWebSocket } from "@/hooks/useWebSocket"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

interface Message {
  id: string
  content: string
  message_type: "user" | "server"
  message_from: string
  session: string
}

interface ChatWindowProps {
  sessionId: string
}

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const handleMessage = useCallback((data: { userMessage: Message; serverMessage: Message } | Message) => {
    if ("userMessage" in data) {
      setMessages((prev) => [...prev, data.userMessage, data.serverMessage])
    } else {
      setMessages((prev) => [...prev, data])
    }
  }, [])

  const { sendMessage, isConnected } = useWebSocket({
    userId: user?.id.toString() || "",
    sessionId,
    onMessage: handleMessage,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !isConnected) return
    sendMessage(input)
    setInput("")
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50">
      <div className="w-full max-w-[80%] bg-white/70 backdrop-blur-lg border-0 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-400 text-white flex items-center justify-between">
          <h3 className="hidden md:flex font-semibold text-lg">Chat Session #{sessionId.slice(0,6)}</h3>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-sm">{isConnected ? "Connected" : "Connecting..."}</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-240px)] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.message_type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${message.message_type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={
                        message.message_type === "user" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"
                      }
                    >
                      {message.message_type === "user" ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs mb-1 ${
                        message.message_type === "user" ? "text-right text-gray-600" : "text-left text-gray-600"
                      }`}
                    >
                      {message.message_type === "user" ? user?.username || "You" : "AI Assistant"}
                    </span>
                    <div
                      className={`rounded-lg p-3 ${
                        message.message_type === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected}
              className="flex-1 bg-gray-50/50 text-black"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!isConnected || !input.trim()}
              className="bg-blue-600 hover:bg-gray-800 text-white"
            >
              <Send className="h-4 w-4 " />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

