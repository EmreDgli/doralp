"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Upload, TableIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { adminStorageApi } from "@/lib/admin-api"
import Image from "next/image"

interface QualityItem {
  id: string
  section: "altbaslik1" | "altbaslik2" | "altbaslik3" | "altbaslik4"
  title: string | null
  description: string | null
  content: string | null
  image_url: string | null
  table_data: any
  sort_order: number
  is_active: boolean
  language: "tr" | "en"
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

const sectionOptions = [
  { value: "altbaslik1", label: "Alt Başlık 1" },
  { value: "altbaslik2", label: "Alt Başlık 2" },
  { value: "altbaslik3", label: "Alt Başlık 3" },
  { value: "altbaslik4", label: "Alt Başlık 4" },
]

export default function QualityPage() {
  const [qualityItems, setQualityItems] = useState<QualityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("altbaslik1")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<QualityItem | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [tableData, setTableData] = useState<any[]>([])
  const [tableHeaders, setTableHeaders] = useState<string[]>([])

  const [formData, setFormData] = useState({
    section: "altbaslik1" as "altbaslik1" | "altbaslik2" | "altbaslik3" | "altbaslik4",
    title: "",
    description: "",
    content: "",
    image_url: "",
    is_active: true,
    language: "tr" as "tr" | "en",
  })

  useEffect(() => {
    loadQualityItems()
  }, [])

  const loadQualityItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("quality_system")
        .select("*")
        .order("section", { ascending: true })
        .order("sort_order", { ascending: true })

      if (error) throw error
      setQualityItems(data || [])
    } catch (error) {
      console.error("Quality items load error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const itemData = {
        ...formData,
        created_by: editingItem ? undefined : (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      }

      if (editingItem) {
        const { error } = await supabase.from("quality_system").update(itemData).eq("id", editingItem.id)

        if (error) throw error
      } else {
        const sectionItems = qualityItems.filter((item) => item.section === formData.section)
        const maxSortOrder = Math.max(...sectionItems.map((s) => s.sort_order), 0)

        const { error } = await supabase.from("quality_system").insert({
          ...itemData,
          sort_order: maxSortOrder + 1,
        })

        if (error) throw error
      }

      await loadQualityItems()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Quality item save error:", error)
      alert(error.message || "Kalite öğesi kaydedilirken hata oluştu")
    }
  }

