"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreditCard, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [tipAmount, setTipAmount] = useState(0)
  const [loading, setLoading] = useState(false)

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
    price: 350,
    serviceFee: 50,
    total: 400,
  }

  const tipOptions = [
    { value: 0, label: "No Tip" },
    { value: 40, label: "10%" },
    { value: 60, label: "15%" },
    { value: 80, label: "20%" },
    { value: "custom", label: "Custom" },
  ]

  const [customTip, setCustomTip] = useState("")

  const handleTipChange = (value: string) => {
    if (value === "custom") {
      setTipAmount(Number.parseInt(customTip) || 0)
    } else {
      setTipAmount(Number.parseInt(value))
    }
  }

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTip(e.target.value)
    if (paymentMethod === "custom") {
      setTipAmount(Number.parseInt(e.target.value) || 0)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push(`/payment/success?booking=${bookingId}`)
    }, 1500)
  }

  const finalTotal = bookingData.total + tipAmount

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you want to pay for the service</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment}>
                    <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center">
                          <DollarSign className="h-5 w-5 mr-2" />
                          Cash on Completion
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name on Card</Label>
                          <Input id="name" placeholder="John Doe" />
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <Label className="mb-2 block">Would you like to add a tip?</Label>
                      <RadioGroup onValueChange={handleTipChange} defaultValue="0" className="grid grid-cols-3 gap-2">
                        {tipOptions.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <RadioGroupItem
                              value={option.value.toString()}
                              id={`tip-${option.value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`tip-${option.value}`}
                              className="flex flex-col items-center justify-center w-full rounded-md border-2 border-gray-200 bg-white p-2 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
                            >
                              {option.value === "custom" ? (
                                <Input
                                  type="number"
                                  placeholder="$"
                                  className="w-full text-center"
                                  value={customTip}
                                  onChange={handleCustomTipChange}
                                  onClick={() => setPaymentMethod("custom")}
                                />
                              ) : (
                                <>
                                  <span className="font-medium">${option.value}</span>
                                  <span className="text-xs text-gray-500">{option.label}</span>
                                </>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={loading}>
                      {loading ? "Processing..." : `Pay $${finalTotal}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={bookingData.provider.image || "/placeholder.svg"}
                        alt={bookingData.provider.name}
                      />
                      <AvatarFallback>{bookingData.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{bookingData.provider.name}</p>
                      <p className="text-sm text-gray-500">{bookingData.provider.title}</p>
                    </div>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{bookingData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking ID:</span>
                      <span className="font-mono">{bookingData.id}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${bookingData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee</span>
                      <span>${bookingData.serviceFee}</span>
                    </div>
                    {tipAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Tip</span>
                        <span>${tipAmount}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${finalTotal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
