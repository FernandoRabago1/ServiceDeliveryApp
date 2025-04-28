"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, MoreHorizontal, MessageSquare, Phone } from "lucide-react"
import Header from "@/components/header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock booking data
const mockBookings = {
  upcoming: [
    {
      id: "BK-1234",
      provider: {
        id: "1",
        name: "Carlos Mendez",
        title: "Professional Plumber",
        image: "/placeholder.svg?height=60&width=60",
      },
      service: "Pipe repair",
      date: "April 20, 2023",
      time: "2:00 PM",
      address: "Av. Chapultepec 123, Guadalajara",
      status: "confirmed",
      total: 400,
    },
    {
      id: "BK-1235",
      provider: {
        id: "2",
        name: "Maria Gonzalez",
        title: "House Cleaner",
        image: "/placeholder.svg?height=60&width=60",
      },
      service: "Full house cleaning",
      date: "April 25, 2023",
      time: "10:00 AM",
      address: "Calle Hidalgo 456, Guadalajara",
      status: "pending",
      total: 300,
    },
  ],
  past: [
    {
      id: "BK-1230",
      provider: {
        id: "3",
        name: "Juan Perez",
        title: "Electrician",
        image: "/placeholder.svg?height=60&width=60",
      },
      service: "Electrical installation",
      date: "March 15, 2023",
      time: "3:30 PM",
      address: "Av. Vallarta 789, Guadalajara",
      status: "completed",
      total: 450,
      rated: true,
      rating: 5,
    },
    {
      id: "BK-1228",
      provider: {
        id: "4",
        name: "Ana Rodriguez",
        title: "Gardener",
        image: "/placeholder.svg?height=60&width=60",
      },
      service: "Garden maintenance",
      date: "March 5, 2023",
      time: "9:00 AM",
      address: "Calle Juarez 321, Guadalajara",
      status: "completed",
      total: 250,
      rated: false,
    },
  ],
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {mockBookings.upcoming.length > 0 ? (
              <div className="space-y-4">
                {mockBookings.upcoming.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={booking.provider.image || "/placeholder.svg"} alt={booking.provider.name} />
                              <AvatarFallback>{booking.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{booking.provider.name}</h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <p className="text-sm text-gray-500">{booking.provider.title}</p>
                              <p className="text-sm font-medium mt-1">{booking.service}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" /> Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" /> Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.address}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">Total:</span>
                          <span className="font-bold ml-1">${booking.total}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/services/provider/${booking.provider.id}`}>
                              View Provider
                            </Link>
                          </Button>
                          {booking.status === "confirmed" && (
                            <Button size="sm" asChild>
                              <Link href={`/payment/${booking.id}`}>
                                Pay Now
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You don&apos;t have any upcoming bookings.</p>
                <Button variant="link" asChild>
                  <Link href="/">Browse Services</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {mockBookings.past.length > 0 ? (
              <div className="space-y-4">
                {mockBookings.past.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={booking.provider.image || "/placeholder.svg"} alt={booking.provider.name} />
                              <AvatarFallback>{booking.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{booking.provider.name}</h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <p className="text-sm text-gray-500">{booking.provider.title}</p>
                              <p className="text-sm font-medium mt-1">{booking.service}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" /> Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Book Again
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.address}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">Total:</span>
                          <span className="font-bold ml-1">${booking.total}</span>
                        </div>
                        <div className="flex gap-2">
                          {!booking.rated ? (
                            <Button size="sm" asChild>
                              <Link href={`/payment/success?booking=${booking.id}`}>
                                Leave Review
                              </Link>
                            </Button>
                          ) : (
                            <div className="flex items-center">
                              <span className="text-sm mr-1">Your rating:</span>
                              <div className="flex">
                                {[...Array(booking.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                ))}
                              </div>
                            </div>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/services/provider/${booking.provider.id}`}>
                              Book Again
                            </Link>
                          </Button>
                        </div>
                      </div>\
