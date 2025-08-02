"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Machine {
  id: string
  adet: number
  cins: string
  model: string
  marka: string
  yerli: boolean
  ithal: boolean
  kapasite: string | null
  created_at: string
  updated_at: string
}

export default function MachineParkPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)

  const [formData, setFormData] = useState({
    adet: 1,
    cins: "",
    model: "",
    marka: "",
    yerli: false,
    ithal: false,
    kapasite: "",
  })

  useEffect(() => {
    loadMachines()
  }, [])

  const loadMachines = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/machines')
      
      if (!response.ok) {
        throw new Error('Makineler yüklenirken hata oluştu')
      }
      
      const data = await response.json()
      setMachines(data || [])
    } catch (error) {
      console.error("Machines load error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingMachine ? `/api/machines/${editingMachine.id}` : '/api/machines';
      const method = editingMachine ? 'PUT' : 'POST';
      
      console.log('Submitting machine data:', formData);
      console.log('Required fields check:', {
        adet: formData.adet,
        cins: formData.cins,
        marka: formData.marka,
        model: formData.model,
        hasAdet: !!formData.adet,
        hasCins: !!formData.cins
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('API Error response:', errorData);
        throw new Error(errorData.error || 'Makine kaydedilirken hata oluştu');
      }

      await loadMachines()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving machine:", error)
    }
  }

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine)
    setFormData({
      adet: machine.adet,
      cins: machine.cins,
      model: machine.model,
      marka: machine.marka,
      yerli: machine.yerli,
      ithal: machine.ithal,
      kapasite: machine.kapasite || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu makineyi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/machines/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Makine silinirken hata oluştu')
      }

      await loadMachines()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      adet: 1,
      cins: "",
      model: "",
      marka: "",
      yerli: false,
      ithal: false,
      kapasite: "",
    })
    setEditingMachine(null)
  }

  const filteredMachines = machines.filter(machine =>
    machine.cins?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.marka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.kapasite?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Makine Parkı</h1>
        <p className="text-xl text-gray-600">Makine ve Ekipman Listesi</p>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Aramak istediğiniz kelimeyi yazın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Makine Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMachine ? 'Makine Düzenle' : 'Yeni Makine Ekle'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Adet *</label>
                  <Input
                    type="number"
                    value={formData.adet}
                    onChange={(e) => setFormData({ ...formData, adet: Number(e.target.value) })}
                    min="1"
                    placeholder="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Marka *</label>
                  <Input
                    value={formData.marka}
                    onChange={(e) => setFormData({ ...formData, marka: e.target.value })}
                    placeholder="PEDDINGHAUS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Model *</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="2006"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kapasite</label>
                  <Input
                    value={formData.kapasite}
                    onChange={(e) => setFormData({ ...formData, kapasite: e.target.value })}
                    placeholder="2000 mm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cins ve Teknik Özellikleri *</label>
                <Textarea
                  value={formData.cins}
                  onChange={(e) => setFormData({ ...formData, cins: e.target.value })}
                  rows={3}
                  placeholder="PEDDİNGHAUS FDB 2500 CNC SAC İŞLEME MERKEZİ"
                  required
                />
              </div>

              {/* Yerli/İthal Checkbox'ları */}
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.yerli}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, yerli: true, ithal: false })
                      } else {
                        setFormData({ ...formData, yerli: false })
                      }
                    }}
                  />
                  <span>Yerli</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.ithal}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, ithal: true, yerli: false })
                      } else {
                        setFormData({ ...formData, ithal: false })
                      }
                    }}
                  />
                  <span>İthal</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingMachine ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Machines Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead className="text-center font-bold">Adet</TableHead>
                <TableHead className="text-center font-bold">Cins ve teknik özellikleri</TableHead>
                <TableHead className="text-center font-bold">Modeli</TableHead>
                <TableHead className="text-center font-bold">Markası</TableHead>
                <TableHead className="text-center font-bold">Yerli</TableHead>
                <TableHead className="text-center font-bold">İthal</TableHead>
                <TableHead className="text-center font-bold">Kapasitesi</TableHead>
                <TableHead className="text-center font-bold">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Arama kriterlerine uygun makine bulunamadı.' : 'Henüz makine eklenmemiş'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine, index) => (
                  <TableRow key={machine.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <TableCell className="text-center">{machine.adet}</TableCell>
                    <TableCell className="text-center max-w-xs">
                      <div className="truncate" title={machine.cins || ""}>
                        {machine.cins}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{machine.model || "-"}</TableCell>
                    <TableCell className="text-center">{machine.marka || "-"}</TableCell>
                    <TableCell className="text-center">
                      {machine.yerli ? "x" : ""}
                    </TableCell>
                    <TableCell className="text-center">
                      {machine.ithal ? "x" : ""}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {machine.kapasite || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(machine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(machine.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}