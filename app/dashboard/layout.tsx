"use client"

import { useEffect, type ReactNode } from "react"
import { I18nProvider } from "@/lib/i18n"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"
import { DatabaseProvider } from "@/lib/database"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { usePathname } from "next/navigation"
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
  Syringe,
  TextSelection,
  ArrowBigDownDash
} from "lucide-react"

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
    name: "Reports",
    icon: FileBarChart,
    id: "reports",
  },
  {
    name: "Prescriptions",
    icon: TextSelection,
    id: "prescriptions"
  },
  {
    name: "Samples",
    icon: Syringe,
    id: "samples",
  },
  {
    name: "Radio",
    icon: BedDouble,
    id: "radio",
  },
  {
    name: "Analysis",
    icon: Search,
    id: "analysis",
  },
  {
    name: "Research",
    icon: Plus,
    id: "research",
  },
  {
    name: "Invoice",
    icon: ArrowBigDownDash,
    id: "invoice",
  },
  {
    name: "Settings",
    icon: Settings,
    id: "settings",
  },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const name = pathname.split('/')[2]

  useEffect(() => {
    console.log(name)
  }, [name])

  return <I18nProvider defaultLocale="en">
    <DatabaseProvider>
      <SessionProvider>
        <SidebarProvider>
          <DashboardSidebar navigationItems={navigationItems} activeTab={name} />
          <SidebarInset>
            <DashboardHeader activeTab={name} navigationItems={navigationItems} />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>

        </SidebarProvider>
      </SessionProvider>
    </DatabaseProvider>
  </I18nProvider>
}

