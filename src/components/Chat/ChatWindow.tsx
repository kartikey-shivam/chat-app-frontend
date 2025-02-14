import { useState, useRef, useEffect } from "react"
import { useWebSocket } from "@/hooks/useWebSocket"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User } from "lucide-react"
import { motion } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
}

interface ChatWindowProps {
  sessionId: number
  jwt: string
}

export const ChatWindow = ({ sessionId, jwt }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const onMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const { sendMessage } = useWebSocket({ jwt, sessionId, onMessage })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    await sendMessage(input)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef])

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] border rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 bg-primary text-primary-foreground">
        <h3 className="font-semibold text-lg">Chat Session #{sessionId}</h3>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className="h-8 w-8">
                {message.sender === "user" ? (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={`rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

