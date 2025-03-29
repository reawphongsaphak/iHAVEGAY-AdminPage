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
              @input="searchssds"
            />
            <div class="search-filters">
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.title" @change="searchssds"> Name
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.brand" @change="searchssds"> Brand
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
          <h2>Edit ssd</h2>
          <form @submit.prevent="updatessd">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="editedssd.title" required>
            </div>
            
            <div class="form-group">
              <label for="brand">Brand:</label>
              <input type="text" id="brand" v-model="editedssd.brand" required>
            </div>
            
            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" id="price" v-model="editedssd.price" required>
            </div>

            <div class="form-group">
              <label for="size_GB">Size:</label>
              <input type="text" id="size_GB" v-model="editedssd.size_GB" required>
            </div>

            <div class="form-group">
              <label for="quantity">Quantity:</label>
              <input type="number" id="quantity" v-model="editedssd.quantity" required>
            </div>
            
            <div class="form-group">
              <label for="imgUrl">Image URL:</label>
              <input type="text" id="imgUrl" v-model="editedssd.imgUrl" required>
            </div>
            
            <div class="modal-buttons">
              <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- ssd Cards Display -->
      <div class="ssd-container mt-5">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredssds.length === 0" class="no-results">
          No ssds found matching your search criteria
        </div>
        <div v-for="ssd in filteredssds" :key="ssd.ssd_id" class="ssd-card">
          <img :src="ssd.imgUrl" alt="ssd Image" class="ssd-image"/>
          <h2>{{ ssd.title }}</h2>
          <p><strong>ID:</strong> {{ ssd.ssd_id }}</p>
          <p><strong>Brand:</strong> {{ ssd.brand }}</p>
          <p><strong>Price:</strong> {{ ssd.price }}฿</p>
          <p><strong>Size:</strong> {{ ssd.size_GB }} GB</p>
          <p><strong>Quantity:</strong> {{ ssd.quantity }}</p>
  
          <!-- Edit and Delete Buttons -->
          <div class="del-edit-botton-container">
              <button @click="editssd(ssd.ssd_id)" class="edit-button" aria-label="Edit ssd">Edit</button>
              <button @click="deletessd(ssd.ssd_id)" class="delete-button" aria-label="Delete ssd">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- Add ssd Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Add New ssd</h2>
          <form @submit.prevent="addssd">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="newssd.title" required>
            </div>
            <div class="form-group">
              <label for="brand">Brand</label>
              <input type="text" id="brand" v-model="newssd.brand" required>
            </div>
            <div class="form-group">
              <label for="price">Price (฿)</label>
              <input type="number" id="price" v-model="newssd.price" required>
            </div>
            <div class="form-group">
              <label for="size_GB">Size</label>
              <input type="text" id="size_GB" v-model="newssd.size_GB" required>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" v-model="newssd.quantity" required>
            </div>
            <div class="form-group">
              <label for="imgUrl">Image URL</label>
              <input type="text" id="imgUrl" v-model="newssd.imgUrl" required>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Add ssd</button>
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
        ssds: [],
        filteredssds: [],
        searchQuery: '',
        searchFilters: {
          title: true,
        },
        loading: true,
        error: null,
        showAddModal: false,
        newssd: {
          title: '',
          brand: '',
          price: '',
          size_GB: '',
          quantity:'',
          imgUrl: ''
        },
        showEditModal: false,
        editedssd: {
          ssd_id: '',
          title: '',
          brand: '',
          price: null,
          size_GB: '',
          quantity:'',
          imgUrl: ''
        },
      };
    },
  
    async created() {
      await this.fetchssdData();
    },
  
    methods: {
      async fetchssdData() {
        try {
          this.loading = true;
          const response = await axios.get('http://127.0.0.1:8888/api/v1/storage/ssds');
          this.ssds = response.data;
          this.filteredssds = [...this.ssds];
          this.loading = false;
        } catch (error) {
          console.error('Error fetching ssd data:', error);
          this.error = 'Failed to load ssd data. Please try again.';
          this.loading = false;
        }
      },
  
      async fetchssdById(ssdId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8888/api/v1/storage/ssds/${ssdId}`);
          return response.data; // Return the ssd data
        } catch (error) {
          console.error('Error fetching ssd data:', error);
          alert('Failed to fetch ssd data. Please try again.');
          return null; // Return null in case of an error
        }
      },
  
      searchssds() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
          this.filteredssds = [...this.ssds];
          return;
        }
        
        this.filteredssds = this.ssds.filter(ssd => {
          const titleMatch = this.searchFilters.title && ssd.title && ssd.title.toLowerCase().includes(query);
          const brandMatch = this.searchFilters.brand && ssd.brand && ssd.brand.toLowerCase().includes(query);
          
          return titleMatch || brandMatch;
        });
      },
  
      generatessdId() {
        const existingIds = this.ssds.map(ssd => ssd.ssd_id);
        for (let i = 42001; i <= 42999; i++) {
          if (!existingIds.includes(i)) {
            return i; // Return the first missing id in the range
          }
        }
        throw new Error('No available ssd ID in the range 42001-42999');
      },
  
      async addssd() {
        try {
          // Generate a unique ID for the new ssd
          const ssd_id = this.generatessdId();
          
          // Add the ID to the new ssd object
          const ssdData = { 
            ...this.newssd,
            ssd_id 
          };
          
          // Send to server
          await axios.post("http://127.0.0.1:8888/api/v1/storage/ssds", ssdData);
          
          // Reset form and close modal
          this.showAddModal = false;
          
          // Refresh data from server
          await this.fetchssdData();
          
          // Reset form data
          this.newssd = {
            title: '',
            brand: '',
            price: '',
            size_GB: '',
            quantity:'',
            imgUrl: ''
          };
        } catch (error) {
          console.error("Error adding ssd:", error);
          alert("Failed to add ssd. Please try again.");
        }
      },
      
      async editssd(ssdId) {
        this.showEditModal = true;
        // Fetch the ssd data using the ssdId and set it to editedssd
        const ssdData = await this.fetchssdById(ssdId);
        if (ssdData) {
          this.editedssd = { ...ssdData }; // Populate the editedssd object
        }
      },
  
      async updatessd() {
        try {
          const response = await axios.patch(
            `http://127.0.0.1:8888/api/v1/storage/ssds/${this.editedssd.ssd_id}`, 
            this.editedssd
          );
          console.log('ssd updated successfully:', response.data);
          this.showEditModal = false; // Close the modal
          await this.fetchssdData(); // Refresh the ssd list
        } catch (error) {
          console.error('Error updating ssd:', error);
          alert('Failed to update ssd. Please try again.'); // Provide user feedback
        }
      },
  
      async deletessd(ssdId) {
        if (confirm("Are you sure you want to delete this ssd?")) {
          try {
            await axios.delete(`http://127.0.0.1:8888/api/v1/storage/ssds/${ssdId}`);
            await this.fetchssdData();
          } catch (error) {
            console.error("Error deleting ssd:", error);
            alert("Failed to delete ssd. Please try again.");
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
  
  .ssd-container {
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
  
  .ssd-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    width: 300px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Pushes buttons to the bottom */
  }
  
  .ssd-image {
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