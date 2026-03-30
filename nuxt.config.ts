// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  ui: {
    icons: ['lucide', 'mdi']
  },

  app: {
    head: {
      title: 'BarberPlus - Marketplace Premium de Barbearias',
      meta: [
        { name: 'description', content: 'Encontre as melhores barbearias perto de você' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0a0a0a' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'barberplus-demo-secret-2024',
    asaasApiKey: process.env.ASAAS_API_KEY || '',
    asaasSandbox: process.env.ASAAS_SANDBOX || 'true',
  },

  compatibilityDate: '2024-12-22'
})

