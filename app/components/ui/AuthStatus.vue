<template>
  <div class="inline-flex items-center space-x-2">
    <template v-if="loading">
      <div
        class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
      ></div>
      <span class="text-sm text-gray-600">Loading...</span>
    </template>
    <template v-else-if="user">
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-xs font-medium">
            {{ initials }}
          </span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-900">
            {{ displayName }}
          </span>
          <span class="text-xs text-gray-500 capitalize">
            {{ profile?.role || "user" }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <span class="text-sm text-gray-600">Not signed in</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { user, profile, loading } = useAuth();

const displayName = computed(() => {
  if (profile.value?.first_name && profile.value?.last_name) {
    return `${profile.value.first_name} ${profile.value.last_name}`;
  }
  if (profile.value?.first_name) {
    return profile.value.first_name;
  }
  return user.value?.email || "Unknown User";
});

const initials = computed(() => {
  if (profile.value?.first_name && profile.value?.last_name) {
    return `${profile.value.first_name[0]}${profile.value.last_name[0]}`.toUpperCase();
  }
  if (profile.value?.first_name) {
    return profile.value.first_name[0]?.toUpperCase();
  }
  if (user.value?.email) {
    return user.value.email[0]?.toUpperCase();
  }
  return "?";
});
</script>
