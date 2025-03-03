<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">CPU Catalog</h1>

    <!-- Search and Add Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div class="relative w-full md:w-1/2">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by name, brand, or socket..."
          class="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <button
        @click="showAddModal = true"
        class="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New CPU
      </button>
    </div>

    <!-- Results Summary -->
    <p class="text-gray-600 mb-4">
      Showing {{ filteredCpuData.length }} of {{ cpuData.length }} CPUs
    </p>

    <!-- CPU Grid -->
    <div v-if="filteredCpuData.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="cpu in filteredCpuData"
        :key="cpu._id"
        class="border border-gray-200 rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl hover:-translate-y-1"
      >
        <div class="relative h-48 bg-gray-100">
          <img
            :src="cpu.imgUrl || '/api/placeholder/400/320'"
            :alt="`${cpu.title} image`"
            class="w-full h-full object-contain p-2"
          />
          <div class="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
            {{ cpu.brand }}
          </div>
        </div>

        <div class="p-4">
          <h2 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{{ cpu.title }}</h2>

          <div class="flex flex-col space-y-1 mb-4">
            <div class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Socket: {{ cpu.Socket || 'N/A' }}
            </div>
          </div>

          <div class="flex justify-between items-center">
            <p class="text-2xl font-bold text-green-600">{{ cpu.price.toLocaleString() || '0' }} THB</p>

            <div class="flex space-x-2">
              <button
                @click="editCpu(cpu)"
                class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <button
                @click="deleteCpu(cpu._id)"
                class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results State -->
    <div v-else class="py-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-xl text-gray-500">No CPUs found matching your search...</p>
      <button @click="searchQuery = ''" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Clear Search
      </button>
    </div>

    <!-- Edit Modal -->
    <div v-if="selectedCpu" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Edit CPU</h2>
          <button @click="selectedCpu = null" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="updateCpu">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Title</label>
            <input
              v-model="selectedCpu.title"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Price (THB)</label>
            <input
              v-model="selectedCpu.price"
              type="number"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Socket</label>
            <input
              v-model="selectedCpu.Socket"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Brand</label>
            <input
              v-model="selectedCpu.brand"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Image URL</label>
            <input
              v-model="selectedCpu.imgUrl"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="selectedCpu = null"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add CPU Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Add New CPU</h2>
          <button @click="showAddModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="addCpu">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Title *</label>
            <input
              v-model="newCpu.title"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Price (THB) *</label>
            <input
              v-model="newCpu.price"
              type="number"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Socket</label>
            <input
              v-model="newCpu.Socket"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Brand</label>
            <input
              v-model="newCpu.brand"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Image URL</label>
            <input
              v-model="newCpu.imgUrl"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add CPU
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cpuData: [],
      selectedCpu: null,
      showAddModal: false,
      searchQuery: "",
      newCpu: {
        title: "",
        price: "",
        Socket: "",
        brand: "",
        imgUrl: "",
      },
    };
  },
  computed: {
    filteredCpuData() {
      if (!this.searchQuery) return this.cpuData;
      const query = this.searchQuery.toLowerCase();
      return this.cpuData.filter(cpu =>
        (cpu.title?.toLowerCase() || "").includes(query) ||
        (cpu.brand?.toLowerCase() || "").includes(query) ||
        (cpu.Socket?.toLowerCase() || "").includes(query)
      );
    },
  },
  mounted() {
    this.fetchCpuData();
  },
  methods: {
    async fetchCpuData() {
      try {
        const response = await axios.get("http://localhost:3000/api/cpu");
        this.cpuData = response.data.data;
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    },

    editCpu(cpu) {
      this.selectedCpu = { ...cpu };
    },

    async updateCpu() {
      try {
        await axios.put(`http://localhost:3000/api/cpu/${this.selectedCpu._id}`, this.selectedCpu);
        this.fetchCpuData(); // Refresh data to ensure consistency
        this.selectedCpu = null;
      } catch (error) {
        console.error("Error updating CPU:", error);
        alert("Failed to update CPU. Please try again.");
      }
    },

    async deleteCpu(id) {
      if (!confirm("Are you sure you want to delete this CPU?")) return;

      try {
        await axios.delete(`http://localhost:3000/api/cpu/${id}`);
        this.cpuData = this.cpuData.filter(cpu => cpu._id !== id);
      } catch (error) {
        console.error("Error deleting CPU:", error);
        alert("Failed to delete CPU. Please try again.");
      }
    },

    async addCpu() {
      try {
        // Make sure Socket property is correctly named in the newCpu object
        const cpuData = { ...this.newCpu };
        await axios.post("http://localhost:3000/api/cpu", cpuData);
        this.fetchCpuData(); // Refresh all data
        this.showAddModal = false;
        this.newCpu = { title: "", price: "", Socket: "", brand: "", imgUrl: "" }; // Reset form
      } catch (error) {
        console.error("Error adding CPU:", error);
        alert("Failed to add CPU. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.fixed {
  z-index: 1000;
}

/* Additional hover effects */
.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Fix for input fields */
input:focus {
  outline: none;
}

/* Line clamp for titles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
