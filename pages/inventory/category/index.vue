<template>
  <div class="flex flex-col">
    <main class="grid items-start flex-1 gap-4 ">
      <div class="flex items-center gap-2 ml-auto">
        <CreateProduct />
        <UButton size="sm" class="text-blue-800 bg-blue-200 disabled:opacity-50 hover:bg-blue-100 disabled:bg-blue-400"
          :disabled="selectedCategory.length === 0"
          @click="viewCategoryById(selectedCategory);"
        >
          <EyeIcon class="w-4 h-4" />
          <span>View</span>
        </UButton>
        <UButton size="sm" class="text-green-700 bg-green-200 disabled:opacity-50 hover:bg-green-100 disabled:bg-green-400"
          :disabled="selectedCategory.length === 0"
          @click="editCategoryById(selectedCategory)"
        >
          <PenSquareIcon class="w-4 h-4" />
          Edit
        </UButton>
        <UButton size="sm" class="text-red-700 bg-red-200 disabled:opacity-50 hover:bg-red-100 disabled:bg-red-400"
          :disabled="selectedCategory.length === 0"
          @click="deleteCategoriesByIds(selectedCategory)"
        >
          <Trash class="w-4 h-4" />
          <span>Delete</span>
        </UButton>
      </div>
      
      <Card class="w-full">
        <div class="px-4 py-4">
          <div class="flex justify-between px-3 ">
            <div class="text-blue-700">
              <h2>Categories</h2>
              <p class="text-blue-700 opacity-70">Here is a list of all categories</p>
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
                <TableHead class="hidden md:table-cell">ID</TableHead>
                <TableHead class="hidden md:table-cell">Code</TableHead>
                <TableHead class="hidden font-sans md:table-cell">Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              <TableRow v-for="categories in category" :key="categories.categoryId" class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="toggleProduct(categories.categoryId)"
              >
                <TableCell @click.stop>
                  <input
                    type="checkbox"
                    :checked="selectedCategory.includes(categories.categoryId)"
                    @change="toggleProduct(categories.categoryId)"
                  />
                </TableCell>
                <TableCell>{{ categories.categoryId || '-' }}</TableCell>
                <TableCell>{{ categories.categoryCode || '-' }}</TableCell>
                <TableCell>{{ categories.categoryName || '-' }}</TableCell>
                <TableCell class="hidden md:table-cell">
                  <UBadge size="sm"
                    :class="[
                      'text-center',
                      categories.status === true ? 'text-blue-500 bg-blue-100 border-blue-500' :
                      categories.status === false ? 'text-red-500 border-red-500 bg-red-100' : 'text-gray-500 border-gray-300 '
                    ]"
                  >
                    {{ categories.status === true ? 'Enabled' : categories.status === false ? 'Disabled' : '-' }}
                  </UBadge>
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
    </main>
  </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { useCategory } from "~/composables/category";
  import { EyeIcon, PenSquareIcon, Trash } from "lucide-vue-next";
  
  const { 
    category, 
    changePage, 
    currentPage, 
    paginatedPages, 
    totalRecords, 
    totalPages,
    selectAll, 
    indeterminate, 
    toggleSelectAll, 
    selectedCategory, 
    toggleProduct, 
    viewCategoryById, 
    editCategoryById,
    deleteCategoriesByIds, 
  } = useCategory();
</script>
