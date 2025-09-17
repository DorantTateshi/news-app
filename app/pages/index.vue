<template>
  <div>
    <!-- Breaking News Banner -->
    <div v-if="breakingNews" class="bg-red-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex items-center">
          <span
            class="bg-white text-red-600 px-2 py-1 text-xs font-bold rounded mr-4"
          >
            BREAKING
          </span>
          <p
            class="text-sm truncate cursor-pointer hover:underline"
            @click="$router.push(`/news/${breakingNews.id}`)"
          >
            {{ breakingNews.title }}
          </p>
        </div>
      </div>
    </div>

    <!-- Hero Section with Featured Story -->
    <section class="relative">
      <div v-if="featuredStory" class="relative h-[70vh] overflow-hidden">
        <img
          :src="featuredStory.image"
          :alt="featuredStory.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="absolute inset-0 flex items-end">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
            <div class="max-w-2xl">
              <span
                class="inline-block bg-red-600 text-white px-3 py-1 text-sm font-bold rounded mb-4"
              >
                {{ getCategoryName(featuredStory.category_id) }}
              </span>
              <h1
                class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight cursor-pointer hover:text-gray-200"
                @click="$router.push(`/news/${featuredStory.id}`)"
              >
                {{ featuredStory.title }}
              </h1>
              <p class="text-xl text-gray-200 mb-6">
                {{ getPreviewText(featuredStory.content, 200) }}
              </p>
              <div class="flex items-center text-gray-300 text-sm">
                <span>{{ formatDate(featuredStory.created_at) }}</span>
                <span class="mx-2">•</span>
                <span>{{ getTimeAgo(featuredStory.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Stories Grid -->
    <section v-if="hasEnoughStoriesForTopSection" class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Top Stories</h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500"
              >Updated {{ getCurrentTime() }}</span
            >
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Story -->
          <div class="lg:col-span-2">
            <Card
              v-if="displayMainStory"
              class="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              @click="$router.push(`/news/${displayMainStory.id}`)"
            >
              <div class="relative">
                <img
                  :src="displayMainStory.image"
                  :alt="displayMainStory.title"
                  class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute top-4 left-4">
                  <span
                    class="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded"
                  >
                    {{ getCategoryName(displayMainStory.category_id) }}
                  </span>
                </div>
                <div class="absolute top-4 right-4">
                  <span
                    class="bg-black bg-opacity-60 text-white px-2 py-1 text-xs font-medium rounded"
                  >
                    Featured
                  </span>
                </div>
              </div>
              <CardContent class="p-6">
                <h3
                  class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors"
                >
                  {{ displayMainStory.title }}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-3">
                  {{ getPreviewText(displayMainStory.content, 200) }}
                </p>
                <div class="flex items-center text-sm text-gray-500">
                  <span>{{ formatDate(displayMainStory.created_at) }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ getTimeAgo(displayMainStory.created_at) }}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Side Stories -->
          <div class="space-y-6">
            <div
              v-for="(article, index) in displaySideStories"
              :key="article.id"
              class="border-b border-gray-200 pb-4 last:border-b-0 cursor-pointer group"
              @click="$router.push(`/news/${article.id}`)"
            >
              <div class="flex space-x-4">
                <div class="flex-shrink-0">
                  <img
                    :src="article.image"
                    :alt="article.title"
                    class="w-20 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <div class="flex-1">
                  <span
                    class="text-xs text-red-600 font-medium uppercase tracking-wider"
                  >
                    {{ getCategoryName(article.category_id) }}
                  </span>
                  <h4
                    class="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors"
                  >
                    {{ article.title }}
                  </h4>
                  <p class="text-xs text-gray-500">
                    {{ getTimeAgo(article.created_at) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Show empty state if no side stories -->
            <div
              v-if="displaySideStories.length === 0"
              class="text-center py-8"
            >
              <div class="text-gray-400 mb-2">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <p class="text-sm text-gray-500">More stories coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alternative: Single Column Layout for Few Articles -->
    <section v-else-if="news.length > 0" class="py-12 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Latest Articles</h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500"
              >{{ news.length }} article{{ news.length !== 1 ? "s" : "" }}</span
            >
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div class="space-y-6">
          <Card
            v-for="article in news.slice(0, 3)"
            :key="article.id"
            class="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            @click="$router.push(`/news/${article.id}`)"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <img
                  :src="article.image"
                  :alt="article.title"
                  class="w-32 h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent class="p-6 flex-1">
                <div class="mb-2">
                  <span class="text-sm text-red-600 font-medium">
                    {{ getCategoryName(article.category_id) }}
                  </span>
                </div>
                <h3
                  class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-red-600 transition-colors"
                >
                  {{ article.title }}
                </h3>
                <p class="text-gray-600 mb-3 line-clamp-2">
                  {{ getPreviewText(article.content, 120) }}
                </p>
                <div class="flex items-center text-sm text-gray-500">
                  <span>{{ formatDate(article.created_at) }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ getTimeAgo(article.created_at) }}</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <section v-else class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="mb-8">
          <svg
            class="w-24 h-24 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">No Articles Yet</h2>
        <p class="text-xl text-gray-600 mb-8">
          Be the first to publish breaking news and engaging stories for your
          audience.
        </p>
        <Button class="bg-red-600 hover:bg-red-700">
          Create Your First Article
        </Button>
      </div>
    </section>

    <!-- Trending Categories -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <div
            class="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>Trending Now</span>
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest stories across different topics and stay
            informed on what matters most to you
          </p>
        </div>

        <!-- Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            class="group relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100 hover:border-red-200"
            @click="$router.push(`/category/${category.id}`)"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Background Pattern -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            ></div>

            <!-- Category Icon with Dynamic Color -->
            <div class="relative z-10 mb-4">
              <div
                :class="getCategoryIconClasses(index)"
                class="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <component
                  :is="getCategoryIcon(index)"
                  class="w-8 h-8 text-white"
                />
              </div>
            </div>

            <!-- Category Content -->
            <div class="relative z-10">
              <h3
                class="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300"
              >
                {{ category.name }}
              </h3>

              <!-- Stats -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-1 text-gray-600">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <span class="text-sm font-medium"
                      >{{ getNewsCountByCategory(category.id) }} articles</span
                    >
                  </div>
                </div>
                <div class="flex items-center space-x-1 text-green-600">
                  <div
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-xs font-medium">Active</span>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="text-xs text-gray-500 mb-4">
                <span>Latest: {{ getLatestArticleTime(category.id) }}</span>
              </div>

              <!-- Action Button -->
              <div class="flex items-center justify-between">
                <span
                  class="text-sm text-gray-600 group-hover:text-red-600 transition-colors font-medium"
                >
                  Explore {{ category.name.toLowerCase() }}
                </span>
                <div
                  class="w-8 h-8 bg-gray-100 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Hover Effect Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"
            ></div>
          </div>
        </div>

        <!-- View All Categories Button -->
        <div class="text-center">
          <NuxtLink
            to="/categories"
            class="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>View All Categories</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Updates -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Latest Updates</h2>
          <NuxtLink
            to="/news"
            class="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <span>View All News</span>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="article in latestNews"
            :key="article.id"
            class="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            @click="$router.push(`/news/${article.id}`)"
          >
            <div class="relative">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-3 left-3">
                <span
                  class="bg-black bg-opacity-70 text-white px-2 py-1 text-xs font-medium rounded"
                >
                  {{ getCategoryName(article.category_id) }}
                </span>
              </div>
              <div class="absolute top-3 right-3">
                <div
                  class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700"
                >
                  {{ getTimeAgo(article.created_at) }}
                </div>
              </div>
            </div>
            <CardContent class="p-4">
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
              >
                {{ article.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                {{ getPreviewText(article.content, 120) }}
              </p>
              <div
                class="flex items-center justify-between text-xs text-gray-500"
              >
                <span>{{ formatDate(article.created_at) }}</span>
                <span
                  class="text-blue-600 group-hover:text-blue-700 font-medium"
                >
                  Read more →
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  FolderIcon,
  NewspaperIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CpuChipIcon,
  HeartIcon,
  TrophyIcon,
  CameraIcon,
} from "@heroicons/vue/24/outline";
import { useNews } from "../composables/useNews";
import { useCategories } from "../composables/useCategories";
import { computed, onMounted } from "vue";
import Button from "../components/ui/Button.vue";
import Card from "../components/ui/Card.vue";
import CardContent from "../components/ui/CardContent.vue";
import { getPreviewText } from "../utils/htmlUtils";

declare function definePageMeta(meta: { layout: string }): void;

definePageMeta({
  layout: "main",
});

const { news, fetchNews } = useNews();
const { categories, fetchCategories } = useCategories();

onMounted(async () => {
  await fetchNews();
  await fetchCategories();
});

const breakingNews = computed(() => {
  return news.value.length > 0 ? news.value[0] : null;
});

const featuredStory = computed(() => {
  return news.value.length > 0 ? news.value[0] : null;
});

const hasEnoughStoriesForTopSection = computed(() => {
  return news.value.length >= 2;
});

const displayMainStory = computed(() => {
  if (news.value.length === 0) return null;
  return sortedNews.value[0] || null;
});

const displaySideStories = computed(() => {
  if (news.value.length <= 1) return [];
  return sortedNews.value.slice(1, 5);
});

const sortedNews = computed(() => {
  return [...news.value].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });
});

const mainStory = computed(() => {
  return displayMainStory.value;
});

const sideStories = computed(() => {
  return displaySideStories.value;
});

const latestNews = computed(() => {
  return [...news.value]
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at || new Date()).getTime() -
        new Date(a.created_at || new Date()).getTime()
    )
    .slice(0, 9);
});

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Unknown Date";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

