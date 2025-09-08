
import { supabase } from './supabase'
import type { SubscriptionOffer, Request, RequestEvent, Ticket, TicketMessage, User, RequestFile, TicketFile } from '../types'

const BUCKET = 'gc_uploads'

function safeName(name: string){
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export const supabaseStore = {
  async getOffers(): Promise<SubscriptionOffer[]> {
    const { data, error } = await supabase.from('subscription_offers').select('*').eq('is_active', true).order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },
  async getOfferBySlug(slug: string): Promise<SubscriptionOffer | null> {
    const { data } = await supabase.from('subscription_offers').select('*').eq('slug', slug).single()
    return (data ?? null) as any
  },
  async createRequest(user: User, payload: { type: 'offer'|'custom', title: string, details?: string, offer_id?: string | null }): Promise<Request> {
    const { data, error } = await supabase.from('requests').insert({
      user_id: user.id, type: payload.type, offer_id: payload.offer_id ?? null, title: payload.title, details: payload.details ?? null, status: 'Submitted'
    }).select().single()
    if (error) throw error
    await supabase.from('request_events').insert({ request_id: data.id, type: 'Submitted', message: 'Anfrage eingegangen', by_admin: false })
    return data as Request
  },
  async listRequests(user: User): Promise<Request[]> {
    const { data, error } = await supabase.from('requests').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },
  async listRequestEvents(requestId: string): Promise<RequestEvent[]> {
    const { data, error } = await supabase.from('request_events').select('*').eq('request_id', requestId).order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
  },
  async addRequestEvent(user: User, requestId: string, type: string, message?: string): Promise<RequestEvent> {
    const { data, error } = await supabase.from('request_events')
      .insert({ request_id: requestId, type, message: message ?? null, by_admin: false })
      .select().single()
    if (error) throw error
    if (type === 'InfoProvided') {
      await supabase.from('requests').update({ status: 'UnderReview' }).eq('id', requestId)
    }
    return data as RequestEvent
  },
  async createTicket(user: User, subject: string, body?: string): Promise<Ticket> {
    const { data, error } = await supabase.from('tickets').insert({ user_id: user.id, subject, status: 'Open' }).select().single()
    if (error) throw error
    if (body && body.trim()) await supabase.from('ticket_messages').insert({ ticket_id: data.id, sender: 'user', body })
    return data as Ticket
  },
  async listTickets(user: User): Promise<Ticket[]> {
    const { data, error } = await supabase.from('tickets').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
    if (error) throw error
    const tickets = data ?? []
    for (const t of tickets as any[]) {
      const { data: reads } = await supabase.from('ticket_reads').select('*').eq('ticket_id', t.id).eq('user_id', user.id).maybeSingle()
      const lastRead = reads?.last_read_at ? new Date(reads.last_read_at).getTime() : 0
      const { data: lastAdmin } = await supabase
        .from('ticket_messages')
        .select('created_at')
        .eq('ticket_id', t.id)
        .eq('sender', 'admin')
        .order('created_at', { ascending: false })
        .limit(1)
      const adminTs = lastAdmin && (lastAdmin as any[])[0]?.created_at ? new Date((lastAdmin as any[])[0].created_at).getTime() : 0
      t.unread = adminTs > lastRead ? 1 : 0
    }
    return tickets as any
  },
  async getTicket(user: User, id: string): Promise<{ticket: Ticket, messages: TicketMessage[]}|null> {
    const { data: ticket } = await supabase.from('tickets').select('*').eq('id', id).eq('user_id', user.id).single()
    if (!ticket) return null
    const { data: messages } = await supabase.from('ticket_messages').select('*').eq('ticket_id', id).order('created_at', { ascending: true })
    return { ticket: ticket as Ticket, messages: (messages ?? []) as TicketMessage[] }
  },
  async sendTicketMessage(user: User, ticketId: string, body: string): Promise<TicketMessage> {
    const { data, error } = await supabase.from('ticket_messages').insert({ ticket_id: ticketId, sender: 'user', body }).select().single()
    if (error) throw error
    await this.markTicketRead(user, ticketId)
    return data as TicketMessage
  },
  async markTicketRead(user: User, ticketId: string){
    await supabase.from('ticket_reads').upsert(
      { user_id: user.id, ticket_id: ticketId, last_read_at: new Date().toISOString() },
      { onConflict: 'user_id,ticket_id' }
    )
    return true
  },
  async unreadTicketsCount(user: User): Promise<number> {
    const list = await this.listTickets(user)
    return (list as any[]).reduce((acc, t) => acc + (t.unread ? 1 : 0), 0)
  },

  // ---- Uploads ----
  async uploadRequestFiles(user: User, requestId: string, files: File[]): Promise<RequestFile[]> {
    const out: RequestFile[] = []
    for (const f of files) {
      const path = `${user.id}/${Date.now()}_${safeName(f.name)}`
      const up = await supabase.storage.from(BUCKET).upload(path, f, { upsert: false, contentType: f.type })
      if (up.error) throw up.error
      const { data, error } = await supabase.from('request_files').insert({
        request_id: requestId, user_id: user.id, path, mime: f.type || null, size: f.size
      }).select().single()
      if (error) throw error
      out.push(data as RequestFile)
    }
    return out
  },
  async getRequestFiles(requestId: string): Promise<RequestFile[]> {
    const { data, error } = await supabase.from('request_files').select('*').eq('request_id', requestId).order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
  },
  async uploadTicketFiles(user: User, ticketId: string, files: File[]): Promise<TicketFile[]> {
    const out: TicketFile[] = []
    for (const f of files) {
      const path = `${user.id}/${Date.now()}_${safeName(f.name)}`
      const up = await supabase.storage.from(BUCKET).upload(path, f, { upsert: false, contentType: f.type })
      if (up.error) throw up.error
      const { data, error } = await supabase.from('ticket_files').insert({
        ticket_id: ticketId, user_id: user.id, path, mime: f.type || null, size: f.size
      }).select().single()
      if (error) throw error
      out.push(data as TicketFile)
    }
    return out
  },
  async getTicketFiles(ticketId: string): Promise<TicketFile[]> {
    const { data, error } = await supabase.from('ticket_files').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
  },
  async getSignedUrl(path: string): Promise<string | null> {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600)
    if (error) return null
    return data?.signedUrl ?? null
  }
}
