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
              @input="searchgpus"
            />
            <div class="search-filters">
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.title" @change="searchgpus"> Name
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.brand" @change="searchgpus"> Brand
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.series" @change="searchgpus"> series
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
          <h2>Edit gpu</h2>
          <form @submit.prevent="updategpu">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="editedgpu.title" required>
            </div>
            
            <div class="form-group">
              <label for="brand">Brand:</label>
              <input type="text" id="brand" v-model="editedgpu.brand" required>
            </div>
            
            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" id="price" v-model="editedgpu.price" required>
            </div>
            
            <div class="form-group">
              <label for="price">Series:</label>
              <input type="text" id="series" v-model="editedgpu.series" required>
            </div>

            <div class="form-group">
              <label for="price">Ram capacity:</label>
              <input type="number" id="ram_capacity_GB" v-model="editedgpu.ram_capacity_GB" required>
            </div>

            <div class="form-group">
              <label for="quantity">Quantity:</label>
              <input type="number" id="quantity" v-model="editedgpu.quantity" required>
            </div>
            
            <div class="form-group">
              <label for="imgUrl">Image URL:</label>
              <input type="text" id="imgUrl" v-model="editedgpu.imgUrl" required>
            </div>
            
            
            <div class="modal-buttons">
              <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- gpu Cards Display -->
      <div class="gpu-container mt-5">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredgpus.length === 0" class="no-results">
          No gpus found matching your search criteria
        </div>
        <div v-for="gpu in filteredgpus" :key="gpu.gpu_id" class="gpu-card">
          <img :src="gpu.imgUrl" alt="gpu Image" class="gpu-image"/>
          <h2>{{ gpu.title }}</h2>
          <p><strong>ID:</strong> {{ gpu.gpu_id }}</p>
          <p><strong>Brand:</strong> {{ gpu.brand }}</p>
          <p><strong>Price:</strong> {{ gpu.price }} ฿</p>
          <p><strong>Ram capacity:</strong> {{ gpu.ram_capacity_GB }} GB</p>
          <p><strong>Series:</strong> {{ gpu.series }}</p>
          <p><strong>Quantity:</strong> {{ gpu.quantity }}</p>
  
          <!-- Edit and Delete Buttons -->
          <div class="del-edit-botton-container">
              <button @click="editgpu(gpu.gpu_id)" class="edit-button" aria-label="Edit gpu">Edit</button>
              <button @click="deletegpu(gpu.gpu_id)" class="delete-button" aria-label="Delete gpu">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- Add gpu Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Add New gpu</h2>
          <form @submit.prevent="addgpu">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="newgpu.title" required>
            </div>
            <div class="form-group">
              <label for="brand">Brand</label>
              <input type="text" id="brand" v-model="newgpu.brand" required>
            </div>
            <div class="form-group">
              <label for="price">Price (฿)</label>
              <input type="number" id="price" v-model="newgpu.price" required>
            </div>
            <div class="form-group">
              <label for="series">series</label>
              <input type="text" id="series" v-model="newgpu.series" required>
            </div>
            <div class="form-group">
              <label for="ram_capacity_GB">Ram capacity</label>
              <input type="number" id="ram_capacity_GB" v-model="newgpu.ram_capacity_GB" required>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" v-model="newgpu.quantity" required>
            </div>
            <div class="form-group">
              <label for="imgUrl">Image URL</label>
              <input type="text" id="imgUrl" v-model="newgpu.imgUrl" required>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Add gpu</button>
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
        gpus: [],
        filteredgpus: [],
        searchQuery: '',
        searchFilters: {
          title: true,
          brand: true,
          series: true,
        },
        loading: true,
        error: null,
        showAddModal: false,
        newgpu: {
            title: '',
            brand: '',
            price: '',
            ram_capacity_GB: null,
            quantity:null,
            series: '',
            imgUrl: ''
        },
        showEditModal: false,
        editedgpu: {
            gpu_id: '',
            title: '',
            brand: '',
            price: null,
            ram_capacity_GB: null,
            quantity:null,
            series: '',
            imgUrl: ''
        },
      };
    },
  
    async created() {
      await this.fetchgpuData();
    },
  
    methods: {
      async fetchgpuData() {
        try {
          this.loading = true;
          const response = await axios.get('http://127.0.0.1:8888/api/v1/GPUs/');
          this.gpus = response.data;
          this.filteredgpus = [...this.gpus];
          this.loading = false;
        } catch (error) {
          console.error('Error fetching gpu data:', error);
          this.error = 'Failed to load gpu data. Please try again.';
          this.loading = false;
        }
      },
  
      async fetchgpuById(gpuId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8888/api/v1/GPUs/${gpuId}`);
          return response.data; // Return the gpu data
        } catch (error) {
          console.error('Error fetching gpu data:', error);
          alert('Failed to fetch gpu data. Please try again.');
          return null; // Return null in case of an error
        }
      },
  
      searchgpus() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
          this.filteredgpus = [...this.gpus];
          return;
        }
        
        this.filteredgpus = this.gpus.filter(gpu => {
          const titleMatch = this.searchFilters.title && gpu.title && gpu.title.toLowerCase().includes(query);
          const brandMatch = this.searchFilters.brand && gpu.brand && gpu.brand.toLowerCase().includes(query);
          const seriesMatch = this.searchFilters.series && gpu.series && gpu.series.toLowerCase().includes(query);
          
          return titleMatch || brandMatch || seriesMatch;
        });
      },
  
      generategpuId() {
        const existingIds = this.gpus.map(gpu => gpu.gpu_id);
        for (let i = 50001; i <= 59999; i++) {
          if (!existingIds.includes(i)) {
            return i; // Return the first missing id in the range
          }
        }
        throw new Error('No available gpu ID in the range 50001-59999');
      },
  
      async addgpu() {
        try {
          // Generate a unique ID for the new gpu
          const gpu_id = this.generategpuId();
          
          // Add the ID to the new gpu object
          const gpuData = { 
            ...this.newgpu,
            gpu_id 
          };
          
          // Send to server
          await axios.post("http://127.0.0.1:8888/api/v1/GPUs/", gpuData);
          
          // Reset form and close modal
          this.showAddModal = false;
          
          // Refresh data from server
          await this.fetchgpuData();
          
          // Reset form data
          this.newgpu = {
            title: '',
            brand: '',
            price: '',
            ram_capacity_GB: null,
            quantity:null,
            series: '',
            imgUrl: ''
          };
        } catch (error) {
          console.error("Error adding gpu:", error);
          alert("Failed to add gpu. Please try again.");
        }
      },
      
      async editgpu(gpuId) {
        this.showEditModal = true;
        // Fetch the gpu data using the gpuId and set it to editedgpu
        const gpuData = await this.fetchgpuById(gpuId);
        if (gpuData) {
          this.editedgpu = { ...gpuData }; // Populate the editedgpu object
        }
      },
  
      async updategpu() {
        try {
          const response = await axios.patch(
            `http://127.0.0.1:8888/api/v1/GPUs/${this.editedgpu.gpu_id}`, 
            this.editedgpu
          );
          console.log('gpu updated successfully:', response.data);
          this.showEditModal = false; // Close the modal
          await this.fetchgpuData(); // Refresh the gpu list
        } catch (error) {
          console.error('Error updating gpu:', error);
          alert('Failed to update gpu. Please try again.'); // Provide user feedback
        }
      },
  
      async deletegpu(gpuId) {
        if (confirm("Are you sure you want to delete this gpu?")) {
          try {
            await axios.delete(`http://127.0.0.1:8888/api/v1/GPUs/${gpuId}`);
            await this.fetchgpuData();
          } catch (error) {
            console.error("Error deleting gpu:", error);
            alert("Failed to delete gpu. Please try again.");
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
  
  .gpu-container {
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
  
  .gpu-card {
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
  
  .gpu-image {
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