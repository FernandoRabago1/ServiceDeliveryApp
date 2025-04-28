"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import MessageConversation from "@/components/message-conversation"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    provider: {
      id: "1",
      name: "Carlos Mendez",
      title: "Professional Plumber",
      image: "/placeholder.svg?height=60&width=60",
      online: true,
    },
    lastMessage: {
      text: "I'll be there at 2 PM tomorrow as scheduled.",
      timestamp: "10:23 AM",
      isRead: true,
      sender: "provider",
    },
    unread: 0,
  },
  {
    id: "2",
    provider: {
      id: "2",
      name: "Maria Gonzalez",
      title: "House Cleaner",
      image: "/placeholder.svg?height=60&width=60",
      online: false,
    },
    lastMessage: {
      text: "Do you need me to bring any special cleaning supplies?",
      timestamp: "Yesterday",
      isRead: false,
      sender: "provider",
    },
    unread: 1,
  },
  {
    id: "3",
    provider: {
      id: "3",
      name: "Juan Perez",
      title: "Electrician",
      image: "/placeholder.svg?height=60&width=60",
      online: false,
    },
    lastMessage: {
      text: "The electrical installation is complete. Please let me know if you have any questions.",
      timestamp: "Yesterday",
      isRead: false,
      sender: "provider",
    },
    unread: 1,
  },
  {
    id: "4",
    provider: {
      id: "4",
      name: "Ana Rodriguez",
      title: "Gardener",
      image: "/placeholder.svg?height=60&width=60",
      online: true,
    },
    lastMessage: {
      text: "Thank you for your payment. I'll see you next month for the regular maintenance.",
      timestamp: "Monday",
      isRead: true,
      sender: "provider",
    },
    unread: 0,
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1") // Default to first conversation
  const [conversations, setConversations] = useState(mockConversations)

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.provider.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mark conversation as read when selected
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: 0, lastMessage: { ...conv.lastMessage, isRead: true } } : conv,
      ),
    )
  }

  // Add a new message to a conversation
  const handleSendMessage = (conversationId: string, messageText: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                text: messageText,
                timestamp,
                isRead: true,
                sender: "user",
              },
            }
          : conv,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="md:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 border-b",
                      selectedConversation === conversation.id && "bg-gray-100",
                    )}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={conversation.provider.image || "/placeholder.svg"}
                          alt={conversation.provider.name}
                        />
                        <AvatarFallback>{conversation.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {conversation.provider.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.provider.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.lastMessage.timestamp}</span>
                      </div>
                      <p
                        className={cn(
                          "text-sm truncate",
                          conversation.unread > 0 ? "font-medium text-black" : "text-gray-500",
                        )}
                      >
                        {conversation.lastMessage.sender === "user" ? "You: " : ""}
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              )}
            </div>
          </Card>

          <Card className="md:col-span-2 overflow-hidden flex flex-col">
            {selectedConversation ? (
              <MessageConversation
                conversation={conversations.find((c) => c.id === selectedConversation)!}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
