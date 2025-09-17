<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="first_name"
          class="block text-sm font-medium text-gray-700 mb-1"
          >First Name (Optional)</label
        >
        <input
          id="first_name"
          v-model="formData.first_name"
          type="text"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            { 'border-red-500': errors.first_name },
          ]"
          placeholder="Enter first name"
        />
        <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">
          {{ errors.first_name }}
        </p>
      </div>

      <div>
        <label
          for="last_name"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Last Name (Optional)</label
        >
        <input
          id="last_name"
          v-model="formData.last_name"
          type="text"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            { 'border-red-500': errors.last_name },
          ]"
          placeholder="Enter last name"
        />
        <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">
          {{ errors.last_name }}
        </p>
      </div>
    </div>

    <div>
      <label for="role" class="block text-sm font-medium text-gray-700 mb-1"
        >Role</label
      >
      <select
        id="role"
        v-model="formData.role"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
          { 'border-red-500': errors.role },
        ]"
        required
      >
        <option value="">Select a role</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>
      <p v-if="errors.role" class="mt-1 text-sm text-red-600">
        {{ errors.role }}
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
        {{ editMode ? "Update" : "Create" }} Profile
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { profileSchema, type ProfileFormData } from "../../lib/validations";
import type { Profile } from "~/types";

interface Props {
  initialData?: Profile;
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: ProfileFormData): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const editMode = computed(() => !!props.initialData);

const formData = ref<ProfileFormData>({
  role: props.initialData?.role || "user",
  first_name: props.initialData?.first_name || "",
  last_name: props.initialData?.last_name || "",
});

const errors = ref<Partial<Record<keyof ProfileFormData, string>>>({});

// Watch for prop changes to update form data
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        role: newData.role || "user",
        first_name: newData.first_name,
        last_name: newData.last_name,
      };
    }
  },
  { immediate: true }
);

const validateForm = () => {
  try {
    profileSchema.parse(formData.value);
    errors.value = {};
    return true;
  } catch (error: any) {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path[0]) {
          newErrors[err.path[0] as keyof ProfileFormData] = err.message;
        }
      });
    }

    errors.value = newErrors;
    return false;
  }
};

const isValid = computed(() => {
  return (
    formData.value.role.trim().length > 0 &&
    Object.keys(errors.value).length === 0
  );
});

// Validate on input
watch(formData, validateForm, { deep: true });

const handleSubmit = () => {
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
        role: "user",
        first_name: "",
        last_name: "",
      };
      errors.value = {};
    }
  }
);
</script>
