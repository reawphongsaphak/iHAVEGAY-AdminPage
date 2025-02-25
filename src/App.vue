<template>
  <div class="flex flex-col h-screen">
    <!-- Top Navigation Bar -->
    <navigation @user-manage-clicked="hideSubmenu" @hardware-clicked="showSubmenu" />

    <div class="flex flex-1">
      <!-- Sidebar (Submenu) -->
      <div v-if="isSubmenuVisible">
        <submenu />
      </div>

      <!-- Main Content (Dynamic Pages) -->
      <div class="bg-white">
        <router-view />
        <!-- <HelloWorldVue /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import navigation from './components/navigation.vue'
import submenu from './components/submenu.vue'

// Load submenu visibility state from localStorage
const isSubmenuVisible = ref(JSON.parse(localStorage.getItem('isSubmenuVisible')) ?? true)

// Method to hide the submenu
const hideSubmenu = () => {
  isSubmenuVisible.value = false
  localStorage.setItem('isSubmenuVisible', JSON.stringify(false))
}

// Method to show the submenu again
const showSubmenu = () => {
  isSubmenuVisible.value = true
  localStorage.setItem('isSubmenuVisible', JSON.stringify(true))
}

// Ensure localStorage value is read when the component is mounted
onMounted(() => {
  isSubmenuVisible.value = JSON.parse(localStorage.getItem('isSubmenuVisible')) ?? true
})
</script>


<style>
</style>
