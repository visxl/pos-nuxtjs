import { ref, computed, watchEffect } from "vue";
import axios from "axios";

export function useOrderDetail() {
  const error = ref<string | null>(null);
  const toast = useToast();
  const loading = ref(false);
  const config = useRuntimeConfig();

  const maxPageButtons = 4;
  const pageSize = 10;
  const currentPage = ref<number>(1);
  const totalRecords = ref<number>(0);
  const orderDetail = ref<any[]>([]);


  const fetchOrderDetail = async () => {
    loading.value = true;
    error.value = null;
    let url = `${config.public.apiBaseUrl}/api/v1/orderItem?pageNumber=${currentPage.value}`;
  
    try {
      const response = await axios.get(url);
      const data = response.data;
      orderDetail.value = data.content;
      totalRecords.value = data.totalRecords;
    } catch (err) {
      console.error("Fetch Error:", err);
      error.value = "Failed to fetch data";
    } finally {
      loading.value = false;
    }
  };

  watchEffect(() => {
    fetchOrderDetail();
  });

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchOrderDetail();
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
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const router = useRouter();
  const selectedOrder = ref<string[]>([])
  const selectAll = ref(false);
  const indeterminate = ref(false);
  
  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedOrder.value = orderDetail.value.map((orderDetail) => orderDetail.id);
      } else {
        selectedOrder.value = [];
      }
  };

const toggleOrder = (id: string) => {
  const index = selectedOrder.value.indexOf(id)
  if (index > -1) {
    selectedOrder.value.splice(index, 1)
  } else {
    selectedOrder.value.push(id)
  }
}

watch(selectedOrder, (newVal) => {
  if (newVal.length === 0) {
    selectAll.value = false;
    indeterminate.value = false;
  } else if (newVal.length === orderDetail.value.length) {
    selectAll.value = true;
    indeterminate.value = false;
  } else {
    selectAll.value = false;
    indeterminate.value = true;
  }
});

const viewOrderDetailById = (selectedOrder: string[]) => {
  if (selectedOrder.length !== 1) {
    toast.add({ title: "Please select only one product!" })
    return;
  } else {
    router.push(`/report/view/${selectedOrder[0]}`);
  }
};
  

  return {
    orderDetail,
    error,
    currentPage,
    totalRecords,
    totalPages,
    paginatedPages,
    fetchOrderDetail,
    changePage,
    formatDate,
    loading,
    selectAll,
    indeterminate,
    toggleSelectAll,
    toggleOrder,
    viewOrderDetailById,
    selectedOrder,

  };
}
