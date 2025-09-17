<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            All Categories
          </h1>
          <p class="text-xl text-purple-100 mb-6">
            Explore news by topics that matter to you
          </p>
          <div class="flex items-center justify-center space-x-6 text-purple-100">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>{{ categories.length }} categories</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>{{ totalArticles }} total articles</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span>{{ subcategories.length }} subcategories</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Sort -->
    <section class="py-8 bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <!-- Search Bar -->
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search categories..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Sort Options -->
          <div class="flex items-center space-x-4">
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">A-Z</option>
              <option value="articles">Most Articles</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Results Info -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ filteredCategories.length }} categor{{ filteredCategories.length !== 1 ? 'ies' : 'y' }}
              <span v-if="searchQuery" class="text-gray-600">
                matching "{{ searchQuery }}"
              </span>
            </h2>
            <p class="text-gray-600 mt-1">
              Find the topics that interest you most
            </p>
          </div>

          <!-- Clear Search -->
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Clear search
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 6" :key="n" class="animate-pulse">
            <div class="bg-white rounded-xl p-6 space-y-4">
              <div class="w-16 h-16 bg-gray-300 rounded-2xl"></div>
              <div class="space-y-2">
                <div class="h-6 bg-gray-300 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            v-for="(category, index) in filteredCategories"
            :key="category.id"
            class="group cursor-pointer bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-purple-200"
            @click="$router.push(`/category/${category.id}`)"
          >
            <CardContent class="p-8">
              <!-- Category Icon -->
              <div class="mb-6">
                <div :class="getCategoryIconClasses(index)" class="w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <component :is="getCategoryIcon(index)" class="w-10 h-10 text-white" />
                </div>
              </div>

              <!-- Category Info -->
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {{ category.name }}
                </h3>
                <p class="text-gray-600 mb-4">
                  Explore the latest {{ category.name.toLowerCase() }} stories and updates
                </p>
              </div>

              <!-- Stats -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Articles</span>
                  <div class="flex items-center space-x-2">
                    <span class="font-semibold text-gray-900">{{ getCategoryArticleCount(category.id) }}</span>
                    <div class="w-1 h-1 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Subcategories</span>
                  <span class="font-semibold text-gray-900">{{ getCategorySubcategories(category.id).length }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Latest</span>
                  <span class="font-semibold text-gray-900">{{ getLatestArticleTime(category.id) }}</span>
                </div>
              </div>

              <!-- Subcategories Preview -->
              <div v-if="getCategorySubcategories(category.id).length > 0" class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Subcategories:</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="subcategory in getCategorySubcategories(category.id).slice(0, 3)"
                    :key="subcategory.id"
                    class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors"
                  >
                    {{ subcategory.name }}
                  </span>
                  <span
                    v-if="getCategorySubcategories(category.id).length > 3"
                    class="text-gray-500 text-xs font-medium"
                  >
                    +{{ getCategorySubcategories(category.id).length - 3 }} more
                  </span>
                </div>
              </div>

              <!-- Action -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 group-hover:text-purple-600 transition-colors font-medium">
                  Explore {{ category.name }}
                </span>
                <div class="w-8 h-8 bg-gray-100 group-hover:bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <svg class="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="mb-8">
            <svg class="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            {{ searchQuery ? 'No categories found' : 'No categories yet' }}
          </h3>
          <p class="text-gray-600 mb-8">
            {{ searchQuery ? 'Try adjusting your search terms.' : 'Categories will appear here once they are created.' }}
          </p>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Clear search
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  FolderIcon,
  NewspaperIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CpuChipIcon,
  HeartIcon,
  TrophyIcon,
  CameraIcon
} from '@heroicons/vue/24/outline'
import { useNews } from '../../composables/useNews'
import { useCategories } from '../../composables/useCategories'
import { useSubcategories } from '../../composables/useSubcategories'
import Card from '../../components/ui/Card.vue'
import CardContent from '../../components/ui/CardContent.vue'

definePageMeta({
  layout: 'main'
})

const { news, fetchNews } = useNews()
const { categories, loading, fetchCategories } = useCategories()
const { subcategories, fetchSubcategories } = useSubcategories()

// State
const searchQuery = ref('')
const sortBy = ref('name')

onMounted(async () => {
  await Promise.all([fetchNews(), fetchCategories(), fetchSubcategories()])
})

// Computed properties
const totalArticles = computed(() => news.value.length)

const filteredCategories = computed(() => {
  let filtered = [...categories.value]

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(query)
    )
  }

  // Sort categories
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'articles':
        return getCategoryArticleCount(b.id) - getCategoryArticleCount(a.id)
      case 'recent':
        const aLatest = getLatestArticleDate(a.id)
        const bLatest = getLatestArticleDate(b.id)
        return (bLatest || 0) - (aLatest || 0)
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return filtered
})

// Helper functions
const getCategoryArticleCount = (categoryId: string) => {
  return news.value.filter(article => article.category_id === categoryId).length
}

const getCategorySubcategories = (categoryId: string) => {
  return subcategories.value.filter(sub => sub.category_id === categoryId)
}

const getLatestArticleTime = (categoryId: string) => {
  const categoryArticles = news.value.filter(article => article.category_id === categoryId)
  if (categoryArticles.length === 0) return 'No articles'

  const latest = categoryArticles.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateB - dateA
  })[0]

  const dateObj = new Date(latest.created_at || 0)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(dateObj)
}

const getLatestArticleDate = (categoryId: string) => {
  const categoryArticles = news.value.filter(article => article.category_id === categoryId)
  if (categoryArticles.length === 0) return null

  const latest = categoryArticles.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateB - dateA
  })[0]

  return new Date(latest.created_at || 0).getTime()
}

// Icon and color logic (same as homepage)
const categoryIcons = [
  NewspaperIcon, GlobeAltIcon, ChartBarIcon, CpuChipIcon,
  TrophyIcon, HeartIcon, CameraIcon, FolderIcon
]

const categoryColors = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'bg-gradient-to-br from-orange-500 to-orange-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-yellow-500 to-yellow-600',
  'bg-gradient-to-br from-red-500 to-red-600'
]

const getCategoryIcon = (index: number) => {
  return categoryIcons[index % categoryIcons.length]
}

const getCategoryIconClasses = (index: number) => {
  return categoryColors[index % categoryColors.length]
}
</script>