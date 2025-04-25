<template>
  <Card class="w-full">
    <div class="px-4 py-4">
      <div class="flex justify-between px-3 ">
        <div class="text-blue-700">
          <h2>Sale Report</h2>
          <p class="text-blue-700 opacity-70">Here is a list of all sale report</p>
        </div>

        <div class="">
          <UButton size="sm" class="text-blue-800 bg-blue-200 disabled:opacity-50 hover:bg-blue-100 disabled:bg-blue-400"
            :disabled="selectedOrder.length === 0"
            @click="viewOrderDetailById(selectedOrder);"
          >
            <EyeIcon class="w-4 h-4" />
            <span>View</span>
          </UButton>
        </div>
      </div>
        
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                :indeterminate="indeterminate"
              />
            </TableHead>
            <TableHead class="hidden md:table-cell">No</TableHead>
            <TableHead>Order No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(order, index) in orderDetail" :key="order.id" class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="toggleOrder(order.id)"
          >
            <TableCell @click.stop>
              <input
                type="checkbox"
                :checked="selectedOrder.includes(order.id)"
                @change="toggleOrder(order.productId)"
              />
            </TableCell>  
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>{{ order.orderNo || '-' }}</TableCell>
            <TableCell class="hidden md:table-cell">{{ formatDate(order.createdDate) || '-' }}</TableCell>
            <TableCell>
              <Dialog class="h-[210mm] w-[100mm]">
                <DialogTrigger>
                  <UButton class="h-6 text-blue-800 bg-blue-200 disabled:opacity-50 hover:bg-blue-100 disabled:bg-blue-400">
                    <EyeIcon class="w-4 h-4" />
                    <span>View</span>
                  </UButton>
                </DialogTrigger>

                <DialogScrollContent class="w-full ">
                  <div class="flex flex-col items-center justify-start h-auto ">
                    <div class="px-2 py-3 mx-auto text-black w-[100mm] min-h-[210mm] font-khmer">
                      <div class="mb-4 text-center">
                        <h1 class="text-lg font-bold">Raksmey Kampuchea Bookstore</h1>
                        <p class="text-sm">#123 Main Street, City</p>
                        <p class="text-sm">Tel: 012-345-678</p>
                      </div>

                      <hr class="my-2 border-dashed" />
                      <div class="flex justify-between mb-2 text-sm">
                        <p>Date: {{ currentDate }}</p>
                        <p>SALE0001</p>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody v-for="(item, index) in order.orderItems" :key="item.id">
                          <TableRow class="grid grid-cols-4 py-1">
                            <TableCell>{{ index + 1 }}</TableCell>
                            <TableCell>{{ item.productName }}</TableCell>
                            <TableCell>{{ formatCurrency(item.quantity) }}</TableCell>
                            <TableCell>{{ formatCurrency(item.price) }}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <hr class="my-2 border-dashed" />

                        <!-- Summary -->
                      <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                          <span>Subtotal</span>
                          <span>{{ formatCurrency(subtotal) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Tax (10%)</span>
                          <span>{{ formatCurrency(tax) }}</span>
                        </div>
                        <div class="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{{ formatCurrency(total) }}</span>
                        </div>
                      </div>

                      <hr class="my-2 border-dashed" />
                      <!-- Footer -->
                      <p class="mt-4 text-xs text-center">Thank you for your purchase!</p>
                    </div>
                  </div>
                </DialogScrollContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
        
      <CardFooter>
        <div class="z-0 w-full mt-3">
          <div class="flex justify-center md:justify-between">
            <div class="hidden w-full md:block">
              <p class="mt-1.5 font-sans text-md text-gray-900 dark:text-gray-200">
                Showing <span class="font-semibold text-blue-700">1-10</span> of <span class="font-semibold text-blue-700">{{ totalRecords }}</span>
              </p>
              <p class="mt-1.5 font-sans text-md text-gray-900 dark:text-gray-200">
                Showing page <span class="font-semibold text-blue-700">{{ currentPage }}</span> of <span class="font-semibold text-blue-700">{{ totalPages }}</span>
              </p>
            </div>
            
            <div class="flex items-center gap-4">
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" type="button"
                class="flex items-center gap-2 px-6 py-3 rounded-full text-centeralign-middle dark:text-gray-50 hover:bg-gray-100 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                <Icon name="mingcute:arrow-left-fill" class="w-4 h-4 text-blue-700 dark:text-gray-200"/>
              </button>
              <div class="flex items-center gap-2">
                <button v-for="page in paginatedPages" :key="page" @click="changePage(page)" type="button"
                  :class="[
                    'relative h-14 max-h-[30px] w-14 max-w-[30px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all', currentPage === page
                    ? 'bg-blue-200 text-blue-800 dark:bg-gray-900 dark:text-gray-50 shadow-md'
                    : 'bg-gray-50 text-blue-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-600 dark:hover:bg-gray-800 active:bg-gray-900/20',
                  ]"
                >
                  <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    {{ page }}
                  </span>
                </button>
              </div>
              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" type="button" class="flex items-center gap-2 px-6 py-3 rounded-full text-centeralign-middle dark:text-gray-50 hover:bg-gray-100 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                <Icon name="mingcute:arrow-right-fill" class="w-4 h-4 text-blue-700 dark:text-gray-200"/>
              </button>
            </div>
          </div>
        </div>
      </CardFooter>
    </div>
  </Card>
</template>
    
<script setup lang="ts">
  import { ref } from 'vue';
  import { useOrderDetail } from "~/composables/orderItem";
  import { EyeIcon } from "lucide-vue-next";
  import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '~/components/ui/table';
  import { Card, CardFooter } from '~/components/ui/card';

  const {
      orderDetail,
      currentPage,
      totalRecords,
      totalPages,
      paginatedPages,
      changePage,
      formatDate,
      selectAll,
      indeterminate,
      selectedOrder,
      toggleSelectAll,
      toggleOrder,
      viewOrderDetailById,
  } = useOrderDetail();
  
  const currentDate = new Date().toLocaleDateString();
  const orderItems = ref({ qty: 0, price: 0 });
  const subtotal = orderItems.value.qty * orderItems.value.price;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  function formatCurrency(value: number): string {
    return '$' + value.toFixed(2);
  }

  const products = ref([])

  onMounted(() => {
    const stored = localStorage.getItem('receipt')
    if (stored) {
      products.value = JSON.parse(stored)
      // setTimeout(() => window.print(), 500)
    }
  })

</script>