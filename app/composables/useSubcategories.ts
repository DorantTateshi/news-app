import { ref, readonly, type Ref } from "vue";
import type { Subcategory, SubcategoryForm } from "~/types";

export const useSubcategories = () => {
  const subcategories: Ref<Subcategory[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const supabase = useSupabaseClient() as any;

  const fetchSubcategories = async (categoryId?: string) => {
    try {
      loading.value = true;
      error.value = null;

      let query = supabase
        .from("subcategories")
        .select("*")
        .order("name", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      subcategories.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error fetching subcategories:", err);
    } finally {
      loading.value = false;
    }
  };

  const createSubcategory = async (subcategoryData: SubcategoryForm) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: createError } = await supabase
        .from("subcategories")
        .insert([subcategoryData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Add the new subcategory to the local state
      if (data) {
        subcategories.value.unshift(data);
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating subcategory:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSubcategory = async (
    id: string,
    subcategoryData: SubcategoryForm
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: updateError } = await supabase
        .from("subcategories")
        .update(subcategoryData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update the subcategory in local state
      if (data) {
        const index = subcategories.value.findIndex((sub) => sub.id === id);
        if (index !== -1) {
          subcategories.value[index] = data;
        }
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error updating subcategory:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSubcategory = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { error: deleteError } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove the subcategory from local state
      subcategories.value = subcategories.value.filter((sub) => sub.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
      console.error("Error deleting subcategory:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    subcategories: readonly(subcategories),
    loading: readonly(loading),
    error: readonly(error),
    fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
};
