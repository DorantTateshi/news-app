<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="mt-2 text-gray-600">
        Welcome to the admin panel. Manage your news blog from here.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Statistics Cards -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <UsersIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Profiles</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.totalProfiles }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <FolderIcon class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Categories</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.totalCategories }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <FolderOpenIcon class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Subcategories</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.totalSubcategories }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <NewspaperIcon class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total News</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.totalNews }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Role Distribution -->
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">Role Distribution</h3>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span class="font-medium text-gray-900">Admins</span>
              </div>
              <span class="text-sm text-gray-600">{{
                statistics.adminCount
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span class="font-medium text-gray-900">Moderators</span>
              </div>
              <span class="text-sm text-gray-600">{{
                statistics.moderatorCount
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span class="font-medium text-gray-900">Users</span>
              </div>
              <span class="text-sm text-gray-600">{{
                statistics.userCount
              }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent News -->
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">Recent News</h3>
        </CardHeader>
        <CardContent>
          <div v-if="recentNews.length === 0" class="text-center py-8">
            <p class="text-gray-500">No news articles yet</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="article in recentNews"
              :key="article.id"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <h4 class="font-medium text-gray-900 mb-1">
                {{ article.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-2">
                {{ article.content.substring(0, 100) }}...
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">
                  {{ article.categories?.name || "Uncategorized" }}
                </span>
                <span class="text-xs text-gray-500">
                  {{
                    article.created_at
                      ? formatDate(article.created_at)
                      : "No date"
                  }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  FolderIcon,
  FolderOpenIcon,
  NewspaperIcon,
} from "@heroicons/vue/24/outline";
import { ref, onMounted } from "vue";
import { useStatistics } from "~/composables/useStatistics";
import type { News } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const { statistics, loading, error, fetchStatistics, getRecentNews } =
  useStatistics();
const recentNews = ref<News[]>([]);

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

onMounted(async () => {
  await fetchStatistics();
  recentNews.value = await getRecentNews(5);
});
</script>
