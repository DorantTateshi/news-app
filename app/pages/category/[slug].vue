<template>
  <div>
    <section class="bg-white py-6 border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="category">
          <nav class="mb-4">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <NuxtLink to="/" class="hover:text-red-600 transition-colors">Home</NuxtLink>
              <span>/</span>
              <span class="text-gray-900 font-medium">{{ category.name }}</span>
            </div>
          </nav>

          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-1">
                {{ category.name }}
              </h1>
              <p class="text-sm text-gray-600">
                {{ categoryNews.length }} articles
                <span v-if="categorySubcategories.length > 0">
                  • {{ categorySubcategories.length }} subcategories
                </span>
              </p>
            </div>

            <div v-if="categorySubcategories.length > 0" class="relative group">
              <button class="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <span>Browse subcategories</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div class="p-1">
                  <NuxtLink v-for="subcategory in categorySubcategories.slice(0, 6)" :key="subcategory.id"
                            :to="`/category/${category?.id}/${subcategory.id}`"
                            class="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                    <span>{{ subcategory.name }}</span>
                    <span class="text-xs text-gray-400">{{ getNewsCountBySubcategory(subcategory.id) }}</span>
                  </NuxtLink>
                  <div v-if="categorySubcategories.length > 6" class="border-t border-gray-100 mt-1 pt-1">
                    <div class="px-3 py-2 text-xs text-gray-500 text-center">
                      +{{ categorySubcategories.length - 6 }} more
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p class="text-gray-600">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    </section>

    <section v-if="categorySubcategories.length > 6" class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">All Subcategories</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <NuxtLink v-for="subcategory in categorySubcategories" :key="subcategory.id"
                    :to="`/category/${category?.id}/${subcategory.id}`"
                    class="group block bg-white rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-red-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {{ subcategory.name }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  {{ getNewsCountBySubcategory(subcategory.id) }} articles
                </p>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="categoryNews.length > 0">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              v-for="article in categoryNews"
              :key="article.id"
              class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="$router.push(`/news/${article.id}`)"
            >
              <img
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                class="w-full h-48 object-cover"
              />
              <CardContent class="p-6">
                <div class="mb-2">
                  <span class="text-sm text-blue-600 font-medium">
                    {{ getSubcategoryName(article.subcategory_id) }}
                  </span>
                </div>
                <h3
                  class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2"
                >
                  {{ article.title }}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-3">
                  {{ getPreviewText(article.content, 150) }}
                </p>
                <div
                  class="flex items-center justify-between text-sm text-gray-500"
                >
                  <span>{{
                    article.created_at
                      ? formatDate(article.created_at)
                      : "Unknown date"
                  }}</span>
                  <span class="text-blue-600 hover:text-blue-700"
                    >Read more →</span
                  >
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div v-else class="text-center py-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            No Articles Found
          </h2>
          <p class="text-gray-600">
            There are no published articles in this category yet.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNews } from "../../composables/useNews";
import { useCategories } from "../../composables/useCategories";
import { useSubcategories } from "../../composables/useSubcategories";
import Card from "../../components/ui/Card.vue";
import CardContent from "../../components/ui/CardContent.vue";
import { getPreviewText } from "../../utils/htmlUtils";

definePageMeta({
  layout: "main",
});

const route = useRoute();
const { news, fetchNews } = useNews();
const { categories, fetchCategories } = useCategories();
const { subcategories, fetchSubcategories } = useSubcategories();

onMounted(async () => {
  await Promise.all([fetchNews(), fetchCategories(), fetchSubcategories()]);
});

const category = computed(() => {
  return categories.value.find((c) => c.id === route.params.slug);
});

const categorySubcategories = computed(() => {
  if (!category.value) return [];
  return subcategories.value.filter(
    (s) => s.category_id === category.value?.id
  );
});

const categoryNews = computed(() => {
  if (!category.value) return [];
  return news.value
    .filter((article) => article.category_id === category.value?.id)
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
});

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

const getSubcategoryName = (subcategoryId?: string) => {
  if (!subcategoryId) return "";
  const subcategory = subcategories.value.find((s) => s.id === subcategoryId);
  return subcategory ? subcategory.name : "";
};

const getNewsCountBySubcategory = (subcategoryId: string) => {
  return news.value.filter(
    (article) => article.subcategory_id === subcategoryId
  ).length;
};
</script>
