"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  CreditCard,
  User,
  Lock,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  Upload,
  CheckCircle,
  Plus,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Juan Perez",
    email: "juan.perez@example.com",
    phone: "+52 1 33 1234 5678",
    address: "Av. Chapultepec 123, Guadalajara, Jalisco",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Regular user of service delivery platforms looking for quality services in Guadalajara.",
  })

  // Mock verification status
  const [verificationStatus] = useState({
    email: true,
    phone: true,
    identity: true,
  })

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      newMessages: true,
      bookingReminders: true,
      serviceUpdates: true,
      promotions: false,
    },
    push: {
      newMessages: true,
      bookingReminders: true,
      serviceUpdates: false,
      promotions: false,
    },
  })

  // Mock payment methods
  const [paymentMethods] = useState([
    {
      id: "card1",
      type: "Credit Card",
      last4: "4242",
      expiry: "04/25",
      brand: "Visa",
      isDefault: true,
    },
    {
      id: "card2",
      type: "Debit Card",
      last4: "8888",
      expiry: "09/24",
      brand: "Mastercard",
      isDefault: false,
    },
  ])

  const handleSaveProfile = () => {
    // Simulate saving profile
    setTimeout(() => {
      setEditMode(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 500)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate password change
    setTimeout(() => {
      setPasswordDialogOpen(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{userData.name}</h3>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>

            <div className="w-full space-y-1">
              <div className="flex flex-col items-start bg-transparent p-0 h-auto space-y-1">
                <Button
                  variant={activeTab === "profile" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "security" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "payment" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant={activeTab === "language" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("language")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Language & Region
                </Button>
                <Button
                  variant={activeTab === "privacy" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("privacy")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </Button>
                <Button
                  variant={activeTab === "help" ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                  onClick={() => setActiveTab("help")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
              </div>
            </div>

            <Separator />
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your personal information and preferences</CardDescription>
                      </div>
                      {saveSuccess && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Saved successfully</span>
                        </div>
                      )}
                      {editMode ? (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                        </div>
                      ) : (
                        <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                          <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {editMode && (
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            {editMode ? (
                              <Input
                                id="name"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                              />
                            ) : (
                              <div className="p-2 border rounded-md bg-gray-50">{userData.name}</div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex items-center gap-2">
                              {editMode ? (
                                <Input
                                  id="email"
                                  value={userData.email}
                                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                              ) : (
                                <div className="p-2 border rounded-md bg-gray-50 flex-1">{userData.email}</div>
                              )}
                              {verificationStatus.email && (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center gap-2">
                              {editMode ? (
                                <Input
                                  id="phone"
                                  value={userData.phone}
                                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                />
                              ) : (
                                <div className="p-2 border rounded-md bg-gray-50 flex-1">{userData.phone}</div>
                              )}
                              {verificationStatus.phone && (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            {editMode ? (
                              <Input
                                id="address"
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                              />
                            ) : (
                              <div className="p-2 border rounded-md bg-gray-50">{userData.address}</div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">About Me</Label>
                          {editMode ? (
                            <Textarea
                              id="bio"
                              value={userData.bio}
                              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                              rows={3}
                            />
                          ) : (
                            <div className="p-2 border rounded-md bg-gray-50">{userData.bio}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Identity Verification</h3>
                      <div className="flex items-center gap-3">
                        {verificationStatus.identity ? (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 w-full">
                            <CheckCircle className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Identity Verified</p>
                              <p className="text-sm">Your INE/CURP has been successfully verified</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 w-full">
                            <AlertCircle className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Identity Verification Required</p>
                              <p className="text-sm">Verify your identity with INE or CURP to unlock all features</p>
                            </div>
                            <Button size="sm" className="ml-auto">
                              Verify Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and authentication methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Password</h3>
                      <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                        <div>
                          <p className="text-sm font-medium">Password</p>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">Change Password</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your current password and a new password to change your password
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" required />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Login Sessions</h3>
                      <div className="p-3 border rounded-md bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Current Session</p>
                            <p className="text-sm text-gray-500">Guadalajara, Mexico - Chrome on Windows</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active Now</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Mobile App</p>
                            <p className="text-sm text-gray-500">iPhone - QuickServ iOS App</p>
                          </div>
                          <p className="text-xs text-gray-500">Last active 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Sign Out All Other Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Email Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="email-messages">New messages</Label>
                            <Switch
                              id="email-messages"
                              checked={notificationSettings.email.newMessages}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  email: { ...notificationSettings.email, newMessages: checked },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="email-reminders">Booking reminders</Label>
                            <Switch
                              id="email-reminders"
                              checked={notificationSettings.email.bookingReminders}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  email: { ...notificationSettings.email, bookingReminders: checked },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="email-updates">Service updates</Label>
                            <Switch
                              id="email-updates"
                              checked={notificationSettings.email.serviceUpdates}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  email: { ...notificationSettings.email, serviceUpdates: checked },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="email-promotions">Promotions and offers</Label>
                            <Switch
                              id="email-promotions"
                              checked={notificationSettings.email.promotions}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  email: { ...notificationSettings.email, promotions: checked },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-3">Push Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="push-messages">New messages</Label>
                            <Switch
                              id="push-messages"
                              checked={notificationSettings.push.newMessages}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  push: { ...notificationSettings.push, newMessages: checked },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="push-reminders">Booking reminders</Label>
                            <Switch
                              id="push-reminders"
                              checked={notificationSettings.push.bookingReminders}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  push: { ...notificationSettings.push, bookingReminders: checked },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="push-updates">Service updates</Label>
                            <Switch
                              id="push-updates"
                              checked={notificationSettings.push.serviceUpdates}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  push: { ...notificationSettings.push, serviceUpdates: checked },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <Label htmlFor="push-promotions">Promotions and offers</Label>
                            <Switch
                              id="push-promotions"
                              checked={notificationSettings.push.promotions}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  push: { ...notificationSettings.push, promotions: checked },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Notification Preferences</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your payment methods and preferences</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Method
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-4 border rounded-md bg-white"
                        >
                          <div className="flex items-center gap-3">
                            {method.brand === "Visa" ? (
                              <div className="h-8 w-12 bg-blue-900 rounded text-white flex items-center justify-center font-bold">
                                VISA
                              </div>
                            ) : (
                              <div className="h-8 w-12 bg-yellow-500 rounded text-white flex items-center justify-center font-bold">
                                MC
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">
                                {method.type} ending in {method.last4}
                              </h3>
                              <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            {!method.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Payment Preferences</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "language" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Language &amp; Region</CardTitle>
                    <CardDescription>Manage your language and regional settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Coming Soon</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy settings and data sharing preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Coming Soon</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "help" && (
              <div className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Help &amp; Support</CardTitle>
                    <CardDescription>Find help and support resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Coming Soon</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
