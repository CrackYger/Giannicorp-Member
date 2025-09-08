
export type UUID = string
export type ISO = string

export interface User {
  id: UUID
  email?: string | null
  name?: string | null
}

export interface SubscriptionOffer {
  id: UUID
  title: string
  slug: string
  description?: string | null
  price_from?: number | null
  terms?: string | null
  is_active?: boolean
  created_at: ISO
}

export type RequestStatus = 'Submitted'|'UnderReview'|'InfoRequested'|'Approved'|'Active'|'Suspended'|'Cancelled'|'Closed'

export interface Request {
  id: UUID
  user_id: UUID
  type: 'offer' | 'custom'
  offer_id?: UUID | null
  title: string
  details?: string | null
  status: RequestStatus
  created_at: ISO
  updated_at: ISO
}

export interface RequestEvent {
  id: UUID
  request_id: UUID
  type: string
  message?: string | null
  by_admin: boolean
  created_at: ISO
}

export interface Ticket {
  id: UUID
  user_id: UUID
  subject: string
  status: string
  created_at: ISO
  updated_at: ISO
  unread?: number
}

export interface TicketMessage {
  id: UUID
  ticket_id: UUID
  sender: 'user' | 'admin'
  body: string
  created_at: ISO
}

export interface RequestFile {
  id: UUID
  request_id: UUID
  user_id: UUID
  path: string
  mime?: string | null
  size?: number | null
  created_at: ISO
}

export interface TicketFile {
  id: UUID
  ticket_id: UUID
  user_id: UUID
  path: string
  mime?: string | null
  size?: number | null
  created_at: ISO
}
