"use client";

import { useRouter } from "next/navigation"

export default function ContentsPage() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İçerik Yönetimi</h1>
        <p className="text-gray-600 mt-2">Site içeriklerini düzenleyin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Ana Sayfa</h3>
          <p className="text-gray-600 mb-4">Hero bölümü, hakkımızda özeti ve diğer ana sayfa içerikleri</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Düzenle
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
          <p className="text-gray-600 mb-4">Şirket hikayesi, vizyon ve misyon bilgileri</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Düzenle
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">İletişim</h3>
          <p className="text-gray-600 mb-4">İletişim bilgileri ve adres bilgileri</p>
          <button 
            onClick={() => router.push('/admin/contact-cards')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Düzenle
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Hizmetler</h3>
          <p className="text-gray-600 mb-4">Sunulan hizmetler ve detayları</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Düzenle
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Footer</h3>
          <p className="text-gray-600 mb-4">Alt bilgi ve sosyal medya linkleri</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Düzenle
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">SEO</h3>
          <p className="text-gray-600 mb-4">Meta açıklamaları ve anahtar kelimeler</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}
