export default defineAppConfig({
  ui: {
    primary: 'amber',
    gray: 'neutral',
    
    button: {
      rounded: 'rounded-xl',
      default: {
        size: 'lg'
      },
      color: {
        primary: {
          solid: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02]'
        }
      }
    },

    card: {
      rounded: 'rounded-2xl',
      background: 'bg-neutral-900/50 backdrop-blur-xl',
      ring: 'ring-1 ring-neutral-800/50',
      shadow: 'shadow-xl shadow-black/20'
    },

    input: {
      rounded: 'rounded-xl',
      color: {
        gray: {
          outline: 'bg-neutral-900/50 ring-neutral-800 focus:ring-amber-500/50'
        }
      }
    },

    badge: {
      rounded: 'rounded-full'
    },

    avatar: {
      rounded: 'rounded-2xl'
    },

    notification: {
      rounded: 'rounded-2xl'
    }
  }
})

