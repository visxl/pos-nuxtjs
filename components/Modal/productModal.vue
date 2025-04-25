<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle class="text-blue-700">{{ isEdit ? 'Edit' : 'View' }} Product</DialogTitle>
      </DialogHeader>

      <div v-if="product">
        <div class="grid gap-4 p-4">
          <UInput v-model="product.productName" label="Product Name" :readonly="!isEdit" />
          <UInput v-model="product.productCode" label="Product Code" readonly />
          <UInput v-model="product.cost" type="number" label="Cost" :readonly="!isEdit" />
          <UInput v-model="product.price" type="number" label="Price" :readonly="!isEdit" />
          <UInput v-model="product.quantity" type="number" label="Quantity" :readonly="!isEdit" />
          <UInput v-model="product.unit" label="Unit" :readonly="!isEdit" />
        </div>

        <DialogFooter v-if="isEdit">
          <Button @click="updateProduct" class="text-white bg-blue-600 hover:bg-blue-500">
            Save Changes
          </Button>
        </DialogFooter>
      </div>
      <div v-else class="p-4 text-center text-gray-500">
        Loading product...
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
const config = useRuntimeConfig()
const toast = useToast()

const props = defineProps({
  selectedProductId: String,
  mode: {
    type: String,
    default: 'view', // or 'edit'
  },
  open: Boolean,
})

const emit = defineEmits(['close'])

const isOpen = ref(props.open)
watch(() => props.open, val => isOpen.value = val)
watch(isOpen, val => {
  if (!val) emit('close')
})

const product = ref(null)
const isEdit = computed(() => props.mode === 'edit')

const fetchProduct = async () => {
  try {
    const res = await axios.get(`${config.public.apiBaseUrl}/api/v1/product/${props.selectedProductId}`)
    product.value = res.data
  } catch (err) {
    toast.add({ title: 'Failed to load product', variant: 'danger' })
  }
}

const updateProduct = async () => {
  try {
    await axios.put(`${config.public.apiBaseUrl}/api/v1/product/update?productId=${props.selectedProductId}`, product.value)
    toast.add({ title: 'Product updated successfully!' })
    isOpen.value = false
  } catch (err) {
    toast.add({ title: 'Failed to update product', variant: 'danger' })
  }
}

onMounted(fetchProduct)
</script>
