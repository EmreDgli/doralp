export interface SlideButton {
  id: string;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  buttons: SlideButton[];
  // Legacy support for old database format
  button_text?: string;
  button_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface SlideFormData {
  title: string;
  subtitle?: string;
  image_url: string;
  buttons: SlideButton[];
  is_active: boolean;
  sort_order: number;
}