<template>
    <Card class="w-full p-4 bg-white rounded-lg shadow-md max-w-[800px] mx-4-auto">
        <form @submit.prevent="createCategory" class="gap-4 ">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-blue-700">Create Category</h1>
              <p class="text-sm text-blue-600 opacity-80">Create a new category for your inventory.</p>
            </div>
            <div>
              <Button type="submit" size="sm" class="mb-4 text-blue-700 bg-blue-200 hover:bg-blue-100" >
                <PlusCircle class="w-4 h-4 mr-2" />
                <span>Create</span>
              </Button>
            </div>
          </div>
          
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-4">
                <span class="text-blue-700">Category Code : </span>
                <UInput
                    v-model="category.categoryCode"
                    label="Category Code"
                    placeholder="Enter category code"
                    :error="category.categoryCode === '' ? 'Category code is required' : ''"
                    required="true"
                />
            </div>
            <div class="col-span-4">
                <span class="text-blue-700">Category Name : </span>
                <UInput
                    v-model="category.categoryName"
                    label="Category Name"
                    placeholder="Enter category name"
                    :error="category.categoryName === '' ? 'Category name is required' : ''"
                    required="true"
                />
            </div>
          </div>
        </form>
    </Card>
</template>

<script setup>
    import { PlusCircle, ArrowDownToLine, Undo2 } from 'lucide-vue-next';
    import { ref } from "vue";
    import axios from "axios";
    const config = useRuntimeConfig();

    const toast = useToast();
    const isOpen = ref(false);
    const category = ref({
      categoryCode: "",
      categoryName: "",
      status: "",
    })

    const createCategory = async () => {
      try {
        await axios.post(`${config.public.apiBaseUrl}/api/v1/category/create`, category.value)
        toast.add({ title: "Successfully Create Category!" })
        window.location.href = "/inventory/category";
      } catch (err) {
        toast.add({ title: "Failed To Create Category!" })
      }
    }
</script>