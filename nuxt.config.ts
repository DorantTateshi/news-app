// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  runtimeConfig: {
    supabase: {
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },
  pages: true,
  ssr: true,
  imports: {
    autoImport: true,
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/callback",
      exclude: ["/*"], // Exclude all routes by default - only admin pages need auth
    },
    types: "./database.types.ts",
  },
});
