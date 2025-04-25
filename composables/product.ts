import { ref, computed, watchEffect } from "vue";
import axios from "axios";

export function useProduct() {
  const error = ref<string | null>(null);
  const toast = useToast();
  const loading = ref(false);
  const config = useRuntimeConfig();

  const maxPageButtons = 4;
  const pageSize = 10;
  const currentPage = ref<number>(1);
  const totalRecords = ref<number>(0);

  const product = ref<any[]>([]);
  const searchText = ref<string>("");
  const findText = ref<string>("");
  const productId = ref<number>(0);


  const fetchProduct = async () => {
    loading.value = true;
    error.value = null;
    let url = `${config.public.apiBaseUrl}/api/v1/product?pageNumber=${currentPage.value}`;
  
    if (searchText.value) {
      url = `${config.public.apiBaseUrl}/api/v1/product/search?searchText=${encodeURIComponent(searchText.value)}&pageNumber=${currentPage.value}`;
    } else if (findText.value) {
      url = `${config.public.apiBaseUrl}/api/v1/product/find?text=${encodeURIComponent(findText.value)}`;
    }
  
    try {
      const response = await axios.get(url);
      const data = response.data;
  
      if (searchText.value || findText.value) {
        product.value = Array.isArray(data.content) ? data.content : [];
      } else {
        totalRecords.value = data.totalRecords;
        product.value = data.content;
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      error.value = "Failed to fetch data";
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (productId: string | number) => {
    try {
      await axios.delete(`${config.public.apiBaseUrl}/api/v1/product/delete?productId=${(productId)}`);
      toast.add({ title: "Successfully deleted Product!" });
  
      window.location.reload();
    } catch (error) {
      toast.add({ title: 'error', description: 'Failed to delete.' });
    }
  };
  

  watchEffect(() => {
    if (searchText.value !== '') {
        fetchProduct();
    }

    fetchProduct();
  });

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchProduct();
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

  const showModal = ref(false)
  const selectedProductId = ref('')
  const modalMode = ref('view')

  const viewProductById = (ids: string[]) => {
    if (ids.length !== 1) return
    selectedProductId.value = ids[0]
    modalMode.value = 'view'
    showModal.value = true
  }

  const editProductById = (ids: string[]) => {
    if (ids.length !== 1) return
    selectedProductId.value = ids[0]
    modalMode.value = 'edit'
    showModal.value = true
  }
  const router = useRouter();
  const selectedProducts = ref<string[]>([])
  const selectAll = ref(false);
  const indeterminate = ref(false);
  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedProducts.value = product.value.map((product) => product.productId);
    } else {
      selectedProducts.value = [];
    }
  };
  
  const toggleProduct = (id: string) => {
    const index = selectedProducts.value.indexOf(id)
    if (index > -1) {
      selectedProducts.value.splice(index, 1)
    } else {
      selectedProducts.value.push(id)
    }
  }

  watch(selectedProducts, (newVal) => {
    if (newVal.length === 0) {
      selectAll.value = false;
      indeterminate.value = false;
    } else if (newVal.length === product.value.length) {
      selectAll.value = true;
      indeterminate.value = false;
    } else {
      selectAll.value = false;
      indeterminate.value = true;
    }
  });

  const deleteProductsByIds = (productIds: string[]) => {
    try {
      const res = axios.delete(`${config.public.apiBaseUrl}/api/v1/product/delete?productId=${productIds.join(',')}`);
      toast.add({ title: 'Product deleted successfully!' });
      selectedProducts.value = [];
      router.push({ path: '/inventory/product' });
    } catch (err) {
      toast.add({ title: 'Failed to delete product' });
    }
  };

  

  return {
    product,
    error,
    searchText,
    findText,
    currentPage,
    totalRecords,
    totalPages,
    paginatedPages,
    fetchProduct,
    changePage,
    formatDate,
    deleteProduct,
    deleteProductsByIds,
    showModal,
    selectedProductId,
    modalMode,
    viewProductById,
    editProductById,
    loading,
    selectAll,
    indeterminate,
    toggleSelectAll,
    toggleProduct,
    selectedProducts,
  };
}
