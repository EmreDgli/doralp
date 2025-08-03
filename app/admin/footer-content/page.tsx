"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Edit, Building, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

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

export default function FooterContentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<'company' | 'social' | 'copyright' | null>(null)
  
  // Varsayılan footer içeriği
  const defaultFooterContent: FooterContent = {
    companyInfo: {
      name: 'Doralp Yapı',
      description: 'Endüstriyel çelik yapı sektöründe 25 yıllık deneyimimizle kaliteli ve güvenilir çözümler sunuyoruz.',
      address: 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye',
      phone: '+90 212 555 0123',
      email: 'info@doralp.com'
    },
    socialLinks: {
      facebook: 'https://facebook.com/doralp',
      instagram: 'https://instagram.com/doralp',
      linkedin: 'https://linkedin.com/company/doralp'
    },
    copyright: '© 2024 Doralp Yapı. Tüm hakları saklıdır.'
  }

  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooterContent)
  const [companyFormData, setCompanyFormData] = useState<CompanyInfo>(defaultFooterContent.companyInfo)
  const [socialFormData, setSocialFormData] = useState<SocialLinks>(defaultFooterContent.socialLinks)
  const [copyrightFormData, setCopyrightFormData] = useState<string>(defaultFooterContent.copyright)

  // localStorage'dan verileri yükle
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

  const handleCompanyEdit = () => {
    setEditingSection('company')
    setCompanyFormData(footerContent.companyInfo)
    setIsDialogOpen(true)
  }

  const handleSocialEdit = () => {
    setEditingSection('social')
    setSocialFormData(footerContent.socialLinks)
    setIsDialogOpen(true)
  }

  const handleCopyrightEdit = () => {
    setEditingSection('copyright')
    setCopyrightFormData(footerContent.copyright)
    setIsDialogOpen(true)
  }

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...footerContent,
      companyInfo: companyFormData
    }
    
    setFooterContent(updatedContent)
    localStorage.setItem('footerContent', JSON.stringify(updatedContent))
    toast.success('Şirket bilgileri güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...footerContent,
      socialLinks: socialFormData
    }
    
    setFooterContent(updatedContent)
    localStorage.setItem('footerContent', JSON.stringify(updatedContent))
    toast.success('Sosyal medya linkleri güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  const handleCopyrightSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...footerContent,
      copyright: copyrightFormData
    }
    
    setFooterContent(updatedContent)
    localStorage.setItem('footerContent', JSON.stringify(updatedContent))
    toast.success('Copyright bilgisi güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Footer İçerik Yönetimi</h1>
        <p className="text-gray-600 mt-2">Footer bilgilerini düzenleyin</p>
      </div>

      <div className="grid gap-6">
        {/* Şirket Bilgileri */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Şirket Bilgileri</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompanyEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Şirket Adı:</strong> {footerContent.companyInfo.name}</p>
              <p className="text-sm text-gray-600"><strong>Açıklama:</strong> {footerContent.companyInfo.description.substring(0, 100)}...</p>
              <p className="text-sm text-gray-600"><strong>Adres:</strong> {footerContent.companyInfo.address}</p>
              <p className="text-sm text-gray-600"><strong>Telefon:</strong> {footerContent.companyInfo.phone}</p>
              <p className="text-sm text-gray-600"><strong>E-posta:</strong> {footerContent.companyInfo.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sosyal Medya Linkleri */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Sosyal Medya</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSocialEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Facebook:</strong> {footerContent.socialLinks.facebook}</p>
              <p className="text-sm text-gray-600"><strong>Instagram:</strong> {footerContent.socialLinks.instagram}</p>
              <p className="text-sm text-gray-600"><strong>LinkedIn:</strong> {footerContent.socialLinks.linkedin}</p>
            </div>
          </CardContent>
        </Card>

        {/* Copyright Bilgisi */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">©</span>
                </div>
                <CardTitle className="text-lg">Copyright</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyrightEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{footerContent.copyright}</p>
          </CardContent>
        </Card>
      </div>

      {/* Şirket Bilgileri Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'company'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Şirket Bilgilerini Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName">Şirket Adı</Label>
              <Input
                id="companyName"
                value={companyFormData.name}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Doralp Yapı"
              />
            </div>

            <div>
              <Label htmlFor="companyDescription">Açıklama</Label>
              <Textarea
                id="companyDescription"
                value={companyFormData.description}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Şirket açıklaması"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="companyAddress">Adres</Label>
              <Textarea
                id="companyAddress"
                value={companyFormData.address}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, address: e.target.value }))}
                required
                placeholder="Şirket adresi"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="companyPhone">Telefon</Label>
              <Input
                id="companyPhone"
                value={companyFormData.phone}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                placeholder="+90 212 555 0123"
              />
            </div>

            <div>
              <Label htmlFor="companyEmail">E-posta</Label>
              <Input
                id="companyEmail"
                type="email"
                value={companyFormData.email}
                onChange={(e) => setCompanyFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="info@doralp.com"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sosyal Medya Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'social'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sosyal Medya Linklerini Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSocialSubmit} className="space-y-4">
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                value={socialFormData.facebook}
                onChange={(e) => setSocialFormData(prev => ({ ...prev, facebook: e.target.value }))}
                placeholder="https://facebook.com/doralp"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                value={socialFormData.instagram}
                onChange={(e) => setSocialFormData(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="https://instagram.com/doralp"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={socialFormData.linkedin}
                onChange={(e) => setSocialFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/company/doralp"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Copyright Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'copyright'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Copyright Bilgisini Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCopyrightSubmit} className="space-y-4">
            <div>
              <Label htmlFor="copyright">Copyright Metni</Label>
              <Input
                id="copyright"
                value={copyrightFormData}
                onChange={(e) => setCopyrightFormData(e.target.value)}
                required
                placeholder="© 2024 Doralp Yapı. Tüm hakları saklıdır."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}