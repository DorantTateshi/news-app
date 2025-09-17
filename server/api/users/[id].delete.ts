import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    // Get the user ID from the route parameters
    const { id } = getRouterParams(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "User ID is required",
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

    // Check if user exists before attempting deletion
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("id", id)
      .single();

    if (profileError && profileError.code === "PGRST116") {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    if (profileError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error checking user existence",
      });
    }

    // Delete the user from auth.users (this will cascade to profiles due to foreign key)
    const { error: deleteError } = await client.auth.admin.deleteUser(id);

    if (deleteError) {
      console.error("Error deleting user from auth:", deleteError);
      throw createError({
        statusCode: 400,
        statusMessage: deleteError.message || "Failed to delete user",
      });
    }

    // Return success response
    return {
      success: true,
      message: `User ${profile.first_name} ${profile.last_name} has been deleted successfully`,
    };
  } catch (error) {
    console.error("Error in delete user API:", error);

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
