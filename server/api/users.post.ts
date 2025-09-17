import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, first_name, last_name, role } = body;

    if (!email || !password || !first_name || !last_name) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields"
      });
    }

    const config = useRuntimeConfig(event);

    // Create Supabase client with service role
    const supabase = createClient(
      config.public.supabase.url,
      config.supabase.serviceKey
    );

    // Create user with admin API
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (userError) {
      throw createError({
        statusCode: 400,
        statusMessage: userError.message
      });
    }

    if (!userData.user) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user"
      });
    }

    // Wait for trigger to create profile, then update it
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name,
        last_name,
        role: role || "user"
      })
      .eq("id", userData.user.id)
      .select()
      .single();

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Continue anyway, user was created
    }

    return {
      success: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        first_name: profileData?.first_name || first_name,
        last_name: profileData?.last_name || last_name,
        role: profileData?.role || role || "user",
        created_at: userData.user.created_at
      }
    };

  } catch (error) {
    console.error("User creation error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error"
    });
  }
});