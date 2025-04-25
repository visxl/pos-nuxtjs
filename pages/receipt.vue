<template>
  <div class="absolute px-4 py-4 print:hidden">
    <NuxtLink to="/pos" class="flex items-center gap-2 px-2 py-1 text-blue-700 bg-blue-200 rounded-md hover:bg-blue-100">
      <ArrowLeft class="w-4 h-4"/>
      <span>Back</span>
    </NuxtLink>
  </div>
    
  <div class="flex flex-col items-center justify-start h-auto p-6">
    <div class="bg-white border shadow" >
      <div class="px-2 py-3 mx-auto text-black w-[100mm] min-h-[210mm] font-khmer">
        <!-- Header -->
        <div class="mb-4 text-center">
          <h1 class="text-lg font-bold">Raksmey Kampuchea Bookstore</h1>
          <p class="text-sm">#123 Main Street, City</p>
          <p class="text-sm">Tel: 012-345-678</p>
        </div>

        <hr class="my-2 border-dashed" />
        <!-- Date and Receipt Info -->
        <div class="flex justify-between mb-2 text-sm">
          <p>Date: {{ currentDate }}</p>
          <p>SALE0001</p>
        </div>

          <!-- Items -->
        <div class="mb-2 text-sm">
          <div class="grid grid-cols-4 pb-1 font-bold border-b border-dashed">
            <span>Item</span>
            <span class="text-right">Qty</span>
            <span class="text-right">Price</span>
            <span class="text-right">Total</span>
          </div>
          <div v-for="(item, index) in items" :key="index" class="grid grid-cols-4 py-1 text-sm">
            <span>{{ item.name }}</span>
            <span class="text-right">{{ item.qty }}</span>
            <span class="text-right">{{ formatCurrency(item.price) }}</span>
            <span class="text-right">{{ formatCurrency(item.qty * item.price) }}</span>
          </div>
        </div>

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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { ArrowLeft } from "lucide-vue-next";

const currentDate = new Date().toLocaleDateString();

const items = [
  { name: 'Apple', qty: 2, price: 1.5 },
  { name: 'Orange', qty: 3, price: 1.25 },
  { name: 'Banana', qty: 5, price: 0.9 },
];

const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
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
    setTimeout(() => window.print(), 500) // auto-trigger print
  }
})
</script>


<style scoped>
.font-khmer {
  font-family: 'Noto Sans Khmer', sans-serif;
}
.receipt-width {
    width: '100mm'
}
.receipt-width {
    height: '210mm'
}

@media print {
  .absolute {
    display: none;
  }
  body {
    margin: 0;
  }
}

</style>
