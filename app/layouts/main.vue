<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Bar -->
    <div class="bg-gray-900 text-white text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-8">
          <div class="flex items-center space-x-4">
            <span>{{ getCurrentDateTime() }}</span>
            <span class="hidden sm:inline">•</span>
            <span class="hidden sm:inline">Breaking news and updates</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-red-400">🔴 LIVE</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">📰</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">NewsHub</h1>
                <p class="text-xs text-gray-500">Breaking News & Updates</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:flex flex-1 max-w-lg mx-8">
            <div class="relative w-full">
              <input type="search" placeholder="Search news..."
                     class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <nav class="hidden lg:flex space-x-6">
            <NuxtLink to="/" class="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                      :class="{ 'text-red-600': $route.path === '/' }">
              Home
            </NuxtLink>
            <NuxtLink v-for="category in categories.slice(0, 4)" :key="category.id"
                      :to="`/category/${category.id}`"
                      class="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                      :class="{ 'text-red-600': $route.path === `/category/${category.id}` }">
              {{ category.name }}
            </NuxtLink>
            <div v-if="categories.length > 4" class="relative group">
              <button class="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors flex items-center">
                More
                <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <NuxtLink v-for="category in categories.slice(4)" :key="category.id"
                          :to="`/category/${category.id}`"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors first:rounded-t-lg last:rounded-b-lg">
                  {{ category.name }}
                </NuxtLink>
              </div>
            </div>
          </nav>
          <div class="flex items-center space-x-3">
            <!-- Mobile Search Button -->
            <button class="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            <template v-if="user">
              <div class="hidden sm:flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-gray-700">
                    {{ (profile?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase() }}
                  </span>
                </div>
                <span class="text-sm text-gray-700 font-medium">
                  {{ profile?.first_name || user.email?.split('@')[0] }}
                </span>
              </div>
              <Button v-if="hasAdminAccess" variant="outline" size="sm" @click="$router.push('/admin')"
                      class="hidden sm:inline-flex">
                Admin
              </Button>
              <Button variant="ghost" size="sm" @click="handleSignOut" class="text-xs">
                Sign Out
              </Button>
            </template>
            <template v-else>
              <Button variant="outline" size="sm" @click="$router.push('/auth/login')" class="text-xs">
                Sign In
              </Button>
              <Button size="sm" @click="$router.push('/auth/signup')" class="bg-red-600 hover:bg-red-700 text-xs">
                Sign Up
              </Button>
            </template>

            <!-- Mobile Menu Button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 text-gray-600 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-b shadow-lg">
      <!-- Mobile Search -->
      <div class="px-4 py-3 border-b">
        <div class="relative">
          <input type="search" placeholder="Search news..."
                 class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Items -->
      <div class="px-4 py-2">
        <NuxtLink to="/" @click="mobileMenuOpen = false"
                  class="block py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  :class="{ 'text-red-600': $route.path === '/' }">
          Home
        </NuxtLink>
        <NuxtLink to="/news" @click="mobileMenuOpen = false"
                  class="block py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  :class="{ 'text-red-600': $route.path.startsWith('/news') }">
          All News
        </NuxtLink>
        <NuxtLink to="/categories" @click="mobileMenuOpen = false"
                  class="block py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  :class="{ 'text-red-600': $route.path === '/categories' }">
          Categories
        </NuxtLink>
        <div class="border-t border-gray-200 my-2"></div>
        <NuxtLink v-for="category in categories" :key="category.id"
                  :to="`/category/${category.id}`" @click="mobileMenuOpen = false"
                  class="block py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  :class="{ 'text-red-600': $route.path === `/category/${category.id}` }">
          {{ category.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">📰</span>
              </div>
              <div>
                <h3 class="text-xl font-bold">NewsHub</h3>
                <p class="text-gray-400 text-sm">Your trusted source for news</p>
              </div>
            </div>
            <p class="text-gray-300 mb-4">
              Stay informed with the latest breaking news, in-depth analysis, and comprehensive coverage from around the world.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4">Categories</h4>
            <ul class="space-y-2">
              <li v-for="category in categories.slice(0, 5)" :key="category.id">
                <NuxtLink :to="`/category/${category.id}`" class="text-gray-300 hover:text-white transition-colors text-sm">
                  {{ category.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400 text-sm">
            &copy; 2024 NewsHub. All rights reserved. | Made with ❤️ for staying informed
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useCategories } from "../composables/useCategories";
import Button from "../components/ui/Button.vue";

const mobileMenuOpen = ref(false);

const { categories, fetchCategories } = useCategories();

onMounted(async () => {
  await fetchCategories();
});
const route = useRoute();

// Authentication
const { user, profile, hasAdminAccess, signOut, getCurrentUser } = useAuth();

// Get current user on mount (non-blocking)
onMounted(() => {
  // Don't await - let the page load while auth is checked in background
  getCurrentUser();
});

const handleSignOut = async () => {
  await signOut();
};

const getCurrentDateTime = () => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
};
</script>
