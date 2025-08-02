import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-doralp-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">DORALP</h3>
              <p className="text-gray-300 leading-relaxed">
                1998 yılından bu yana endüstriyel çelik yapı sektöründe kaliteli üretim ve güvenilir hizmet anlayışıyla
                hizmet vermekteyiz.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
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
                  <p>Organize Sanayi Bölgesi</p>
                  <p>1. Cadde No: 123</p>
                  <p>İstanbul, Türkiye</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-doralp-gold flex-shrink-0" />
                <span className="text-gray-300">+90 212 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-doralp-gold flex-shrink-0" />
                <span className="text-gray-300">info@doralp.com.tr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Doralp. Tüm hakları saklıdır.</p>
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
