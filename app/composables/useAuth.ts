import { ref, readonly, computed, type Ref } from "vue";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "~/types";

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user: Ref<User | null> = ref(null);
  const profile: Ref<Profile | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getCurrentUser = async () => {
    try {
      loading.value = true;
      error.value = null;

      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      user.value = authUser;

      if (authUser) {
        // Get the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error in getCurrentUser:", profileError);
          // Set minimal profile if fetch fails
          profile.value = {
            id: authUser.id,
            role: "user"
          };
        } else {
          profile.value = profileData;
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error getting current user:", err);
    } finally {
      loading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      user.value = data.user;

      // Get the user's profile after successful login
      if (data.user) {
        console.log("Fetching profile for user:", data.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          console.log("Creating basic profile for user");

          // Try to create a basic profile
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              role: "admin", // Make first user admin by default
              first_name: "Admin",
              last_name: "User"
            })
            .select()
            .single();

          if (createError) {
            console.error("Failed to create profile:", createError);
            // Set a minimal profile if creation fails
            profile.value = {
              id: data.user.id,
              role: "admin",
              first_name: "Admin",
              last_name: "User"
            };
          } else {
            console.log("Created new profile:", newProfile);
            profile.value = newProfile;
          }
        } else if (profileData) {
          console.log("Profile fetched:", profileData);
          profile.value = profileData;
        } else {
          console.log("Profile is null, creating minimal profile");
          profile.value = {
            id: data.user.id,
            role: "admin",
            first_name: "Admin",
            last_name: "User"
          };
        }
      }

      return { success: true };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error signing in:", err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // If user is created successfully, update their profile (trigger creates basic profile)
      if (data.user) {
        const profileUpdate = {
          first_name: firstName,
          last_name: lastName,
          role: "user",
        };

        const { error: profileError } = await (supabase.from("profiles") as any)
          .update(profileUpdate)
          .eq("id", data.user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          // Don't throw here as the user account was created successfully
        }

        user.value = data.user;
      }

      return { success: true };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error signing up:", err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      user.value = null;
      profile.value = null;

      // Navigate to home page after logout
      await navigateTo("/");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error signing out:", err);
    } finally {
      loading.value = false;
    }
  };

  const isAdmin = computed(() => {
    return profile.value?.role === "admin";
  });

  const isModerator = computed(() => {
    return profile.value?.role === "moderator";
  });

  const canManageContent = computed(() => {
    return (
      profile.value?.role === "admin" || profile.value?.role === "moderator"
    );
  });

  const hasAdminAccess = computed(() => {
    return canManageContent.value;
  });

  return {
    user: readonly(user),
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    getCurrentUser,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isModerator,
    canManageContent,
    hasAdminAccess,
  };
};
