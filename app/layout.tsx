import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Academia - Student Attendance Management",
  description: "Track and manage your academic attendance with ease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <SidebarNav />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'