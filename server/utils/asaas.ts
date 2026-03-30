const ASAAS_API_KEY = process.env.ASAAS_API_KEY || ''
const ASAAS_BASE = process.env.ASAAS_SANDBOX === 'true'
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://api.asaas.com/v3'

export const isAsaasConfigured = !!ASAAS_API_KEY

export async function asaasRequest(method: string, endpoint: string, body?: any) {
  const res = await fetch(`${ASAAS_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    console.error('Asaas API error:', res.status, JSON.stringify(data))
    throw new Error(data.errors?.[0]?.description || `Asaas error ${res.status}`)
  }
  return data
}

export const PLANS = {
  free: {
    name: 'Gratuito',
    value: 0,
    maxProfessionals: 1,
    description: 'Plano Gratuito BarberPlus',
    features: [
      'agendamentos',
      'clientes',
      'fila',
      'link_bio',
      'caixa',
    ]
  },
  professional: {
    name: 'Profissional',
    value: 99.90,
    maxProfessionals: 2,
    description: 'Plano Profissional BarberPlus',
    features: [
      'agendamentos',
      'clientes',
      'fila',
      'link_bio',
      'caixa',
      'financeiro',
      'whatsapp',
      'fidelidade',
      'avaliacoes',
      'suporte_prioritario',
    ]
  },
  pro: {
    name: 'Pro',
    value: 199.90,
    maxProfessionals: 5,
    description: 'Plano Pro BarberPlus',
    features: [
      'agendamentos',
      'clientes',
      'fila',
      'link_bio',
      'caixa',
      'financeiro',
      'whatsapp',
      'fidelidade',
      'avaliacoes',
      'suporte_prioritario',
    ]
  },
} as const

export type PlanKey = keyof typeof PLANS
