<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Completing Sign In...
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Please wait while we verify your authentication.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const { getCurrentUser } = useAuth();

onMounted(async () => {
  try {
    // Wait for auth callback to process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get current user to update auth state
    await getCurrentUser();

    // Redirect to intended destination or admin
    const redirectTo = (route.query.redirect as string) || "/admin";
    await navigateTo(redirectTo);
  } catch (error) {
    console.error("Auth callback error:", error);
    await navigateTo("/auth/login?error=callback_failed");
  }
});
</script>
