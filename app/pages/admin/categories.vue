<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Categories</h1>
          <p class="mt-2 text-gray-600">Create and manage news categories.</p>
        </div>
        <Button @click="openCreateModal">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading && categories.length === 0"
      class="flex justify-center py-12"
    >
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

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="category in categories"
        :key="category.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ category.name }}
            </h3>
            <div class="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                @click="openEditModal(category)"
                :disabled="loading"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="text-red-600 hover:text-red-700"
                @click="confirmDelete(category)"
                :disabled="loading"
              >
                Delete
              </Button>
            </div>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>ID: {{ category.id.substring(0, 8) }}...</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && categories.length === 0 && !error"
      class="text-center py-12"
    >
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No categories found
      </h3>
      <p class="text-gray-600 mb-4">
        Get started by creating your first category.
      </p>
      <Button @click="openCreateModal">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Category
      </Button>
    </div>

    <!-- Create/Edit Modal -->
    <Modal
      :is-open="showModal"
      :title="editingCategory ? 'Edit Category' : 'Create Category'"
      @close="closeModal"
    >
      <CategoryForm
        :initial-data="editingCategory"
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
import type { Category } from "../../types";
import type { CategoryFormData } from "~/lib/validations";
import { useCategories } from "../../composables/useCategories";
import CategoryForm from "../../components/forms/CategoryForm.vue";
import Modal from "../../components/ui/Modal.vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const {
  categories,
  loading,
  error,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategories();

const showModal = ref(false);
const editingCategory = ref<Category | undefined>(undefined);
const formLoading = ref(false);

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const openCreateModal = () => {
  editingCategory.value = undefined;
  showModal.value = true;
};

const openEditModal = (category: Category) => {
  editingCategory.value = category;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCategory.value = undefined;
};

const handleSubmit = async (data: CategoryFormData) => {
  try {
    formLoading.value = true;

    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, data);
    } else {
      await createCategory(data);
    }

    closeModal();
  } catch (err) {
    console.error("Error submitting form:", err);
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = async (category: Category) => {
  if (
    confirm(
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
    )
  ) {
    try {
      await deleteCategory(category.id);
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
