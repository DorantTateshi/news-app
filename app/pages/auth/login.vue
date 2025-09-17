<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            NewsHub
          </h1>
        </NuxtLink>
      </div>

      <LoginForm @success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "~/components/forms/LoginForm.vue";

definePageMeta({
  layout: false,
});

const handleLoginSuccess = () => {
  console.log("Login successful");
};
</script>
