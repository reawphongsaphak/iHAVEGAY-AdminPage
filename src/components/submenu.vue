<template>
  <div class="w-60 bg-dark-blue p-4 shadow-lg h-screen flex flex-col">
    <ul class="menu bg-side-bar rounded-box w-full flex-1">
      <li>
        <dashboard />
        <div class="relative" ref="dropdownRef">
          <!-- Dropdown trigger button with SAO-style design -->
          <button 
            @click.stop="toggleDropdown" 
            class="flex items-center justify-between w-full p-3 text-lg font-medium bg-side-bar hover:"
          >
            <div class="flex items-center text-white">
              <span class="material-icons mr-2 text-white">menu</span>
              Products
            </div>
            <span class="ml-1 transition-transform duration-900 text-white text-2xl" :class="{ 'rotate-90': isOpen }">▹</span>
          </button>
          
          <!-- Dropdown menu with animation -->
          <transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="transform opacity-0 -translate-y-2"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2"
          >
            <ul 
              v-if="isOpen" 
              class="absolute top-full w-full bg-side-bar bg-opacity-80 shadow-lg"
            >
              <li v-for="(item, index) in menuItems" :key="index" class="last:border-b-0">
                <router-link 
                  :to="'/' + item.name.toLowerCase()" 
                  class="text-m block px-4 py-3 hover:bg-white hover:bg-opacity-10 w- text-left transition-all duration-200 text-white flex items-center"
                  @click="navigateTo(item.name)"
                >
                  <span class="material-icons mr-3">{{ item.icon }}</span>
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dashboard from './dashboard.vue'

// Get router and route instances
const router = useRouter()
const route = useRoute()

// List of items with icons
const menuItems = ref([
  { name: 'CPU', icon: 'memory' },
  { name: 'Ram', icon: 'developer_board' },
  { name: 'Mainboard', icon: 'dashboard' },
  { name: 'SSD', icon: 'storage' },
  { name: 'M2', icon: 'sd_card' },
  { name: 'GPU', icon: 'videogame_asset' },
  { name: 'Case', icon: 'computer' },
  { name: 'PSU', icon: 'power' }
])

// Toggle dropdown state
const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Data fetching function
const fetchData = async (category) => {
  try {
    console.log(`Fetching data for category: ${category}`)
    // Replace this with your actual API call
    // const response = await fetch(`/api/products/${category}`)
    // const data = await response.json()
    // Process your data here
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Navigation function
const navigateTo = (item) => {
  // Close the dropdown
  isOpen.value = false
  
  // Programmatically navigate to ensure it works
  router.push('/' + item.toLowerCase())
}

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Watch for route changes to fetch data
watch(
  () => route.path,
  (newPath) => {
    const category = newPath.substring(1) // Remove the leading slash
    if (category) {
      fetchData(category)
    }
  }
)

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Load Google Material Icons
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
  
  // Initial data fetch based on current route
  const initialCategory = route.path.substring(1)
  if (initialCategory) {
    fetchData(initialCategory)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
/* Add any additional custom styles here */
</style>