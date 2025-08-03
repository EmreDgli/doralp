"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Edit, Trash2, FileText, Calendar } from "lucide-react"
import Image from "next/image"

interface QualityCertificate {
  id: string
  title: string
  description: string
  certificate_number: string
  issue_date: string
  expiry_date?: string
  issuing_authority: string
  certificate_file_url?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export default function QualitySystemPage() {
  const [certificates, setCertificates] = useState<QualityCertificate[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<QualityCertificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    certificate_number: '',
    issue_date: '',
    expiry_date: '',
    issuing_authority: '',
    is_active: true
  })

  const [selectedFiles, setSelectedFiles] = useState<{
    image?: File
  }>({})

  // Sertifikaları yükle
  const loadCertificates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/quality-system')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      } else {
        toast.error('Sertifikalar yüklenemedi')
      }
    } catch (error) {
      console.error('Load certificates error:', error)
      toast.error('Sertifikalar yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCertificates()
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      certificate_number: '',
      issue_date: '',
      expiry_date: '',
      issuing_authority: '',
      is_active: true
    })
    setSelectedFiles({})
    setEditingCertificate(null)
  }

  const handleAdd = () => {
      resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (certificate: QualityCertificate) => {
    setFormData({
      title: certificate.title,
      description: certificate.description,
      certificate_number: certificate.certificate_number,
      issue_date: certificate.issue_date,
      expiry_date: certificate.expiry_date || '',
      issuing_authority: certificate.issuing_authority,
      is_active: certificate.is_active
    })
    setEditingCertificate(certificate)
    setSelectedFiles({})
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sertifikayı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/quality-system/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Sertifika silindi')
        loadCertificates()
      } else {
        toast.error('Sertifika silinemedi')
      }
    } catch (error) {
      console.error('Delete certificate error:', error)
      toast.error('Sertifika silinirken hata oluştu')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Upload Error:', errorData)
      throw new Error(`Dosya yüklenemedi: ${errorData.error || 'Bilinmeyen hata'}`)
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Form validation
    if (!formData.title.trim()) {
      toast.error('Başlık boş olamaz')
      setIsSubmitting(false)
      return
    }

    if (!formData.certificate_number.trim()) {
      toast.error('Sertifika numarası boş olamaz')
      setIsSubmitting(false)
      return
    }

    if (!formData.issue_date) {
      toast.error('Veriliş tarihi seçilmelidir')
      setIsSubmitting(false)
      return
    }

    if (!formData.issuing_authority.trim()) {
      toast.error('Veren kurum boş olamaz')
      setIsSubmitting(false)
      return
    }

    console.log('Form validation passed, submitting:', formData)

    try {
      let image_url = editingCertificate?.image_url

      // Görseli yükle
      if (selectedFiles.image) {
        image_url = await uploadFile(selectedFiles.image, 'quality-system')
      }

      const submitData = {
        ...formData,
        image_url
      }

      const url = editingCertificate 
        ? `/api/quality-system/${editingCertificate.id}`
        : '/api/quality-system'
      
      const method = editingCertificate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        toast.success(editingCertificate ? 'Sertifika güncellendi' : 'Sertifika eklendi')
        setIsDialogOpen(false)
        resetForm()
        loadCertificates()
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        console.error('Response status:', response.status)
        toast.error(`Sertifika eklenemedi: ${errorData.error || 'Bilinmeyen hata'}`)
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Sertifika kaydedilirken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kalite Sistemi</h1>
          <p className="text-gray-600 mt-2">Sertifikaları yönetin</p>
        </div>
        <Button onClick={handleAdd} className="bg-doralp-navy hover:bg-doralp-navy/90">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sertifika
        </Button>
      </div>

      {/* Sertifikalar Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Sertifikalar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doralp-navy mx-auto"></div>
              <p className="text-gray-600 mt-2">Sertifikalar yükleniyor...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz sertifika eklenmemiş</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Görsel</TableHead>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Sertifika No</TableHead>
                  <TableHead>Veriliş Tarihi</TableHead>
                  <TableHead>Geçerlilik</TableHead>
                  <TableHead>Kurum</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>
                      {certificate.image_url ? (
                        <div className="w-12 h-12 relative">
                          <Image
                            src={certificate.image_url}
                            alt={certificate.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{certificate.title}</TableCell>
                    <TableCell>{certificate.certificate_number}</TableCell>
                    <TableCell>{formatDate(certificate.issue_date)}</TableCell>
                    <TableCell>
                      {certificate.expiry_date ? formatDate(certificate.expiry_date) : 'Süresiz'}
                    </TableCell>
                    <TableCell>{certificate.issuing_authority}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        certificate.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(certificate)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(certificate.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sertifika Ekleme/Düzenleme Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Sertifika Düzenle' : 'Yeni Sertifika Ekle'}
            </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="ISO 9001:2015"
                />
              </div>

              <div>
                <Label htmlFor="certificate_number">Sertifika Numarası</Label>
                <Input
                  id="certificate_number"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificate_number: e.target.value }))}
                  required
                  placeholder="TR-12345"
                />
              </div>
              </div>

              <div>
              <Label htmlFor="description">Açıklama</Label>
                <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Sertifika açıklaması"
                rows={3}
                />
              </div>

              <div>
              <Label htmlFor="issuing_authority">Veren Kurum</Label>
              <Input
                id="issuing_authority"
                value={formData.issuing_authority}
                onChange={(e) => setFormData(prev => ({ ...prev, issuing_authority: e.target.value }))}
                required
                placeholder="TSE - Türk Standartları Enstitüsü"
                      />
                    </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">Veriliş Tarihi</Label>
                    <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                  required
                />
              </div>

            <div>
                <Label htmlFor="expiry_date">Son Geçerlilik Tarihi (İsteğe bağlı)</Label>
                    <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Sertifika Görseli</Label>
                            <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
              />
              {editingCertificate?.image_url && !selectedFiles.image && (
                <p className="text-xs text-gray-500 mt-1">Mevcut görsel: Var</p>
              )}
              </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="is_active">Aktif</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Kaydediliyor...' : editingCertificate ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}