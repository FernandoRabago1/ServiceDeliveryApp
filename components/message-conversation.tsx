// src/components/message-conversation.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Socket } from "socket.io-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, MoreVertical, Paperclip, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export interface ConversationMeta {
  withUser: string
  user: { uid: string; name: string; image?: string; online?: boolean }
  lastAt: string
  unread: number
}

export interface Message {
  id: string
  body: string
  senderId: string
  receiverId: string
  isRead: boolean
  created_at: string
}

interface Props {
  conversation: ConversationMeta
  onSendMessage: (to: string, body: string) => void
  socket: Socket
}

export default function MessageConversation({ conversation, onSendMessage, socket }: Props) {
  const { user } = useAuth()
  const myId = user!.uid

  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  // 1) cargar historial
  useEffect(() => {
    axios
      .get<Message[]>(
        `http://localhost:3000/api/conversations/${conversation.withUser}/messages?limit=10&offset=0`,
        { withCredentials: true }
      )
      .then(r => setMessages(r.data))
      .catch(console.error)
  }, [conversation.withUser])

  // 2) incoming y sent
  useEffect(() => {
    const onIncoming = (msg: Message) => {
      if (msg.senderId === conversation.withUser) {
        setMessages(ms => [...ms, msg])
      }
    }
    const onSent = (msg: Message) => {
      if (msg.senderId === myId) {
        setMessages(ms => [...ms, msg])
      }
    }
    socket.on("incoming", onIncoming)
    socket.on("sent", onSent)
    return () => {
      socket.off("incoming", onIncoming)
      socket.off("sent", onSent)
    }
  }, [socket, conversation.withUser, myId])

  // 3) auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    if (!newMsg.trim()) return
    // onSendMessage(conversation.withUser, newMsg)
    socket.emit("message", { to: conversation.withUser, body: newMsg })
    setNewMsg("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.user.image || "/placeholder.svg"} alt={conversation.user.name}/>
            <AvatarFallback>{conversation.user.name.slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{conversation.user.name}</h3>
            <p className="text-xs text-gray-500">
              {conversation.user.online
                ? <span className="text-green-500">● Online</span>
                : `Last active ${new Date(conversation.lastAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Block contact</DropdownMenuItem>
              <DropdownMenuItem>Clear conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Report issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => {
          const outgoing = m.senderId === myId
          return (
            <div key={m.id} className={cn("flex", outgoing ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                outgoing
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              )}>
                <p>{m.body}</p>
                <div className="text-xs mt-1 text-gray-500">
                  {new Date(m.created_at).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon"><ImageIcon className="h-5 w-5"/></Button> */}
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key==="Enter" && !e.shiftKey && (e.preventDefault(), send())}
          />
          <Button onClick={send} disabled={!newMsg.trim()}><Send className="h-5 w-5"/></Button>
        </div>
      </div>
    </div>
  )
}
