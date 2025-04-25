import { ref, computed, watchEffect } from "vue";
import axios from "axios";

export function useCategory() {
  const error = ref<string | null>(null);
  const toast = useToast();
  const loading = ref(false);
  const config = useRuntimeConfig();

  const category = ref<any[]>([]);
  const categoryId = ref<number>(0);
  const maxPageButtons = 4;
  const pageSize = 10;
  const currentPage = ref<number>(1);
  const totalRecords = ref<number>(0);

  const fetchCategory = async () => {
    loading.value = true;
    error.value = null;
      let url = `${config.public.apiBaseUrl}/api/v1/category?pageNumber=${currentPage.value}`;
    
      try {
          const response = await axios.get(url);
          const data = response.data;
          category.value = data.content; 
          totalRecords.value = data.totalRecords;
      } catch (err) {
          console.error("Fetch Error:", err);
          error.value = "Failed to fetch data";
      } finally {
          loading.value = false;
      }
  };

  watchEffect(() => {
    fetchCategory();
  });

  const deleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`${config.public.apiBaseUrl}/api/v1/category/delete?categoryId=${(categoryId)}`);
      toast.add({ title: "Successfully deleted category!" });
  
      window.location.reload();
    } catch (error) {
      toast.add({ title: "Failed to delete category!" });
      console.error("Delete Error:", error);
    }
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchCategory();
  };

  const totalPages = computed(() => {
    return totalRecords.value > 0 ? Math.ceil(totalRecords.value / pageSize) : 1;
  });

  const paginatedPages = computed(() => {
    const pages = [];
    let startPage = Math.max(currentPage.value - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages.value);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }
    return pages;
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return "-";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const router = useRouter();
  const selectedCategory = ref<string[]>([])
  const selectAll = ref(false);
  const indeterminate = ref(false);
  
  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedCategory.value = category.value.map((category) => category.categoryId);
    } else {
      selectedCategory.value = [];
    }
  };
  
  const toggleProduct = (id: string) => {
    const index = selectedCategory.value.indexOf(id)
    if (index > -1) {
      selectedCategory.value.splice(index, 1)
    } else {
      selectedCategory.value.push(id)
    }
  }

  watch(selectedCategory, (newVal) => {
    if (newVal.length === 0) {
      selectAll.value = false;
      indeterminate.value = false;
    } else if (newVal.length === category.value.length) {
      selectAll.value = true;
      indeterminate.value = false;
    } else {
      selectAll.value = false;
      indeterminate.value = true;
    }
  });

  const viewCategoryById = (selectedCategory: string[]) => {
    if (selectedCategory.length !== 1) {
      toast.add({ title: "Please select only one product!" })
      return;
    } else {
      router.push(`/inventory/category/view/${selectedCategory[0]}`);
    }
  };

  const editCategoryById = (selectedCategory: string[]) => {
    if (selectedCategory.length !== 1) {
      toast.add({ title: "Please select only one category!" })
      return;
    } else {
      router.push(`/inventory/category/edit/${selectedCategory[0]}`);
    }
  };

  const deleteCategoriesByIds = (categorytIds: string[]) => {
    console.log(`Deleting category with IDs: ${categorytIds.join(', ')}`);
  };

  return {
    category,
    loading,
    changePage,
    currentPage,
    totalRecords,
    totalPages,
    paginatedPages,
    categoryId,
    fetchCategory,
    error,
    formatDate,
    deleteCategory,
    deleteCategoriesByIds,
    selectAll,
    indeterminate,
    toggleSelectAll,
    toggleProduct,
    selectedCategory,
    viewCategoryById,
    editCategoryById,
    config,
    toast,
  };
}
