'use client'

import { PageHeader } from "@/components/page-header"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Machine {
  id: string
  adet: number
  cins: string
  model: string
  marka: string
  yerli: boolean
  ithal: boolean
  kapasite: string
  created_at: string
  updated_at: string
}

export default function MakineParkiPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMachines()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = machines.filter(machine =>
        machine.cins.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.marka.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMachines(filtered)
    } else {
      setFilteredMachines(machines)
    }
  }, [searchTerm, machines])

  const fetchMachines = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/machines')
      
      if (!response.ok) {
        throw new Error('Makineler yüklenirken hata oluştu')
      }
      
      const data = await response.json()
      setMachines(data)
      setFilteredMachines(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Makine Parkı" subtitle="Makine ve Ekipman Listesi" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-4">
              Makine <span className="text-doralp-gold">Parkı</span>
            </h2>
            <p className="text-lg text-doralp-gray max-w-3xl mx-auto mb-8">
              Makine ve Ekipman Listesi
            </p>
            
            {/* Arama Kutusu */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-doralp-gray h-4 w-4" />
              <Input
                type="text"
                placeholder="Aramak istediğiniz kelimeyi yazın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-center"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doralp-gold mx-auto"></div>
              <p className="text-doralp-gray mt-4">Makineler yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Desktop Tablo */}
              <div className="hidden md:block">
                {/* Tablo Başlığı */}
                <div className="bg-doralp-navy text-white px-6 py-4">
                  <div className="grid grid-cols-8 gap-4 font-semibold text-sm">
                    <div className="text-center">Adet</div>
                    <div className="col-span-2 text-center">Cins ve teknik özellikleri</div>
                    <div className="text-center">Modeli</div>
                    <div className="text-center">Markası</div>
                    <div className="text-center">Yerli</div>
                    <div className="text-center">İthal</div>
                    <div className="text-center">Kapasitesi</div>
                  </div>
                </div>

                {/* Tablo İçeriği */}
                <div className="divide-y divide-gray-200">
                  {filteredMachines.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-doralp-gray">
                        {searchTerm ? "Arama kriterlerinize uygun makine bulunamadı." : "Henüz makine kaydı bulunmuyor."}
                      </p>
                    </div>
                  ) : (
                    filteredMachines.map((machine, index) => (
                      <div 
                        key={machine.id} 
                        className={`grid grid-cols-8 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-doralp-navy text-center">{machine.adet}</div>
                        <div className="col-span-2 text-doralp-gray text-center">{machine.cins}</div>
                        <div className="text-doralp-gray text-center">{machine.model}</div>
                        <div className="text-doralp-gray text-center">{machine.marka}</div>
                        <div className="text-center flex items-center justify-center">
                          {machine.yerli ? (
                            <span className="text-green-600 font-bold text-lg">✓</span>
                          ) : (
                            <span className="text-gray-300 font-bold text-lg">-</span>
                          )}
                        </div>
                        <div className="text-center flex items-center justify-center">
                          {machine.ithal ? (
                            <span className="text-blue-600 font-bold text-lg">✓</span>
                          ) : (
                            <span className="text-gray-300 font-bold text-lg">-</span>
                          )}
                        </div>
                        <div className="text-center">
                          {machine.kapasite ? (
                            <span className="bg-doralp-gold text-white px-2 py-1 rounded text-xs font-medium">
                              {machine.kapasite}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Mobile Kartlar */}
              <div className="md:hidden space-y-4">
                {filteredMachines.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-doralp-gray">
                      {searchTerm ? "Arama kriterlerinize uygun makine bulunamadı." : "Henüz makine kaydı bulunmuyor."}
                    </p>
                  </div>
                ) : (
                  filteredMachines.map((machine, index) => (
                    <div 
                      key={machine.id} 
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-doralp-navy">{machine.cins}</h3>
                          <span className="bg-doralp-navy text-white px-2 py-1 rounded text-xs">
                            Adet: {machine.adet}
                          </span>
                        </div>
                        <div className="text-sm text-doralp-gray">
                          <div><strong>Model:</strong> {machine.model}</div>
                          <div><strong>Marka:</strong> {machine.marka}</div>
                          <div>
                            <strong>Kapasite:</strong> 
                            {machine.kapasite ? (
                              <span className="ml-2 bg-doralp-gold text-white px-2 py-1 rounded text-xs font-medium">
                                {machine.kapasite}
                              </span>
                            ) : (
                              <span className="ml-2 text-gray-400">Belirtilmemiş</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <span>Yerli:</span>
                            {machine.yerli ? (
                              <span className="text-green-600 font-bold">✓</span>
                            ) : (
                              <span className="text-gray-300 font-bold">-</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>İthal:</span>
                            {machine.ithal ? (
                              <span className="text-blue-600 font-bold">✓</span>
                            ) : (
                              <span className="text-gray-300 font-bold">-</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
