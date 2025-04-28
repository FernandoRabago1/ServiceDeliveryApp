"use client"

import { useState } from "react"
import ServiceCategoryGrid from "@/components/service-category-grid"
import Header from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-blue-800">Welcome to Service App</h2>
              <p className="text-blue-600">Login or register to access all features and book services.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/register">Register</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        )}
        <ServiceCategoryGrid />
      </div>
    </div>
  )
}
