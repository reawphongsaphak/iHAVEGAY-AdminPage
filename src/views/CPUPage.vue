<template>
  <div>
    <!-- Search and Add Section -->
    <div class="controls-container">
      <div class="search-container">
        <div class="search-wrapper">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by name, brand, or memory type..." 
            class="search-input"
            @input="searchcpus"
          />
          <div class="search-filters">
            <label class="filter-label">
              <input type="checkbox" v-model="searchFilters.title" @change="searchcpus"> Name
            </label>
            <label class="filter-label">
              <input type="checkbox" v-model="searchFilters.brand" @change="searchcpus"> Brand
            </label>
            <label class="filter-label">
              <input type="checkbox" v-model="searchFilters.Socket" @change="searchcpus"> Socket
            </label>
          </div>
        </div>
      </div>
      <div class="add-button-container">
        <button @click="showAddModal = true" class="add-button"> + </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Edit cpu</h2>
        <form @submit.prevent="updatecpu">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="editedcpu.title" required>
          </div>
          
          <div class="form-group">
            <label for="brand">Brand:</label>
            <input type="text" id="brand" v-model="editedcpu.brand" required>
          </div>
          
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" id="price" v-model="editedcpu.price" required>
          </div>
          
          <div class="form-group">
            <label for="memory-type">Socket:</label>
            <input type="text" id="memory-type" v-model="editedcpu.Socket" required>
          </div>
          
          <div class="form-group">
            <label for="imgUrl">Image URL:</label>
            <input type="text" id="imgUrl" v-model="editedcpu.imgUrl" required>
          </div>
          
          <div class="modal-buttons">
            <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- cpu Cards Display -->
    <div class="cpu-container mt-5">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="filteredcpus.length === 0" class="no-results">
        No cpus found matching your search criteria
      </div>
      <div v-for="cpu in filteredcpus" :key="cpu.cpu_id" class="cpu-card">
        <img :src="cpu.imgUrl" alt="cpu Image" class="cpu-image"/>
        <h2>{{ cpu.title }}</h2>
        <p><strong>ID:</strong> {{ cpu.cpu_id }}</p>
        <p><strong>Brand:</strong> {{ cpu.brand }}</p>
        <p><strong>Price:</strong> {{ cpu.price }}฿</p>
        <p><strong>Socket:</strong> {{ cpu.Socket }}</p>

        <!-- Edit and Delete Buttons -->
        <div class="del-edit-botton-container">
            <button @click="editcpu(cpu.cpu_id)" class="edit-button" aria-label="Edit cpu">Edit</button>
            <button @click="deletecpu(cpu.cpu_id)" class="delete-button" aria-label="Delete cpu">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add cpu Modal -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add New cpu</h2>
        <form @submit.prevent="addcpu">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="newcpu.title" required>
          </div>
          <div class="form-group">
            <label for="brand">Brand</label>
            <input type="text" id="brand" v-model="newcpu.brand" required>
          </div>
          <div class="form-group">
            <label for="price">Price (฿)</label>
            <input type="number" id="price" v-model="newcpu.price" required>
          </div>
          <div class="form-group">
            <label for="Socket">Socket</label>
            <input type="text" id="Socket" v-model="newcpu.Socket" required>
          </div>
          <div class="form-group">
            <label for="imgUrl">Image URL</label>
            <input type="text" id="imgUrl" v-model="newcpu.imgUrl" required>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">Add cpu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cpus: [],
      filteredcpus: [],
      searchQuery: '',
      searchFilters: {
        title: true,
        brand: true,
        Socket: true,
      },
      loading: true,
      error: null,
      showAddModal: false,
      newcpu: {
        title: '',
        brand: '',
        price: '',
        Socket: '',
        imgUrl: ''
      },
      showEditModal: false,
      editedcpu: {
        cpu_id: '',
        title: '',
        brand: '',
        price: null,
        Socket: '',
        imgUrl: ''
      },
    };
  },

  async created() {
    await this.fetchcpuData();
  },

  methods: {
    async fetchcpuData() {
      try {
        this.loading = true;
        const response = await axios.get('http://127.0.0.1:8000/CPUs');
        this.cpus = response.data;
        this.filteredcpus = [...this.cpus];
        this.loading = false;
      } catch (error) {
        console.error('Error fetching cpu data:', error);
        this.error = 'Failed to load cpu data. Please try again.';
        this.loading = false;
      }
    },

    async fetchcpuById(cpuId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/CPUs/${cpuId}`);
        return response.data; // Return the cpu data
      } catch (error) {
        console.error('Error fetching cpu data:', error);
        alert('Failed to fetch cpu data. Please try again.');
        return null; // Return null in case of an error
      }
    },

    searchcpus() {
      const query = this.searchQuery.toLowerCase().trim();
      
      if (!query) {
        this.filteredcpus = [...this.cpus];
        return;
      }
      
      this.filteredcpus = this.cpus.filter(cpu => {
        const titleMatch = this.searchFilters.title && cpu.title && cpu.title.toLowerCase().includes(query);
        const brandMatch = this.searchFilters.brand && cpu.brand && cpu.brand.toLowerCase().includes(query);
        const memoryTypeMatch = this.searchFilters.Socket && cpu.Socket && cpu.Socket.toLowerCase().includes(query);
        
        return titleMatch || brandMatch || memoryTypeMatch;
      });
    },

    generatecpuId() {
      const existingIds = this.cpus.map(cpu => cpu.cpu_id);
      for (let i = 10001; i <= 19999; i++) {
        if (!existingIds.includes(i)) {
          return i; // Return the first missing id in the range
        }
      }
      throw new Error('No available CPU ID in the range 10001-19999');
    },

    async addcpu() {
      try {
        // Generate a unique ID for the new cpu
        const cpu_id = this.generatecpuId();
        
        // Add the ID to the new cpu object
        const cpuData = { 
          ...this.newcpu,
          cpu_id 
        };
        
        // Send to server
        await axios.post("http://127.0.0.1:8000/CPUs", cpuData);
        
        // Reset form and close modal
        this.showAddModal = false;
        
        // Refresh data from server
        await this.fetchcpuData();
        
        // Reset form data
        this.newcpu = {
          title: '',
          brand: '',
          price: '',
          Socket: '',
          imgUrl: ''
        };
      } catch (error) {
        console.error("Error adding cpu:", error);
        alert("Failed to add cpu. Please try again.");
      }
    },
    
    async editcpu(cpuId) {
      this.showEditModal = true;
      // Fetch the cpu data using the cpuId and set it to editedcpu
      const cpuData = await this.fetchcpuById(cpuId);
      if (cpuData) {
        this.editedcpu = { ...cpuData }; // Populate the editedcpu object
      }
    },

    async updatecpu() {
      try {
        const response = await axios.patch(
          `http://127.0.0.1:8000/cpus/${this.editedcpu.cpu_id}`, 
          this.editedcpu
        );
        console.log('cpu updated successfully:', response.data);
        this.showEditModal = false; // Close the modal
        await this.fetchcpuData(); // Refresh the cpu list
      } catch (error) {
        console.error('Error updating cpu:', error);
        alert('Failed to update cpu. Please try again.'); // Provide user feedback
      }
    },

    async deletecpu(cpuId) {
      if (confirm("Are you sure you want to delete this cpu?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/CPUs/${cpuId}`);
          await this.fetchcpuData();
        } catch (error) {
          console.error("Error deleting cpu:", error);
          alert("Failed to delete cpu. Please try again.");
        }
      }
    }
  }
};
</script>

<style scoped>
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 0 10px;
}

.search-container {
  margin-top: 10px;
  flex: 1;
  max-width: 500px;
}

.search-wrapper {
  display: flex;
  flex-direction: column;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 8px;
}

.search-filters {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.filter-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.filter-label input {
  margin-right: 5px;
}

.add-button {
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #45a049;
}

.cpu-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
}

.no-results {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
  width: 100%;
}

.cpu-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 300px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Pushes buttons to the bottom */
}

.cpu-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.del-edit-botton-container{
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
}

/* Button Styling */
button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  margin: 0 4px;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #991f0f;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>