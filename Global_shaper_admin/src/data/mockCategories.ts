import type {
  InitiativeCategory,
  EventCategory,
  OpportunityCategory,
  ProposalCategory,
} from '@/types'

const now = new Date().toISOString()

export const mockInitiativeCategories: InitiativeCategory[] = [
  { id: 'ic1', name: 'Educación', slug: 'educacion', description: 'Proyectos de educación y formación', color: '#3B82F6', display_order: 1, is_active: true, created_at: now, updated_at: now },
  { id: 'ic2', name: 'Medio Ambiente', slug: 'medio-ambiente', description: 'Conservación y sostenibilidad', color: '#10B981', display_order: 2, is_active: true, created_at: now, updated_at: now },
  { id: 'ic3', name: 'Salud', slug: 'salud', description: 'Salud comunitaria y bienestar', color: '#EF4444', display_order: 3, is_active: true, created_at: now, updated_at: now },
  { id: 'ic4', name: 'Tecnología', slug: 'tecnologia', description: 'Innovación y desarrollo', color: '#8B5CF6', display_order: 4, is_active: true, created_at: now, updated_at: now },
  { id: 'ic5', name: 'Desarrollo Social', slug: 'desarrollo-social', description: 'Impacto social y comunitario', color: '#EC4899', display_order: 5, is_active: true, created_at: now, updated_at: now },
]

export const mockEventCategories: EventCategory[] = [
  { id: 'ec1', name: 'Taller', slug: 'taller', description: 'Talleres de formación', color: '#3B82F6', is_active: true, created_at: now, updated_at: now },
  { id: 'ec2', name: 'Conferencia', slug: 'conferencia', description: 'Conferencias y charlas', color: '#8B5CF6', is_active: true, created_at: now, updated_at: now },
  { id: 'ec3', name: 'Voluntariado', slug: 'voluntariado', description: 'Actividades de voluntariado', color: '#10B981', is_active: true, created_at: now, updated_at: now },
  { id: 'ec4', name: 'Networking', slug: 'networking', description: 'Eventos de conexión', color: '#F59E0B', is_active: true, created_at: now, updated_at: now },
]

export const mockOpportunityCategories: OpportunityCategory[] = [
  { id: 'oc1', name: 'Convocatorias', slug: 'convocatorias', description: 'Convocatorias abiertas', color: '#3B82F6', display_order: 1, is_active: true, created_at: now, updated_at: now },
  { id: 'oc2', name: 'Voluntariado', slug: 'voluntariado', description: 'Oportunidades de voluntariado', color: '#10B981', display_order: 2, is_active: true, created_at: now, updated_at: now },
  { id: 'oc3', name: 'Becas', slug: 'becas', description: 'Becas y financiamiento', color: '#F59E0B', display_order: 3, is_active: true, created_at: now, updated_at: now },
  { id: 'oc4', name: 'Talleres', slug: 'talleres', description: 'Talleres y capacitaciones', color: '#8B5CF6', display_order: 4, is_active: true, created_at: now, updated_at: now },
]

export const mockProposalCategories: ProposalCategory[] = [
  { id: 'pc1', name: 'Educación', slug: 'educacion', description: 'Problemas de educación', is_active: true, created_at: now },
  { id: 'pc2', name: 'Medio Ambiente', slug: 'medio-ambiente', description: 'Problemas ambientales', is_active: true, created_at: now },
  { id: 'pc3', name: 'Salud', slug: 'salud', description: 'Problemas de salud pública', is_active: true, created_at: now },
  { id: 'pc4', name: 'Infraestructura', slug: 'infraestructura', description: 'Problemas de infraestructura', is_active: true, created_at: now },
  { id: 'pc5', name: 'Problemas Sociales', slug: 'problemas-sociales', description: 'Problemas sociales', is_active: true, created_at: now },
]
