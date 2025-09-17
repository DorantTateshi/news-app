import { ref, readonly, type Ref } from "vue";
import type { UserWithProfile, UserUpdateData } from "~/types";

export const useUsers = () => {
  const users: Ref<UserWithProfile[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const supabase = useSupabaseClient();

  /**
   * Get all users with their profiles via server API
   */
  const getUsers = async () => {
    try {
      loading.value = true;
      error.value = null;

      console.log("Fetching users...");

      // Call server API to get users with email data
      const response = await $fetch<{
        success: boolean;
        users?: UserWithProfile[];
        message?: string;
      }>("/api/users", {
        method: "GET",
      });

      if (!response.success || !response.users) {
        throw new Error(response.message || "Failed to fetch users");
      }

      users.value = response.users;
      console.log("Users fetched:", response.users);

    } catch (err) {
      // Fallback to profiles-only if API fails
      console.warn("API failed, falling back to profiles-only:", err);

      try {
        const { data: profilesData, error: fetchError } = await supabase
          .from("profiles")
          .select("id, role, first_name, last_name")
          .order("first_name", { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        users.value = (profilesData || []).map((profile: any) => ({
          id: profile.id,
          role: profile.role || "user",
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: "Email not available", // Placeholder when API fails
          created_at: new Date().toISOString(),
        }));

      } catch (fallbackErr) {
        error.value = fallbackErr instanceof Error ? fallbackErr.message : "An error occurred";
        console.error("Error fetching users:", fallbackErr);
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update a user's profile (role, name, etc.)
   */
  const updateUser = async (id: string, updates: UserUpdateData) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: updateError } = await (supabase as any)
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update the user in local state
      if (data) {
        const userIndex = users.value.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
          const currentUser = users.value[userIndex];
          if (currentUser) {
            users.value[userIndex] = {
              id: currentUser.id,
              email: currentUser.email,
              created_at: currentUser.created_at,
              first_name: updates.first_name ?? currentUser.first_name,
              last_name: updates.last_name ?? currentUser.last_name,
              role: updates.role ?? currentUser.role,
            };
          }
        }
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error updating user:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Promote a user to a specific role
   */
  const promoteUser = async (
    id: string,
    role: "admin" | "moderator" | "user"
  ) => {
    return updateUser(id, { role });
  };

  /**
   * Delete a user (both auth.users and profiles)
   * This calls our server API which uses the service role
   */
  const deleteUser = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Call our server API to delete the user
      const response = await $fetch<{ success: boolean; message?: string }>(
        `/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        throw new Error("Failed to delete user");
      }

      // Remove user from local state
      users.value = users.value.filter((user) => user.id !== id);

      return { success: true };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new user account via server API
   * This avoids session conflicts by using server-side admin API
   */
  const createUser = async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: "admin" | "moderator" | "user";
  }) => {
    try {
      loading.value = true;
      error.value = null;

      console.log("Creating user via API:", userData.email);

      // Call server API to create user
      const response = await $fetch<{
        success: boolean;
        user?: UserWithProfile;
        message?: string;
      }>("/api/users", {
        method: "POST",
        body: userData,
      });

      if (!response.success || !response.user) {
        throw new Error(response.message || "Failed to create user");
      }

      // Add new user to local state
      users.value.unshift(response.user);

      console.log("User successfully created:", response.user);
      return response.user;

    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating user:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    getUsers,
    updateUser,
    promoteUser,
    deleteUser,
    createUser,
  };
};
