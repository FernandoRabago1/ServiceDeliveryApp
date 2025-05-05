"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const providerId = searchParams.get("provider")

  // Mock booking data
  const bookingData = {
    id: "BK-" + Math.floor(Math.random() * 10000),
    provider: {
      id: providerId || "1",
      name: "Carlos Mendez",
      title: "Professional Plumber",
      image: "/placeholder.svg?height=80&width=80",
    },
    date: "April 20, 2023",
    time: "2:00 PM",
    address: "Av. Chapultepec 123, Guadalajara",
    price: 350,
    serviceFee: 50,
    total: 400,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your service has been successfully booked</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={bookingData.provider.image || "/placeholder.svg"} alt={bookingData.provider.name} />
                <AvatarFallback>{bookingData.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{bookingData.provider.name}</h3>
                <p className="text-sm text-gray-500">{bookingData.provider.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-gray-600">
                    {bookingData.date} at {bookingData.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">{bookingData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Payment Details</p>
                  <div className="text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${bookingData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee</span>
                      <span>${bookingData.serviceFee}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-1 border-t">
                      <span>Total</span>
                      <span>${bookingData.total}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Payment will be collected after service completion</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
              <p>
                Booking ID: <span className="font-mono font-medium">{bookingData.id}</span>
              </p>
              <p className="mt-1">Save this ID for your reference</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" asChild>
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
