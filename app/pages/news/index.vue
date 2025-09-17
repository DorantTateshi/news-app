<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            All News Articles
          </h1>
          <p class="text-xl text-red-100 mb-6">
            Discover all our latest stories and breaking news
          </p>
          <div class="flex items-center justify-center space-x-6 text-red-100">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>{{ totalArticles }} articles</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>{{ categories.length }} categories</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Search -->
    <section class="py-8 bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <!-- Search Bar -->
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search articles..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-4">
            <!-- Category Filter -->
            <select
              v-model="selectedCategory"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>

            <!-- Sort Options -->
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Results Info -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ filteredArticles.length }} article{{ filteredArticles.length !== 1 ? 's' : '' }}
              <span v-if="searchQuery || selectedCategory" class="text-gray-600">
                {{ searchQuery ? `matching "${searchQuery}"` : '' }}
                {{ selectedCategory ? `in ${getCategoryName(selectedCategory)}` : '' }}
              </span>
            </h2>
            <p class="text-gray-600 mt-1">
              Stay informed with our latest coverage and breaking news
            </p>
          </div>

          <!-- Clear Filters -->
          <button
            v-if="searchQuery || selectedCategory"
            @click="clearFilters"
            class="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 6" :key="n" class="animate-pulse">
            <div class="bg-white rounded-lg overflow-hidden">
              <div class="h-48 bg-gray-300"></div>
              <div class="p-6 space-y-3">
                <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-gray-300 rounded"></div>
                  <div class="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Articles Grid -->
        <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            v-for="article in paginatedArticles"
            :key="article.id"
            class="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
            @click="$router.push(`/news/${article.id}`)"
          >
            <div class="relative">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-4 left-4">
                <span class="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                  {{ getCategoryName(article.category_id) }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <div class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                  {{ getTimeAgo(article.created_at) }}
                </div>
              </div>
            </div>
            <CardContent class="p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                {{ article.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-3 mb-4">
                {{ getPreviewText(article.content, 120) }}
              </p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ formatDate(article.created_at) }}</span>
                <span class="text-red-600 group-hover:text-red-700 font-medium">
                  Read more →
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="mb-8">
            <svg class="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            {{ searchQuery || selectedCategory ? 'No articles found' : 'No articles yet' }}
          </h3>
          <p class="text-gray-600 mb-8">
            {{ searchQuery || selectedCategory ? 'Try adjusting your search or filters.' : 'Be the first to publish an article.' }}
          </p>
          <button
            v-if="searchQuery || selectedCategory"
            @click="clearFilters"
            class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center">
          <nav class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 border rounded-lg',
                page === currentPage
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNews } from '../../composables/useNews'
import { useCategories } from '../../composables/useCategories'
import { getPreviewText } from '../../utils/htmlUtils'
import Card from '../../components/ui/Card.vue'
import CardContent from '../../components/ui/CardContent.vue'

definePageMeta({
  layout: 'main'
})

const { news, loading, fetchNews } = useNews()
const { categories, fetchCategories } = useCategories()

// Filter and search states
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const articlesPerPage = 12

onMounted(async () => {
  await Promise.all([fetchNews(), fetchCategories()])
})

const totalArticles = computed(() => news.value.length)

const filteredArticles = computed(() => {
  let filtered = [...news.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.content?.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.category_id === selectedCategory.value)
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'oldest':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'newest':
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return filteredArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getCategoryName = (categoryId: string | undefined) => {
  if (!categoryId) return 'Uncategorized'
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Unknown Category'
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'Unknown Date'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj)
}

const getTimeAgo = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return formatDate(date)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})
</script>