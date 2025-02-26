<template>
  <nav class="bg-gradient-to-r from-green-600 to-green-500 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left Side - Dropdown Menu -->
        <div class="relative">
          <button
            @click.stop="isMenuOpen = !isMenuOpen"
            class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-150"
          >
            <span class="mr-2">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'transform rotate-180': isMenuOpen }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Dropdown Content -->
          <!-- Dropdown Content -->
<div
  v-show="isMenuOpen"
  class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition duration-150 ease-in-out"
  v-click-outside="closeMenu"
>
  <div class="py-1 w-48"> <!-- Adjust width here -->
    <router-link
      to="/user"
      @click="handleUserManageClick"
      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
    >
      User Management
    </router-link>
    <router-link
      to="/"
      @click="handleHardwareClick"
      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
    >
      Hardware
    </router-link>
  </div>
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
