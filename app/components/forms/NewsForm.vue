<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
        >Title</label
      >
      <input
        id="title"
        v-model="formData.title"
        type="text"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
          { 'border-red-500': errors.title },
        ]"
        placeholder="Enter news title"
        @blur="touched.title = true"
        required
      />
      <p
        v-if="(touched.title || hasAttemptedSubmit) && errors.title"
        class="mt-1 text-sm text-red-600"
      >
        {{ errors.title }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="category"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Category</label
        >
        <select
          id="category"
          v-model="formData.category_id"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            { 'border-red-500': errors.category_id },
          ]"
          @change="touched.category_id = true"
          required
        >
          <option value="">Select a category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <p
          v-if="
            (touched.category_id || hasAttemptedSubmit) && errors.category_id
          "
          class="mt-1 text-sm text-red-600"
        >
          {{ errors.category_id }}
        </p>
      </div>

      <div>
        <label
          for="subcategory"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Subcategory (Optional)</label
        >
        <select
          id="subcategory"
          v-model="formData.subcategory_id"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            { 'border-red-500': errors.subcategory_id },
          ]"
          @change="touched.subcategory_id = true"
          :disabled="!formData.category_id"
        >
          <option value="">Select a subcategory</option>
          <option
            v-for="subcategory in filteredSubcategories"
            :key="subcategory.id"
            :value="subcategory.id"
          >
            {{ subcategory.name }}
          </option>
        </select>
        <p
          v-if="
            (touched.subcategory_id || hasAttemptedSubmit) &&
            errors.subcategory_id
          "
          class="mt-1 text-sm text-red-600"
        >
          {{ errors.subcategory_id }}
        </p>
      </div>
    </div>

    <div>
      <label for="image" class="block text-sm font-medium text-gray-700 mb-1"
        >Image URL (Optional)</label
      >
      <input
        id="image"
        v-model="formData.image"
        type="url"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
          { 'border-red-500': errors.image },
        ]"
        placeholder="https://example.com/image.jpg"
        @blur="touched.image = true"
      />
      <p
        v-if="(touched.image || hasAttemptedSubmit) && errors.image"
        class="mt-1 text-sm text-red-600"
      >
        {{ errors.image }}
      </p>
    </div>

    <div>
      <QuillEditor
        v-model="formData.content"
        label="Content"
        placeholder="Write your news article content..."
        :error="(touched.content || hasAttemptedSubmit) && errors.content ? errors.content : ''"
        @update:modelValue="touched.content = true"
      />
    </div>

    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        :disabled="loading"
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading || !isValid"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="mr-2">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </span>
        {{ editMode ? "Update" : "Create" }} Article
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { newsSchema, type NewsFormData } from "../../lib/validations";
import type { News, Category, Subcategory } from "~/types";
import QuillEditor from "../ui/QuillEditor.vue";

interface Props {
  initialData?: News;
  categories: Category[];
  subcategories: Subcategory[];
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: NewsFormData): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const editMode = computed(() => !!props.initialData);

const formData = ref<NewsFormData>({
  title: props.initialData?.title || "",
  content: props.initialData?.content || "",
  image: props.initialData?.image || "",
  category_id: props.initialData?.category_id || "",
  subcategory_id: props.initialData?.subcategory_id || "",
});

const errors = ref<Partial<Record<keyof NewsFormData, string>>>({});
const touched = ref<Partial<Record<keyof NewsFormData, boolean>>>({});
const hasAttemptedSubmit = ref(false);

// Filter subcategories based on selected category
const filteredSubcategories = computed(() => {
  if (!formData.value.category_id) return [];
  return props.subcategories.filter(
    (sub) => sub.category_id === formData.value.category_id
  );
});

// Reset subcategory when category changes
watch(
  () => formData.value.category_id,
  (newCategoryId, oldCategoryId) => {
    if (newCategoryId !== oldCategoryId) {
      formData.value.subcategory_id = "";
    }
  }
);

// Watch for prop changes to update form data
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        title: newData.title,
        content: newData.content,
        image: newData.image || "",
        category_id: newData.category_id || "",
        subcategory_id: newData.subcategory_id || "",
      };
    }
  },
  { immediate: true }
);

const validateForm = () => {
  try {
    newsSchema.parse(formData.value);
    errors.value = {};
    return true;
  } catch (error: any) {
    const newErrors: Partial<Record<keyof NewsFormData, string>> = {};

    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path[0]) {
          newErrors[err.path[0] as keyof NewsFormData] = err.message;
        }
      });
    }

    errors.value = newErrors;
    return false;
  }
};

const isValid = computed(() => {
  return (
    formData.value.title.trim().length > 0 &&
    formData.value.content.trim().length > 0 &&
    formData.value.category_id.trim().length > 0 &&
    Object.keys(errors.value).length === 0
  );
});

// Validate on input
watch(formData, validateForm, { deep: true });

const handleSubmit = () => {
  hasAttemptedSubmit.value = true;
  if (validateForm()) {
    emit("submit", formData.value);
  }
};

// Reset form when not in edit mode
watch(
  () => props.initialData,
  (newData) => {
    if (!newData) {
      formData.value = {
        title: "",
        content: "",
        image: "",
        category_id: "",
        subcategory_id: "",
      };
      errors.value = {};
      touched.value = {};
      hasAttemptedSubmit.value = false;
    }
  }
);
</script>
