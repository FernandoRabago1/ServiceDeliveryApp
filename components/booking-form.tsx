"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BookingFormProps {
  providerId: string
  providerName: string
}

export default function BookingForm({ providerId, providerName }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  // Mock time slots
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !timeSlot) {
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push(`/booking/confirmation?provider=${providerId}`)
    }, 1500)
  }

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-gray-400")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => {
                // Disable past dates and Sundays
                return date < new Date() || date.getDay() === 0
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Select Time</Label>
        <RadioGroup onValueChange={setTimeSlot} className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <div key={slot}>
              <RadioGroupItem value={slot} id={`time-${slot}`} className="peer sr-only" disabled={!date} />
              <Label
                htmlFor={`time-${slot}`}
                className="flex flex-col items-center justify-center rounded-md border-2 border-gray-200 bg-white p-2 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
              >
                <Clock className="mb-1 h-4 w-4" />
                <span className="text-sm">{slot}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special requirements or details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!date || !timeSlot || loading}>
        {loading ? "Processing..." : `Book with ${providerName}`}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By booking, you agree to our Terms of Service and Privacy Policy. No payment will be charged until service
        completion.
      </p>
    </form>
  )
}
