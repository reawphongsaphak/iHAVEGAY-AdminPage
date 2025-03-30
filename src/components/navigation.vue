<template>
  <div class="navbar bg-dark-blue shadow-lg px-4 py-2 m-0 p-0">

    <!-- Center Logo/Title -->
    <div class="flex-1 text-center">

      <router-link 
        to="/dashboard"
        class="btn btn-ghost text-xl font-semibold text-white hover:bg-white hover:bg-opacity-5 rounded-lg transition-all">
        IHAVEGAY
      </router-link>
    </div>

    <!-- Right Side Icon/Button -->
    <div class="flex-none">
      <button class="btn btn-square btn-ghost hover:bg-dark-blue rounded-lg transition-all">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-5 w-5 stroke-current text-white">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    handleUserManageClick() {
      // Emit an event to hide the submenu when User Manage is clicked
      this.$emit('user-manage-clicked')
    },
    handleHardwareClick() {
      // Emit an event to show the submenu when Hardware is clicked
      this.$emit('hardware-clicked')
    }
  }
}

// Navigation function
const navigateTo = (item) => {
  // Close the dropdown
  
  // Programmatically navigate to ensure it works
  router.push('/' + item.toLowerCase())
}
</script>
