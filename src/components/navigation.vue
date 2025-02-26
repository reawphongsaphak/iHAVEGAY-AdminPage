<template>
  <div class="navbar bg-dark-blue shadow-lg px-4 py-2 m-0 p-0">
    <!-- Left Side Dropdown -->
    <div class="flex-none">
      <details class="dropdown">
        <summary class="btn m-1 text-white hover:bg-light-dark-blue rounded-lg transition-all">Change</summary>
        <ul class="menu dropdown-content bg-white text-black rounded-box z-[1] w-52 p-2 shadow-md">
          <router-link to="/user" @click="handleUserManageClick">
            <li><a class="hover:bg-gray-300 active:bg-gray-400">User Manage</a></li>
          </router-link>
          <router-link to="/" @click="handleHardwareClick">
            <li><a class="hover:bg-gray-300 active:bg-gray-400">Hardware</a></li>
          </router-link>
        </ul>
      </details>
    </div>

    <!-- Center Logo/Title -->
    <div class="flex-1 text-center">
      <a class="btn btn-ghost text-xl font-semibold text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all">IHAVEGAY</a>
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
</script>
