"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking")

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Mock booking data
  const bookingData = {
    id: bookingId || "BK-1234",
    provider: {
      id: "1",
      name: "Carlos Mendez",
      title: "Professional Plumber",
      image: "/placeholder.svg?height=80&width=80",
    },
    date: "April 20, 2023",
    time: "2:00 PM",
    total: 450,
  }

  const handleReviewSubmit = () => {
    // Simulate API call
    setTimeout(() => {
      setReviewSubmitted(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Thank you for using QuickServ</CardDescription>
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

            <div className="p-3 bg-blue-50 rounded-md text-blue-800 text-sm mb-6">
              <p>
                Payment of <span className="font-bold">${bookingData.total}</span> has been processed successfully.
              </p>
              <p className="mt-1">
                Booking ID: <span className="font-mono font-medium">{bookingData.id}</span>
              </p>
            </div>

            {!reviewSubmitted ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Rate your experience</h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={`h-8 w-8 ${rating >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Write a review</label>
                  <Textarea
                    placeholder="Share your experience with this service provider..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button className="w-full" onClick={handleReviewSubmit} disabled={rating === 0}>
                  Submit Review
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                <h3 className="font-semibold">Thank you for your review!</h3>
                <p className="text-gray-600">Your feedback helps improve our service.</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" asChild>
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
