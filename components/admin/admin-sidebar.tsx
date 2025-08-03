"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  ImageIcon,
  Settings,
  Shield,
  Award,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Kullanıcılar",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "İçerik Yönetimi",
    href: "/admin/contents",
    icon: FileText,
  },
  {
    title: "Projeler",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    title: "Slider",
    href: "/admin/slides",
    icon: ImageIcon,
  },
  {
    title: "Makine Parkı",
    href: "/admin/machine-park",
    icon: Settings,
  },
  {
    title: "İş Güvenliği",
    href: "/admin/safety",
    icon: Shield,
  },
  {
    title: "Kalite Sistemi",
    href: "/admin/quality",
    icon: Award,
  },
  {
    title: "Galeri",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Logo URL'sini buradan kolayca değiştirebilirsiniz
  const LOGO_URL = "/Doralp_Icon.png" // Doralp logo dosyası

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="bg-white shadow-md">
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="relative h-10 w-auto">
              <Image
                src={LOGO_URL}
                alt="Doralp Logo"
                height={40}
                width={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive ? "bg-doralp-navy text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
