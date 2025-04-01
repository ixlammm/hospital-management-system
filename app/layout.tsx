import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clinic Management System",
  description: "A comprehensive hospital management dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={inter.className}>
        {children}
      </body>
    </html>
  )
}



import './globals.css'