<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p class="mt-2 text-gray-600">
            View and manage user accounts with their roles and profile
            information.
          </p>
        </div>
        <Button @click="openCreateModal" :disabled="loading">
          <PlusIcon class="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && users.length === 0" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
    >
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <Card v-if="!loading || users.length > 0">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{
                        user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : "No name set"
                      }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ user.id.substring(0, 8) }}...
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getRoleColor(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{
                    user.created_at ? formatDate(user.created_at) : "Unknown"
                  }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openEditModal(user)"
                      :disabled="loading"
                    >
                      Edit
                    </Button>
                    <Button
                      v-if="user.role === 'user'"
                      variant="outline"
                      size="sm"
                      @click="promoteUser(user, 'moderator')"
                      :disabled="loading"
                      class="text-blue-600 hover:text-blue-700"
                    >
                      Promote
                    </Button>
                    <Button
                      v-if="user.role === 'moderator'"
                      variant="outline"
                      size="sm"
                      @click="promoteUser(user, 'admin')"
                      :disabled="loading"
                      class="text-purple-600 hover:text-purple-700"
                    >
                      To Admin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      class="text-red-600 hover:text-red-700"
                      @click="confirmDelete(user)"
                      :disabled="loading"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <div
      v-if="!loading && users.length === 0 && !error"
      class="text-center py-12"
    >
      <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p class="text-gray-600 mb-4">
        Get started by creating your first user account.
      </p>
      <Button @click="openCreateModal">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create User
      </Button>
    </div>

    <!-- Create/Edit Modal -->
    <Modal
      :is-open="showModal"
      :title="editingUser ? 'Edit User' : 'Create User'"
      @close="closeModal"
    >
      <UserFormComponent
        :initial-data="editingUser"
        :loading="formLoading"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline";
import { ref, onMounted } from "vue";
import type { UserWithProfile, UserForm } from "../../types";
import { useUsers } from "../../composables/useUsers";
import UserFormComponent from "../../components/forms/UserForm.vue";
import Modal from "../../components/ui/Modal.vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const {
  users,
  loading: usersLoading,
  error,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  promoteUser: promoteUserRole,
} = useUsers();

const showModal = ref(false);
const editingUser = ref<UserWithProfile | undefined>(undefined);
const formLoading = ref(false);
const loading = ref(false);

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const getRoleColor = (role: string | undefined) => {
  const colors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    moderator: "bg-purple-100 text-purple-800",
    user: "bg-gray-100 text-gray-800",
  };
  return colors[role || ""] || "bg-gray-100 text-gray-800";
};

const openCreateModal = () => {
  editingUser.value = undefined;
  showModal.value = true;
};

const openEditModal = (user: UserWithProfile) => {
  editingUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingUser.value = undefined;
};

const handleSubmit = async (data: UserForm) => {
  try {
    formLoading.value = true;

    if (editingUser.value) {
      // For editing, we only update the profile fields (not email/password)
      await updateUser(editingUser.value.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      });
    } else {
      // For creating, we use all the fields including email and password
      await createUser({
        email: data.email,
        password: data.password!,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      });

      // Refresh the users list after creating a new user
      await getUsers();
    }

    closeModal();
  } catch (err) {
    console.error("Error submitting form:", err);
  } finally {
    formLoading.value = false;
  }
};

const promoteUser = async (
  user: UserWithProfile,
  newRole: "admin" | "moderator" | "user"
) => {
  const confirmMessage = `Are you sure you want to promote "${user.first_name} ${user.last_name}" to ${newRole}?`;

  if (confirm(confirmMessage)) {
    try {
      await promoteUserRole(user.id, newRole);
    } catch (err) {
      console.error("Error promoting user:", err);
    }
  }
};

const confirmDelete = async (user: UserWithProfile) => {
  const userName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email;

  if (
    confirm(
      `Are you sure you want to delete "${userName}"? This will permanently delete their account and all associated data. This action cannot be undone.`
    )
  ) {
    try {
      await deleteUser(user.id);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
};

// Fetch users on component mount
onMounted(() => {
  getUsers();
});
</script>
