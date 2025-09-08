
export const localStore = {
  async seedOffers(){ return [] },
  async getOffers(){ return [] as any[] },
  async getOfferBySlug(slug: string){ return null },
  async createRequest(user: any, payload: any){ return { id: 'rq_local', ...payload, user_id: user.id, status: 'Submitted', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } },
  async listRequests(user: any){ return [] },
  async listRequestEvents(id: string){ return [] },
  async addRequestEvent(user: any, id: string, type: string, message?: string){ return { id: 're_local', request_id: id, type, message, by_admin: false, created_at: new Date().toISOString() } },
  async createTicket(user: any, subject: string, body?: string){ return { id: 'tk_local', user_id: user.id, subject, status: 'Open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } },
  async listTickets(user: any){ return [] },
  async getTicket(user: any, id: string){ return { ticket: { id, user_id: user.id, subject: 'Demo', status: 'Open', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, messages: [] } },
  async sendTicketMessage(user: any, id: string, body: string){ return { id: 'tm_local', ticket_id: id, sender: 'user', body, created_at: new Date().toISOString() } },
  async markTicketRead(){ return true },
  async unreadTicketsCount(){ return 0 },

  // uploads (no-op)
  async uploadRequestFiles(){ return [] },
  async getRequestFiles(){ return [] },
  async uploadTicketFiles(){ return [] },
  async getTicketFiles(){ return [] },
  async getSignedUrl(){ return null }
}

export function getDemoUser(){
  return { id: 'demo-user', email: 'demo@giannicorp.local', name: 'Gianni (Demo)' }
}
