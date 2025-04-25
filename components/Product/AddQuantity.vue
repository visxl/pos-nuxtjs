<template>
    <Card class="w-full">
        <div class="px-4 py-4">
            <div class="flex justify-between px-3">
                <div class="text-blue-700">
                    <h2>Add Adjustment</h2>
                    <p class="text-blue-700 opacity-70">Add products quantity</p>
                </div>
            </div>
            
            <form @submit.prevent="submitAdjustment">
                <div class="grid grid-cols-1 gap-4 px-3 py-2">
                    <div class="flex flex-col gap-2 border border-blue-700 rounded-lg">
                        <UInput
                            variants="ghost"
                            v-model="searchText"
                            type="text"
                            @keydown.enter.prevent
                            placeholder="Search product..."
                            class="block w-full border-blue-500 rounded-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                        />

                        <ul v-if="filteredProducts.length && searchText" class="absolute z-10 mt-10 overflow-y-auto bg-white border rounded-md shadow-md w-[500px] max-h-60">
                            <li
                                v-for="product in filteredProducts"
                                :key="product.productId"
                                @click="selectProduct(product)"
                                class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {{ product.productName }} - <span class="font-semibold">{{ product.productCode }}</span>
                            </li>
                        </ul>
                    </div>

                    <Table v-if="selectedProducts.length" class="">
                         <TableHeader class="text-blue-700">
                            <TableRow class="font-semibold text-blue-700 border-b border-blue-200">
                                <TableHead class="">No</TableHead>
                                <TableHead class="">Product</TableHead>
                                <TableHead class="">Code</TableHead>
                                <TableHead class="">Quantity</TableHead>
                                <TableHead class="">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                       
                       
                            <TableBody
                                v-for="(product, index) in selectedProducts"
                                :key="product.productId"
                                class="transition duration-200 border-b border-blue-200 rounded-lg justify-evenly hover:border-blue-300"
                            >
                                <TableRow class="overflow-y-auto max-h-64">
                                    <TableCell>{{ index + 1 }}</TableCell>
                                    <TableCell>{{ product.productName }}</TableCell>
                                    <TableCell>{{ product.productCode }}</TableCell>
                                    <TableCell>
                                        <UInput
                                            variants="ghost"
                                            v-model="product.quantity"
                                            type="number"
                                            placeholder="Enter quantity"
                                            class="border-blue-200 rounded-lg hover:border-blue-300"
                                            min="1"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <UButton icon="lucide:x" variant="ghost" @click="removeProduct(index)" class="text-red-600 hover:bg-red-100">
                                            Remove
                                        </UButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        

                        <!-- Save Button -->
                        <div class="mt-4">
                            <UButton type="submit" class="text-blue-800 bg-blue-200 hover:bg-blue-100">
                                Save Adjustment
                            </UButton>
                        </div>
                    </Table>
                </div>
            </form>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const { product } = useProduct();
const toast = useToast();
const searchText = ref('');
const selectedProducts = ref<any[]>([]);

const filteredProducts = computed(() => {
    if (!searchText.value) return [];
    return product.value.filter((p) =>
        p.productName.toLowerCase().includes(searchText.value.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchText.value.toLowerCase())
    );
});

const selectProduct = (product: any) => {
    const exists = selectedProducts.value.some(p => p.productId === product.productId);
    if (!exists) {
        selectedProducts.value.push({ ...product, quantity: 1 });
    }
    searchText.value = ''; 
};

const removeProduct = (index: number) => {
    selectedProducts.value.splice(index, 1);
};

const submitAdjustment = async () => {
    const invalid = selectedProducts.value.some(p => p.quantity <= 0);
    if (invalid) {
        toast.add({ title: "Please enter a valid quantity for all products." });
        return;
    }

    try {
        for (const product of selectedProducts.value) {
            const payload = {
                addQuantity: product.quantity
            };
            await $fetch(`http://localhost:8081/api/v1/product/add/${product.productId}`, {
                method: 'PUT',
                body: payload
            });
        }

        toast.add({ title: "Quantity adjustment saved successfully!" });
        selectedProducts.value = [];
    } catch (error) {
        toast.add({ title: "Error saving adjustment."});
    }
};

</script>
