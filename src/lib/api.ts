
import type { SubscriptionOffer, Request, RequestEvent, Ticket, TicketMessage, User, RequestFile, TicketFile } from '../types'
import { localStore, getDemoUser } from './localStore'
import { supabase } from './supabase'
import { getEnv } from './env'

function supaReady(){
  const { configured } = getEnv()
  return configured && !!supabase
}

export const api = {
  currentUser(): User {
    return getDemoUser()
  },
  async initDemo(){
    if (!supaReady()) {
      await localStore.seedOffers()
    }
  },
  async getOffers(): Promise<SubscriptionOffer[]> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.getOffers()
    }
    return localStore.getOffers()
  },
  async getOfferBySlug(slug: string): Promise<SubscriptionOffer | null> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.getOfferBySlug(slug)
    }
    return localStore.getOfferBySlug(slug)
  },
  async createRequest(user: User, payload: { type: 'offer'|'custom', title: string, details?: string, offer_id?: string | null }) {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.createRequest(user, payload)
    }
    return localStore.createRequest(user, payload)
  },
  async listRequests(user: User) {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.listRequests(user)
    }
    return localStore.listRequests(user)
  },
  async listRequestEvents(requestId: string) {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.listRequestEvents(requestId)
    }
    return localStore.listRequestEvents(requestId)
  },
  async addRequestEvent(user: User, requestId: string, type: string, message?: string) {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.addRequestEvent(user, requestId, type, message)
    }
    return localStore.addRequestEvent(user, requestId, type, message)
  },
  async createTicket(user: User, subject: string, body?: string){
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.createTicket(user, subject, body)
    }
    return localStore.createTicket(user, subject, body)
  },
  async listTickets(user: User){
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.listTickets(user)
    }
    return localStore.listTickets(user)
  },
  async getTicket(user: User, id: string){
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.getTicket(user, id)
    }
    return localStore.getTicket(user, id)
  },
  async sendTicketMessage(user: User, ticketId: string, body: string){
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.sendTicketMessage(user, ticketId, body)
    }
    return localStore.sendTicketMessage(user, ticketId, body)
  },
  async markTicketRead(user: User, ticketId: string){
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.markTicketRead(user, ticketId)
    }
    return localStore.markTicketRead(user, ticketId)
  },
  async unreadTicketsCount(user: User): Promise<number> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.unreadTicketsCount(user)
    }
    return localStore.unreadTicketsCount(user)
  },

  // ---- Uploads ----
  async uploadRequestFiles(user: User, requestId: string, files: File[]): Promise<RequestFile[]> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.uploadRequestFiles(user, requestId, files)
    }
    return localStore.uploadRequestFiles(user, requestId, files)
  },
  async getRequestFiles(requestId: string): Promise<RequestFile[]> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.getRequestFiles(requestId)
    }
    return localStore.getRequestFiles(requestId)
  },
  async uploadTicketFiles(user: User, ticketId: string, files: File[]): Promise<TicketFile[]> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.uploadTicketFiles(user, ticketId, files)
    }
    return localStore.uploadTicketFiles(user, ticketId, files)
  },
  async getTicketFiles(ticketId: string): Promise<TicketFile[]> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.getTicketFiles(ticketId)
    }
    return localStore.getTicketFiles(ticketId)
  },
  async getSignedUrl(path: string): Promise<string | null> {
    if (supaReady()) {
      const { supabaseStore } = await import('./supabaseStore')
      return supabaseStore.getSignedUrl(path)
    }
    return localStore.getSignedUrl(path)
  }
}
