<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Statistics</h1>
      <p class="mt-2 text-gray-600">
        Overview of your news blog performance and analytics.
      </p>
    </div>

    <!-- Main Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <UsersIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.totalUsers }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <NewspaperIcon class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Published News</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.publishedNews }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <DocumentTextIcon class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Draft News</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ statistics.draftNews }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <FolderIcon class="w-6 h-6 text-purple-600" />
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
    </div>

    <!-- Detailed Statistics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- News by Category -->
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">News by Category</h3>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">{{
                  category.name
                }}</span>
              </div>
              <span class="text-sm text-gray-600">
                {{ getNewsCountByCategory(category.id) }} articles
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- News by Status -->
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">News by Status</h3>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">Published</span>
              </div>
              <span class="text-sm text-gray-600"
                >{{ statistics.publishedNews }} articles</span
              >
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">Draft</span>
              </div>
              <span class="text-sm text-gray-600"
                >{{ statistics.draftNews }} articles</span
              >
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">Archived</span>
              </div>
              <span class="text-sm text-gray-600">
                {{
                  statistics.totalNews -
                  statistics.publishedNews -
                  statistics.draftNews
                }}
                articles
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">Recent Users</h3>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="user in statistics.recentUsers"
              :key="user.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-sm text-gray-600">{{ user.email }}</p>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                "
              >
                {{ user.role }}
              </span>
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
          <div class="space-y-4">
            <div
              v-for="article in statistics.recentNews"
              :key="article.id"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <h4 class="font-medium text-gray-900 mb-1">
                {{ article.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-2">{{ article.excerpt }}</p>
              <div class="flex items-center justify-between">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    article.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  "
                >
                  {{ article.status }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(article.publishedAt) }}
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
  NewspaperIcon,
  DocumentTextIcon,
  FolderIcon,
} from "@heroicons/vue/24/outline";
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

// @ts-ignore
const { statistics, categories, news } = useMockData();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getNewsCountByCategory = (categoryId: string) => {
  return news.filter((article: any) => article.categoryId === categoryId)
    .length;
};
</script>
