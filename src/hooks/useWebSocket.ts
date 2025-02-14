"use client"

import { useState, useEffect } from "react"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
}

interface UseWebSocketProps {
  jwt: string
  sessionId: number
  onMessage: (message: Message) => void
}

export const useWebSocket = ({ jwt, sessionId, onMessage }: UseWebSocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  // useEffect(() => {
  //   const ws = new WebSocket(`ws://localhost:8080/chat/${sessionId}?jwt=${jwt}`) // Replace with your WebSocket URL

  //   ws.onopen = () => {
  //     console.log("WebSocket connection opened")
  //   }

  //   ws.onmessage = (event) => {
  //     const message = JSON.parse(event.data as string) as Message
  //     onMessage(message)
  //   }

  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed")
  //     setSocket(null)
  //   }

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error:", error)
  //     setSocket(null)
  //   }

  //   setSocket(ws)

  //   return () => {
  //     if (ws.readyState !== WebSocket.CLOSED) {
  //       ws.close()
  //     }
  //   }
  // }, [jwt, sessionId, onMessage])

  const sendMessage = async (message: string) => {
    if (socket) {
      socket.send(JSON.stringify({ content: message }))
    }
  }

  return { sendMessage }
}

