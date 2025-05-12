import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Award, Clock, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Provider {
  id: number
  name: string
  title: string
  rating: number
  reviews: number
  price: number
  priceType: string
  distance: number
  image: string
  isNew: boolean
  badges: string[]
}

interface ServiceProviderCardProps {
  provider: Provider
}

export default function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "punctual":
        return <Clock className="h-3 w-3 mr-1" />
      case "professional":
        return <Award className="h-3 w-3 mr-1" />
      case "reliable":
        return <Shield className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case "punctual":
        return "Punctual"
      case "professional":
        return "Professional"
      case "reliable":
        return "Reliable"
      default:
        return badge
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={provider.image || "/placeholder.svg"} alt={provider.name} />
              <AvatarFallback>{provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{provider.name}</h3>
                  <p className="text-gray-600">{provider.title}</p>
                </div>
                {provider.isNew && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    New
                  </Badge>
                )}
              </div>

              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{provider.rating}</span>
                {/* <span className="text-gray-500 text-sm ml-1">({provider.reviews} reviews)</span> */}
              </div>

              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{provider.distance} km away</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {provider.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  {getBadgeIcon(badge)}
                  {getBadgeText(badge)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 p-4 border-t">
        <div>
          <span className="font-bold text-lg">${provider.price}</span>
          <span className="text-gray-500 text-sm">/{provider.priceType}</span>
        </div>
        <Link href={`/services/provider/${provider.id}`}>
          <Button>View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
