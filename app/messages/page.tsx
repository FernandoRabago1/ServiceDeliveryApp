// app/messages/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { io, Socket } from "socket.io-client"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import MessageConversation from "@/components/message-conversation"
import { useAuth } from "@/contexts/auth-context"

export type ConversationMeta = {
  withUser: string
  user: { uid: string; name: string; image?: string; online?: boolean }
  lastAt: string
  unread: number
}

export default function MessagesPage() {
  const { user } = useAuth()
  if (!user) return null
  const userId = user.uid

  const [conversations, setConversations] = useState<ConversationMeta[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const sock = io("http://localhost:4101", { query: { userId } })
    setSocket(sock)

    // 1) Init: recibimos lista de quiénes están online y entonces pedimos las conversaciones
    sock.on("init", ({ online }: { online: string[] }) => {
      axios
        .get<ConversationMeta[]>("http://localhost:3000/api/conversations", { withCredentials: true })
        .then(res => {
          // Marcamos online a quienes estén en el array
          const convos = res.data.map(c => ({
            ...c,
            user: { ...c.user, online: online.includes(c.withUser) }
          }))
          setConversations(convos)
        })
        .catch(console.error)
    })

    // 2) Presence en caliente
    sock.on("presence", ({ id, online }: { id: string; online: boolean }) => {
      setConversations(cs =>
        cs.map(c =>
          c.withUser === id
            ? { ...c, user: { ...c.user, online } }
            : c
        )
      )
    })

    // 3) Incoming: nuevo mensaje actualiza timestamp + unread
    sock.on("incoming", msg => {
      setConversations(cs =>
        cs.map(c =>
          c.withUser === msg.senderId
            ? { ...c, lastAt: msg.created_at, unread: c.unread + 1 }
            : c
        )
      )
    })

    return () => { sock.disconnect() }
  }, [userId])

  // Filtrar + ordenar por lastAt desc
  const filtered = useMemo(() => {
    return conversations
      .filter(c => c.user.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())
  }, [conversations, search])

  const handleSelect = (id: string) => {
    setSelected(id)
    axios.post(`http://localhost:3000/api/conversations/${id}/read`, null, { withCredentials: true })
    setConversations(cs =>
      cs.map(c =>
        c.withUser === id ? { ...c, unread: 0 } : c
      )
    )
  }

  const handleSendMessage = (to: string, body: string) => {
    socket?.emit("message", { to, body })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar */}
          <Card className="md:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                <Input
                  className="pl-10"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div> */}
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length ? filtered.map(c => (
                <div
                  key={c.withUser}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 border-b",
                    selected === c.withUser && "bg-gray-100"
                  )}
                  onClick={() => handleSelect(c.withUser)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={c.user.image||"/placeholder.svg"} alt={c.user.name}/>
                    <AvatarFallback>{c.user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{c.user.name}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(c.lastAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={cn(
                        "text-sm truncate",
                        c.unread ? "font-medium text-black" : "text-gray-500"
                      )}>
                        {c.unread > 0 ? `${c.unread} unread` : "All read"}
                      </p>
                      {c.user.online && (
                        <span className="text-green-500 text-xs">● Online</span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-gray-500">No conversations</div>
              )}
            </div>
          </Card>

          {/* Chat window */}
          <Card className="md:col-span-2 overflow-hidden flex flex-col">
            {selected ? (
              <MessageConversation
                conversation={filtered.find(c => c.withUser === selected)!}
                socket={socket!}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
