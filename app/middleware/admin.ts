export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getCurrentUser, hasAdminAccess, user, profile } = useAuth();

  try {
    await getCurrentUser();

    if (!user.value) {
      console.log("Admin middleware: No user found, redirecting to login");
      return await navigateTo(
        `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
      );
    }

    if (!profile.value) {
      console.log("Admin middleware: Profile not loaded, redirecting to login");
      return await navigateTo(
        `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
      );
    }

    console.log("Admin middleware: Profile loaded:", profile.value);
    console.log("Admin middleware: Has admin access:", hasAdminAccess.value);

    if (!hasAdminAccess.value) {
      console.log("Admin middleware: Access denied for role:", profile.value.role);
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied. Admin privileges required.",
      });
    }

    console.log("Admin middleware: Access granted");
  } catch (error) {
    console.error("Admin middleware error:", error);
    return await navigateTo(
      `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
    );
  }
});
