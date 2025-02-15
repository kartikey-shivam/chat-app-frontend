"use client"

import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

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
    if (!SOCKET_URL) {
      console.error("Socket URL not configured")
      return
    }

    const socketInstance = io(SOCKET_URL, {
      path: "/socket.io/chat",
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
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
      console.error("Socket error:", error)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      if (socketInstance) {
        socketInstance.removeAllListeners()
        socketInstance.disconnect()
      }
    }
  }, [userId, sessionId, handleMessageResponse, handleSessionStarted])

  const sendMessage = useCallback((content: string) => {
    if (socket?.connected) {
      socket.emit("sendMessage", {
        content,
        userId,
        sessionId
      })
    } else {
      console.warn("Socket not connected, message not sent")
    }
  }, [socket, userId, sessionId])

  return {
    sendMessage,
    isConnected: socket?.connected || false
  }
}
