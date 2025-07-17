// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: '',
    // Public keys that are exposed to the client
    public: {
      apiBase: 'https://date.nager.at/api/v3'
    }
  }
});
