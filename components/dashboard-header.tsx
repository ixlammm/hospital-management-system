"use client"

import type React from "react"

import { Bell, Search, Clock, Space } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n"
import { signOut } from "@/auth"
import { logout } from "@/actions/auth-actions"
import { SidebarTrigger } from "./ui/sidebar"

interface DashboardHeaderProps {
  activeTab: string
  navigationItems: {
    name: string
    icon: React.ComponentType
    id: string
  }[]
}

export function DashboardHeader({ activeTab, navigationItems }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const { t } = useI18n()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })

  return (
    <header className="sticky top-0 z-1 border-b bg-card">
      <div className="flex h-16 items-center pr-6 pl-2">
        <SidebarTrigger className="p-4 mr-2" />
        <h1 className="text-xl font-semibold">{t(`navigation.${activeItem?.id || "dashboard"}`)}</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formattedTime}</span>
            <span className="text-sm hidden lg:inline">• {formattedDate}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`${t("common.search")}...`}
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[320px]"
            />
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              4
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/doctor.png" alt="Dr. Smith" />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuItem>Aide</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => await logout()}>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