const getCategoryName = (categoryId: string | undefined) => {
  if (!categoryId) return "Unknown Category";
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown Category";
};

const getNewsCountByCategory = (categoryId: string) => {
  return news.value.filter((article) => article.category_id === categoryId)
    .length;
};

const getTimeAgo = (date: Date | string | undefined) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(date);
};

const getCurrentTime = () => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
};

const categoryIcons = [
  NewspaperIcon, // News/General
  GlobeAltIcon, // World/International
  ChartBarIcon, // Business/Finance
  CpuChipIcon, // Technology
  TrophyIcon, // Sports
  HeartIcon, // Health/Lifestyle
  CameraIcon, // Entertainment
  FolderIcon, // Default
];

const categoryColors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-yellow-500 to-yellow-600",
  "bg-gradient-to-br from-red-500 to-red-600",
];

const getCategoryIcon = (index: number) => {
  return categoryIcons[index % categoryIcons.length];
};

const getCategoryIconClasses = (index: number) => {
  return categoryColors[index % categoryColors.length];
};

const getLatestArticleTime = (categoryId: string) => {
  const categoryArticles = news.value.filter(
    (article) => article.category_id === categoryId
  );
  if (categoryArticles.length === 0) return "No articles yet";

  const latest = categoryArticles.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  })[0];

  return getTimeAgo(latest?.created_at);
};
</script>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: slideInUp 0.6s ease-out forwards;
  animation-fill-mode: both;
}

@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.group:hover .group-hover\\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\\:-translate-y-2 {
  transform: translateY(-8px);
}

.bg-gradient-text {
  background: linear-gradient(135deg, #ef4444, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
