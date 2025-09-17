import { ref, readonly, type Ref } from "vue";
import type { Profile, ProfileForm } from "~/types";

export const useProfiles = () => {
  const profiles: Ref<Profile[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const supabase = useSupabaseClient();

  const fetchProfiles = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .order("first_name", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      profiles.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error fetching profiles:", err);
    } finally {
      loading.value = false;
    }
  };

  const createProfile = async (profileData: ProfileForm) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: createError } = await (
        supabase.from("profiles") as any
      )
        .insert([profileData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Add the new profile to the local state
      if (data) {
        profiles.value.unshift(data);
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating profile:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (id: string, profileData: ProfileForm) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: updateError } = await (
        supabase.from("profiles") as any
      )
        .update(profileData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update the profile in local state
      if (data) {
        const index = profiles.value.findIndex((profile) => profile.id === id);
        if (index !== -1) {
          profiles.value[index] = data;
        }
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove the profile from local state
      profiles.value = profiles.value.filter((profile) => profile.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error deleting profile:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    profiles: readonly(profiles),
    loading: readonly(loading),
    error: readonly(error),
    fetchProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
  };
};
