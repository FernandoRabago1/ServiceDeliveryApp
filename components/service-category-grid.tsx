"use client"

import type React from "react"

import { Home, Sparkles, Heart, Car, GraduationCap, PawPrint, PartyPopper, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ServiceCategoryProps {
  title: string
  icon: React.ReactNode
  color: string
  href: string
}

const ServiceCategory = ({ title, icon, color, href }: ServiceCategoryProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "rounded-lg p-8 h-40 flex flex-col items-center justify-center text-white transition-transform hover:scale-105",
          color,
        )}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-center">{title}</h3>
      </div>
    </Link>
  )
}

export default function ServiceCategoryGrid() {
  const categories = [
    {
      title: "Hogar y Mantenimiento",
      icon: <Home />,
      color: "bg-amber-500",
      href: "/services/home-maintenance",
    },
    {
      title: "Belleza y Bienestar",
      icon: <Sparkles />,
      color: "bg-purple-400",
      href: "/services/beauty-wellness",
    },
    {
      title: "Salud y Cuidado Personal",
      icon: <Heart />,
      color: "bg-blue-300",
      href: "/services/health-care",
    },
    {
      title: "Automotriz",
      icon: <Car />,
      color: "bg-green-400",
      href: "/services/automotive",
    },
    {
      title: "Educación y Clases",
      icon: <GraduationCap />,
      color: "bg-orange-500",
      href: "/services/education",
    },
    {
      title: "Mascotas",
      icon: <PawPrint />,
      color: "bg-amber-700",
      href: "/services/pets",
    },
    {
      title: "Eventos y Entretenimiento",
      icon: <PartyPopper />,
      color: "bg-blue-500",
      href: "/services/events",
    },
    {
      title: "",
      icon: <Plus className="h-12 w-12 text-gray-400" />,
      color: "bg-gray-200",
      href: "/services/add-category",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <ServiceCategory
          key={index}
          title={category.title}
          icon={category.icon}
          color={category.color}
          href={category.href}
        />
      ))}
    </div>
  )
}
