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
              @input="searchm2s"
            />
            <div class="search-filters">
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.title" @change="searchm2s"> Name
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.brand" @change="searchm2s"> Brand
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
          <h2>Edit m2</h2>
          <form @submit.prevent="updatem2">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="editedm2.title" required>
            </div>
            
            <div class="form-group">
              <label for="brand">Brand:</label>
              <input type="text" id="brand" v-model="editedm2.brand" required>
            </div>
            
            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" id="price" v-model="editedm2.price" required>
            </div>

            <div class="form-group">
              <label for="capacity">Size:</label>
              <input type="text" id="capacity" v-model="editedm2.capacity" required>
            </div>

            <div class="form-group">
              <label for="read">Read speed:</label>
              <input type="text" id="read" v-model="editedm2.read" required>
            </div>

            <div class="form-group">
              <label for="memory-type">Write speed:</label>
              <input type="text" id="write" v-model="editedm2.write" required>
            </div>

            <div class="form-group">
              <label for="quantity">Write speed:</label>
              <input type="number" id="quantity" v-model="editedm2.quantity" required>
            </div>
            
            <div class="form-group">
              <label for="imgUrl">Image URL:</label>
              <input type="text" id="imgUrl" v-model="editedm2.imgUrl" required>
            </div>
            
            <div class="modal-buttons">
              <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- m2 Cards Display -->
      <div class="m2-container mt-5">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredm2s.length === 0" class="no-results">
          No m2s found matching your search criteria
        </div>
        <div v-for="m2 in filteredm2s" :key="m2.m2_id" class="m2-card">
          <img :src="m2.imgUrl" alt="m2 Image" class="m2-image"/>
          <h2>{{ m2.title }}</h2>
          <p><strong>ID:</strong> {{ m2.m2_id }}</p>
          <p><strong>Brand:</strong> {{ m2.brand }}</p>
          <p><strong>Price:</strong> {{ m2.price }}฿</p>
          <p><strong>Read speed:</strong> {{ m2.read }}</p>
          <p><strong>Write speed:</strong> {{ m2.write }}</p>
          <p><strong>Size:</strong> {{ m2.capacity }} GB</p>
          <p><strong>Quantity:</strong> {{ m2.quantity }}</p>
  
          <!-- Edit and Delete Buttons -->
          <div class="del-edit-botton-container">
              <button @click="editm2(m2.m2_id)" class="edit-button" aria-label="Edit m2">Edit</button>
              <button @click="deletem2(m2.m2_id)" class="delete-button" aria-label="Delete m2">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- Add m2 Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Add New m2</h2>
          <form @submit.prevent="addm2">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="newm2.title" required>
            </div>
            <div class="form-group">
              <label for="brand">Brand</label>
              <input type="text" id="brand" v-model="newm2.brand" required>
            </div>
            <div class="form-group">
              <label for="price">Price (฿)</label>
              <input type="number" id="price" v-model="newm2.price" required>
            </div>
            <div class="form-group">
              <label for="capacity">Size</label>
              <input type="text" id="capacity" v-model="newm2.capacity" required>
            </div>
            <div class="form-group">
              <label for="read">Read speed (MB/s)</label>
              <input type="text" id="read" v-model="newm2.read" required>
            </div>
            <div class="form-group">
              <label for="write">Write speed (MB/s)</label>
              <input type="text" id="write" v-model="newm2.write" required>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" v-model="newm2.quantity" required>
            </div>
            <div class="form-group">
              <label for="imgUrl">Image URL</label>
              <input type="text" id="imgUrl" v-model="newm2.imgUrl" required>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Add m2</button>
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
        m2s: [],
        filteredm2s: [],
        searchQuery: '',
        searchFilters: {
          title: true,
        },
        loading: true,
        error: null,
        showAddModal: false,
        newm2: {
            title: '',
            brand: '',
            price: '',
            capacity: '',
            read: '',
            write: '',
            quantity:'',
            imgUrl: ''
        },
        showEditModal: false,
        editedm2: {
            m2_id: '',
            title: '',
            brand: '',
            price: null,
            capacity: '',
            read: '',
            write: '',
            quantity:'',
            imgUrl: ''
        },
      };
    },
  
    async created() {
      await this.fetchm2Data();
    },
  
    methods: {
      async fetchm2Data() {
        try {
          this.loading = true;
          const response = await axios.get('http://127.0.0.1:8000/api/v1/storage/m2s');
          this.m2s = response.data;
          this.filteredm2s = [...this.m2s];
          this.loading = false;
        } catch (error) {
          console.error('Error fetching m2 data:', error);
          this.error = 'Failed to load m2 data. Please try again.';
          this.loading = false;
        }
      },
  
      async fetchm2ById(m2Id) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/storage/m2s/${m2Id}`);
          return response.data; // Return the m2 data
        } catch (error) {
          console.error('Error fetching m2 data:', error);
          alert('Failed to fetch m2 data. Please try again.');
          return null; // Return null in case of an error
        }
      },
  
      searchm2s() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
          this.filteredm2s = [...this.m2s];
          return;
        }
        
        this.filteredm2s = this.m2s.filter(m2 => {
          const titleMatch = this.searchFilters.title && m2.title && m2.title.toLowerCase().includes(query);
          const brandMatch = this.searchFilters.brand && m2.brand && m2.brand.toLowerCase().includes(query);
          
          return titleMatch || brandMatch;
        });
      },
  
      generatem2Id() {
        const existingIds = this.m2s.map(m2 => m2.m2_id);
        for (let i = 43001; i <= 43999; i++) {
          if (!existingIds.includes(i)) {
            return i; // Return the first missing id in the range
          }
        }
        throw new Error('No available m2 ID in the range 43001-43999');
      },
  
      async addm2() {
        try {
          // Generate a unique ID for the new m2
          const m2_id = this.generatem2Id();
          
          // Add the ID to the new m2 object
          const m2Data = { 
            ...this.newm2,
            m2_id 
          };
          
          // Send to server
          await axios.post("http://127.0.0.1:8000/api/v1/storage/m2s", m2Data);
          
          // Reset form and close modal
          this.showAddModal = false;
          
          // Refresh data from server
          await this.fetchm2Data();
          
          // Reset form data
          this.newm2 = {
            title: '',
            brand: '',
            price: '',
            capacity: '',
            read: '',
            write: '',
            quantity:'',
            imgUrl: ''
          };
        } catch (error) {
          console.error("Error adding m2:", error);
          alert("Failed to add m2. Please try again.");
        }
      },
      
      async editm2(m2Id) {
        this.showEditModal = true;
        // Fetch the m2 data using the m2Id and set it to editedm2
        const m2Data = await this.fetchm2ById(m2Id);
        if (m2Data) {
          this.editedm2 = { ...m2Data }; // Populate the editedm2 object
        }
      },
  
      async updatem2() {
        try {
          const response = await axios.patch(
            `http://127.0.0.1:8000/api/v1/storage/m2s/${this.editedm2.m2_id}`, 
            this.editedm2
          );
          console.log('m2 updated successfully:', response.data);
          this.showEditModal = false; // Close the modal
          await this.fetchm2Data(); // Refresh the m2 list
        } catch (error) {
          console.error('Error updating m2:', error);
          alert('Failed to update m2. Please try again.'); // Provide user feedback
        }
      },
  
      async deletem2(m2Id) {
        if (confirm("Are you sure you want to delete this m2?")) {
          try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/storage/m2s/${m2Id}`);
            await this.fetchm2Data();
          } catch (error) {
            console.error("Error deleting m2:", error);
            alert("Failed to delete m2. Please try again.");
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
  
  .m2-container {
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
  
  .m2-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    width: 250px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    height: 585px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Pushes buttons to the bottom */
  }
  
  .m2-image {
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