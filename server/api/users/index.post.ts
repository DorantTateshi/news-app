import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event);
    const { email, password, first_name, last_name, role = "user" } = body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Email, password, first name, and last name are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid email format",
      });
    }

    // Validate role
    if (!["admin", "moderator", "user"].includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid role. Must be admin, moderator, or user",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "Password must be at least 6 characters long",
      });
    }

    // Create Supabase client with service role key for admin operations
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-only key for admin operations
    );

    // Verify the service role key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: "Service role key not configured",
      });
    }

    // Create user in auth.users
    const { data: authData, error: authError } =
      await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for admin-created users
      });

    if (authError) {
      console.error("Error creating user in auth:", authError);
      throw createError({
        statusCode: 400,
        statusMessage: authError.message || "Failed to create user account",
      });
    }

    if (!authData.user) {
      throw createError({
        statusCode: 500,
        statusMessage: "User creation failed - no user data returned",
      });
    }

    // Update the user's profile with the provided information
    const { data: profileData, error: profileError } = await client
      .from("profiles")
      .update({
        first_name,
        last_name,
        role,
      })
      .eq("id", authData.user.id)
      .select()
      .single();

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Try to clean up the auth user if profile update fails
      await client.auth.admin.deleteUser(authData.user.id);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user profile",
      });
    }

    // Return the complete user data
    const userData = {
      id: authData.user.id,
      email: authData.user.email!,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      role: profileData.role,
      created_at: authData.user.created_at,
    };

    return {
      success: true,
      user: userData,
      message: `User ${first_name} ${last_name} has been created successfully`,
    };
  } catch (error) {
    console.error("Error in create user API:", error);

    // If it's already an H3 error, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Otherwise, create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
