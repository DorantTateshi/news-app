<template>
  <div>
    <!-- Article Hero -->
    <div v-if="article" class="relative h-[50vh] overflow-hidden">
      <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="absolute inset-0 flex items-end">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div class="max-w-3xl">
            <div class="flex items-center space-x-3 mb-4">
              <span class="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
                {{ getCategoryName(article.category_id) }}
              </span>
              <span v-if="article.subcategory_id" class="bg-white bg-opacity-20 text-white px-3 py-1 text-sm rounded">
                {{ getSubcategoryName(article.subcategory_id) }}
              </span>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {{ article.title }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <article v-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Simple Breadcrumb -->
      <nav class="mb-6">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-red-600 transition-colors">Home</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/category/${article.category_id}`" class="hover:text-red-600 transition-colors">
            {{ getCategoryName(article.category_id) }}
          </NuxtLink>
          <span v-if="article.subcategory_id">/</span>
          <NuxtLink v-if="article.subcategory_id" :to="`/category/${article.category_id}/${article.subcategory_id}`" class="hover:text-red-600 transition-colors">
            {{ getSubcategoryName(article.subcategory_id) }}
          </NuxtLink>
          <span>/</span>
          <span class="text-gray-900 font-medium truncate max-w-[200px]" :title="article.title">
            {{ article.title }}
          </span>
        </div>
      </nav>

      <!-- Article Meta -->
      <header class="mb-8">
        <div class="flex items-center justify-between mb-6 pb-6 border-b">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-lg font-bold text-gray-700">
                {{ getAuthorInitials(article.created_by) }}
              </span>
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ getAuthorName(article.created_by) }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(article.created_at) }} • {{ getTimeAgo(article.created_at) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span class="text-sm">{{ Math.floor(Math.random() * 50) + 10 }}</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              <span class="text-sm">Share</span>
            </button>
            <button class="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <div class="prose prose-lg prose-gray max-w-none">
        <!-- Lead Paragraph -->
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-red-600 pl-6 bg-gray-50 py-4 rounded-r-lg">
          {{ getPreviewText(article.content, 200) }}
        </p>

        <!-- Article Body with Rich HTML Content -->
        <div class="text-gray-800 leading-relaxed article-content"
             v-html="sanitizeHtml(article.content)"></div>
      </div>

      <!-- Article Tags/Topics -->
      <div class="mt-12 pt-8 border-t">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
        <div class="flex flex-wrap gap-3">
          <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
            {{ getCategoryName(article.category_id) }}
          </span>
          <span v-if="article.subcategory_id" class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
            {{ getSubcategoryName(article.subcategory_id) }}
          </span>
          <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
            Breaking News
          </span>
          <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
            {{ formatDate(article.created_at) }}
          </span>
        </div>
      </div>

      <!-- Tags -->
      <!-- Tags section removed as it's not in the schema -->

      <!-- Social Share -->
      <div class="mt-12 pt-8 border-t">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
        <div class="flex space-x-4">
          <button class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="text-sm">Facebook</span>
          </button>
          <button class="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span class="text-sm">Twitter</span>
          </button>
          <button class="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span class="text-sm">WhatsApp</span>
          </button>
          <button class="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span class="text-sm">Copy Link</span>
          </button>
        </div>
      </div>

      <!-- Related Articles -->
      <section class="mt-16 pt-8 border-t">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">You might also like</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card v-for="relatedArticle in relatedArticles" :key="relatedArticle.id"
                class="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                @click="$router.push(`/news/${relatedArticle.id}`)">
            <div class="relative">
              <img :src="relatedArticle.image" :alt="relatedArticle.title"
                   class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute top-3 left-3">
                <span class="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                  {{ getCategoryName(relatedArticle.category_id) }}
                </span>
              </div>
            </div>
            <CardContent class="p-4">
              <h4 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {{ relatedArticle.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                {{ getPreviewText(relatedArticle.content, 100) }}
              </p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ getTimeAgo(relatedArticle.created_at) }}</span>
                <span class="text-blue-600 group-hover:text-blue-700 font-medium">
                  Read more →
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </article>

    <!-- Article Not Found -->
    <div
      v-else
      class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
      <p class="text-xl text-gray-600 mb-8">
        The article you're looking for doesn't exist or has been removed.
      </p>
      <Button @click="$router.push('/')">Back to Home</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { News } from "../../types";
import { useRoute } from "vue-router";
import { useNews } from "../../composables/useNews";
import { useCategories } from "../../composables/useCategories";
import { useSubcategories } from "../../composables/useSubcategories";
import { useProfiles } from "../../composables/useProfiles";
import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import CardContent from "../../components/ui/CardContent.vue";
import { sanitizeHtml, getPreviewText } from "../../utils/htmlUtils";

declare function definePageMeta(meta: { layout: string }): void;

definePageMeta({
  layout: "main",
});

const route = useRoute();
const { news, fetchNews } = useNews();
const { categories, fetchCategories } = useCategories();
const { subcategories, fetchSubcategories } = useSubcategories();
const { profiles, fetchProfiles } = useProfiles();

onMounted(async () => {
  await Promise.all([
    fetchNews(),
    fetchCategories(),
    fetchSubcategories(),
    fetchProfiles(),
  ]);
});

const article = computed(() => {
  return news.value.find((n) => n.id === route.params.slug);
});

const relatedArticles = computed(() => {
  if (!article.value) return [];
  return news.value
    .filter(
      (n) =>
        n.id !== article.value?.id &&
        n.category_id === article.value?.category_id
    )
    .slice(0, 4);
});

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Unknown Date";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

const getCategoryName = (categoryId: string | undefined) => {
  if (!categoryId) return "Unknown Category";
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown Category";
};

const getSubcategoryName = (subcategoryId: string) => {
  const subcategory = subcategories.value.find((s) => s.id === subcategoryId);
  return subcategory ? subcategory.name : "";
};

const getAuthorName = (authorId: string | undefined) => {
  if (!authorId) return "Unknown Author";
  const author = profiles.value.find((u: any) => u.id === authorId);
  return author
    ? `${author.first_name} ${author.last_name}`.trim() || "Unknown Author"
    : "Unknown Author";
};

const getAuthorInitials = (authorId: string | undefined) => {
  if (!authorId) return "UA";
  const author = profiles.value.find((u: any) => u.id === authorId);
  if (author) {
    const firstName = author.first_name?.[0] || "";
    const lastName = author.last_name?.[0] || "";
    return (firstName + lastName) || "UA";
  }
  return "UA";
};

const getTimeAgo = (date: Date | string | undefined) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(date);
};

</script>

<style>
/* Rich text content styling */
.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  @apply font-bold text-gray-900 mt-8 mb-4;
}

.article-content h1 { @apply text-3xl; }
.article-content h2 { @apply text-2xl; }
.article-content h3 { @apply text-xl; }
.article-content h4 { @apply text-lg; }

.article-content p {
  @apply mb-4 leading-relaxed;
}

.article-content ul,
.article-content ol {
  @apply mb-4 ml-6;
}

.article-content ul {
  @apply list-disc;
}

.article-content ol {
  @apply list-decimal;
}

.article-content li {
  @apply mb-2;
}

.article-content blockquote {
  @apply border-l-4 border-gray-300 pl-4 py-2 mb-4 italic text-gray-700;
}

.article-content strong,
.article-content b {
  @apply font-bold;
}

.article-content em,
.article-content i {
  @apply italic;
}

.article-content u {
  @apply underline;
}

.article-content strike,
.article-content s {
  @apply line-through;
}

.article-content code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

.article-content pre {
  @apply bg-gray-100 p-4 rounded mb-4 overflow-x-auto;
}

.article-content pre code {
  @apply bg-transparent px-0 py-0;
}

.article-content a {
  @apply text-blue-600 hover:text-blue-800 underline;
}
</style>
