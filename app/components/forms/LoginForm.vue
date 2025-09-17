<template>
  <div class="w-full max-w-md mx-auto">
    <div
      class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-8"
    >
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Sign In
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            autocomplete="email"
            placeholder="Enter your email"
            class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.email,
            }"
          />
          <p
            v-if="errors.email"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.password,
            }"
          />
          <p
            v-if="errors.password"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.password }}
          </p>
        </div>

        <div
          v-if="authError"
          class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
        >
          <p class="text-sm text-red-600 dark:text-red-400">
            {{ authError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading || !canSubmit"
          class="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/auth/signup"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, nextTick } from "vue";
import { loginSchema, type LoginFormData } from "../../lib/validations";

interface Props {
  redirectTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: "/admin",
});

const emit = defineEmits<{
  success: [];
}>();

const { signIn, loading, error: authError } = useAuth();

const formData = reactive<LoginFormData>({
  email: "",
  password: "",
});

const errors = reactive<Partial<Record<keyof LoginFormData, string>>>({});

// Simple button enable/disable logic
const canSubmit = computed(() => {
  return !!(
    formData.email &&
    formData.password &&
    formData.email.trim() &&
    formData.password.trim()
  );
});

const validateForm = () => {
  // Clear previous errors
  errors.email = undefined;
  errors.password = undefined;

  const result = loginSchema.safeParse(formData);
  if (result.success) {
    return true;
  } else {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof LoginFormData;
      errors[field] = issue.message;
    });
    return false;
  }
};

const handleSubmit = async () => {
  console.log("Handle submit called with:", formData);

  if (!validateForm()) {
    console.log("Validation failed, errors:", errors);
    return;
  }

  console.log("Validation passed, calling signIn...");
  const result = await signIn(formData.email, formData.password);
  console.log("SignIn result:", result);

  if (result.success) {
    console.log("Login successful, emitting success and redirecting...");
    emit("success");

    // Add a small delay to ensure reactive state is updated
    await nextTick();

    // Get current auth state to verify
    const { user, profile, hasAdminAccess } = useAuth();
    console.log("Current user after login:", user.value);
    console.log("Current profile after login:", profile.value);
    console.log("Has admin access:", hasAdminAccess.value);

    // Check for redirect parameter in URL
    const route = useRoute();
    const redirectTo = (route.query.redirect as string) || props.redirectTo;
    console.log("Redirecting to:", redirectTo);

    // Use replace instead of push to avoid back button issues
    await navigateTo(redirectTo, { replace: true });
  } else {
    console.log("Login failed:", result.error);
  }
};
</script>
