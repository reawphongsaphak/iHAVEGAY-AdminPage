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
              @input="searchmainboards"
            />
            <div class="search-filters">
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.title" @change="searchmainboards"> Name
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.brand" @change="searchmainboards"> Brand
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.socket" @change="searchmainboards"> Socket
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.size" @change="searchmainboards"> size
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
          <h2>Edit mainboard</h2>
          <form @submit.prevent="updatemainboard">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="editedmainboard.title" required>
            </div>
            
            <div class="form-group">
              <label for="brand">Brand:</label>
              <input type="text" id="brand" v-model="editedmainboard.brand" required>
            </div>
            
            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" id="price" v-model="editedmainboard.price" required>
            </div>
            
            <div class="form-group">
              <label for="socket">Socket:</label>
              <input type="text" id="socket" v-model="editedmainboard.socket" required>
            </div>

            <div class="form-group">
              <label for="memory-type">Memory type:</label>
              <input type="text" id="memory-type" v-model="editedmainboard.memory_type" required>
            </div>

            <div class="form-group">
              <label for="size">Size:</label>
              <input type="text" id="size" v-model="editedmainboard.size" required>
            </div>
            
            <div class="form-group">
              <label for="imgUrl">Image URL:</label>
              <input type="text" id="imgUrl" v-model="editedmainboard.imgUrl" required>
            </div>
            
            <div class="modal-buttons">
              <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- mainboard Cards Display -->
      <div class="mainboard-container mt-5">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredmainboards.length === 0" class="no-results">
          No mainboards found matching your search criteria
        </div>
        <div v-for="mainboard in filteredmainboards" :key="mainboard.mainboard_id" class="mainboard-card">
          <img :src="mainboard.imgUrl" alt="mainboard Image" class="mainboard-image"/>
          <h2>{{ mainboard.title }}</h2>
          <p><strong>ID:</strong> {{ mainboard.mainboard_id }}</p>
          <p><strong>Brand:</strong> {{ mainboard.brand }}</p>
          <p><strong>Price:</strong> {{ mainboard.price }}฿</p>
          <p><strong>Memory type:</strong> {{ mainboard.memory_type }}</p>
          <p><strong>Size:</strong> {{ mainboard.size }}</p>
          <p><strong>Socket:</strong> {{ mainboard.socket }}</p>
  
          <!-- Edit and Delete Buttons -->
          <div class="del-edit-botton-container">
              <button @click="editmainboard(mainboard.mainboard_id)" class="edit-button" aria-label="Edit mainboard">Edit</button>
              <button @click="deletemainboard(mainboard.mainboard_id)" class="delete-button" aria-label="Delete mainboard">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- Add mainboard Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Add New mainboard</h2>
          <form @submit.prevent="addmainboard">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="newmainboard.title" required>
            </div>
            <div class="form-group">
              <label for="brand">Brand</label>
              <input type="text" id="brand" v-model="newmainboard.brand" required>
            </div>
            <div class="form-group">
              <label for="price">Price (฿)</label>
              <input type="number" id="price" v-model="newmainboard.price" required>
            </div>
            <div class="form-group">
              <label for="socket">Socket</label>
              <input type="text" id="socket" v-model="newmainboard.socket" required>
            </div>
            <div class="form-group">
              <label for="memory_type">Memory type</label>
              <input type="text" id="memory_type" v-model="newmainboard.memory_type" required>
            </div>
            <div class="form-group">
              <label for="size">Size</label>
              <input type="text" id="size" v-model="newmainboard.size" required>
            </div>
            <div class="form-group">
              <label for="imgUrl">Image URL</label>
              <input type="text" id="imgUrl" v-model="newmainboard.imgUrl" required>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Add mainboard</button>
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
        mainboards: [],
        filteredmainboards: [],
        searchQuery: '',
        searchFilters: {
          title: true,
          brand: true,
          Socket: true,
        },
        loading: true,
        error: null,
        showAddModal: false,
        newmainboard: {
          title: '',
          brand: '',
          price: '',
          socket: '',
          memory_type: '',
          size: '',
          imgUrl: ''
        },
        showEditModal: false,
        editedmainboard: {
          mainboard_id: '',
          title: '',
          brand: '',
          price: null,
          socket: '',
          memory_type: '',
          size: '',
          imgUrl: ''
        },
      };
    },
  
    async created() {
      await this.fetchmainboardData();
    },
  
    methods: {
      async fetchmainboardData() {
        try {
          this.loading = true;
          const response = await axios.get('http://127.0.0.1:8000/Mainboards');
          this.mainboards = response.data;
          this.filteredmainboards = [...this.mainboards];
          this.loading = false;
        } catch (error) {
          console.error('Error fetching mainboard data:', error);
          this.error = 'Failed to load mainboard data. Please try again.';
          this.loading = false;
        }
      },
  
      async fetchmainboardById(mainboardId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/Mainboards/${mainboardId}`);
          return response.data; // Return the mainboard data
        } catch (error) {
          console.error('Error fetching mainboard data:', error);
          alert('Failed to fetch mainboard data. Please try again.');
          return null; // Return null in case of an error
        }
      },
  
      searchmainboards() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
          this.filteredmainboards = [...this.mainboards];
          return;
        }
        
        this.filteredmainboards = this.mainboards.filter(mainboard => {
          const titleMatch = this.searchFilters.title && mainboard.title && mainboard.title.toLowerCase().includes(query);
          const brandMatch = this.searchFilters.brand && mainboard.brand && mainboard.brand.toLowerCase().includes(query);
          const memoryTypeMatch = this.searchFilters.Socket && mainboard.socket && mainboard.socket.toLowerCase().includes(query);
          const sizeMatch = this.searchFilters.size && mainboard.size && mainboard.size.toLowerCase().includes(query);
          
          return titleMatch || brandMatch || memoryTypeMatch || sizeMatch;
        });
      },
  
      generatemainboardId() {
        const existingIds = this.mainboards.map(mainboard => mainboard.mainboard_id);
        for (let i = 30001; i <= 39999; i++) {
          if (!existingIds.includes(i)) {
            return i; // Return the first missing id in the range
          }
        }
        throw new Error('No available mainboard ID in the range 30001-39999');
      },
  
      async addmainboard() {
        try {
          // Generate a unique ID for the new mainboard
          const mainboard_id = this.generatemainboardId();
          
          // Add the ID to the new mainboard object
          const mainboardData = { 
            ...this.newmainboard,
            mainboard_id 
          };
          
          // Send to server
          await axios.post("http://127.0.0.1:8000/Mainboards", mainboardData);
          
          // Reset form and close modal
          this.showAddModal = false;
          
          // Refresh data from server
          await this.fetchmainboardData();
          
          // Reset form data
          this.newmainboard = {
            title: '',
            brand: '',
            price: '',
            socket: '',
            memory_type: '',
            size: '',
            imgUrl: ''
          };
        } catch (error) {
          console.error("Error adding mainboard:", error);
          alert("Failed to add mainboard. Please try again.");
        }
      },
      
      async editmainboard(mainboardId) {
        this.showEditModal = true;
        // Fetch the mainboard data using the mainboardId and set it to editedmainboard
        const mainboardData = await this.fetchmainboardById(mainboardId);
        if (mainboardData) {
          this.editedmainboard = { ...mainboardData }; // Populate the editedmainboard object
        }
      },
  
      async updatemainboard() {
        try {
          const response = await axios.patch(
            `http://127.0.0.1:8000/Mainboards/${this.editedmainboard.mainboard_id}`, 
            this.editedmainboard
          );
          console.log('mainboard updated successfully:', response.data);
          this.showEditModal = false; // Close the modal
          await this.fetchmainboardData(); // Refresh the mainboard list
        } catch (error) {
          console.error('Error updating mainboard:', error);
          alert('Failed to update mainboard. Please try again.'); // Provide user feedback
        }
      },
  
      async deletemainboard(mainboardId) {
        if (confirm("Are you sure you want to delete this mainboard?")) {
          try {
            await axios.delete(`http://127.0.0.1:8000/Mainboards/${mainboardId}`);
            await this.fetchmainboardData();
          } catch (error) {
            console.error("Error deleting mainboard:", error);
            alert("Failed to delete mainboard. Please try again.");
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
  
  .mainboard-container {
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
  
  .mainboard-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    width: 300px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    height: 570px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Pushes buttons to the bottom */
  }
  
  .mainboard-image {
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