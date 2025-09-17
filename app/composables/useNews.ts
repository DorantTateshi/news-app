import { ref, readonly, type Ref } from "vue";
import type { News, NewsForm } from "../types";

export const useNews = () => {
  const news: Ref<News[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const supabase = useSupabaseClient();

  const fetchNews = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      news.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error fetching news:", err);
    } finally {
      loading.value = false;
    }
  };

  const createNews = async (newsData: NewsForm) => {
    try {
      loading.value = true;
      error.value = null;

      // Get current user ID - in a real app, this would come from auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const newsWithAuthor = {
        ...newsData,
        created_by: user.id,
      };

      const { data, error: createError } = await (supabase as any)
        .from("news")
        .insert([newsWithAuthor])
        .select("*")
        .single();

      if (createError) {
        throw createError;
      }

      // Add the new news item to the local state
      if (data) {
        news.value.unshift(data);
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating news:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateNews = async (id: string, newsData: NewsForm) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: updateError } = await (supabase as any)
        .from("news")
        .update(newsData)
        .eq("id", id)
        .select("*")
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update the news item in local state
      if (data) {
        const index = news.value.findIndex((item) => item.id === id);
        if (index !== -1) {
          news.value[index] = data;
        }
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error updating news:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from("news")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove the news item from local state
      news.value = news.value.filter((item) => item.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error deleting news:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    news: readonly(news),
    loading: readonly(loading),
    error: readonly(error),
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
  };
};
