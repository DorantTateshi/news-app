<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
        >Category Name</label
      >
      <input
        id="name"
        v-model="formData.name"
        type="text"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
          { 'border-red-500': errors.name },
        ]"
        placeholder="Enter category name"
        @blur="touched.name = true"
        required
      />
      <p
        v-if="(touched.name || hasAttemptedSubmit) && errors.name"
        class="mt-1 text-sm text-red-600"
      >
        {{ errors.name }}
      </p>
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
        {{ editMode ? "Update" : "Create" }} Category
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { categorySchema, type CategoryFormData } from "../../lib/validations";
import type { Category } from "~/types";

interface Props {
  initialData?: Category;
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: CategoryFormData): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const editMode = computed(() => !!props.initialData);

const formData = ref<CategoryFormData>({
  name: props.initialData?.name || "",
});

const errors = ref<Partial<Record<keyof CategoryFormData, string>>>({});
const touched = ref<Partial<Record<keyof CategoryFormData, boolean>>>({});
const hasAttemptedSubmit = ref(false);

// Watch for prop changes to update form data
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        name: newData.name,
      };
    }
  },
  { immediate: true }
);

const validateForm = () => {
  try {
    categorySchema.parse(formData.value);
    errors.value = {};
    return true;
  } catch (error: any) {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};

    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path[0]) {
          newErrors[err.path[0] as keyof CategoryFormData] = err.message;
        }
      });
    }

    errors.value = newErrors;
    return false;
  }
};

const isValid = computed(() => {
  return (
    formData.value.name.trim().length > 0 &&
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
      formData.value = { name: "" };
      errors.value = {};
      touched.value = {};
      hasAttemptedSubmit.value = false;
    }
  }
);
</script>
