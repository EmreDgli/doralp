"use client";

export default function SafetyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İş Güvenliği Yönetimi</h1>
        <p className="text-gray-600 mt-2">İş güvenliği belgeleri ve sertifikaları</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Güvenlik Belgeleri</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Yeni Belge Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">ISO 45001 Sertifikası</h3>
            <p className="text-gray-600 text-sm mb-3">İş Sağlığı ve Güvenliği Yönetim Sistemi</p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Geçerli</span>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Görüntüle</button>
                <button className="text-red-600 hover:text-red-900 text-sm">Sil</button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">OHSAS 18001 Sertifikası</h3>
            <p className="text-gray-600 text-sm mb-3">İş Sağlığı ve Güvenliği Değerlendirme Serisi</p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Geçerli</span>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Görüntüle</button>
                <button className="text-red-600 hover:text-red-900 text-sm">Sil</button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Güvenlik Eğitim Sertifikası</h3>
            <p className="text-gray-600 text-sm mb-3">Personel güvenlik eğitim belgeleri</p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Yenilenmeli</span>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Görüntüle</button>
                <button className="text-red-600 hover:text-red-900 text-sm">Sil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
