import type { SiteSetting } from '@/types'

const now = new Date().toISOString()

export const mockSettings: SiteSetting[] = [
  { id: 's1', key: 'site_name', value: { es: 'Global Shapers Hub Oruro' }, description: 'Nombre del sitio', category: 'general', is_public: true, created_at: now, updated_at: now },
  { id: 's2', key: 'site_tagline', value: { es: 'Jóvenes impulsando el cambio en Oruro' }, description: 'Lema del sitio', category: 'general', is_public: true, created_at: now, updated_at: now },
  { id: 's3', key: 'mission_statement', value: { es: 'Impulsar el desarrollo de Oruro a través de proyectos de impacto liderados por jóvenes.' }, description: 'Declaración de misión', category: 'about', is_public: true, created_at: now, updated_at: now },
  { id: 's4', key: 'vision_statement', value: { es: 'Ser una comunidad referente de jóvenes líderes comprometidos con Oruro.' }, description: 'Declaración de visión', category: 'about', is_public: true, created_at: now, updated_at: now },
  { id: 's5', key: 'contact_email', value: { es: 'info@shapersoruro.org' }, description: 'Email de contacto', category: 'contact', is_public: true, created_at: now, updated_at: now },
  { id: 's6', key: 'contact_phone', value: { es: '+591 70000000' }, description: 'Teléfono de contacto', category: 'contact', is_public: true, created_at: now, updated_at: now },
  { id: 's7', key: 'social_facebook', value: { es: 'https://facebook.com/shapersoruro' }, description: 'Facebook', category: 'contact', is_public: true, created_at: now, updated_at: now },
  { id: 's8', key: 'social_instagram', value: { es: 'https://instagram.com/shapersoruro' }, description: 'Instagram', category: 'contact', is_public: true, created_at: now, updated_at: now },
  { id: 's9', key: 'social_linkedin', value: { es: '' }, description: 'LinkedIn', category: 'contact', is_public: true, created_at: now, updated_at: now },
  { id: 's10', key: 'social_twitter', value: { es: '' }, description: 'Twitter / X', category: 'contact', is_public: true, created_at: now, updated_at: now },
  { id: 's11', key: 'hero_title', value: { es: 'Bienvenido a Global Shapers Hub Oruro' }, description: 'Título principal del hero', category: 'home', is_public: true, created_at: now, updated_at: now },
  { id: 's12', key: 'hero_subtitle', value: { es: 'Somos una comunidad de jóvenes comprometidos con el desarrollo de Oruro' }, description: 'Subtítulo del hero', category: 'home', is_public: true, created_at: now, updated_at: now },
]
