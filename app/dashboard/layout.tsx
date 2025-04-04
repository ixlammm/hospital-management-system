import type { ReactNode } from "react"
import { I18nProvider } from "@/lib/i18n"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"
import { DatabaseProvider } from "@/lib/database"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Removed authentication check and redirect
  return <I18nProvider defaultLocale="en">
    <DatabaseProvider>
      <SessionProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </SessionProvider>
    </DatabaseProvider>
  </I18nProvider>
}

