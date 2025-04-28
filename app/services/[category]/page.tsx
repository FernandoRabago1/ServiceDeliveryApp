"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal } from "lucide-react"
import Header from "@/components/header"
import ServiceProviderCard from "@/components/service-provider-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock data for service providers
const mockProviders = [
  {
    id: 1,
    name: "Carlos Mendez",
    title: "Professional Plumber",
    rating: 4.8,
    reviews: 124,
    price: 350,
    priceType: "hour",
    distance: 2.5,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: ["punctual", "professional"],
  },
  {
    id: 2,
    name: "Maria Gonzalez",
    title: "House Cleaner",
    rating: 4.9,
    reviews: 89,
    price: 300,
    priceType: "hour",
    distance: 3.2,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: ["reliable", "professional"],
  },
  {
    id: 3,
    name: "Juan Perez",
    title: "Electrician",
    rating: 4.7,
    reviews: 56,
    price: 400,
    priceType: "service",
    distance: 5.1,
    image: "/placeholder.svg?height=80&width=80",
    isNew: true,
    badges: ["punctual"],
  },
  {
    id: 4,
    name: "Ana Rodriguez",
    title: "Gardener",
    rating: 4.5,
    reviews: 32,
    price: 250,
    priceType: "hour",
    distance: 1.8,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: ["reliable"],
  },
]

// Map category slugs to display names
const categoryNames: Record<string, string> = {
  "home-maintenance": "Hogar y Mantenimiento",
  "beauty-wellness": "Belleza y Bienestar",
  "health-care": "Salud y Cuidado Personal",
  automotive: "Automotriz",
  education: "Educación y Clases",
  pets: "Mascotas",
  events: "Eventos y Entretenimiento",
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const categoryName = categoryNames[category] || "Services"

  const [searchQuery, setSearchQuery] = useState("")
  const [maxDistance, setMaxDistance] = useState(10)
  const [minRating, setMinRating] = useState(4)
  const [priceRange, setPriceRange] = useState([0, 1000])

  // Filter providers based on search and filters
  const filteredProviders = mockProviders.filter((provider) => {
    return (
      (provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      provider.distance <= maxDistance &&
      provider.rating >= minRating &&
      provider.price >= priceRange[0] &&
      provider.price <= priceRange[1]
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search services..."
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Services</SheetTitle>
                  <SheetDescription>Adjust your search parameters</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Maximum Distance: {maxDistance} km</Label>
                    <Slider
                      defaultValue={[maxDistance]}
                      max={20}
                      step={1}
                      onValueChange={(value) => setMaxDistance(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Rating: {minRating} stars</Label>
                    <Slider
                      defaultValue={[minRating]}
                      min={1}
                      max={5}
                      step={0.5}
                      onValueChange={(value) => setMinRating(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </Label>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={1000}
                      step={50}
                      onValueChange={(value) => setPriceRange(value)}
                    />
                  </div>
                  <Button className="w-full" onClick={() => {}}>
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => <ServiceProviderCard key={provider.id} provider={provider} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No service providers found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setMaxDistance(10)
                  setMinRating(4)
                  setPriceRange([0, 1000])
                }}
              >
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
