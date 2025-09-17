<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage News</h1>
          <p class="mt-2 text-gray-600">
            Create, edit, and manage news articles.
          </p>
        </div>
        <Button @click="openCreateModal" :disabled="loading">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && news.length === 0" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
    >
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- News Table -->
    <Card v-if="!loading || news.length > 0">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Article
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="article in news"
                :key="article.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <img
                      v-if="article.image"
                      :src="article.image"
                      :alt="article.title"
                      class="w-12 h-12 rounded-lg object-cover mr-4"
                    />
                    <div
                      class="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center"
                      v-else
                    >
                      <span class="text-gray-400 text-xs">No Image</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ article.title }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ article.content.substring(0, 100) }}...
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">
                    {{ getCategoryName(article?.category_id || "") }}
                  </span>
                  <div
                    class="text-xs text-gray-500"
                    v-if="article.subcategory_id"
                  >
                    {{ getSubcategoryName(article.subcategory_id) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{
                    article.created_at ? formatDate(article.created_at) : "N/A"
                  }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openEditModal(article)"
                      :disabled="loading"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      class="text-red-600 hover:text-red-700"
                      @click="confirmDelete(article)"
                      :disabled="loading"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <div
      v-if="!loading && news.length === 0 && !error"
      class="text-center py-12"
    >
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No news articles found
      </h3>
      <p class="text-gray-600 mb-4">
        Get started by creating your first news article.
      </p>
      <Button @click="openCreateModal" :disabled="categories.length === 0">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add News
      </Button>
      <p v-if="categories.length === 0" class="text-sm text-gray-500 mt-2">
        You need to create categories first before adding news articles.
      </p>
    </div>

    <!-- Create/Edit Modal -->
    <Modal
      :is-open="showModal"
      :title="editingNews ? 'Edit News Article' : 'Create News Article'"
      size="xl"
      @close="closeModal"
    >
      <NewsForm
        :initial-data="editingNews"
        :categories="(categories as Category[])"
        :subcategories="(subcategories as Subcategory[])"
        :loading="formLoading"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline";
import { ref, onMounted } from "vue";
import type { News, Category, Subcategory } from "../../types";
import type { NewsFormData } from "~/lib/validations";
import { useNews } from "../../composables/useNews";
import { useCategories } from "../../composables/useCategories";
import { useSubcategories } from "../../composables/useSubcategories";
import NewsForm from "../../components/forms/NewsForm.vue";
import Modal from "../../components/ui/Modal.vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const {
  news,
  loading: newsLoading,
  error,
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
} = useNews();
const { categories, fetchCategories } = useCategories();
const { subcategories, fetchSubcategories } = useSubcategories();

const showModal = ref(false);
const editingNews = ref<News | undefined>(undefined);
const formLoading = ref(false);
const loading = ref(false);

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown";
};

const getSubcategoryName = (subcategoryId: string) => {
  const subcategory = subcategories.value.find((s) => s.id === subcategoryId);
  return subcategory ? subcategory.name : "Unknown";
};

const openCreateModal = () => {
  editingNews.value = undefined;
  showModal.value = true;
};

const openEditModal = (article: News) => {
  editingNews.value = article;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingNews.value = undefined;
};

const handleSubmit = async (data: NewsFormData) => {
  try {
    formLoading.value = true;

    if (editingNews.value) {
      await updateNews(editingNews.value.id, data);
    } else {
      await createNews(data);
    }

    closeModal();
  } catch (err) {
    console.error("Error submitting form:", err);
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = async (article: News) => {
  if (
    confirm(
      `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
    )
  ) {
    try {
      await deleteNews(article.id);
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  }
};

// Fetch data on component mount
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchCategories(), fetchSubcategories(), fetchNews()]);
  } finally {
    loading.value = false;
  }
});
</script>
