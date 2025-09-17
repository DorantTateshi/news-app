<template>
  <div>
    <!-- Compact Header -->
    <section class="bg-white py-6 border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="subcategory && category">
          <!-- Simple Breadcrumb -->
          <nav class="mb-4">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <NuxtLink to="/" class="hover:text-red-600 transition-colors">Home</NuxtLink>
              <span>/</span>
              <NuxtLink :to="`/category/${category.id}`" class="hover:text-red-600 transition-colors">{{ category.name }}</NuxtLink>
              <span>/</span>
              <span class="text-gray-900 font-medium">{{ subcategory.name }}</span>
            </div>
          </nav>

          <!-- Compact Header -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-1">
                {{ subcategory.name }}
              </h1>
              <p class="text-sm text-gray-600">
                {{ subcategoryNews.length }} articles in {{ category?.name }}
              </p>
            </div>

            <!-- Related Subcategories Quick Menu -->
            <div class="flex items-center space-x-3">
              <NuxtLink :to="`/category/${category?.id}`" class="text-sm text-gray-600 hover:text-red-600 transition-colors">
                ← Back to {{ category?.name }}
              </NuxtLink>
              <div v-if="relatedSubcategories.length > 0" class="relative group">
                <button class="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                  <span>More in {{ category?.name }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div class="p-1">
                    <NuxtLink v-for="relatedSub in relatedSubcategories.slice(0, 5)" :key="relatedSub.id"
                              :to="`/category/${category?.id}/${relatedSub.id}`"
                              class="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                      <span>{{ relatedSub.name }}</span>
                      <span class="text-xs text-gray-400">{{ getNewsCountBySubcategory(relatedSub.id) }}</span>
                    </NuxtLink>
                    <div v-if="relatedSubcategories.length > 5" class="border-t border-gray-100 mt-1 pt-1">
                      <NuxtLink :to="`/category/${category?.id}`" class="block px-3 py-2 text-xs text-gray-500 hover:text-red-600 text-center transition-colors">
                        View all {{ relatedSubcategories.length + 1 }} subcategories
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Subcategory Not Found
          </h1>
          <p class="text-gray-600">
            The subcategory you're looking for doesn't exist.
          </p>
        </div>
      </div>
    </section>

    <!-- News Articles -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="subcategoryNews.length > 0">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              v-for="article in subcategoryNews"
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
                    {{ getCategoryName(article.category_id) }}
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
                    article.created_at ? formatDate(article.created_at) : "N/A"
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
            There are no published articles in this subcategory yet.
          </p>
        </div>
      </div>
    </section>

    <!-- Related Subcategories (only show if many) -->
    <section v-if="relatedSubcategories.length > 3" class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">
          More in {{ category?.name }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <NuxtLink v-for="relatedSub in relatedSubcategories.slice(0, 8)" :key="relatedSub.id"
                    :to="`/category/${category?.id}/${relatedSub.id}`"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors">
            {{ relatedSub.name }}
            <span class="ml-2 text-xs text-gray-500">({{ getNewsCountBySubcategory(relatedSub.id) }})</span>
          </NuxtLink>
          <NuxtLink v-if="relatedSubcategories.length > 8" :to="`/category/${category?.id}`"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
            View all {{ relatedSubcategories.length }} subcategories →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNews } from "../../../composables/useNews";
import { useCategories } from "../../../composables/useCategories";
import { useSubcategories } from "../../../composables/useSubcategories";
import Card from "../../../components/ui/Card.vue";
import CardContent from "../../../components/ui/CardContent.vue";
import { getPreviewText } from "../../../utils/htmlUtils";

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
  return categories.value.find((c) => c.id === route.params.categorySlug);
});

const subcategory = computed(() => {
  if (!category.value) return null;
  return subcategories.value.find(
    (s) =>
      s.id === route.params.subcategorySlug &&
      s.category_id === category?.value?.id
  );
});

const subcategoryNews = computed(() => {
  if (!subcategory.value) return [];
  return news.value
    .filter((article) => article.subcategory_id === subcategory?.value?.id)
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
});

const relatedSubcategories = computed(() => {
  if (!category.value) return [];
  return subcategories.value
    .filter(
      (s) =>
        s.category_id === category?.value?.id && s.id !== subcategory.value?.id
    )
    .slice(0, 6);
});

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

const getCategoryName = (categoryId: string | undefined) => {
  if (!categoryId) return "Unknown";
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown";
};

const getNewsCountBySubcategory = (subcategoryId: string) => {
  return news.value.filter(
    (article) => article.subcategory_id === subcategoryId
  ).length;
};
</script>
