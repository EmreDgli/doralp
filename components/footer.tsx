"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

interface CompanyInfo {
  name: string
  description: string
  address: string
  phone: string
  email: string
}

interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
}

interface FooterContent {
  companyInfo: CompanyInfo
  socialLinks: SocialLinks
  copyright: string
}

export function Footer() {
  const [footerContent, setFooterContent] = useState<FooterContent>({
    companyInfo: {
      name: 'DORALP',
      description: '1998 yılından bu yana endüstriyel çelik yapı sektöründe kaliteli üretim ve güvenilir hizmet anlayışıyla hizmet vermekteyiz.',
      address: 'Organize Sanayi Bölgesi\n1. Cadde No: 123\nİstanbul, Türkiye',
      phone: '+90 212 123 45 67',
      email: 'info@doralp.com.tr'
    },
    socialLinks: {
      facebook: 'https://facebook.com/doralp',
      instagram: 'https://instagram.com/doralp',
      linkedin: 'https://linkedin.com/company/doralp'
    },
    copyright: '© {year} Doralp. Tüm hakları saklıdır.'
  })

  // localStorage'dan footer içeriğini yükle
  useEffect(() => {
    const savedContent = localStorage.getItem('footerContent')
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        setFooterContent(parsedContent)
      } catch (error) {
        console.error('Footer content parse error:', error)
      }
    }
  }, [])
  return (
    <footer className="bg-doralp-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">{footerContent.companyInfo.name}</h3>
              <p className="text-gray-300 leading-relaxed">
                {footerContent.companyInfo.description}
              </p>
            </div>
            <div className="flex space-x-4">
              {footerContent.socialLinks.facebook && (
                <Link href={footerContent.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {footerContent.socialLinks.instagram && (
                <Link href={footerContent.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {footerContent.socialLinks.linkedin && (
                <Link href={footerContent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Hızlı Linkler</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/fabrika" className="text-gray-300 hover:text-white transition-colors">
                  Fabrika
                </Link>
              </li>
              <li>
                <Link href="/projeler" className="text-gray-300 hover:text-white transition-colors">
                  Projeler
                </Link>
              </li>
              <li>
                <Link href="/kalite-sistemi" className="text-gray-300 hover:text-white transition-colors">
                  Kalite Sistemi
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Hizmetlerimiz</h4>
            <ul className="space-y-3">
              <li className="text-gray-300">Endüstriyel Çelik Yapı</li>
              <li className="text-gray-300">Fabrika İnşaatı</li>
              <li className="text-gray-300">Proje Yönetimi</li>
              <li className="text-gray-300">Çelik Konstrüksiyon</li>
              <li className="text-gray-300">Saha Montajı</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">İletişim</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-doralp-gold mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  {footerContent.companyInfo.address.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-doralp-gold flex-shrink-0" />
                <span className="text-gray-300">{footerContent.companyInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-doralp-gold flex-shrink-0" />
                <span className="text-gray-300">{footerContent.companyInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              {footerContent.copyright.replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/gizlilik-politikasi" className="text-gray-300 hover:text-white text-sm transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="text-gray-300 hover:text-white text-sm transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="/kvkk" className="text-gray-300 hover:text-white text-sm transition-colors">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
