"use client"

import type React from "react"

import { Bell, Search, Clock, Space, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

const Moment = dynamic(() => import("react-moment"), { ssr: false })

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
import { SidebarTrigger } from "./ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"

interface DashboardHeaderProps {
  activeTab: string
  navigationItems: {
    name: string
    icon: React.ComponentType
    id: string
  }[]
}

export function DashboardHeader({ activeTab, navigationItems }: DashboardHeaderProps) {
  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const { t } = useI18n()

  const session = useSession()

  const auth = useAuth()

  return (
    <header className="sticky top-0 z-1 border-b bg-card">
      <div className="flex h-16 items-center pr-6 pl-2">
        <SidebarTrigger className="p-4 mr-2" />
        <h1 className="text-xl font-semibold">{t(`navigation.${activeItem?.id || "dashboard"}`)}</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <Moment local format={"hh:mm A • dddd, MMMM d"}/>
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
              <DropdownMenuLabel>{session.status == "authenticated" && session.data.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={auth.logout.run}>
                {auth.logout.loading && <Loader2 className="animate-spin"/>}
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

