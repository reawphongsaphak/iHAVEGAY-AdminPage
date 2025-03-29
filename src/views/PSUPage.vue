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
              @input="searchPSUs"
            />
            <div class="search-filters">
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.title" @change="searchPSUs"> Name
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.brand" @change="searchPSUs"> Brand
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
          <h2>Edit PSU</h2>
          <form @submit.prevent="updatePSU">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="editedPSU.title" required>
            </div>
            
            <div class="form-group">
              <label for="brand">Brand:</label>
              <input type="text" id="brand" v-model="editedPSU.brand" required>
            </div>
            
            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" id="price" v-model.number="editedPSU.price" required>
            </div>
  
            <div class="form-group">
              <label for="Max_Watt">Max watt:</label>
              <input type="number" id="Max_Watt" v-model.number="editedPSU.Max_Watt" required>
            </div>
  
            <div class="form-group">
              <label for="certs">Certificate:</label>
              <input type="text" id="certs" v-model="editedPSU.certs" required>
            </div>

            <div class="form-group">
              <label for="quantity">Quantity:</label>
              <input type="number" id="quantity" v-model="editedPSU.quantity" required>
            </div>
            
            <div class="form-group">
              <label for="imgUrl">Image URL:</label>
              <input type="text" id="imgUrl" v-model="editedPSU.imgUrl" required>
            </div>
            
            <div class="modal-buttons">
              <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- PSU Cards Display -->
      <div class="PSU-container mt-5">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredPSUs.length === 0" class="no-results">
          No PSUs found matching your search criteria
        </div>
        <div v-for="PSU in filteredPSUs" :key="PSU.psu_id" class="PSU-card">
          <img :src="PSU.imgUrl" alt="PSU Image" class="PSU-image"/>
          <h2>{{ PSU.title }}</h2>
          <p><strong>ID:</strong> {{ PSU.psu_id }}</p>
          <p><strong>Brand:</strong> {{ PSU.brand }}</p>
          <p><strong>Price:</strong> {{ PSU.price }} ฿</p>
          <p><strong>Max watt:</strong> {{ PSU.Max_Watt }} </p>
          <p><strong>Certificate:</strong> {{ PSU.certs }} </p>
          <p><strong>Quantity:</strong> {{ PSU.quantity }} </p>
  
          <!-- Edit and Delete Buttons -->
          <div class="del-edit-botton-container">
              <button @click="editPSU(PSU.psu_id)" class="edit-button" aria-label="Edit PSU">Edit</button>
              <button @click="deletePSU(PSU.psu_id)" class="delete-button" aria-label="Delete PSU">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- Add PSU Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Add New PSU</h2>
          <form @submit.prevent="addPSU">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="newPSU.title" required>
            </div>
            <div class="form-group">
              <label for="brand">Brand</label>
              <input type="text" id="brand" v-model="newPSU.brand" required>
            </div>
            <div class="form-group">
              <label for="price">Price (฿)</label>
              <input type="number" id="price" v-model.number="newPSU.price" required>
            </div>
            <div class="form-group">
              <label for="Max_Watt">Max watt</label>
              <input type="number" id="Max_Watt" v-model.number="newPSU.Max_Watt" required>
            </div>
            <div class="form-group">
              <label for="certs">Certificate</label>
              <input type="text" id="certs" v-model="newPSU.certs" required>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" v-model="newPSU.quantity" required>
            </div>
            <div class="form-group">
              <label for="imgUrl">Image URL</label>
              <input type="text" id="imgUrl" v-model="newPSU.imgUrl" required>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Add PSU</button>
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
        PSUs: [],
        filteredPSUs: [],
        searchQuery: '',
        searchFilters: {
          title: true,
          brand: true,
          series: true,
        },
        loading: true,
        error: null,
        showAddModal: false,
        newPSU: {
            title: '',
            brand: '',
            price: null,
            Max_Watt: null,
            certs: '',
            quantity:'',
            imgUrl: ''
        },
        showEditModal: false,
        editedPSU: {
            psu_id: '',
            title: '',
            brand: '',
            price: null,
            Max_Watt: null,
            certs: '',
            quantity:'',
            imgUrl: ''
        },
      };
    },
  
    async created() {
      await this.fetchPSUData();
    },
  
    methods: {
      async fetchPSUData() {
        try {
          this.loading = true;
          const response = await axios.get('http://127.0.0.1:8888/api/v1/PSUs/');
          this.PSUs = response.data;
          this.filteredPSUs = [...this.PSUs];
          this.loading = false;
        } catch (error) {
          console.error('Error fetching PSU data:', error);
          this.error = 'Failed to load PSU data. Please try again.';
          this.loading = false;
        }
      },
  
      async fetchPSUById(PSUId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8888/api/v1/PSUs/${PSUId}`);
          return response.data; // Return the PSU data
        } catch (error) {
          console.error('Error fetching PSU data:', error);
          alert('Failed to fetch PSU data. Please try again.');
          return null; // Return null in case of an error
        }
      },
  
      searchPSUs() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
          this.filteredPSUs = [...this.PSUs];
          return;
        }
        
        this.filteredPSUs = this.PSUs.filter(PSU => {
          const titleMatch = this.searchFilters.title && PSU.title && PSU.title.toLowerCase().includes(query);
          const brandMatch = this.searchFilters.brand && PSU.brand && PSU.brand.toLowerCase().includes(query);
          
          return titleMatch || brandMatch;
        });
      },
  
      generatePSUId() {
        const existingIds = this.PSUs.map(PSU => PSU.psu_id);
        for (let i = 70001; i <= 79999; i++) {
          if (!existingIds.includes(i)) {
            return i; // Return the first missing id in the range
          }
        }
        throw new Error('No available PSU ID in the range 70001-79999');
      },
  
      async addPSU() {
        try {
          // Generate a unique ID for the new PSU
          const psu_id = this.generatePSUId();
          
          // Add the ID to the new PSU object
          const PSUData = { 
            ...this.newPSU,
            psu_id,
            price: Number(this.newPSU.price),
            Max_Watt: Number(this.newPSU.Max_Watt)
          };
          
          // Send to server
          await axios.post("http://127.0.0.1:8888/api/v1/PSUs/", PSUData);
          
          // Reset form and close modal
          this.showAddModal = false;
          
          // Refresh data from server
          await this.fetchPSUData();
          
          // Reset form data
          this.newPSU = {
            title: '',
            brand: '',
            price: '',
            Max_Watt: '',
            certs: '',
            quantity:'',
            imgUrl: ''
          };
        } catch (error) {
          console.error("Error adding PSU:", error);
          alert("Failed to add PSU. Please try again.");
        }
      },
      
      async editPSU(PSUId) {
        try {
          this.showEditModal = true;
          // Fetch the PSU data using the PSUId
          const PSUData = await this.fetchPSUById(PSUId);
          if (PSUData) {
            // Ensure correct data types before populating the form
            this.editedPSU = { 
              ...PSUData,
              price: Number(PSUData.price),
              Max_Watt: Number(PSUData.Max_Watt)
            };
            console.log("Editing PSU data:", this.editedPSU);
          }
        } catch (error) {
          console.error('Error preparing PSU for edit:', error);
        }
      },
  
      async updatePSU() {
        try {
            // Prepare the data to be sent
            const updateData = {
            psu_id: this.editedPSU.psu_id,
            title: this.editedPSU.title,
            brand: this.editedPSU.brand,
            price: Number(this.editedPSU.price),
            Max_Watt: Number(this.editedPSU.Max_Watt),
            certs: this.editedPSU.certs,
            quantity: this.editedPSU.quantity,
            imgUrl: this.editedPSU.imgUrl
            };
            
            console.log('Sending update with data:', updateData);

            const response = await axios.patch(
            `http://127.0.0.1:8888/api/v1/PSUs/${this.editedPSU.psu_id}`, updateData);

            console.log('PSU updated successfully:', response.data);
            this.showEditModal = false; // Close the modal
            await this.fetchPSUData(); // Refresh the PSU list
        } catch (error) {
            console.error('Error updating PSU:', error.response ? error.response.data : error.message);
            alert('Failed to update PSU. Please try again.');
        }
      },

  
      async deletePSU(PSUId) {
        if (confirm("Are you sure you want to delete this PSU?")) {
          try {
            await axios.delete(`http://127.0.0.1:8888/api/v1/PSUs/${PSUId}`);
            await this.fetchPSUData();
          } catch (error) {
            console.error("Error deleting PSU:", error);
            alert("Failed to delete PSU. Please try again.");
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
  
  .PSU-container {
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
  
  .PSU-card {
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
  
  .PSU-image {
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