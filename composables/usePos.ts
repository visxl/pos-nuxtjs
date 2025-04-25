import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRuntimeConfig } from "#imports";

export function usePos() {
  interface Product {
    productId: number
    productName: string
    productCode: string
    price: number
    quantity: number
    imageUrl?: string
  }

  const router = useRouter()
  const config = useRuntimeConfig()

  const searchText = ref('')
  const searchResults = ref<Product[]>([])
  const selectedProducts = ref<Product[]>([])
  const products = ref<Product[]>([])
  const loading = ref(false)

  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalProducts = ref(0)
  const pageSize = ref(20)

  const categories = ref<string[]>(['All'])
  const selectedCategory = ref<string>('All')

  const item = computed(() => selectedProducts.value.length)
  const subTotal = computed(() =>
    selectedProducts.value.reduce((total, product) => total + (product.price * product.quantity), 0)
  )
  const vatAmount = computed(() => subTotal.value * 0)
  const total = computed(() => subTotal.value + vatAmount.value)

  // Fetch all categories
  onMounted(async () => {
    try {
      const res = await fetch(`${config.public.apiBaseUrl}/api/v1/category/categories`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const categoryNames = data.map((c: any) => c.categoryName)
        categories.value = ['All', ...categoryNames]
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  })

  // Unified product fetcher
  async function loadProducts(page: number = 1) {
    loading.value = true
    currentPage.value = page

    try {
      const isAll = selectedCategory.value === 'All' || !selectedCategory.value
      const url = isAll
        ? `${config.public.apiBaseUrl}/api/v1/product?pageNumber=${page}&pageSize=${pageSize.value}`
        : `${config.public.apiBaseUrl}/api/v1/product/category?name=${encodeURIComponent(selectedCategory.value)}&pageNumber=${page}&pageSize=${pageSize.value}`

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load products')

      const data = await res.json()

      if (data) {
        products.value = data.content || []
        totalProducts.value = data.totalElements || products.value.length
        totalPages.value = data.totalPages || 1
      }
    } catch (error) {
      console.error('Error loading products:', error)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  // Change category
  async function fetchByCategory(category: string) {
    selectedCategory.value = category
    await loadProducts(1)
  }

  // Search
  const handleSearchEnter = async () => {
    if (!searchText.value.trim()) {
      searchResults.value = []
      return
    }

    try {
      const res = await fetch(
        `${config.public.apiBaseUrl}/api/v1/product/find?text=${encodeURIComponent(searchText.value)}`
      )
      const data = await res.json()
      searchResults.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error searching products:', error)
      searchResults.value = []
    }
  }

  function selectProduct(product: Product) {
    const existingIndex = selectedProducts.value.findIndex(p => p.productId === product.productId)

    if (existingIndex >= 0) {
      selectedProducts.value[existingIndex].quantity++
    } else {
      selectedProducts.value.push({
        ...product,
        quantity: 1
      })
    }

    searchText.value = ''
    searchResults.value = []
  }

  function removeProduct(index: number) {
    selectedProducts.value.splice(index, 1)
  }

  function updateTotal(product: Product) {
    product.quantity = Math.max(1, product.quantity)
  }

  function cancelOrder() {
    selectedProducts.value = []
  }

  async function printReceipt() {
    localStorage.setItem('receipt', JSON.stringify(selectedProducts.value))
    router.push('/receipt')
  }

  async function createOrder() {
    if (selectedProducts.value.length === 0) return

    try {
      const res = await fetch(`${config.public.apiBaseUrl}/api/v1/orderItem/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderItems: selectedProducts.value.map(product => ({
            productCode: product.productCode,
            quantity: product.quantity,
          }))
        })
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to create order')
      }

      await res.json()
      router.push('/receipt')
      cancelOrder()
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  // Watch page changes
  watch(currentPage, (page) => {
    loadProducts(page)
  })

  // Initial load
  onMounted(() => {
    loadProducts()
  })

  return {
    searchText,
    searchResults,
    selectedProducts,
    products,
    loading,
    currentPage,
    totalPages,
    totalProducts,
    pageSize,
    categories,
    selectedCategory,
    item,
    subTotal,
    vatAmount,
    total,
    loadProducts,
    fetchByCategory,
    handleSearchEnter,
    selectProduct,
    removeProduct,
    updateTotal,
    cancelOrder,
    printReceipt,
    createOrder,
    nextPage,
    prevPage,
    formatCurrency
  }
}
