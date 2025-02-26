<template>
  <nav class="bg-gradient-to-r from-emerald-600 to-teal-500 shadow-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left Side - Brand with Icon and Dropdown Menu -->
        <div class="flex items-center">
          <!-- Logo/Icon -->
          <div class="flex-shrink-0 flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span class="ml-2 text-white font-bold text-lg">IHaveGay</span>
          </div>

          <!-- Dropdown Menu -->
          <div class="relative">
            <button
              @click.stop="isMenuOpen = !isMenuOpen"
              class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-150"
            >
              <span class="mr-2">Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" :class="{ 'transform rotate-180': isMenuOpen }" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Content -->
            <div
              v-show="isMenuOpen"
              class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-opacity duration-150 ease-in-out"
              v-click-outside="closeMenu"
            >
              <div class="py-1">
                <router-link
                  to="/user"
                  @click="handleUserManageClick"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 transition duration-150 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  User Management
                </router-link>
                <router-link
                  to="/"
                  @click="handleHardwareClick"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 transition duration-150 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Hardware
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Optional actions -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-4">
            <button class="text-white hover:bg-emerald-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    handleUserManageClick() {
      this.isMenuOpen = false;
      this.$emit("user-manage-clicked");
    },
    handleHardwareClick() {
      this.isMenuOpen = false;
      this.$emit("hardware-clicked");
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  },
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.addEventListener("click", el.clickOutsideEvent, true);
      },
      unmounted(el) {
        document.removeEventListener("click", el.clickOutsideEvent, true);
      }
    }
  }
};
</script>
