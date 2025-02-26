<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold mb-6">CPU List</h1>

    <!-- Search Input -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a CPU..."
      class="input input-bordered input-md w-full max-w-xs mb-4"
    />

    <!-- Add CPU Button -->
    <button @click="showAddModal = true" class="btn btn-success">Add CPU</button>

    <!-- Display CPU List -->
    <div v-if="filteredCpuData.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      <div v-for="cpu in filteredCpuData" :key="cpu._id" class="border p-4 rounded-lg shadow-lg">
        <img :src="cpu.imgUrl" alt="CPU Image" class="w-full h-40 object-cover rounded-t-lg mb-2">
        <h2 class="text-lg font-semibold">{{ cpu.title }}</h2>
        <p class="text-sm text-gray-500">Brand: {{ cpu.brand }}</p>
        <p class="text-sm text-gray-500">Socket: {{ cpu.Socket }}</p>
        <p class="text-lg font-bold text-green-500">Price: {{ cpu.price }} THB</p>

        <!-- Action Buttons -->
        <div class="flex justify-between mt-3">
          <button @click="editCpu(cpu)" class="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
          <button @click="deleteCpu(cpu.id)" class="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>

    <!-- If no CPUs found -->
    <div v-else>
      <p class="text-center text-xl">No CPUs found...</p>
    </div>

    <!-- Edit Modal -->
    <div v-if="selectedCpu" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Edit CPU</h2>
        <label class="block mb-2">Title</label>
        <input v-model="selectedCpu.title" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Price</label>
        <input v-model="selectedCpu.price" type="number" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Socket</label>
        <input v-model="selectedCpu.Socket" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Brand</label>
        <input v-model="selectedCpu.brand" class="w-full border p-2 rounded mb-3" />

        <!-- Modal Buttons -->
        <div class="flex justify-between mt-4">
          <button @click="updateCpu" class="px-3 py-1 bg-green-500 text-white rounded">Save</button>
          <button @click="selectedCpu = null" class="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Add CPU Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Add New CPU</h2>
        <label class="block mb-2">Title</label>
        <input v-model="newCpu.title" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Price</label>
        <input v-model="newCpu.price" type="number" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Socket</label>
        <input v-model="newCpu.Socket" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Brand</label>
        <input v-model="newCpu.brand" class="w-full border p-2 rounded mb-3" />
        <label class="block mb-2">Image URL</label>
        <input v-model="newCpu.imgUrl" class="w-full border p-2 rounded mb-3" />

        <!-- Modal Buttons -->
        <div class="flex justify-between mt-4">
          <button @click="addCpu" class="px-3 py-1 bg-green-500 text-white rounded">Add</button>
          <button @click="showAddModal = false" class="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      rams: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/Rams');
      console.log(response.data); // Check what data you are getting
      this.rams = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
    // Update CPU
    async updateCpu() {
      try {
        await axios.put(`http://localhost:3000/api/cpu/${this.selectedCpu._id}`, this.selectedCpu);
        this.cpuData = this.cpuData.map(cpu =>
          cpu._id === this.selectedCpu._id ? Object.assign({}, this.selectedCpu) : cpu
        );
        this.selectedCpu = null;
      } catch (error) {
        console.error("Error updating CPU:", error);
      }
    },

    // Delete CPU
    async deleteCpu(id) {
      if (!confirm("Are you sure you want to delete this CPU?")) return;

      try {
        await axios.delete(`http://localhost:3000/api/cpu/${id}`);
        this.cpuData = this.cpuData.filter(cpu => cpu._id !== id);
      } catch (error) {
        console.error("Error deleting CPU:", error);
      }
    },

    // Add new CPU
    async addCpu() {
      try {
        const response = await axios.post("http://localhost:3000/api/cpu", this.newCpu);
        this.cpuData.push(response.data); // Add new CPU to UI
        this.showAddModal = false;
        this.newCpu = { title: "", price: "", socket: "", brand: "", imgUrl: "" }; // Reset form
      } catch (error) {
        console.error("Error adding CPU:", error);
      }
  },
};
</script>

<style scoped>
/* Modal Styling */
.fixed {
  z-index: 1000;
}
</style>
