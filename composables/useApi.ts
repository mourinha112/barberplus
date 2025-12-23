export const useApi = () => {
  const { authHeaders, currentBarbershop } = useAuth()

  // GET request
  const get = async <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
    
    return await $fetch(`${url}${query}`, {
      headers: authHeaders.value
    }) as T
  }

  // POST request
  const post = async <T = any>(url: string, body?: any): Promise<T> => {
    return await $fetch(url, {
      method: 'POST',
      headers: authHeaders.value,
      body
    }) as T
  }

  // PATCH request
  const patch = async <T = any>(url: string, body?: any): Promise<T> => {
    return await $fetch(url, {
      method: 'PATCH',
      headers: authHeaders.value,
      body
    }) as T
  }

  // DELETE request
  const del = async <T = any>(url: string): Promise<T> => {
    return await $fetch(url, {
      method: 'DELETE',
      headers: authHeaders.value
    }) as T
  }

  // APIs do Painel (adiciona barbershopId automaticamente)
  const painel = {
    // Dashboard
    getDashboardStats: (params?: any) => 
      get('/api/painel/dashboard/stats', { barbershopId: currentBarbershop.value?.id, ...params }),

    // Agendamentos
    getAppointments: (params?: any) => 
      get('/api/painel/appointments', { barbershopId: currentBarbershop.value?.id, ...params }),
    createAppointment: (data: any) => 
      post('/api/painel/appointments', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateAppointment: (id: string, data: any) => 
      patch(`/api/painel/appointments/${id}`, data),
    getAvailableSlots: (params: any) => 
      get('/api/painel/appointments/available-slots', { barbershopId: currentBarbershop.value?.id, ...params }),

    // Clientes
    getClients: (params?: any) => 
      get('/api/painel/clients', { barbershopId: currentBarbershop.value?.id, ...params }),
    getClient: (id: string) => 
      get(`/api/painel/clients/${id}`),
    createClient: (data: any) => 
      post('/api/painel/clients', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateClient: (id: string, data: any) => 
      patch(`/api/painel/clients/${id}`, data),
    addClientHistory: (clientId: string, data: any) => 
      post(`/api/painel/clients/${clientId}/history`, data),

    // Profissionais
    getProfessionals: (params?: any) => 
      get('/api/painel/professionals', { barbershopId: currentBarbershop.value?.id, ...params }),
    createProfessional: (data: any) => 
      post('/api/painel/professionals', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateProfessional: (id: string, data: any) => 
      patch(`/api/painel/professionals/${id}`, data),
    deleteProfessional: (id: string) => 
      del(`/api/painel/professionals/${id}`),

    // Serviços
    getServices: (params?: any) => 
      get('/api/painel/services', { barbershopId: currentBarbershop.value?.id, ...params }),
    createService: (data: any) => 
      post('/api/painel/services', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateService: (id: string, data: any) => 
      patch(`/api/painel/services/${id}`, data),
    deleteService: (id: string) => 
      del(`/api/painel/services/${id}`),

    // Fila Virtual
    getQueue: (params?: any) => 
      get('/api/painel/queue', { barbershopId: currentBarbershop.value?.id, ...params }),
    addToQueue: (data: any) => 
      post('/api/painel/queue', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateQueueItem: (id: string, data: any) => 
      patch(`/api/painel/queue/${id}`, data),
    removeFromQueue: (id: string) => 
      del(`/api/painel/queue/${id}`),

    // Financeiro
    getTransactions: (params?: any) => 
      get('/api/painel/financial/transactions', { barbershopId: currentBarbershop.value?.id, ...params }),
    createTransaction: (data: any) => 
      post('/api/painel/financial/transactions', { barbershopId: currentBarbershop.value?.id, ...data }),
    getFinancialSummary: (params?: any) => 
      get('/api/painel/financial/summary', { barbershopId: currentBarbershop.value?.id, ...params }),
    getCommissions: (params?: any) => 
      get('/api/painel/financial/commissions', { barbershopId: currentBarbershop.value?.id, ...params }),
    payCommissions: (data: any) => 
      post('/api/painel/financial/commissions/pay', { barbershopId: currentBarbershop.value?.id, ...data }),
    getCashRegister: (params?: any) => 
      get('/api/painel/financial/cash-register', { barbershopId: currentBarbershop.value?.id, ...params }),
    manageCashRegister: (data: any) => 
      post('/api/painel/financial/cash-register', { barbershopId: currentBarbershop.value?.id, ...data }),

    // Fidelidade
    getLoyaltyProgram: () => 
      get('/api/painel/loyalty/program', { barbershopId: currentBarbershop.value?.id }),
    saveLoyaltyProgram: (data: any) => 
      post('/api/painel/loyalty/program', { barbershopId: currentBarbershop.value?.id, ...data }),
    getLoyaltyCards: (params?: any) => 
      get('/api/painel/loyalty/cards', { barbershopId: currentBarbershop.value?.id, ...params }),
    addLoyaltyStamp: (data: any) => 
      post('/api/painel/loyalty/add-stamp', { barbershopId: currentBarbershop.value?.id, ...data }),
    redeemLoyaltyReward: (cardId: string) => 
      post('/api/painel/loyalty/redeem', { cardId }),

    // Avaliações
    getReviews: (params?: any) => 
      get('/api/painel/reviews', { barbershopId: currentBarbershop.value?.id, ...params }),
    replyToReview: (id: string, reply: string) => 
      post(`/api/painel/reviews/${id}/reply`, { reply }),
    toggleReviewVisibility: (id: string, isVisible: boolean) => 
      patch(`/api/painel/reviews/${id}/visibility`, { isVisible }),

    // WhatsApp
    getWhatsAppAutomations: () => 
      get('/api/painel/whatsapp/automations', { barbershopId: currentBarbershop.value?.id }),
    saveWhatsAppAutomation: (data: any) => 
      post('/api/painel/whatsapp/automations', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateWhatsAppAutomation: (id: string, data: any) => 
      patch(`/api/painel/whatsapp/automations/${id}`, data),
    deleteWhatsAppAutomation: (id: string) => 
      del(`/api/painel/whatsapp/automations/${id}`),
    sendWhatsAppMessage: (data: any) => 
      post('/api/painel/whatsapp/send', { barbershopId: currentBarbershop.value?.id, ...data }),
    getWhatsAppMessages: (params?: any) => 
      get('/api/painel/whatsapp/messages', { barbershopId: currentBarbershop.value?.id, ...params }),
    toggleWhatsAppBot: (enabled: boolean) => 
      post('/api/painel/whatsapp/toggle', { barbershopId: currentBarbershop.value?.id, enabled }),

    // Link Bio
    getLinkBio: () => 
      get('/api/painel/link-bio', { barbershopId: currentBarbershop.value?.id }),
    updateLinkBio: (data: any) => 
      patch('/api/painel/link-bio', { barbershopId: currentBarbershop.value?.id, ...data }),
    addLinkBioLink: (data: any) => 
      post('/api/painel/link-bio/links', { barbershopId: currentBarbershop.value?.id, ...data }),
    updateLinkBioLink: (id: string, data: any) => 
      patch(`/api/painel/link-bio/links/${id}`, data),
    deleteLinkBioLink: (id: string) => 
      del(`/api/painel/link-bio/links/${id}`),

    // Configurações
    getSettings: () => 
      get('/api/painel/settings', { barbershopId: currentBarbershop.value?.id }),
    updateSettings: (data: any) => 
      patch('/api/painel/settings', { barbershopId: currentBarbershop.value?.id, ...data }),
    saveWorkingHours: (workingHours: any[]) => 
      post('/api/painel/settings/working-hours', { barbershopId: currentBarbershop.value?.id, workingHours }),
    saveAmenities: (amenities: any[]) => 
      post('/api/painel/settings/amenities', { barbershopId: currentBarbershop.value?.id, amenities }),
    addGalleryImage: (data: any) => 
      post('/api/painel/settings/gallery', { barbershopId: currentBarbershop.value?.id, ...data }),
    deleteGalleryImage: (id: string) => 
      del(`/api/painel/settings/gallery/${id}`)
  }

  // APIs Públicas (Marketplace)
  const marketplace = {
    getBarbershops: (params?: any) => get('/api/barbershops', params),
    getBarbershop: (slug: string) => get(`/api/barbershops/${slug}`),
    getFeaturedBarbershops: () => get('/api/barbershops/featured'),
    getNearbyBarbershops: (params: any) => get('/api/barbershops/nearby', params),
    getCategories: () => get('/api/marketplace/categories'),
    search: (params: any) => get('/api/marketplace/search', params)
  }

  // APIs do Usuário
  const user = {
    getAppointments: (params?: any) => get('/api/user/appointments', params),
    getFavorites: () => get('/api/user/favorites'),
    toggleFavorite: (barbershopId: string) => post('/api/user/favorites', { barbershopId })
  }

  // API de Agendamento
  const booking = {
    book: (data: any) => post('/api/appointments/book', data),
    getAvailableSlots: (params: any) => get('/api/painel/appointments/available-slots', params)
  }

  // API de Avaliações
  const reviews = {
    create: (data: any) => post('/api/reviews', data)
  }

  // API do Link Bio
  const linkBio = {
    get: (slug: string) => get(`/api/link-bio/${slug}`),
    trackClick: (slug: string, linkId: string) => post(`/api/link-bio/${slug}/click`, { linkId })
  }

  return {
    get,
    post,
    patch,
    del,
    painel,
    marketplace,
    user,
    booking,
    reviews,
    linkBio
  }
}

