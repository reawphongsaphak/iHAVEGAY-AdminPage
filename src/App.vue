<template>
  <div class="flex flex-col h-screen">
    <!-- Top Navigation Bar -->
    <navigation />

    <div class="flex flex-1">
      <!-- Sidebar (Submenu) -->
      <div>
        <submenu />
      </div>

      <!-- Main Content (Dynamic Pages) -->
      <div class=" bg-white">
        <router-view />
        <!-- <HelloWorldVue /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
// import HelloWorldVue from './components/HelloWorld.vue'
import navigation from './components/navigation.vue'
import submenu from './components/submenu.vue'
</script>

<style>
</style>
