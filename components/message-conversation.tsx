"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, MoreVertical, Paperclip, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Provider {
  id: string
  name: string
  title: string
  image: string
  online: boolean
}

interface Message {
  id: string
  text: string
  timestamp: string
  sender: "user" | "provider"
  isRead?: boolean
}

interface Conversation {
  id: string
  provider: Provider
  lastMessage: {
    text: string
    timestamp: string
    isRead: boolean
    sender: "user" | "provider"
  }
  unread: number
}

interface MessageConversationProps {
  conversation: Conversation
  onSendMessage: (conversationId: string, messageText: string) => void
}

// Mock messages for each conversation
const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      text: "Hello! I need help with a leaking pipe under my kitchen sink.",
      timestamp: "10:05 AM",
      sender: "user",
    },
    {
      id: "1-2",
      text: "Hi there! I'd be happy to help with your leaking pipe. Can you provide more details about the issue?",
      timestamp: "10:10 AM",
      sender: "provider",
    },
    {
      id: "1-3",
      text: "It's been leaking for about 2 days. The cabinet underneath is getting wet.",
      timestamp: "10:15 AM",
      sender: "user",
    },
    {
      id: "1-4",
      text: "I understand. I have an opening tomorrow at 2 PM. Would that work for you?",
      timestamp: "10:20 AM",
      sender: "provider",
    },
    {
      id: "1-5",
      text: "Yes, that works for me. Thank you!",
      timestamp: "10:22 AM",
      sender: "user",
    },
    {
      id: "1-6",
      text: "I'll be there at 2 PM tomorrow as scheduled.",
      timestamp: "10:23 AM",
      sender: "provider",
    },
  ],
  "2": [
    {
      id: "2-1",
      text: "Hi Maria, I'd like to schedule a house cleaning for next week.",
      timestamp: "Yesterday",
      sender: "user",
    },
    {
      id: "2-2",
      text: "Hello! I'd be happy to help. What day works best for you?",
      timestamp: "Yesterday",
      sender: "provider",
    },
    {
      id: "2-3",
      text: "Would Wednesday at 10 AM work?",
      timestamp: "Yesterday",
      sender: "user",
    },
    {
      id: "2-4",
      text: "Yes, Wednesday at 10 AM works perfectly. I've added you to my schedule.",
      timestamp: "Yesterday",
      sender: "provider",
    },
    {
      id: "2-5",
      text: "Do you need me to bring any special cleaning supplies?",
      timestamp: "Yesterday",
      sender: "provider",
      isRead: false,
    },
  ],
  "3": [
    {
      id: "3-1",
      text: "Hello Juan, I need help with installing some new light fixtures.",
      timestamp: "Yesterday",
      sender: "user",
    },
    {
      id: "3-2",
      text: "Hi! I can help with that. How many fixtures do you need installed?",
      timestamp: "Yesterday",
      sender: "provider",
    },
    {
      id: "3-3",
      text: "I have 3 ceiling lights and 2 wall sconces.",
      timestamp: "Yesterday",
      sender: "user",
    },
    {
      id: "3-4",
      text: "The electrical installation is complete. Please let me know if you have any questions.",
      timestamp: "Yesterday",
      sender: "provider",
      isRead: false,
    },
  ],
  "4": [
    {
      id: "4-1",
      text: "Hi Ana, when can you come for the monthly garden maintenance?",
      timestamp: "Monday",
      sender: "user",
    },
    {
      id: "4-2",
      text: "Hello! I can come this Friday at 9 AM if that works for you.",
      timestamp: "Monday",
      sender: "provider",
    },
    {
      id: "4-3",
      text: "Friday at 9 AM is perfect. See you then!",
      timestamp: "Monday",
      sender: "user",
    },
    {
      id: "4-4",
      text: "Thank you for your payment. I'll see you next month for the regular maintenance.",
      timestamp: "Monday",
      sender: "provider",
    },
  ],
}

export default function MessageConversation({ conversation, onSendMessage }: MessageConversationProps) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(mockMessages[conversation.id] || [])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when messages change or conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    // Reset messages when conversation changes
    setMessages(mockMessages[conversation.id] || [])
  }, [conversation.id])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg: Message = {
      id: `${conversation.id}-${messages.length + 1}`,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "user",
    }

    setMessages([...messages, newMsg])
    onSendMessage(conversation.id, newMessage)
    setNewMessage("")

    // Simulate provider response after a delay
    setTimeout(() => {
      const responseMessages = [
        "I'll get back to you shortly.",
        "Thanks for your message!",
        "I understand. Let me check my schedule.",
        "I'll take care of that right away.",
        "Is there anything else you need help with?",
      ]

      const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)]

      const responseMsg: Message = {
        id: `${conversation.id}-${messages.length + 2}`,
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sender: "provider",
      }

      setMessages((prevMessages) => [...prevMessages, responseMsg])
    }, 2000)
  }

  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.provider.image || "/placeholder.svg"} alt={conversation.provider.name} />
            <AvatarFallback>{conversation.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{conversation.provider.name}</h3>
            <p className="text-xs text-gray-500">
              {conversation.provider.online ? <span className="text-green-500">● Online</span> : "Last seen recently"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Block contact</DropdownMenuItem>
              <DropdownMenuItem>Clear conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Report issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none",
              )}
            >
              <p>{message.text}</p>
              <div className={cn("text-xs mt-1", message.sender === "user" ? "text-blue-100" : "text-gray-500")}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  )
}
