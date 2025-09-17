<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Email Field -->
    <div>
      <Label for="email">Email *</Label>
      <Input
        id="email"
        v-model="formData.email"
        type="email"
        placeholder="user@example.com"
        required
        :disabled="!!initialData || loading"
        :class="{ 'border-red-300': errors.email }"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">
        {{ errors.email }}
      </p>
      <p v-if="!!initialData" class="mt-1 text-sm text-gray-500">
        Email cannot be changed after user creation
      </p>
    </div>

    <!-- Password Field (only for new users) -->
    <div v-if="!initialData">
      <Label for="password">Password *</Label>
      <Input
        id="password"
        v-model="formData.password"
        type="password"
        placeholder="Minimum 6 characters"
        required
        :disabled="loading"
        :class="{ 'border-red-300': errors.password }"
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">
        {{ errors.password }}
      </p>
    </div>

    <!-- First Name Field -->
    <div>
      <Label for="firstName">First Name *</Label>
      <Input
        id="firstName"
        v-model="formData.first_name"
        type="text"
        placeholder="John"
        required
        :disabled="loading"
        :class="{ 'border-red-300': errors.first_name }"
      />
      <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">
        {{ errors.first_name }}
      </p>
    </div>

    <!-- Last Name Field -->
    <div>
      <Label for="lastName">Last Name *</Label>
      <Input
        id="lastName"
        v-model="formData.last_name"
        type="text"
        placeholder="Doe"
        required
        :disabled="loading"
        :class="{ 'border-red-300': errors.last_name }"
      />
      <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">
        {{ errors.last_name }}
      </p>
    </div>

    <!-- Role Field -->
    <div>
      <Label for="role">Role *</Label>
      <select
        id="role"
        v-model="formData.role"
        required
        :disabled="loading"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        :class="{ 'border-red-300': errors.role }"
      >
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
      <p v-if="errors.role" class="mt-1 text-sm text-red-600">
        {{ errors.role }}
      </p>
      <div class="mt-2 text-sm text-gray-600">
        <div class="space-y-1">
          <p>
            <span class="font-medium">User:</span> Can view published content
          </p>
          <p>
            <span class="font-medium">Moderator:</span> Can create and edit
            content
          </p>
          <p>
            <span class="font-medium">Admin:</span> Full access to all features
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="generalError"
      class="bg-red-50 border border-red-200 rounded-md p-4"
    >
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ generalError }}
          </div>
        </div>
      </div>
    </div>


    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        :disabled="loading || !isFormValid"
        :title="!isFormValid ? 'Please fill all required fields' : ''"
        class="min-w-[100px]"
      >
        <span v-if="loading" class="flex items-center">
          <div
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
          ></div>
          {{ initialData ? "Updating..." : "Creating..." }}
        </span>
        <span v-else>
          {{ initialData ? "Update User" : "Create User" }}
        </span>
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { UserWithProfile, UserForm } from "~/types";
import { userFormSchema } from "~/lib/validations";

interface Props {
  initialData?: UserWithProfile;
  loading?: boolean;
}

interface Emits {
  (e: "submit", data: UserForm): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Form data
const formData = ref<UserForm>({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  role: "user",
});

// Validation errors
const errors = ref<Record<string, string>>({});
const generalError = ref<string>("");

// Initialize form data when props change
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = {
      email: newData.email,
      password: "", // Always empty for edit mode
      first_name: newData.first_name || "",
      last_name: newData.last_name || "",
      role: newData.role || "user",
    };
  } else {
    // Reset for new user
    formData.value = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "user",
    };
  }
}, { immediate: true });

// Simple form validation - just check if basic fields are filled
const isFormValid = computed(() => {
  const hasRequiredFields =
    formData.value.email.trim().length > 0 &&
    formData.value.first_name.trim().length > 0 &&
    formData.value.last_name.trim().length > 0 &&
    formData.value.role;

  // For new users, password is required
  if (!props.initialData) {
    return hasRequiredFields && formData.value.password && formData.value.password.length >= 6;
  }

  return hasRequiredFields;
});

// Validate form on input
const validateForm = () => {
  try {
    errors.value = {};
    generalError.value = "";

    // For new users, require password
    if (!props.initialData) {
      const formWithRequiredPassword = {
        ...formData.value,
        password: formData.value.password || "" // Ensure password is not undefined
      };

      // Check password length manually since Zod schema has it as optional
      if (!formWithRequiredPassword.password || formWithRequiredPassword.password.length < 6) {
        errors.value.password = "Password must be at least 6 characters";
        return;
      }

      userFormSchema.parse(formWithRequiredPassword);
    } else {
      // For existing users, password is optional
      userFormSchema.parse(formData.value);
    }
  } catch (error: any) {
    console.log("Validation error:", error);
    if (error.errors) {
      error.errors.forEach((err: any) => {
        errors.value[err.path[0]] = err.message;
      });
    }
  }
};

// Only validate on submit, not on every input change
// watch(formData, validateForm, { deep: true });

// Handle form submission
const handleSubmit = async () => {
  try {
    validateForm();

    if (Object.keys(errors.value).length > 0) {
      return;
    }

    emit("submit", formData.value);
  } catch (error) {
    generalError.value =
      error instanceof Error ? error.message : "An error occurred";
  }
};
</script>
