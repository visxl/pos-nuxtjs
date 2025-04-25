// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/icon',
    'nuxt-highcharts',
    '@nuxtjs/color-mode',
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    preference: 'light'
  },
  vite: {
    server: {
      hmr: {
        overlay: false, 
      },
    },
  },
  nitro: {
    prerender: {
      failOnError: false, // Allow build to continue despite errors
    },
  },
  runtimeConfig: {
    public: {
      // apiBaseUrl: process.env.API_BASE_URL || 'http://192.168.1.105:8000',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8081',
    },
    googleFonts: {
      families: {
        Content: [400, 700],
      },
      display: "swap",
    },
  },
})
