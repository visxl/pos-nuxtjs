import { usePos } from '../composables/usePos';
<template>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden">
    <!-- Order Panel (Left Sidebar) -->
    <aside class="flex-shrink-0 w-[600px] p-4 bg-white border-r flex flex-col">
      <!-- Search Bar -->
      <div class="relative flex flex-col gap-2">
        <UInput
          v-model="searchText"
          type="text"
          placeholder="Search product..."
          class="block w-full border border-blue-500 rounded-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
          @keyup.enter="handleSearchEnter"
        />
        <ul
          v-if="searchResults.length"
          class="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md top-full max-h-60"
        >
          <li
            v-for="product in searchResults"
            :key="product.productId"
            @click="selectProduct(product)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            {{ product.productName }} -
            <span class="font-semibold">{{ product.productCode }}</span>
            <span class="float-right">{{ formatCurrency(product.price) }}</span>
          </li>
        </ul>
      </div>

      <!-- Order Items Table -->
      <div class="flex-1 mt-6 overflow-y-auto">
        <Table v-if="selectedProducts.length">
          <TableHeader class="sticky top-0 text-blue-700 bg-white">
            <TableRow class="font-semibold text-blue-700 border-b border-blue-200">
              <TableHead>No</TableHead>
              <TableHead class="hidden">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead class="sr-only">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(product, index) in selectedProducts"
              :key="`${product.productId}-${index}`"
              class="transition duration-200 border-b border-blue-200 hover:border-blue-300"
            >
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell class="hidden">{{ product.productCode }}</TableCell>
              <TableCell>{{ product.productName }}</TableCell>
              <TableCell>
                <UInput
                  v-model.number="product.quantity"
                  type="number"
                  class="w-auto border-blue-200 rounded-lg max-w-16"
                  min="1"
                  @change="updateTotal(product)"
                />
              </TableCell>
              <TableCell>{{ (product.price * product.quantity) + "៛" }}</TableCell>
              <TableCell>
                <UButton
                  icon="lucide:x"
                  variant="ghost"
                  @click="removeProduct(index)"
                  class="text-red-600 hover:bg-red-100"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Order Summary -->
      <div class="sticky bottom-0 pt-4 mt-auto bg-white border-t border-gray-200">
        <div class="grid grid-cols-4 gap-2 mb-4">
          <span class="font-bold">Item:</span>
          <div class="font-bold">{{ item }}</div>
          <span class="mr-4 font-bold">VAT (10%):</span>
          <div class="font-bold">{{ vatAmount + "៛"}}</div>
          <span class="mr-4 font-bold">Sub Total:</span>
          <div class="font-bold">{{ subTotal + "៛" }}</div>
          <span class="mr-4 font-bold">Total:</span>
          <div class="font-bold">{{ total + "៛" }}</div>
        </div>
       
        <div class="grid grid-cols-2 gap-2">
          <UButton
            color="red"
            variant="outline"
            @click="cancelOrder"
            class="w-full"
          >
            Cancel Order
          </UButton>
          <UButton
            color="green"
            @click="createOrder"
            class="w-full row-span-2"
            :disabled="selectedProducts.length === 0"
          >
            Payment
          </UButton>
          <UButton
            color="blue"
            @click="printReceipt"
            class="w-full"
            :disabled="selectedProducts.length === 0"
          >
            Print Receipt
          </UButton>
        </div>
      </div>
    </aside>

    <!-- Product Display (Main Area) -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <header class="flex items-center justify-between flex-shrink-0 px-4 py-2 border-b">
        <div class="w-full overflow-x-auto no-scrollbar">
          <div class="flex space-x-2 w-max">
            <UButton
              v-for="category in categories"
              :key="category"
              @click="fetchByCategory(category)"
              :color="selectedCategory === category ? 'blue' : 'gray'"
              variant="ghost"
              class="whitespace-nowrap"
            >
              {{ category }}
            </UButton>
          </div>
        </div>
      </header>


      <main class="flex flex-col flex-1 overflow-hidden">
        <div class="flex-1 p-6 overflow-y-auto">
          <div v-if="loading" class="flex items-center justify-center h-full">
          </div>
          <div v-else-if="products.length === 0" class="flex items-center justify-center h-full">
            <p class="text-gray-500">No products found</p>
          </div>
          <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <Card
              v-for="(product, index) in products"
              :key="`${product.productId}-${index}`"
              class="flex flex-col items-center justify-center w-full gap-2 transition-colors cursor-pointer h-44 hover:bg-gray-50"
              @click="selectProduct(product)"
            >
              <div class="text-sm font-medium text-center">{{ product.productName }}</div>
              <div class="text-xs font-bold">{{ product.price + "៛" }}</div>
              <div class="text-xs text-gray-600">{{ product.productCode }}</div>
            </Card>
          </div>
        </div>

        <!-- Pagination controls at bottom -->
        <div class="sticky bottom-0 flex h-12 mb-5">
          <UButton
            :disabled="currentPage === 1 || loading"
            @click="prevPage"
            class="justify-center flex-1 py-4 text-blue-800 bg-blue-200 rounded-lg hover:bg-blue-100 disabled:bg-blue-100"
          >
            <UIcon name="i-heroicons-arrow-long-left" class="w-6 h-6" />
          </UButton>
          
          <div class="flex items-center justify-center px-4 bg-gray-50">
            <span class="text-sm font-medium">{{ currentPage }}</span>
          </div>
          
          <UButton
            :disabled="currentPage === totalPages || loading"
            @click="nextPage"
            class="justify-center flex-1 py-4 text-blue-800 bg-blue-200 rounded-lg hover:bg-blue-100 disabled:bg-blue-100"
          >
            <UIcon name="i-heroicons-arrow-long-right" class="w-6 h-6" />
          </UButton>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'pos',
})
const {
  searchText,
  searchResults,
  selectedProducts,
  products,
  loading,
  currentPage,
  totalPages,
  categories,
  selectedCategory,
  item,
  subTotal,
  vatAmount,
  total,
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
} = usePos();
</script>

<style scoped>
.sticky {
  position: sticky;
  z-index: 10;
}
</style>