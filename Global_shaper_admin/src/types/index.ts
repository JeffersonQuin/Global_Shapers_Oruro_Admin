export type UUID = string
export type ISODate = string
export type ISODateTime = string

export type Role = 'admin' | 'editor'

export interface SessionUser {
  id: string
  username: string
  displayName: string
  role: Role
}

/* ---- Categorías ---- */
export interface InitiativeCategory {
  id: UUID
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  display_order: number
  is_active: boolean
  created_at: ISODateTime
  updated_at: ISODateTime
}

export interface EventCategory {
  id: UUID
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  is_active: boolean
  created_at: ISODateTime
  updated_at: ISODateTime
}

export interface OpportunityCategory {
  id: UUID
  name: string
  slug: string
  description?: string
  color?: string
  display_order: number
  is_active: boolean
  created_at: ISODateTime
  updated_at: ISODateTime
}

export interface ProposalCategory {
  id: UUID
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at: ISODateTime
}

/* ---- Contenido ---- */
export type InitiativeStatus = 'planned' | 'active' | 'completed' | 'paused'

export interface Initiative {
  id: UUID
  title: string
  slug: string
  short_description: string
  full_description: string
  category_id: UUID | null
  status: InitiativeStatus
  start_date?: ISODate
  end_date?: ISODate
  featured_image_url?: string
  gallery_images: string[]
  impact_metrics: Record<string, string | number>
  is_featured: boolean
  is_published: boolean
  view_count: number
  created_at: ISODateTime
  updated_at: ISODateTime
}

export type EventLocationType = 'physical' | 'virtual' | 'hybrid'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export interface EventItem {
  id: UUID
  title: string
  slug: string
  description: string
  category_id: UUID | null
  start_datetime: ISODateTime
  end_datetime: ISODateTime
  location_type: EventLocationType
  location_address?: string
  virtual_link?: string
  registration_link?: string
  registration_deadline?: ISODateTime
  capacity?: number
  status: EventStatus
  featured_image_url?: string
  is_featured: boolean
  contact_info?: { name?: string; email?: string; phone?: string }
  created_at: ISODateTime
  updated_at: ISODateTime
}

export type OpportunityType =
  | 'call'
  | 'volunteer'
  | 'workshop'
  | 'scholarship'
  | 'event'
  | 'other'
export type OpportunityStatus = 'draft' | 'open' | 'closed'

export interface Opportunity {
  id: UUID
  title: string
  slug: string
  description: string
  category_id: UUID | null
  opportunity_type: OpportunityType
  requirements?: string
  application_process?: string
  application_link?: string
  application_deadline?: ISODateTime
  time_commitment?: string
  benefits?: string
  status: OpportunityStatus
  featured_image_url?: string
  is_featured: boolean
  tags: string[]
  contact_info?: { name?: string; email?: string }
  created_at: ISODateTime
  updated_at: ISODateTime
}

/* ---- Bandeja ---- */
export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export interface ContactMessage {
  id: UUID
  sender_name: string
  sender_email: string
  subject: string
  message: string
  status: MessageStatus
  admin_notes?: string
  sent_at: ISODateTime
  read_at?: ISODateTime
  replied_at?: ISODateTime
}

export type ParticipationStatus =
  | 'pending'
  | 'contacted'
  | 'accepted'
  | 'declined'
  | 'archived'

export interface ParticipationRequest {
  id: UUID
  full_name: string
  email: string
  phone?: string
  age_range?: string
  reason_for_interest: string
  areas_of_interest: string[]
  how_heard_about_us?: string
  status: ParticipationStatus
  admin_notes?: string
  submitted_at: ISODateTime
  reviewed_at?: ISODateTime
}

export type ProposalStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'declined'
  | 'implemented'
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent'

export interface CommunityProposal {
  id: UUID
  submitter_name: string
  submitter_email: string
  submitter_phone?: string
  problem_title: string
  problem_description: string
  proposed_solution?: string
  category_id: UUID | null
  geographic_area?: string
  priority_level?: PriorityLevel
  status: ProposalStatus
  admin_notes?: string
  submitted_at: ISODateTime
  reviewed_at?: ISODateTime
}

/* ---- Chatbot ---- */
export type ContentType =
  | 'faq'
  | 'about'
  | 'initiative'
  | 'event'
  | 'opportunity'
  | 'general'

export interface ChatbotKnowledge {
  id: UUID
  title: string
  content: string
  content_type?: ContentType
  category?: string
  tags: string[]
  source_reference?: string
  is_active: boolean
  priority: number
  created_at: ISODateTime
  updated_at: ISODateTime
}

/* ---- Configuración ---- */
export interface SiteSetting {
  id: UUID
  key: string
  value: Record<string, unknown> | string
  description?: string
  category?: string
  is_public: boolean
  created_at: ISODateTime
  updated_at: ISODateTime
}
