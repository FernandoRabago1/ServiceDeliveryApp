"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Mail,
  Phone,
  Star,
  Calendar,
  MoreHorizontal,
  Filter,
  MapPin,
  FileText,
  LayoutGrid,
  List,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for customers
const mockCustomers = [
  {
    id: "C1001",
    name: "Juan Perez",
    email: "juan.perez@example.com",
    phone: "+52 1 33 1234 5678",
    joinDate: "2023-01-15",
    location: "Zapopan, Jalisco",
    totalBookings: 8,
    totalSpent: 2450,
    lastBooking: "2023-04-10",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "C1002",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@example.com",
    phone: "+52 1 33 2345 6789",
    joinDate: "2023-02-03",
    location: "Guadalajara, Jalisco",
    totalBookings: 5,
    totalSpent: 1800,
    lastBooking: "2023-04-05",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "C1003",
    name: "Carlos Gomez",
    email: "carlos.gomez@example.com",
    phone: "+52 1 33 3456 7890",
    joinDate: "2023-02-18",
    location: "Tlaquepaque, Jalisco",
    totalBookings: 3,
    totalSpent: 950,
    lastBooking: "2023-03-25",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "C1004",
    name: "Ana Martinez",
    email: "ana.martinez@example.com",
    phone: "+52 1 33 4567 8901",
    joinDate: "2023-03-01",
    location: "Zapopan, Jalisco",
    totalBookings: 2,
    totalSpent: 650,
    lastBooking: "2023-03-20",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "inactive",
  },
  {
    id: "C1005",
    name: "Roberto Diaz",
    email: "roberto.diaz@example.com",
    phone: "+52 1 33 5678 9012",
    joinDate: "2023-03-10",
    location: "Guadalajara, Jalisco",
    totalBookings: 1,
    totalSpent: 450,
    lastBooking: "2023-03-15",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "C1006",
    name: "Sofia Lopez",
    email: "sofia.lopez@example.com",
    phone: "+52 1 33 6789 0123",
    joinDate: "2023-03-15",
    location: "Tonala, Jalisco",
    totalBookings: 2,
    totalSpent: 800,
    lastBooking: "2023-04-08",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
]

// Mock data for customer service history
const mockServiceHistory = {
  C1001: [
    {
      id: "ORD-1234",
      service: "Plumbing Repair",
      provider: "Carlos Mendez",
      date: "2023-04-10",
      amount: 400,
      status: "completed",
      rating: 5,
    },
    {
      id: "ORD-1180",
      service: "Electrical Installation",
      provider: "Juan Perez",
      date: "2023-03-25",
      amount: 450,
      status: "completed",
      rating: 4,
    },
    {
      id: "ORD-1120",
      service: "House Cleaning",
      provider: "Maria Gonzalez",
      date: "2023-03-10",
      amount: 300,
      status: "completed",
      rating: 5,
    },
  ],
  C1002: [
    {
      id: "ORD-1235",
      service: "House Cleaning",
      provider: "Maria Gonzalez",
      date: "2023-04-05",
      amount: 350,
      status: "completed",
      rating: 4,
    },
    {
      id: "ORD-1185",
      service: "Gardening",
      provider: "Ana Rodriguez",
      date: "2023-03-15",
      amount: 250,
      status: "completed",
      rating: 5,
    },
  ],
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false)

  // Filter customers based on search query
  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewCustomerDetails = (customer: any) => {
    setSelectedCustomer(customer)
    setCustomerDetailsOpen(true)
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
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-gray-500">Manage your customer relationships</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 w-64"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">View:</span>
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                          <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomerDetails(customer)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{customer.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Joined {formatDate(customer.joinDate)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="font-semibold">{customer.totalBookings}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="font-semibold">${customer.totalSpent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t p-4 flex justify-end">
                    <Button onClick={() => handleViewCustomerDetails(customer)}>View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                              <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{customer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.location}</TableCell>
                        <TableCell>{customer.totalBookings}</TableCell>
                        <TableCell>${customer.totalSpent}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewCustomerDetails(customer)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found</p>
            {searchQuery && (
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={customerDetailsOpen} onOpenChange={setCustomerDetailsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>Detailed information about the customer</DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} alt={selectedCustomer.name} />
                    <AvatarFallback>{selectedCustomer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mt-2">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500">Customer ID: {selectedCustomer.id}</p>
                  <Badge className="mt-2" variant={selectedCustomer.status === "active" ? "default" : "secondary"}>
                    {selectedCustomer.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <p>{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p>{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p>{selectedCustomer.location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p>{formatDate(selectedCustomer.joinDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Total Bookings</p>
                      <p className="font-semibold text-xl">{selectedCustomer.totalBookings}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="font-semibold text-xl">${selectedCustomer.totalSpent}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Last Booking</p>
                      <p className="font-semibold">{formatDate(selectedCustomer.lastBooking)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="history">
                  <TabsList>
                    <TabsTrigger value="history">Service History</TabsTrigger>
                    <TabsTrigger value="notes">Customer Notes</TabsTrigger>
                    <TabsTrigger value="communications">Communications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockServiceHistory[selectedCustomer.id as keyof typeof mockServiceHistory]?.length > 0 ? (
                          mockServiceHistory[selectedCustomer.id as keyof typeof mockServiceHistory]?.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.id}</TableCell>
                              <TableCell>{booking.service}</TableCell>
                              <TableCell>{booking.provider}</TableCell>
                              <TableCell>{formatDate(booking.date)}</TableCell>
                              <TableCell>${booking.amount}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < booking.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No service history available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-gray-500 text-center">No customer notes available</p>
                        <div className="mt-4">
                          <Input placeholder="Add a note about this customer..." />
                          <Button className="mt-2">Add Note</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="communications" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-gray-500 text-center">No communication history available</p>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </Button>
                          <Button variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Customer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomerDetailsOpen(false)}>
              Close
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Export Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
