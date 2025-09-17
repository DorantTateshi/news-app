import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);

    // Create Supabase client with service role
    const supabase = createClient(
      config.public.supabase.url,
      config.supabase.serviceKey
    );

    // Get all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, role, first_name, last_name")
      .order("first_name", { ascending: true });

    if (profilesError) {
      throw createError({
        statusCode: 500,
        statusMessage: profilesError.message
      });
    }

    // Get auth users to get email data
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.warn("Could not fetch auth users:", authError);
    }

    // Create a map of auth users by ID
    const authUsersMap = new Map();
    if (authData?.users) {
      authData.users.forEach((user: any) => {
        authUsersMap.set(user.id, user);
      });
    }

    // Combine profile and auth data
    const users = (profilesData || []).map((profile: any) => {
      const authUser = authUsersMap.get(profile.id);
      return {
        id: profile.id,
        role: profile.role || "user",
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: authUser?.email || "Email not available",
        created_at: authUser?.created_at || new Date().toISOString(),
      };
    });

    return {
      success: true,
      users
    };

  } catch (error) {
    console.error("Get users error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error"
    });
  }
});