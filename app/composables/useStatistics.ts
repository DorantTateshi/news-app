import { ref, readonly, type Ref } from "vue";
import type { News } from "~/types";

interface Statistics {
  totalProfiles: number;
  totalCategories: number;
  totalSubcategories: number;
  totalNews: number;
  adminCount: number;
  moderatorCount: number;
  userCount: number;
}

export const useStatistics = () => {
  const supabase = useSupabaseClient();
  const statistics: Ref<Statistics> = ref({
    totalProfiles: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalNews: 0,
    adminCount: 0,
    moderatorCount: 0,
    userCount: 0,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchStatistics = async () => {
    try {
      loading.value = true;
      error.value = null;

      // Fetch all statistics in parallel
      const [
        { count: profilesCount, error: profilesError },
        { count: categoriesCount, error: categoriesError },
        { count: subcategoriesCount, error: subcategoriesError },
        { count: newsCount, error: newsError },
        { count: adminCount, error: adminError },
        { count: moderatorCount, error: moderatorError },
        { count: userCount, error: userError },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase
          .from("subcategories")
          .select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "moderator"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "user"),
      ]);

      // Check for errors
      if (
        profilesError ||
        categoriesError ||
        subcategoriesError ||
        newsError ||
        adminError ||
        moderatorError ||
        userError
      ) {
        throw new Error("Failed to fetch some statistics");
      }

      statistics.value = {
        totalProfiles: profilesCount || 0,
        totalCategories: categoriesCount || 0,
        totalSubcategories: subcategoriesCount || 0,
        totalNews: newsCount || 0,
        adminCount: adminCount || 0,
        moderatorCount: moderatorCount || 0,
        userCount: userCount || 0,
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error fetching statistics:", err);
    } finally {
      loading.value = false;
    }
  };

  const getNewsByCategory = async () => {
    try {
      // First get all news with category_id
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("category_id")
        .order("category_id");

      if (newsError) throw newsError;

      // Then get all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name");

      if (categoriesError) throw categoriesError;

      // Create a map of category_id to name
      const categoryMap =
        categoriesData?.reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {}) || {};

      // Group news by category
      const grouped = newsData?.reduce((acc: any, item: any) => {
        const categoryName = categoryMap[item.category_id] || "Unknown";
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      return grouped || {};
    } catch (err) {
      console.error("Error fetching news by category:", err);
      return {};
    }
  };

  const getRecentProfiles = async (limit = 5) => {
    try {
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select("*")
        .order("id", { ascending: false })
        .limit(limit);

      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      console.error("Error fetching recent profiles:", err);
      return [];
    }
  };

  const getRecentNews = async (limit = 5) => {
    try {
      const { data, error: queryError } = await supabase
        .from("news")
        .select(`
          *,
          categories(name)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      console.error("Error fetching recent news:", err);
      return [];
    }
  };

  return {
    statistics: readonly(statistics),
    loading: readonly(loading),
    error: readonly(error),
    fetchStatistics,
    getNewsByCategory,
    getRecentProfiles,
    getRecentNews,
  };
};
