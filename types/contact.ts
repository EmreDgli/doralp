export interface ContactInfo {
  id: string;
  type: 'location' | 'contact_item';
  title: string;
  subtitle?: string;
  icon?: string; // For contact items: 'phone', 'email', 'address', 'clock'
  color?: string; // For contact items: 'bg-blue-500', 'bg-green-500', etc.
  details?: string[]; // Array of detail strings
  address?: string; // For location
  map_embed_url?: string; // For location map
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  type: 'location' | 'contact_item';
  title: string;
  subtitle?: string;
  icon?: string;
  color?: string;
  details?: string[];
  address?: string;
  map_embed_url?: string;
  sort_order: number;
  is_active: boolean;
}

export const CONTACT_ICONS = [
  { value: 'phone', label: 'Telefon', icon: 'Phone' },
  { value: 'email', label: 'E-posta', icon: 'Mail' },
  { value: 'address', label: 'Adres', icon: 'MapPin' },
  { value: 'clock', label: 'Saat', icon: 'Clock' },
  { value: 'fax', label: 'Faks', icon: 'Printer' },
  { value: 'website', label: 'Website', icon: 'Globe' }
] as const;

export const CONTACT_COLORS = [
  { value: 'bg-blue-500', label: 'Mavi', color: '#3B82F6' },
  { value: 'bg-green-500', label: 'Yeşil', color: '#10B981' },
  { value: 'bg-red-500', label: 'Kırmızı', color: '#EF4444' },
  { value: 'bg-purple-500', label: 'Mor', color: '#8B5CF6' },
  { value: 'bg-yellow-500', label: 'Sarı', color: '#F59E0B' },
  { value: 'bg-indigo-500', label: 'İndigo', color: '#6366F1' },
  { value: 'bg-pink-500', label: 'Pembe', color: '#EC4899' },
  { value: 'bg-orange-500', label: 'Turuncu', color: '#F97316' }
] as const;