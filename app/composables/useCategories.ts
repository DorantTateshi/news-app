import { ref, readonly, type Ref } from "vue";
import type { Category, CategoryForm } from "~/types";

export const useCategories = () => {
  const categories: Ref<Category[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const supabase = useSupabaseClient();

  const fetchCategories = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      categories.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error fetching categories:", err);
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (categoryData: CategoryForm) => {
    try {
      loading.value = true;
      error.value = null;

      console.log("Creating category with data:", categoryData);
      const userResponse = await supabase.auth.getUser();
      console.log("Current user:", userResponse);

      const { data, error: createError } = await supabase
        .from("categories")
        .insert([categoryData])
        .select()
        .single();

      console.log("Insert response:", { data, error: createError });

      if (createError) {
        throw createError;
      }

      // Add the new category to the local state
      if (data) {
        categories.value.unshift(data);
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating category:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id: string, categoryData: CategoryForm) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: updateError } = await (supabase as any)
        .from("categories")
        .update(categoryData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update the category in local state
      if (data) {
        const index = categories.value.findIndex((cat) => cat.id === id);
        if (index !== -1) {
          categories.value[index] = data;
        }
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error updating category:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove the category from local state
      categories.value = categories.value.filter((cat) => cat.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error deleting category:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
