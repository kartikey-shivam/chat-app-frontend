"use client"
import {  useState } from "react"
import { ChatWindow } from "@/components/Chat/ChatWindow"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid'
interface ChatSession {
  id: string
  title: string
}

export default function HomePage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const {user,logout} = useAuth()
 const router = useRouter()
  const handleLogout = (): void => {
    logout()
    toast.success("Logged out successfully")
    router.refresh()
  }

  const createNewSession = () => {
    const newSession = {
      id: uuidv4(),
      title: `Chat Session ${sessions.length + 1}`,
    }
    console.log("Creating new session:", newSession)
    setSessions([...sessions, newSession])
    setSelectedSession(newSession.id)
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 mr-2 text-primary text-black" />
              <h1 className="hidden md:flex text-xl font-bold text-black">Chat Assistant</h1>

            </div>
           {!selectedSession && <Button className="text-black" variant="ghost" onClick={createNewSession}>
              <Plus className="h-4 w-4 mr-2 text-black" />
              New Session
            </Button>}
          </motion.div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground text-gray-600 ">{user?.username}</span>
            <Button variant="ghost" className="text-black" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2 text-black" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)] bg-white/70 backdrop-blur-lg border-0 shadow-lg rounded-lg">
        {/* <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <SessionList sessions={sessions} onCreate={createNewSession} onSelect={setSelectedSession} />
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          {selectedSession ? (
            <ChatWindow sessionId={selectedSession} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-black">
              Select a chat session or create a new one to begin
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

