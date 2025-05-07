"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sliders, MapPin, Star, LayoutGrid, List, MenuIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ServiceProviderCard from "@/components/service-provider-card"

// Mock data for service providers and bookings
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
    category: "home-maintenance",
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
    category: "home-maintenance",
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
    category: "home-maintenance",
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
    category: "home-maintenance",
  },
  {
    id: 5,
    name: "Sofia Lopez",
    title: "Hair Stylist",
    rating: 4.9,
    reviews: 156,
    price: 450,
    priceType: "service",
    distance: 3.5,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: ["professional", "reliable"],
    category: "beauty-wellness",
  },
  {
    id: 6,
    name: "Diego Martinez",
    title: "Personal Trainer",
    rating: 4.7,
    reviews: 78,
    price: 500,
    priceType: "session",
    distance: 4.2,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: ["punctual", "professional"],
    category: "health-care",
  },
  {
    id: 7,
    name: "Laura Sanchez",
    title: "Makeup Artist",
    rating: 4.8,
    reviews: 93,
    price: 350,
    priceType: "service",
    distance: 2.7,
    image: "/placeholder.svg?height=80&width=80",
    isNew: true,
    badges: ["professional"],
    category: "beauty-wellness",
  },
  {
    id: 8,
    name: "Roberto Diaz",
    title: "Auto Mechanic",
    rating: 4.6,
    reviews: 105,
    price: 380,
    priceType: "service",
    distance: 5.5,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: ["reliable"],
    category: "automotive",
  },
]


export default function CustomViewPage() {
  const [viewType, setViewType] = useState<"grid" | "list" | "compact">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [maxDistance, setMaxDistance] = useState(10)
  const [minRating, setMinRating] = useState(4)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([2, 5]) // Mock favorite providers
  const [data, setData] = useState([] as any[])

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    console.log("Reacciona cuando data cambia", data)
  }, [data]);

  // Formatear los datos reales del modelo Post
  const formattedProviders = data.map((post: any) => ({
    id: post.uid,
    name: post.owner_name || "Desconocido", // Asumiendo que backend expone owner_name, si no, reemplazar por lógica adecuada
    title: post.title || "Sin título",
    rating: 4.5, // placeholder ya que no está en el modelo
    reviews: 0,  // placeholder ya que no está en el modelo
    price: post.cost || 0,
    priceType: "service", // Puedes ajustar según lógica si tienes más info
    distance: 1.0, // Puedes calcular con lat/long si lo deseas
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: [],
    category: "automotive"
  }))

  // Filter providers based on filters
  const filteredProviders = formattedProviders.filter((provider) => {
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDistance = provider.distance <= maxDistance
    const matchesRating = provider.rating >= minRating
    const matchesPrice = provider.price >= priceRange[0] && provider.price <= priceRange[1]
    const matchesFavorites = !showFavorites || favorites.includes(provider.id)

    return matchesCategory && matchesSearch && matchesDistance && matchesRating && matchesPrice && matchesFavorites
  })

  const toggleFavorite = (providerId: number) => {
    setFavorites((prev) => (prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId]))
  }

  const sortOptions = [
    { value: "rating", label: "Rating (High to Low)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "distance", label: "Distance (Nearest)" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Custom View</h1>
            <p className="text-gray-500">Customize how you view service providers</p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <Button
              variant={viewType === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("grid")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={viewType === "compact" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("compact")}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sliders className="h-4 w-4 mr-2" /> Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Options</DialogTitle>
                  <DialogDescription>Set your preferences for service providers</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="home-maintenance">Home & Maintenance</SelectItem>
                        <SelectItem value="beauty-wellness">Beauty & Wellness</SelectItem>
                        <SelectItem value="health-care">Health & Personal Care</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="education">Education & Classes</SelectItem>
                        <SelectItem value="events">Events & Entertainment</SelectItem>
                        <SelectItem value="pets">Pets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-favorites">Show favorites only</Label>
                    <Switch id="show-favorites" checked={showFavorites} onCheckedChange={setShowFavorites} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => {}}>
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Input
              className="pl-10 w-full"
              placeholder="Search for service providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {filteredProviders.length > 0 ? (
          <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredProviders.map((provider) => (
              <div key={provider.id}>
                {viewType === "grid" ? (
                  <ServiceProviderCard provider={provider} />
                ) : viewType === "list" ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={provider.image || "/placeholder.svg"} alt={provider.name} />
                          <AvatarFallback>{provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{provider.name}</h3>
                                {favorites.includes(provider.id) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 fill-yellow-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    onClick={() => toggleFavorite(provider.id)}
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )}
                                {!favorites.includes(provider.id) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400 hover:text-yellow-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => toggleFavorite(provider.id)}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{provider.title}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${provider.price}</div>
                              <div className="text-sm text-gray-500">per {provider.priceType}</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                              <span>
                                {provider.rating} ({provider.reviews})
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                              <span>{provider.distance} km</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {provider.badges.map((badge, index) => (
                              <Badge key={index} variant="secondary">
                                {badge === "punctual" && "Punctual"}
                                {badge === "professional" && "Professional"}
                                {badge === "reliable" && "Reliable"}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button>View Profile</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={provider.image || "/placeholder.svg"} alt={provider.name} />
                            <AvatarFallback>{provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm">{provider.name}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                              <span>{provider.rating}</span>
                              <MapPin className="h-3 w-3 text-gray-500 ml-2 mr-1" />
                              <span>{provider.distance} km</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">${provider.price}</div>
                          <Button size="sm" variant="outline" className="mt-1">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No service providers match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setMaxDistance(10)
                setMinRating(4)
                setPriceRange([0, 1000])
                setShowFavorites(false)
              }}
            >
              Reset all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
