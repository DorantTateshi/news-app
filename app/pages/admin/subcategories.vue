<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Subcategories</h1>
          <p class="mt-2 text-gray-600">
            Create and manage subcategories for your news categories.
          </p>
        </div>
        <Button @click="openCreateModal" :disabled="loading">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Subcategory
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading && subcategories.length === 0"
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

    <!-- Subcategories Table -->
    <Card v-if="!loading || subcategories.length > 0">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subcategory
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
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
                v-for="subcategory in subcategories"
                :key="subcategory.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ subcategory.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    ID: {{ subcategory.id.substring(0, 8) }}...
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">
                    {{ getCategoryName(subcategory.category_id) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openEditModal(subcategory)"
                      :disabled="loading"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      class="text-red-600 hover:text-red-700"
                      @click="confirmDelete(subcategory)"
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
      v-if="!loading && subcategories.length === 0 && !error"
      class="text-center py-12"
    >
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No subcategories found
      </h3>
      <p class="text-gray-600 mb-4">
        Get started by creating your first subcategory.
      </p>
      <Button @click="openCreateModal" :disabled="categories.length === 0">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Subcategory
      </Button>
      <p v-if="categories.length === 0" class="text-sm text-gray-500 mt-2">
        You need to create categories first before adding subcategories.
      </p>
    </div>

    <!-- Create/Edit Modal -->
    <Modal
      :is-open="showModal"
      :title="editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'"
      @close="closeModal"
    >
      <SubcategoryForm
        :initial-data="editingSubcategory"
        :categories="categories"
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
import type { Subcategory } from "../../types";
import type { SubcategoryFormData } from "~/lib/validations";
import { useSubcategories } from "../../composables/useSubcategories";
import { useCategories } from "../../composables/useCategories";
import SubcategoryForm from "../../components/forms/SubcategoryForm.vue";
import Modal from "../../components/ui/Modal.vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const {
  subcategories,
  loading: subcategoriesLoading,
  error,
  fetchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = useSubcategories();
const { categories, fetchCategories } = useCategories();

const showModal = ref(false);
const editingSubcategory = ref<Subcategory | undefined>(undefined);
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

const openCreateModal = () => {
  editingSubcategory.value = undefined;
  showModal.value = true;
};

const openEditModal = (subcategory: Subcategory) => {
  editingSubcategory.value = subcategory;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingSubcategory.value = undefined;
};

const handleSubmit = async (data: SubcategoryFormData) => {
  try {
    formLoading.value = true;

    if (editingSubcategory.value) {
      await updateSubcategory(editingSubcategory.value.id, data);
    } else {
      await createSubcategory(data);
    }

    closeModal();
  } catch (err) {
    console.error("Error submitting form:", err);
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = async (subcategory: Subcategory) => {
  if (
    confirm(
      `Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`
    )
  ) {
    try {
      await deleteSubcategory(subcategory.id);
    } catch (err) {
      console.error("Error deleting subcategory:", err);
    }
  }
};

// Fetch data on component mount
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchCategories(), fetchSubcategories()]);
  } finally {
    loading.value = false;
  }
});
</script>
