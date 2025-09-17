<template>
  <div class="w-full max-w-md mx-auto">
    <div
      class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-8"
    >
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Join us today! Create your account to get started.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              placeholder="John"
              class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              :class="{
                'border-red-500 focus:ring-red-500 focus:border-red-500':
                  errors.firstName,
              }"
              @blur="validateField('firstName')"
            />
            <p
              v-if="errors.firstName"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {{ errors.firstName }}
            </p>
          </div>

          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              placeholder="Doe"
              class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              :class="{
                'border-red-500 focus:ring-red-500 focus:border-red-500':
                  errors.lastName,
              }"
              @blur="validateField('lastName')"
            />
            <p
              v-if="errors.lastName"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {{ errors.lastName }}
            </p>
          </div>
        </div>

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
            placeholder="john.doe@example.com"
            class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.email,
            }"
            @blur="validateField('email')"
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
            placeholder="Enter your password"
            class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.password,
            }"
            @blur="validateField('password')"
          />
          <p
            v-if="errors.password"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.confirmPassword,
            }"
            @blur="validateField('confirmPassword')"
          />
          <p
            v-if="errors.confirmPassword"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.confirmPassword }}
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

        <div
          v-if="successMessage"
          class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
        >
          <p class="text-sm text-green-600 dark:text-green-400">
            {{ successMessage }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
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
            Creating Account...
          </span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { signupSchema, type SignupFormData } from "../../lib/validations";

interface Props {
  redirectTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: "/",
});

const emit = defineEmits<{
  success: [];
}>();

const { signUp, loading, error: authError } = useAuth();

const formData = reactive<SignupFormData>({
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
});

const errors = reactive<Partial<Record<keyof SignupFormData, string>>>({});
const successMessage = ref("");

const validateField = (field: keyof SignupFormData) => {
  // For confirmPassword, we need to validate the entire form to check password match
  if (field === "confirmPassword") {
    const result = signupSchema.safeParse(formData);
    if (result.success) {
      errors.confirmPassword = undefined;
    } else {
      const confirmPasswordError = result.error.issues.find((err: any) =>
        err.path.includes("confirmPassword")
      );
      errors.confirmPassword = confirmPasswordError?.message;
    }
  } else {
    const fieldSchema = signupSchema.shape[field];
    const result = fieldSchema.safeParse(formData[field]);
    if (result.success) {
      errors[field] = undefined;
    } else {
      errors[field] = result.error.issues[0]?.message;
    }
  }
};

const validateForm = () => {
  const result = signupSchema.safeParse(formData);
  if (result.success) {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof SignupFormData] = undefined;
    });
    return true;
  } else {
    result.error.issues.forEach((issue: any) => {
      const field = issue.path[0] as keyof SignupFormData;
      errors[field] = issue.message;
    });
    return false;
  }
};

const isFormValid = computed(() => {
  return (
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.firstName &&
    formData.lastName &&
    !Object.values(errors).some((error) => error)
  );
});

const handleSubmit = async () => {
  if (!validateForm()) return;

  const result = await signUp(
    formData.email,
    formData.password,
    formData.firstName,
    formData.lastName
  );

  if (result.success) {
    successMessage.value =
      "Account created successfully! Please check your email to verify your account.";
    emit("success");

    // Reset form
    Object.keys(formData).forEach((key) => {
      formData[key as keyof SignupFormData] = "";
    });

    // Redirect after a short delay
    setTimeout(() => {
      navigateTo(props.redirectTo);
    }, 3000);
  }
};
</script>
