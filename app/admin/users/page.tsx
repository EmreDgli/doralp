"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Save, User, Shield, Ban } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  role: string;
  is_super_admin: boolean | null;
  banned_until: string | null;
  deleted_at: string | null;
}

interface UserForm {
  email: string;
  password: string;
  role: string;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    email: "",
    password: "",
    role: "authenticated",
  });

  useEffect(() => {
    fetchUsers();
  }, []); // fetchUsers'ı dependency array'e eklemiyoruz çünkü sadece component mount olduğunda çalışmasını istiyoruz

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Önceki hataları temizle
      console.log('Fetching users from /api/users');
      
      const response = await fetch('/api/users');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Kullanıcılar yüklenirken hata oluştu`);
      }
      
      const data = await response.json();
      console.log('Users data:', data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kullanıcı kaydedilirken hata oluştu');
      }

      await fetchUsers();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kullanıcı silinirken hata oluştu');
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "authenticated",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (user: User) => {
    if (user.deleted_at) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Silinmiş</span>;
    }
    if (user.banned_until) {
      return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Yasaklı</span>;
    }
    if (user.email_confirmed_at) {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Aktif</span>;
    }
    return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Onay Bekliyor</span>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {editingId ? 'Yeni Şifre (boş bırakılırsa değişmez)' : 'Şifre'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingId}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="authenticated">Kullanıcı</option>
                  <option value="service_role">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Kullanıcılar yükleniyor...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Durum</th>
                <th className="px-4 py-2 text-left">Kayıt Tarihi</th>
                <th className="px-4 py-2 text-left">Son Giriş</th>
                <th className="px-4 py-2 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Henüz kullanıcı bulunmuyor
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {user.is_super_admin ? (
                          <Shield className="w-4 h-4 mr-2 text-red-500" />
                        ) : (
                          <User className="w-4 h-4 mr-2 text-blue-500" />
                        )}
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        user.role === 'service_role' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'service_role' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-4 py-2 text-sm">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-2 text-sm">{formatDate(user.last_sign_in_at)}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Sil"
                          disabled={user.is_super_admin === true}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
