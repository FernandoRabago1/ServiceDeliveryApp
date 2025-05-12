"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal } from "lucide-react"
import Header from "@/components/header"
import ServiceProviderCard from "@/components/service-provider-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const categoryNames: Record<string, string> = {
  "home-maintenance": "Hogar y Mantenimiento",
  "beauty-wellness": "Belleza y Bienestar",
  "health-care": "Salud y Cuidado Personal",
  automotive: "Automotriz",
  education: "Educación y Clases",
  pets: "Mascotas",
  events: "Eventos y Entretenimiento",
}

interface ProviderData {
  uid: string;
  title: string | null;
  body: string | null;
  cost: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  owner: {
    uid: string;
    name: string | null;
    email: string;
    description: string | null;
    average_rating: number | null;
    is_new: boolean | null;
  };
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const categoryName = categoryNames[category] || "Servicios"
  const providerId = params.id;


  const [searchQuery, setSearchQuery] = useState("")
  const [maxDistance, setMaxDistance] = useState(10)
  const [minRating, setMinRating] = useState(4)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [data, setData] = useState([] as any[])
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  
  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${providerId}`)
      .then(res => res.json())
      .then(data => setProviderData(data))
      .catch(err => console.error("Error fetching provider:", err));
  }, [providerId]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
  }, [])

  const formattedProviders = data.map((post: any) => ({
    id: post.uid,
    name: post.owner.name || "Desconocido",
    title: post.title || "Sin título",
    rating: 4.5, // Placeholder
    reviews: 0, // Placeholder
    price: post.cost || 0,
    priceType: "service",
    distance: 1.0,
    image: "/placeholder.svg?height=80&width=80",
    isNew: false,
    badges: [],
  }))

  const filteredProviders = formattedProviders.filter((provider) => {
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{categoryName}</h1>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal size={20} />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div>
                  <Label>Buscar</Label>
                  <Input
                    placeholder="Buscar por nombre o título"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Distancia máxima (km)</Label>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[maxDistance]}
                    onValueChange={(value) => setMaxDistance(value[0])}
                  />
                  <div className="text-sm mt-1">{maxDistance} km</div>
                </div>

                <div>
                  <Label>Calificación mínima</Label>
                  <Slider
                    min={1}
                    max={5}
                    step={0.1}
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                  />
                  <div className="text-sm mt-1">{minRating} estrellas</div>
                </div>

                <div>
                  <Label>Rango de precio ($)</Label>
                  <Slider
                    min={0}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value)}
                  />
                  <div className="text-sm mt-1">
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("")
                    setMaxDistance(10)
                    setMinRating(4)
                    setPriceRange([0, 1000])
                  }}
                  className="w-full"
                >
                  Resetear filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                No se encontraron proveedores de servicios que coincidan con los
                filtros.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setMaxDistance(10)
                  setMinRating(4)
                  setPriceRange([0, 1000])
                }}
              >
                Resetear filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


/* export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const categoryName = categoryNames[category] || "Services"

  const [searchQuery, setSearchQuery] = useState("")
  const [maxDistance, setMaxDistance] = useState(10)
  const [minRating, setMinRating] = useState(4)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [data, setData] = useState([] as any []);

  useEffect(() => {
    console.log("Category page loaded")
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    console.log("Reacciona cuando data cambia", data)
    
  }, [data]);

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
 */