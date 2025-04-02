import type { ReactNode } from "react"
import { I18nProvider } from "@/lib/i18n"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Removed authentication check and redirect
  return <I18nProvider defaultLocale="fr">
    <SessionProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </SessionProvider>
  </I18nProvider>
}

