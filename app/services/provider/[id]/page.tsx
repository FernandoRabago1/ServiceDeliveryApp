"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, MapPin, Clock, Award, Shield, ChevronLeft, MessageSquare, Phone, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import ReviewCard from "@/components/review-card"
import BookingForm from "@/components/booking-form"

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

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.id;
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${providerId}`)
      .then(res => res.json())
      .then(data => setProviderData(data))
      .catch(err => console.error("Error fetching provider:", err));
  }, [providerId]);

  useEffect(() => {
    fetch("http://localhost:3000/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((review: any) => ({
          id: review.uid,
          user: review.reviewer_name || "Anonymous",
          rating: review.rating,
          date: new Date(review.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          comment: review.review_text,
          userImage: review.reviewer_image || "/placeholder.svg?height=40&width=40",
        }));
        setReviews(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

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

  if (!providerData) {
    return <div className="text-center mt-10">Loading provider...</div>
  }

  const {
    title,
    body,
    cost,
    created_at,
    latitude,
    longitude,
    owner
  } = providerData;

  const {
    name,
    description,
    average_rating,
    is_new
  } = owner;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" alt={name || "Provider"} />
                    <AvatarFallback>{name?.substring(0, 2).toUpperCase() || "PR"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">{name}</h1>
                        <p className="text-gray-600">{title}</p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <Button variant="outline" size="sm" className="mr-2">
                          <MessageSquare className="h-4 w-4 mr-1" /> Message
                        </Button>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center mt-3">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{average_rating?.toFixed(1) || "N/A"}</span>
                      <span className="text-gray-500 text-sm ml-1">(Reviews not counted here)</span>
                      <div className="mx-2 h-4 border-r border-gray-300"></div>
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500 text-sm ml-1">{latitude}, {longitude}</span>
                    </div>

                    <div className="mt-3">
                      {is_new && (
                        <Badge variant="secondary" className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          New Provider
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700">{description || "No description provided."}</p>
                      <p className="mt-2 text-sm text-gray-500">Posted on: {new Date(created_at).toLocaleDateString()}</p>
                      <p className="mt-2 text-md font-semibold text-gray-800">Cost: ${cost?.toFixed(2) || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="about" className="mt-6">
            <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <p className="mt-4 text-gray-600">{body}</p>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="space-y-4 mt-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} {...review} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
          <BookingForm 
          providerId={providerData.uid} 
          providerName={providerData.owner.name} 
        />
          </div>
        </div>
      </div>
    </div>
  );
}




/* "use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, MapPin, Clock, Award, Shield, ChevronLeft, MessageSquare, Phone, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import ReviewCard from "@/components/review-card"
import BookingForm from "@/components/booking-form"

// Mock data for a service provider
const mockProvider = {
  id: 1,
  name: "Carlos Mendez",
  title: "Professional Plumber",
  description:
    "Experienced plumber with over 10 years of experience in residential and commercial plumbing services. Specializing in repairs, installations, and maintenance.",
  rating: 4.8,
  reviews: 124,
  price: 350,
  priceType: "hour",
  distance: 2.5,
  image: "/placeholder.svg?height=150&width=150",
  isNew: false,
  badges: ["punctual", "professional", "reliable"],
  services: [
    "Pipe repairs and replacements",
    "Drain cleaning and unclogging",
    "Fixture installations",
    "Water heater services",
    "Leak detection and repair",
  ],
  gallery: [
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ],
  availability: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 2:00 PM",
    sunday: "Closed",
  },
}

// Mock reviews
const mockReviews = [
  {
    id: 1,
    user: "Maria L.",
    rating: 5,
    date: "March 15, 2023",
    comment: "Carlos was very professional and fixed our leaking sink quickly. Highly recommend!",
    userImage: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    user: "Juan P.",
    rating: 4,
    date: "February 28, 2023",
    comment: "Good service, arrived on time and completed the job efficiently. Would hire again.",
    userImage: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    user: "Ana R.",
    rating: 5,
    date: "January 10, 2023",
    comment: "Excellent service! Carlos installed our new water heater and explained everything thoroughly.",
    userImage: "/placeholder.svg?height=40&width=40",
  },
]

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


export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params.id
  const [activeTab, setActiveTab] = useState("about")
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((json) => setUser(json))
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    console.log("Reacciona cuando data cambia", user)
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:3000/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((review: any) => ({
          id: review.uid,
          user: review.reviewer_name || "Anonymous", // Asegúrate que `reviewer_name` venga del backend o usa placeholder
          rating: review.rating,
          date: new Date(review.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          comment: review.review_text,
          userImage: review.reviewer_image || "/placeholder.svg?height=40&width=40", // Asegúrate que venga del backend
        }));
        setReviews(formatted);
      })
      .catch((err) => console.error(err));
  }, []);
  



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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={mockProvider.image || "/placeholder.svg"} alt={mockProvider.name} />
                    <AvatarFallback>{mockProvider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">{mockProvider.name}</h1>
                        <p className="text-gray-600">{mockProvider.title}</p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <Button variant="outline" size="sm" className="mr-2">
                          <MessageSquare className="h-4 w-4 mr-1" /> Message
                        </Button>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center mt-3">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{mockProvider.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({mockProvider.reviews} reviews)</span>
                      <div className="mx-2 h-4 border-r border-gray-300"></div>
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500 text-sm ml-1">{mockProvider.distance} km away</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {mockProvider.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            {getBadgeIcon(badge)}
                            {getBadgeText(badge)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center">
                        <span className="font-bold text-xl">${mockProvider.price}</span>
                        <span className="text-gray-500 text-sm ml-1">/{mockProvider.priceType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Tabs defaultValue="about" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-700">{mockProvider.description}</p>

                      <h3 className="text-lg font-semibold mt-6 mb-2">Services Offered</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {mockProvider.services.map((service, index) => (
                          <li key={index} className="text-gray-700">
                            {service}
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-lg font-semibold mt-6 mb-2">Availability</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(mockProvider.availability).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}:</span>
                            <span className="text-gray-700">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="gallery" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Work Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mockProvider.gallery.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Work sample ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Client Reviews</h3>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 font-medium">{mockProvider.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({mockProvider.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <ReviewCard key={index} review={review} />
                          ))
                        ) : (
                          <p className="text-gray-500">No reviews yet.</p>
                        )}
                      </div>

                      <Button variant="outline" className="w-full mt-4">
                        View All Reviews
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Book This Service</h3>
                <BookingForm providerId={providerId as string} providerName={mockProvider.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
 */