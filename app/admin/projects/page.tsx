"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Edit, Trash2, X, Save, Image, Calendar, MapPin, Tag, Upload, Trash } from "lucide-react";

interface ProjectImage {
  id?: string;
  url: string;
  alt_text?: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  date: string | null;
  end_date: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  project_images?: ProjectImage[];
}

interface ProjectForm {
  title: string;
  description: string;
  location: string;
  category: string;
  start_date: string;
  end_date: string;
  is_ongoing: boolean;
  language: string;
  images: ProjectImage[];
}

// Yıl seçimi için özel dropdown komponenti
const YearDropdown = ({ 
  value, 
  onChange, 
  placeholder = "Yıl Seçin",
  disabled = false 
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => 2010 + i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleYearSelect = (year: number) => {
    onChange(year.toString());
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {value || placeholder}
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2">
            <div className="grid grid-cols-3 gap-1">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`px-2 py-1 text-sm rounded hover:bg-blue-100 ${
                    value === year.toString() ? 'bg-blue-500 text-white' : 'text-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = [
  "Devam eden projeler",
  "Sanayi Yapıları", 
  "Lojistik yapılar",
  "Stadyum - Spor salonu",
  "Enerji santral yapıları",
  "AVM - Market"
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectForm>({
    title: "",
    description: "",
    location: "",
    category: "",
    start_date: "",
    end_date: "",
    is_ongoing: false,
    language: "tr",
    images: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Debug: Console'da project verilerini göster
  useEffect(() => {
    console.log('Admin Projects Debug:', {
      projectsCount: projects.length,
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        imagesCount: p.project_images?.length || 0,
        firstImage: p.project_images?.[0]?.image_url,
        allImages: p.project_images
      }))
    });
  }, [projects]);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Admin: Fetching projects...');
      
      const response = await fetch('/api/projects');
      console.log('Admin: API response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Projeler yüklenirken hata oluştu');
      }
      
      const data = await response.json();
      console.log('Admin: Received data:', {
        projectCount: data.length,
        data: data
      });
      
      setProjects(data);
    } catch (err) {
      console.error('Admin: Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('Submitting form data:', formData);
      console.log('Images count:', formData.images.length);
      console.log('Images:', formData.images);
      console.log('Images array length:', formData.images?.length);
      console.log('First image sample:', formData.images?.[0]);
      
      // Sadece dolu görselleri gönder
      const validImages = formData.images.filter(img => img.url && img.url.trim() !== '');
      console.log('Valid images (non-empty):', validImages);
      
      const submitData = {
        ...formData,
        images: validImages
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Proje kaydedilirken hata oluştu');
      }

      const result = await response.json();
      console.log('Project saved successfully:', result);

      await fetchProjects();
      resetForm();
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    
    // Tarih formatını kontrol et ve yıl olarak ayarla
    let startDate = project.date || "";
    let endDate = project.end_date || "";
    
    // Eğer tarih formatında ise yılı çıkar
    if (startDate && !/^\d{4}$/.test(startDate)) {
      startDate = new Date(startDate).getFullYear().toString();
    }
    if (endDate && !/^\d{4}$/.test(endDate)) {
      endDate = new Date(endDate).getFullYear().toString();
    }
    
    setFormData({
      title: project.title,
      description: project.description || "",
      location: project.location || "",
      category: project.category || "",
      start_date: startDate,
      end_date: endDate,
      is_ongoing: !project.end_date,
      language: project.language,
              images: project.project_images?.map(img => ({
        url: img.url,
        alt_text: img.alt_text || ""
      })) || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Proje silinirken hata oluştu');
      }

      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      category: "",
      start_date: "",
      end_date: "",
      is_ongoing: false,
      language: "tr",
      images: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: "", alt_text: "" }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, field: keyof ProjectImage, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileUpload = async (file: File, index: number) => {
    try {
      setUploadingIndex(index);
      setError(''); // Önceki hataları temizle
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Upload error data:', errorData);
        throw new Error(errorData.error || 'Resim yüklenirken hata oluştu');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      
      setFormData(prev => {
        const updatedImages = prev.images.map((img, i) => 
          i === index ? { ...img, url: result.url } : img
        );
        console.log('Form data updated with new image:', {
          index,
          newUrl: result.url,
          updatedImage: updatedImages[index],
          allImages: updatedImages
        });
        return {
          ...prev,
          images: updatedImages
        };
      });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Resim yüklenirken hata oluştu');
    } finally {
      setUploadingIndex(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    // Eğer sadece yıl ise (4 haneli sayı), direkt döndür
    if (/^\d{4}$/.test(dateString)) {
      return dateString;
    }
    // Tarih formatında ise yılı çıkar
    return new Date(dateString).getFullYear().toString();
  };

  const getCategoryBadge = (category: string | null) => {
    if (!category) return null;
    
    const colors = {
      "Devam eden projeler": "bg-blue-100 text-blue-800",
      "Sanayi Yapıları": "bg-gray-100 text-gray-800",
      "Lojistik yapılar": "bg-green-100 text-green-800",
      "Stadyum - Spor salonu": "bg-purple-100 text-purple-800",
      "Enerji santral yapıları": "bg-yellow-100 text-yellow-800",
      "AVM - Market": "bg-pink-100 text-pink-800"
    };

    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Proje Yönetimi</h1>
        <p className="text-gray-600 mt-2">Projeleri düzenleyin ve yönetin</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Proje Listesi</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Yeni Proje Ekle
          </button>
        </div>

        {showForm && (
          <div className="mb-6 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proje Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proje Yeri
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlama Yılı
                  </label>
                  <YearDropdown
                    value={formData.start_date}
                    onChange={(value) => setFormData(prev => ({ ...prev, start_date: value }))}
                    placeholder="Yıl Seçin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bitiş Yılı
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_ongoing"
                        checked={formData.is_ongoing}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          is_ongoing: e.target.checked,
                          end_date: e.target.checked ? "" : prev.end_date
                        }))}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_ongoing" className="text-sm text-gray-700">
                        Devam ediyor
                      </label>
                    </div>
                    {!formData.is_ongoing && (
                      <YearDropdown
                        value={formData.end_date}
                        onChange={(value) => setFormData(prev => ({ ...prev, end_date: value }))}
                        placeholder="Yıl Seçin"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Resimler
                  </label>
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Image size={16} />
                    Resim Ekle
                  </button>
                </div>
                
                {formData.images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Resim {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                                         <div className="space-y-3">
                       {/* Dosya Yükleme */}
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <input
                             type="file"
                             accept="image/*"
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 handleFileUpload(file, index);
                               }
                             }}
                             className="hidden"
                             id={`file-upload-${index}`}
                             disabled={uploadingIndex === index}
                           />
                           <label
                             htmlFor={`file-upload-${index}`}
                             className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm ${
                               uploadingIndex === index 
                                 ? 'bg-gray-400 cursor-not-allowed' 
                                 : 'bg-blue-600 hover:bg-blue-700 text-white'
                             }`}
                           >
                             {uploadingIndex === index ? (
                               <>
                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                 Yükleniyor...
                               </>
                             ) : (
                               <>
                                 <Upload size={16} />
                                 Resim Yükle
                               </>
                             )}
                           </label>
                           {image.url && uploadingIndex !== index && (
                             <span className="text-green-600 text-sm flex items-center gap-1">
                               <Image size={16} />
                               Yüklendi
                             </span>
                           )}
                         </div>
                         
                         {/* WebP Önerisi */}
                         <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                           💡 <strong>Öneri:</strong> En iyi performans için WebP formatında yüklemeniz önerilir. 
                           WebP dosyaları daha küçük boyutlu ve daha hızlı yüklenir.
                         </div>
                       </div>

                       {/* Resim Önizleme */}
                       {image.url && (
                         <div className="relative">
                           <img
                             src={image.url}
                             alt={image.alt_text || 'Proje resmi'}
                             className="w-full h-32 object-cover rounded-md border"
                           />
                           <button
                             type="button"
                             onClick={() => updateImage(index, 'url', '')}
                             className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                             title="Resmi kaldır"
                           >
                             <Trash size={12} />
                           </button>
                         </div>
                       )}

                       {/* URL Input (Manuel giriş için) */}
                       <input
                         type="url"
                         placeholder="Veya resim URL'si girin"
                         value={image.url}
                         onChange={(e) => updateImage(index, 'url', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         <input
                           type="text"
                           placeholder="Alt Text"
                           value={image.alt_text}
                           onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                           className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         />
                       </div>
                     </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Proje Görseli */}
              {project.project_images && project.project_images.length > 0 && (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={project.project_images[0].image_url}
                    alt={project.project_images[0].alt_text || project.title}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log('Image loaded successfully:', project.project_images[0].image_url);
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', project.project_images[0].image_url);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {project.project_images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{project.project_images.length - 1} fotoğraf
                    </div>
                  )}
                  {/* Debug info */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {project.project_images[0].image_url.split('/').pop()}
                  </div>
                </div>
              )}
              
              {/* Debug: Görseller yoksa bilgi göster */}
              {(!project.project_images || project.project_images.length === 0) && (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div>Görsel bulunamadı</div>
                    <div className="text-xs mt-1">Project ID: {project.id}</div>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              
              {project.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="space-y-2 mb-3">
                {project.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} />
                    {project.location}
                  </div>
                )}
                
                {project.date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {formatDate(project.date)} - {project.end_date ? formatDate(project.end_date) : 'Devam ediyor'}
                  </div>
                )}
                
                {project.project_images && project.project_images.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Image size={12} />
                    {project.project_images.length} resim
                  </div>
                )}
              </div>
              
                <div className="flex justify-between items-center">
                  {getCategoryBadge(project.category)}
                  <span className="text-xs text-gray-400">
                    {formatDate(project.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Henüz proje eklenmemiş. Yeni proje eklemek için yukarıdaki butonu kullanın.
          </div>
        )}
      </div>
    </div>
  );
}
