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
import { ref } from 'vue'
import navigation from './components/navigation.vue'
import submenu from './components/submenu.vue'

// Reactive variable to control submenu visibility
const isSubmenuVisible = ref(true)

// Method to hide the submenu
const hideSubmenu = () => {
  isSubmenuVisible.value = false
}

// Method to show the submenu again
const showSubmenu = () => {
  isSubmenuVisible.value = true
}
</script>

<style>
</style>
