"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  BedDouble,
  FileBarChart,
  Settings,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { OverviewTab } from "@/components/tabs/overview-tab"
import { PatientsTab } from "@/components/tabs/patients-tab"
import { StaffTab } from "@/components/tabs/staff-tab"
import { AppointmentsTab } from "@/components/tabs/appointments-tab"
import { ReportsTab } from "@/components/tabs/reports-tab"
import { SettingsTab } from "@/components/tabs/settings-tab"
import { RoomsTab } from "@/components/tabs/rooms-tab"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useI18n } from "@/lib/i18n"
import { SidebarInset, SidebarTrigger } from "./ui/sidebar"
import { Separator } from "./ui/separator"
import { DashboardHeader } from "./dashboard-header"

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { t } = useI18n()

  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      id: "overview",
    },
    {
      name: "Patients",
      icon: Users,
      id: "patients",
    },
    {
      name: "Staff",
      icon: Stethoscope,
      id: "staff",
    },
    {
      name: "Appointments",
      icon: Calendar,
      id: "appointments",
    },
    {
      name: "Rooms",
      icon: BedDouble,
      id: "rooms",
    },
    {
      name: "Reports",
      icon: FileBarChart,
      id: "reports",
    },
    {
      name: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  return (
    <>
      <DashboardSidebar navigationItems={navigationItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <DashboardHeader activeTab={activeTab} navigationItems={navigationItems} />
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "patients" && <PatientsTab />}
          {activeTab === "staff" && <StaffTab />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "rooms" && <RoomsTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </SidebarInset>
    </>
  )
}

