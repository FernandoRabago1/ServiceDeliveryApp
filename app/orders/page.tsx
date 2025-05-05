"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  LayoutGrid,
  List,
  Star,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for service orders
const mockOrders = {
  active: [
    {
      id: "ORD-1234",
      service: "Plumbing Repair",
      provider: {
        id: "1",
        name: "Carlos Mendez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-04-20",
      time: "14:00 - 16:00",
      address: "Av. Chapultepec 123, Guadalajara",
      status: "scheduled",
      price: 350,
      serviceFee: 50,
      total: 400,
      paymentStatus: "pending",
    },
    {
      id: "ORD-1235",
      service: "House Cleaning",
      provider: {
        id: "2",
        name: "Maria Gonzalez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-04-25",
      time: "10:00 - 13:00",
      address: "Calle Hidalgo 456, Guadalajara",
      status: "confirmed",
      price: 300,
      serviceFee: 40,
      total: 340,
      paymentStatus: "pending",
    },
    {
      id: "ORD-1236",
      service: "Electrical Installation",
      provider: {
        id: "3",
        name: "Juan Perez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-04-18",
      time: "09:00 - 11:00",
      address: "Av. Mexico 789, Guadalajara",
      status: "in_progress",
      price: 400,
      serviceFee: 50,
      total: 450,
      paymentStatus: "pending",
    },
  ],
  completed: [
    {
      id: "ORD-1230",
      service: "Garden Maintenance",
      provider: {
        id: "4",
        name: "Ana Rodriguez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-03-15",
      time: "10:00 - 12:00",
      address: "Calle Juarez 321, Guadalajara",
      status: "completed",
      price: 250,
      serviceFee: 30,
      total: 280,
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      rating: 5,
    },
    {
      id: "ORD-1228",
      service: "Hair Styling",
      provider: {
        id: "5",
        name: "Sofia Lopez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-03-10",
      time: "15:00 - 16:30",
      address: "Av. Vallarta 567, Guadalajara",
      status: "completed",
      price: 450,
      serviceFee: 50,
      total: 500,
      paymentStatus: "paid",
      paymentMethod: "Cash",
      rating: 4,
    },
    {
      id: "ORD-1225",
      service: "Car Repair",
      provider: {
        id: "6",
        name: "Roberto Diaz",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-03-05",
      time: "09:00 - 14:00",
      address: "Calle Morelos 890, Guadalajara",
      status: "completed",
      price: 1200,
      serviceFee: 100,
      total: 1300,
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      rating: 5,
    },
  ],
  cancelled: [
    {
      id: "ORD-1220",
      service: "Massage Therapy",
      provider: {
        id: "7",
        name: "Laura Sanchez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-02-28",
      time: "17:00 - 18:00",
      address: "Av. Chapultepec 456, Guadalajara",
      status: "cancelled",
      price: 500,
      serviceFee: 50,
      total: 550,
      paymentStatus: "refunded",
      cancellationReason: "Provider unavailable",
    },
    {
      id: "ORD-1218",
      service: "Home Painting",
      provider: {
        id: "8",
        name: "Diego Martinez",
        image: "/placeholder.svg?height=60&width=60",
      },
      date: "2023-02-20",
      time: "09:00 - 17:00",
      address: "Calle Hidalgo 789, Guadalajara",
      status: "cancelled",
      price: 1800,
      serviceFee: 150,
      total: 1950,
      paymentStatus: "not_charged",
      cancellationReason: "Customer request",
    },
  ],
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return null
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>
      case "not_charged":
        return <Badge className="bg-gray-100 text-gray-800">Not Charged</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
      case "confirmed":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredOrders = (tab: string) => {
    const orders = mockOrders[tab as keyof typeof mockOrders] || []
    if (!searchQuery) return orders

    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.provider.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500">Manage your service orders</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 w-64"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setViewMode("cards")}>
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setViewMode("table")}>
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="active">Active ({mockOrders.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({mockOrders.completed.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({mockOrders.cancelled.length})</TabsTrigger>
          </TabsList>

          {["active", "completed", "cancelled"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {viewMode === "cards" ? (
                filteredOrders(tab).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders(tab).map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(order.status)}
                                <div>
                                  <h3 className="font-semibold">{order.service}</h3>
                                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">{getStatusBadge(order.status)}</div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={order.provider.image || "/placeholder.svg"}
                                  alt={order.provider.name}
                                />
                                <AvatarFallback>{order.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{order.provider.name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{formatDate(order.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{order.time}</span>
                              </div>
                              <div className="flex items-center gap-2 col-span-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="truncate">{order.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-500">Total:</span>
                              <span className="font-bold ml-1">${order.total}</span>
                              <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
                            </div>
                            <Button onClick={() => handleViewOrderDetails(order)}>View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No {tab} orders found</p>
                    {searchQuery && (
                      <Button variant="link" onClick={() => setSearchQuery("")}>
                        Clear search
                      </Button>
                    )}
                  </div>
                )
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders(tab).length > 0 ? (
                          filteredOrders(tab).map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.service}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={order.provider.image || "/placeholder.svg"}
                                      alt={order.provider.name}
                                    />
                                    <AvatarFallback>{order.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{order.provider.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(order.date)}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell>${order.total}</TableCell>
                              <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleViewOrderDetails(order)}>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No {tab} orders found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete information about your service order</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedOrder.service}</h3>
                  <p className="text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedOrder.provider.image || "/placeholder.svg"}
                    alt={selectedOrder.provider.name}
                  />
                  <AvatarFallback>{selectedOrder.provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedOrder.provider.name}</h4>
                  <p className="text-sm text-gray-500">Service Provider</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{formatDate(selectedOrder.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">{selectedOrder.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-b py-3 space-y-2">
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${selectedOrder.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee</span>
                  <span>${selectedOrder.serviceFee}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>${selectedOrder.total}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Payment Status</p>
                  <div className="mt-1">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</div>
                  {selectedOrder.paymentMethod && (
                    <p className="text-sm text-gray-500 mt-1">Paid via {selectedOrder.paymentMethod}</p>
                  )}
                </div>

                {selectedOrder.status === "scheduled" || selectedOrder.status === "confirmed" ? (
                  <Button>Reschedule</Button>
                ) : selectedOrder.status === "completed" && !selectedOrder.rating ? (
                  <Button>Leave Review</Button>
                ) : selectedOrder.status === "in_progress" ? (
                  <Button>Contact Provider</Button>
                ) : null}
              </div>

              {selectedOrder.cancellationReason && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="font-medium text-red-800">Cancellation Reason</p>
                  <p className="text-sm text-red-700">{selectedOrder.cancellationReason}</p>
                </div>
              )}

              {selectedOrder.status === "completed" && selectedOrder.rating && (
                <div className="flex items-center">
                  <p className="font-medium mr-2">Your Rating:</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < selectedOrder.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
