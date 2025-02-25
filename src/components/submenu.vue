<template>
  <div class="w-60 bg-green-200 p-4 shadow-lg h-screen flex flex-col">
    <ul class="menu bg-base-200 rounded-box w-full flex-1">
      <li>
        <dashboard />
        <ul>
          <li v-for="(item, index) in sell_list" :key="index">
            <!-- Use router-link for navigation -->
            <router-link :to="'/' + item.toLowerCase()" class="text-lg block p-2 hover:bg-green-300 rounded">
              {{ item }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import CPUPageVue from '../view/CPUPage.vue'
import dashboard from './dashboard.vue'
// import CPUPageVue from '../view/CPUPage.vue'

// List of items
const sell_list = ref(['CPU', 'Ram', 'Mainboard', 'SSD', 'M2', 'GPU', 'Case', 'PSU'])
</script>

<style>
</style>
