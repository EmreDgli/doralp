export interface Content {
  id: string;
  language: 'tr' | 'en';
  page: string;
  title: string;
  body?: string;
  created_at: string;
  updated_at?: string;
}

export interface ContentFormData {
  language: 'tr' | 'en';
  page: string;
  title: string;
  body: string;
}

export type LANGUAGES = 'tr' | 'en';

export const LANGUAGE_OPTIONS = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' }
] as const;

export const PAGE_OPTIONS = [
  { value: 'home', label: 'Anasayfa' },
  { value: 'about', label: 'Hakkımızda' },
  { value: 'services', label: 'Hizmetler' },
  { value: 'projects', label: 'Projeler' },
  { value: 'contact', label: 'İletişim' },
  { value: 'footer', label: 'Footer' },
  { value: 'general', label: 'Genel' }
] as const;