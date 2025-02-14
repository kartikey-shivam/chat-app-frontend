"use client"
import { useState } from "react"
import { SessionList } from "@/components/SessionList"
import { ChatWindow } from "@/components/Chat/ChatWindow"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut } from "lucide-react"
import { motion } from "framer-motion"

interface ChatSession {
  id: number
  title: string
}

export default function HomePage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [user, setUser] = useState<{ email: string } | null>({ email: "user@example.com" }) // Mock user for demo

  const logout = () => {
    setUser(null)
  }

  const createNewSession = () => {
    const newSession = {
      id: sessions.length + 1,
      title: `Chat Session ${sessions.length + 1}`,
    }
    console.log("Creating new session:", newSession)
    setSessions([...sessions, newSession])
    setSelectedSession(newSession.id)
  }

  const jwt = "your-jwt-token" // Mock JWT token

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <LayoutDashboard className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold">Chat Assistant</h1>
          </motion.div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <SessionList sessions={sessions} onCreate={createNewSession} onSelect={setSelectedSession} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6"
        >
          {selectedSession ? (
            <ChatWindow sessionId={selectedSession} jwt={jwt} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a chat session or create a new one to begin
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

