<template>
  <Dialog>
    <DialogTrigger as-child>
      <UButton class="text-blue-800 bg-blue-200 disabled:opacity-50 hover:bg-blue-100 disabled:bg-blue-400" size="sm">
        <Plus class="w-4 h-4" />
        <span>Create</span>
      </UButton>
    </DialogTrigger>
    <DialogScrollContent class="sm:max-w-[700px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
      <form @submit.prevent="createProduct" class="w-full gap-4 px-4">
        <DialogHeader class="py-6 pb-0">
          <div class="flex justify-between">
            <div>
              <DialogTitle class="text-blue-700">Add New Product</DialogTitle>
              <DialogDescription class="text-blue-700 opacity-70">
                Click save when you're done.
              </DialogDescription>
            </div>

            <div class="flex items-center justify-between mt-6">
              <Button type="submit" size="sm" class="mb-4 text-blue-700 bg-blue-200 hover:bg-blue-100" >
                <PlusCircle class="w-4 h-4 mr-2" />
                <span>Create</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
          
        <div class="gap-4 mb-2">
          <div class="mb-4">
            <span class="text-blue-700">Product Code : </span>
            <UInput v-model="product.productCode" label="Category Code" placeholder="Enter category code" class="flex gap-2" required>
              <button @click="generateProductCode" type="button" class="px-2 py-2 text-sm text-blue-700 bg-blue-200 rounded hover:bg-blue-100">
                <Shuffle class="w-4 h-4" />
              </button>
            </UInput>            
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Product Name : </span>
            <UInput v-model="product.productName" label="Category Name" placeholder="Enter category name" :error="product.productName === '' ? 'Product name is required' : ''"/>
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Cost : </span>
            <UInput v-model="product.cost" label="Cost" placeholder="Enter cost" type="number"/>
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Price : </span>
            <UInput v-model="product.price" label="Price" placeholder="Enter price" type="number" />
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Quantity : </span>
            <UInput v-model="product.quantity" label="Price" placeholder="Enter quantity       *Optional" type="number"/>
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Units : </span>
            <USelectMenu v-model="product.unit" label="Unit" placeholder="Select unit" :options="units"/>
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Category Name : </span>
            <USelectMenu v-model="product.categoryName" label="Category Name" placeholder="Select Category Name" :options="categoryNameOptions" @click="findCategory"
              :error="product.categoryName === '' ? 'Category Name is required' : ''"
            />
          </div>
          <div class="mb-4">
            <span class="text-blue-700">Category Code : </span>
            <USelectMenu v-model="product.categoryCode" label="Category Code" placeholder="Select Category Code" :options="categoryCodeOptions" @click="findCategory"
              :error="product.categoryCode === '' ? 'Category Code is required' : ''" disabled
            />
          </div>
        </div>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup>
import { PlusCircle, Shuffle, Plus } from 'lucide-vue-next';
import { ref } from "vue";
import axios from "axios";
const config = useRuntimeConfig();

const toast = useToast();
const isOpen = ref(false);
const product = ref({
    productCode: '',
    productName: '',
    cost: '',
    price: '',
    quantity: '',
    unit: '',
    status: '',
    categoryName: '',
    categoryCode: '',
})
const units = ['kg', 'g', 'pcs', 'box']

const createProduct = async () => {
    try {
        await axios.post(`${config.public.apiBaseUrl}/api/v1/product/create`, product.value);
        toast.add({ title: "Successfully Created Product!" });
    } catch (err) {
        if (err.response && err.response.status === 409) {
        toast.add({ title: "Product code already exists", variant: "danger" });
        } else {
        toast.add({ title: "Failed To Create Product!" });
        }
    }
};

const categoryList = ref([]); 
const categoryCodeOptions = ref([]);
const categoryNameOptions = ref([]);

const findCategory = async () => {
    try {
        const response = await axios.get(`${config.public.apiBaseUrl}/api/v1/category/categories`);
        categoryList.value = response.data;
        categoryCodeOptions.value = categoryList.value.map(item => item.categoryCode);
        categoryNameOptions.value = categoryList.value.map(item => item.categoryName);
    } catch (err) {
        toast.add({ title: "Failed to fetch categories" });
    }
};

watch(() => product.value.categoryCode, (newCode) => {
    const match = categoryList.value.find(item => item.categoryCode === newCode);
    if (match) {
        product.value.categoryName = match.categoryName;
    }
});

watch(() => product.value.categoryName, (newName) => {
    const match = categoryList.value.find(item => item.categoryName === newName);
    if (match) {
        product.value.categoryCode = match.categoryCode;
    }
});


const generateProductCode = async () => {
let isUnique = false;
let attempts = 0;

while (!isUnique && attempts < 10) {
    const randomCode = Math.floor(100000000 + Math.random() * 900000000);
    try {
        const response = await axios.get(`${config.public.apiBaseUrl}/api/v1/product/check-code/${randomCode}`);
        console.log("Product fetched:", response.data);
    if (!response.data) {
        product.value.productCode = randomCode;
        isUnique = "true";
        toast.add({ title: "Generated unique product code: " + randomCode });
    } else {
        attempts++;
    }
    } catch (err) {
        toast.add({ title: "Error checking product code" });
        console.error("Error fetching product:", error.response?.data || error.message);
    break;
    }
}

    if (!isUnique) {
        toast.add({ title: "Failed to generate a unique product code" });
    }
};
</script>