  const handleTableSubmit = async () => {
    if (!editingItem) return

    try {
      const { error } = await supabase
        .from("quality_system")
        .update({
          table_data: { headers: tableHeaders, rows: tableData },
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", editingItem.id)

      if (error) throw error

      await loadQualityItems()
      setIsTableDialogOpen(false)
      setEditingItem(null)
    } catch (error: any) {
      console.error("Table save error:", error)
      alert(error.message || "Tablo kaydedilirken hata oluştu")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const uploadResult = await adminStorageApi.uploadImage(file, "admin-images", "quality")
      setFormData({ ...formData, image_url: uploadResult.url })
    } catch (error: any) {
      console.error("Image upload error:", error)
      alert(error.message || "Resim yüklenirken hata oluştu")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEdit = (item: QualityItem) => {
    setEditingItem(item)
    setFormData({
      section: item.section,
      title: item.title || "",
      description: item.description || "",
      content: item.content || "",
      image_url: item.image_url || "",
      is_active: item.is_active,
      language: item.language,
    })
    setIsDialogOpen(true)
  }

  const handleEditTable = (item: QualityItem) => {
    setEditingItem(item)
    if (item.table_data) {
      setTableHeaders(item.table_data.headers || [])
      setTableData(item.table_data.rows || [])
    } else {
      setTableHeaders(["Başlık 1", "Başlık 2"])
      setTableData([["", ""]])
    }
    setIsTableDialogOpen(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Bu kalite öğesini silmek istediğinizden emin misiniz?")) return

    try {
      const { error } = await supabase.from("quality_system").delete().eq("id", itemId)

      if (error) throw error
      await loadQualityItems()
    } catch (error: any) {
      console.error("Quality item delete error:", error)
      alert(error.message || "Kalite öğesi silinirken hata oluştu")
    }
  }

  const addTableRow = () => {
    setTableData([...tableData, new Array(tableHeaders.length).fill("")])
  }

  const removeTableRow = (index: number) => {
    setTableData(tableData.filter((_, i) => i !== index))
  }

  const updateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData]
    newData[rowIndex][colIndex] = value
    setTableData(newData)
  }

  const updateTableHeader = (index: number, value: string) => {
    const newHeaders = [...tableHeaders]
    newHeaders[index] = value
    setTableHeaders(newHeaders)
  }

  const addTableColumn = () => {
    setTableHeaders([...tableHeaders, `Başlık ${tableHeaders.length + 1}`])
    setTableData(tableData.map((row) => [...row, ""]))
  }

  const removeTableColumn = (index: number) => {
    setTableHeaders(tableHeaders.filter((_, i) => i !== index))
    setTableData(tableData.map((row) => row.filter((_, i) => i !== index)))
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      section: "altbaslik1",
      title: "",
      description: "",
      content: "",
      image_url: "",
      is_active: true,
      language: "tr",
    })
  }

  const getItemsBySection = (section: string) => {
    return qualityItems.filter((item) => item.section === section)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doralp-gold"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-doralp-navy">Kalite Sistemi</h1>
          <p className="text-doralp-gray mt-2">Kalite yönetim sistemi içeriklerini yönetin</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-doralp-gold hover:bg-doralp-gold/90" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kalite Öğesi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Kalite Öğesi Düzenle" : "Yeni Kalite Öğesi Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bölüm</label>
                  <Select
                    value={formData.section}
                    onValueChange={(value: "altbaslik1" | "altbaslik2" | "altbaslik3" | "altbaslik4") =>
                      setFormData({ ...formData, section: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          {section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dil</label>
                  <Select
                    value={formData.language}
                    onValueChange={(value: "tr" | "en") => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="ISO 9001:2015"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kısa Açıklama</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Kısa açıklama metni"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detaylı İçerik</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  placeholder="Detaylı açıklama ve içerik"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Resim</label>
                <div className="space-y-2">
                  {formData.image_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Quality preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Resim URL'si"
                    />
                    <label htmlFor="quality-image-upload">
                      <Button type="button" variant="outline" disabled={uploadingImage} asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? "Yükleniyor..." : "Yükle"}
                        </span>
                      </Button>
                      <input
                        id="quality-image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <label className="text-sm font-medium">Aktif</label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" className="bg-doralp-gold hover:bg-doralp-gold/90">
                  {editingItem ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Editor Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tablo Düzenle</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Table Headers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Tablo Başlıkları</label>
                <Button type="button" variant="outline" size="sm" onClick={addTableColumn}>
                  <Plus className="h-4 w-4 mr-1" />
                  Sütun Ekle
                </Button>
              </div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)` }}>
                {tableHeaders.map((header, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <Input
                      value={header}
                      onChange={(e) => updateTableHeader(index, e.target.value)}
                      placeholder={`Başlık ${index + 1}`}
                    />
                    {tableHeaders.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTableColumn(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Table Data */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Tablo Verileri</label>
                <Button type="button" variant="outline" size="sm" onClick={addTableRow}>
                  <Plus className="h-4 w-4 mr-1" />
                  Satır Ekle
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {tableHeaders.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <TableCell key={colIndex}>
                            <Input
                              value={cell}
                              onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                              placeholder={`Veri ${colIndex + 1}`}
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          {tableData.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTableRow(rowIndex)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsTableDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleTableSubmit} className="bg-doralp-gold hover:bg-doralp-gold/90">
                Tabloyu Kaydet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs for Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {sectionOptions.map((section) => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sectionOptions.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            <Card>
              <CardHeader>
                <CardTitle>{section.label} İçerikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getItemsBySection(section.value).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {item.image_url && (
                        <div className="w-20 h-16 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title || "Quality item"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-doralp-navy">{item.title}</h3>
                          <Badge variant="outline">{item.language.toUpperCase()}</Badge>
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? "Aktif" : "Pasif"}
                          </Badge>
                          {item.table_data && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <TableIcon className="w-3 h-3 mr-1" />
                              Tablo Var
                            </Badge>
                          )}
                        </div>

                        {item.description && <p className="text-sm text-doralp-gray mb-1">{item.description}</p>}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTable(item)} title="Tablo Düzenle">
                          <TableIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {getItemsBySection(section.value).length === 0 && (
                    <div className="text-center py-8 text-doralp-gray">Bu bölümde henüz içerik eklenmemiş</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
