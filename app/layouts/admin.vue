<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ profile?.first_name || user?.email || "Admin" }}
            </span>
            <Button variant="outline" size="sm" @click="$router.push('/')">
              View Site
            </Button>
            <Button variant="outline" size="sm" @click="handleSignOut">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <nav class="w-64 bg-white shadow-sm min-h-screen">
        <div class="p-4">
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/admin"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-gray-100 text-gray-900': $route.path === '/admin',
                }"
              >
                <HomeIcon class="w-5 h-5 mr-3" />
                Dashboard
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/users"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-gray-100 text-gray-900': $route.path === '/admin/users',
                }"
              >
                <UsersIcon class="w-5 h-5 mr-3" />
                Manage Users
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/categories"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-gray-100 text-gray-900':
                    $route.path === '/admin/categories',
                }"
              >
                <FolderIcon class="w-5 h-5 mr-3" />
                Manage Categories
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/subcategories"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-gray-100 text-gray-900':
                    $route.path === '/admin/subcategories',
                }"
              >
                <FolderOpenIcon class="w-5 h-5 mr-3" />
                Manage Subcategories
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/news"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-gray-100 text-gray-900': $route.path === '/admin/news',
                }"
              >
                <NewspaperIcon class="w-5 h-5 mr-3" />
                Manage News
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/statistics"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                :class="{
                  'bg-gray-100 text-gray-900':
                    $route.path === '/admin/statistics',
                }"
              >
                <ChartBarIcon class="w-5 h-5 mr-3" />
                Statistics
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  FolderOpenIcon,
  NewspaperIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();

// Authentication
const { user, profile, signOut, getCurrentUser } = useAuth();

// Get current user on mount (non-blocking since middleware handles auth)
onMounted(() => {
  getCurrentUser();
});

const handleSignOut = async () => {
  await signOut();
};
</script>
