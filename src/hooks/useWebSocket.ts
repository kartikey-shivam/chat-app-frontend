"use client"

import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string
  content: string
  message_type: 'user' | 'server'
  message_from: string
  session: string
}

interface SessionStartMessage {
  content: string
  message_from: string
  message_type: 'server'
  sessionId: string
}

interface UseWebSocketProps {
  userId: string
  sessionId: string
  onMessage: (messages: { userMessage: Message, serverMessage: Message } | Message) => void
}

export const useWebSocket = ({ userId, sessionId, onMessage }: UseWebSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const handleMessageResponse = useCallback((data: { userMessage: Message, serverMessage: Message }) => {
    console.log("Received message response:", data)
    onMessage(data)
  }, [onMessage])

  const handleSessionStarted = useCallback((data: SessionStartMessage) => {
    console.log("Received session started event:", data)
    // Convert the session start message to match Message interface
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: data.content,
      message_type: data.message_type,
      message_from: data.message_from,
      session: data.sessionId
    }
    onMessage(welcomeMessage)
  }, [onMessage])

  useEffect(() => {
    const socketInstance = io("https://chat-app-backend-production-9e6f.up.railway.app", {
      path: "/socket.io/chat",
      transports: ['websocket']
    })

    socketInstance.on("connect", () => {
      console.log("Connected to chat server with socket ID:", socketInstance.id)
      setIsConnected(true)
      socketInstance.emit("startSession", {
        userId,
        sessionId
      })
    })

    socketInstance.on("sessionStarted", handleSessionStarted)
    socketInstance.on("messageResponse", handleMessageResponse)

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from chat server")
      setIsConnected(false)
    })

    socketInstance.on("error", (error) => {
      console.log("Socket error:", error)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.removeAllListeners()
      socketInstance.disconnect()
    }
  }, [userId, sessionId, handleMessageResponse, handleSessionStarted])

  const sendMessage = useCallback((content: string) => {
    if (socket?.connected) {
      socket.emit("sendMessage", {
        content,
        userId,
        sessionId,
        session: sessionId
      })
    }
  }, [socket, userId, sessionId])

  return { 
    sendMessage,
    isConnected: socket?.connected || false
  }
}
