"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  PenToolIcon as Tool,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  badge?: number
  onClick?: () => void
}

const SidebarItem = ({ icon, label, href, active, badge, onClick }: SidebarItemProps) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left",
          active ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
        )}
      >
        {icon}
        <span>{label}</span>
        {badge && (
          <span className="ml-auto bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <Link href={href} className="w-full">
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          active ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
        )}
      >
        {icon}
        <span>{label}</span>
        {badge && (
          <span className="ml-auto bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  const isLoggedIn = !!user

  return (
    <div className={cn("bg-[#1E1E1E] text-white transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-white rounded p-1">
              <Tool className="h-6 w-6 text-[#1E1E1E]" />
            </div>
            <span className="font-bold text-lg">Dooers</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto bg-white rounded p-1">
            <Tool className="h-6 w-6 text-[#1E1E1E]" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-6 space-y-1 px-3">
        <div className="flex items-center px-3 py-2">
          {!collapsed && <span className="text-xs font-semibold uppercase text-gray-400">Services</span>}
        </div>
        <SidebarItem icon={<Home className="h-5 w-5" />} label="Summary" href="/" active={pathname === "/"} />
      </div>

      <div className="mt-6 space-y-1 px-3">
        <SidebarItem
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          href="/messages"
          active={pathname === "/messages"}
          badge={2}
        />
        <SidebarItem
          icon={<FileText className="h-5 w-5" />}
          label="Orders"
          href="/orders"
          active={pathname === "/orders"}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          href="/customers"
          active={pathname === "/customers"}
        />
      </div>

      <div className="mt-6 space-y-1 px-3">
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          href="/settings"
          active={pathname === "/settings"}
        />
      </div>

      <div className="mt-6 space-y-1 px-3">
        <SidebarItem
          icon={<Plus className="h-5 w-5" />}
          label="Add Service"
          href="/addService"
          active={pathname === "/addService"}
        />
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="space-y-3">
          {!collapsed && !isLoggedIn && (
            <>
              <Link href="/auth/login" className="block text-sm text-gray-400 hover:text-white px-3">
                Login
              </Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white px-3">
                Contact us
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <SidebarItem icon={<LogOut className="h-5 w-5" />} label="Log out" href="#" onClick={logout} />
          ) : (
            <SidebarItem icon={<LogOut className="h-5 w-5" />} label="Log in" href="/auth/login" />
          )}
        </div>
      </div>
    </div>
  )
}
