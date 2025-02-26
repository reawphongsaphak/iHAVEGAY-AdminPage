<template>
  <div class="w-64 bg-gradient-to-b from-green-100 to-green-200 shadow-lg h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-green-300">
      <h2 class="text-xl font-bold text-green-800">Hardware Manage</h2>
      <p class="text-sm text-green-600">Select a category</p>
    </div>

    <!-- Menu Items -->
    <div class="flex-1 overflow-y-auto py-2">
      <div class="px-4 mb-2">
        <dashboard class="mb-4" />
      </div>

      <ul class="space-y-1 px-2">
        <li
          v-for="(item, index) in sell_list"
          :key="index"
          class="relative"
        >
          <router-link
            :to="'/' + item.toLowerCase()"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors hover:bg-green-300 hover:text-green-900"
            v-slot="{ isActive }"
          >
            <!-- Icon based on category -->
            <span class="mr-3 text-green-600">
              <component :is="getCategoryIcon(item)" />
            </span>

            <!-- Menu item text -->
            <span :class="{ 'font-medium': isActive }">{{ item }}</span>

            <!-- Active indicator -->
            <span
              v-if="isActive"
              class="absolute inset-y-0 left-0 w-1 bg-green-600 rounded-r-lg"
              aria-hidden="true"
            ></span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-green-300 mt-auto">
      <button class="w-full flex items-center justify-center px-4 py-2 text-sm text-green-800 bg-green-300 rounded-lg hover:bg-green-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Category
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue';
import dashboard from './dashboard.vue';

// List of items
const sell_list = ref(['CPU', 'RAM', 'Mainboard', 'SSD', 'M.2', 'GPU', 'Case', 'PSU']);

// Function to get the appropriate icon for each category
const getCategoryIcon = (category) => {
  // Simple SVG icon components for each category
  const icons = {
    CPU: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z'
      })
    ]),

    RAM: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
      })
    ]),

    Mainboard: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
      })
    ]),

    SSD: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
      })
    ]),

    'M.2': () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2'
      })
    ]),

    GPU: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z'
      })
    ]),

    Case: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      })
    ]),

    PSU: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 10V3L4 14h7v7l9-11h-7z'
      })
    ])
  };

  // Return the appropriate icon or a default one if not found
  return icons[category] || icons['CPU'];
};
</script>

<style scoped>
.router-link-active {
  background-color: rgba(167, 243, 208, 0.5);
  color: #065f46;
  font-weight: 500;
}
</style>
