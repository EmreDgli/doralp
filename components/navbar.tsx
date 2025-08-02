"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react"
import { LanguageSwitcher } from "./language-switcher"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Logo URL'sini buradan kolayca değiştirebilirsiniz
  const LOGO_URL = "/Doralp_Icon.png" // Doralp logo dosyası

  // Sosyal medya linkleri
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://facebook.com/doralp", // Doralp'in Facebook hesabı
      label: "Facebook",
      color: "hover:text-blue-600"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/doralp", // Doralp'in Instagram hesabı
      label: "Instagram",
      color: "hover:text-pink-600"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/doralp", // Doralp'in LinkedIn hesabı
      label: "LinkedIn",
      color: "hover:text-blue-700"
    }
  ]

  const handleMouseEnter = (menuLabel: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setHoveredMenu(menuLabel)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredMenu(null)
    }, 150) // 150ms gecikme
    setHoverTimeout(timeout)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  const menuItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    {
      label: "Fabrika",
      submenu: [
        { href: "/fabrika", label: "Fabrika" },
        { href: "/fabrika/galeri", label: "Galeri" },
        { href: "/fabrika/makine-parki", label: "Makine Parkı" },
        { href: "/fabrika/is-guvenligi", label: "İş Güvenliği" },
      ],
    },
    { href: "/projeler", label: "Projeler" },
    { href: "/kalite-sistemi", label: "Kalite Sistemi" },
    { href: "/iletisim", label: "İletişim" },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <div className="relative h-12 w-auto transform transition-all duration-300 group-hover:scale-105">
                <Image
                  src={LOGO_URL}
                  alt="Doralp Logo"
                  height={48}
                  width={120}
                  className="object-contain transition-all duration-300 group-hover:brightness-110"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            {/* Menu Items */}
            <div className="flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Button 
                        variant="ghost" 
                        className="relative text-doralp-gray hover:text-doralp-navy px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-doralp-navy/5 group"
                        asChild
                      >
                        <div className="flex items-center cursor-pointer">
                          <span className="relative z-10">{item.label}</span>
                          <ChevronDown className={`ml-2 h-4 w-4 transition-all duration-300 ${
                            hoveredMenu === item.label ? 'rotate-180 text-doralp-gold' : ''
                          }`} />
                          <div className="absolute inset-0 bg-gradient-to-r from-doralp-gold/10 to-doralp-navy/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                        </div>
                      </Button>
                      
                      {/* Hover Dropdown */}
                      {hoveredMenu === item.label && (
                        <div className="absolute top-full left-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100/50 py-3 z-50 animate-in fade-in-0 zoom-in-95 duration-300">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-5 py-3 mx-2 text-sm text-doralp-gray hover:text-doralp-navy hover:bg-gradient-to-r hover:from-doralp-gold/10 hover:to-doralp-navy/10 transition-all duration-300 rounded-lg border-l-4 border-transparent hover:border-doralp-gold group"
                              onClick={() => setHoveredMenu(null)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="relative text-doralp-gray hover:text-doralp-navy px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-doralp-navy/5 group"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-doralp-gold/10 to-doralp-navy/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Right Side - Social, Language, Contact */}
            <div className="flex items-center space-x-4 ml-8">
              {/* Sosyal Medya İkonları */}
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-doralp-gray ${social.color} transition-all duration-300 hover:scale-110 transform`}
                      aria-label={social.label}
                    >
                      <IconComponent size={20} />
                    </Link>
                  )
                })}
              </div>

              <LanguageSwitcher />
              
              {/* Bize Ulaşın Butonu */}
              <Button
                asChild
                className="bg-gradient-to-r from-doralp-gold to-doralp-gold/80 hover:from-doralp-gold/90 hover:to-doralp-gold/70 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/iletisim" className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Bize Ulaşın</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <div>
                      <div className="text-doralp-gray px-3 py-2 text-sm font-medium">{item.label}</div>
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="text-doralp-gray hover:text-doralp-navy block px-6 py-2 text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-doralp-gray hover:text-doralp-navy block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobil Sosyal Medya ve Bize Ulaşın */}
              <div className="px-3 py-4 border-t border-gray-200 mt-4">
                {/* Sosyal Medya İkonları */}
                <div className="flex items-center justify-center space-x-6 mb-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon
                    return (
                      <Link
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-doralp-gray ${social.color} transition-all duration-300 hover:scale-110 transform`}
                        aria-label={social.label}
                      >
                        <IconComponent size={24} />
                      </Link>
                    )
                  })}
                </div>
                
                {/* Mobil Bize Ulaşın Butonu */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-doralp-gold to-doralp-gold/80 hover:from-doralp-gold/90 hover:to-doralp-gold/70 text-white font-medium py-3 rounded-full shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/iletisim" className="flex items-center justify-center space-x-2">
                    <Mail size={18} />
                    <span>Bize Ulaşın</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
