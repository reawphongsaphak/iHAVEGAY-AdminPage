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
            @input="searchRams"
          />
          <div class="search-filters">
            <label class="filter-label">
              <input type="checkbox" v-model="searchFilters.title" @change="searchRams"> Name
            </label>
            <label class="filter-label">
              <input type="checkbox" v-model="searchFilters.brand" @change="searchRams"> Brand
            </label>
            <label class="filter-label">
              <input type="checkbox" v-model="searchFilters.memory_type" @change="searchRams"> Memory Type
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
        <h2>Edit RAM</h2>
        <form @submit.prevent="updateRam">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="editedRam.title" required>
          </div>
          
          <div class="form-group">
            <label for="brand">Brand:</label>
            <input type="text" id="brand" v-model="editedRam.brand" required>
          </div>
          
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" id="price" v-model="editedRam.price" required>
          </div>
          
          <div class="form-group">
            <label for="memory-type">Memory Type:</label>
            <input type="text" id="memory-type" v-model="editedRam.memory_type" required>
          </div>
          
          <div class="form-group">
            <label for="speed">Speed:</label>
            <input type="text" id="speed" v-model="editedRam.speed" required>
          </div>

          <div class="form-group">
            <label for="number_of_DIMMs">Number of DIMMs:</label>
            <input type="text" id="number_of_DIMMs" v-model="editedRam.number_of_DIMMs" required>
          </div>

          <div class="form-group">
            <label for="capacity_per_DIMM">Capacity per DIMM (GB):</label>
            <input type="text" id="capacity_per_DIMM" v-model="editedRam.capacity_per_DIMM" required>
          </div>
          
          <div class="form-group">
            <label for="imgUrl">Image URL:</label>
            <input type="text" id="imgUrl" v-model="editedRam.imgUrl" required>
          </div>
          
          <div class="modal-buttons">
            <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- RAM Cards Display -->
    <div class="ram-container mt-5">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="filteredRams.length === 0" class="no-results">
        No RAMs found matching your search criteria
      </div>
      <div v-for="ram in filteredRams" :key="ram.ram_id" class="ram-card">
        <img :src="ram.imgUrl" alt="RAM Image" class="ram-image"/>
        <h2>{{ ram.title }}</h2>
        <p><strong>ID:</strong> {{ ram.ram_id }}</p>
        <p><strong>Brand:</strong> {{ ram.brand }}</p>
        <p><strong>Price:</strong> {{ ram.price }}฿</p>
        <p><strong>Memory Type:</strong> {{ ram.memory_type }}</p>
        <p><strong>Number of DIMMs:</strong> {{ ram.number_of_DIMMs }}</p>
        <p><strong>Capacity per DIMM (GB):</strong> {{ ram.capacity_per_DIMM }}</p>
        <p><strong>Speed:</strong> {{ ram.speed }}</p>

        <!-- Edit and Delete Buttons -->
        <div class="del-edit-botton-container">
            <button @click="editRam(ram.ram_id)" class="edit-button" aria-label="Edit RAM">Edit</button>
            <button @click="deleteRam(ram.ram_id)" class="delete-button" aria-label="Delete RAM">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add RAM Modal -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add New RAM</h2>
        <form @submit.prevent="addRam">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="newRam.title" required>
          </div>
          <div class="form-group">
            <label for="brand">Brand</label>
            <input type="text" id="brand" v-model="newRam.brand" required>
          </div>
          <div class="form-group">
            <label for="price">Price (฿)</label>
            <input type="number" id="price" v-model="newRam.price" required>
          </div>
          <div class="form-group">
            <label for="memory_type">Memory Type</label>
            <input type="text" id="memory_type" v-model="newRam.memory_type" required>
          </div>
          <div class="form-group">
            <label for="speed">Speed</label>
            <input type="text" id="speed" v-model="newRam.speed" required>
          </div>
          <div class="form-group">
            <label for="number_of_DIMMs">Number of DIMMs</label>
            <input type="text" id="number_of_DIMMs" v-model="newRam.number_of_DIMMs" required>
          </div>
          <div class="form-group">
            <label for="capacity_per_DIMM">Capacity per DIMM</label>
            <input type="text" id="capacity_per_DIMM" v-model="newRam.capacity_per_DIMM" required>
          </div>
          <div class="form-group">
            <label for="imgUrl">Image URL</label>
            <input type="text" id="imgUrl" v-model="newRam.imgUrl" required>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">Add RAM</button>
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
      rams: [],
      filteredRams: [],
      searchQuery: '',
      searchFilters: {
        title: true,
        brand: true,
        memory_type: true,
      },
      loading: true,
      error: null,
      showAddModal: false,
      newRam: {
        title: '',
        brand: '',
        price: '',
        memory_type: '',
        speed: '',
        number_of_DIMMs: '',
        capacity_per_DIMM: '',
        imgUrl: ''
      },
      showEditModal: false,
      editedRam: {
        ram_id: '',
        title: '',
        brand: '',
        price: null,
        memory_type: '',
        speed: '',
        number_of_DIMMs: '',
        capacity_per_DIMM: '',
        imgUrl: ''
      },
    };
  },

  async created() {
    await this.fetchRamData();
  },

  methods: {
    async fetchRamData() {
      try {
        this.loading = true;
        const response = await axios.get('http://127.0.0.1:8000/Rams');
        this.rams = response.data;
        this.filteredRams = [...this.rams];
        this.loading = false;
      } catch (error) {
        console.error('Error fetching RAM data:', error);
        this.error = 'Failed to load RAM data. Please try again.';
        this.loading = false;
      }
    },

    async fetchRamById(ramId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/Rams/${ramId}`);
        return response.data; // Return the RAM data
      } catch (error) {
        console.error('Error fetching RAM data:', error);
        alert('Failed to fetch RAM data. Please try again.');
        return null; // Return null in case of an error
      }
    },

    searchRams() {
      const query = this.searchQuery.toLowerCase().trim();
      
      if (!query) {
        this.filteredRams = [...this.rams];
        return;
      }
      
      this.filteredRams = this.rams.filter(ram => {
        const titleMatch = this.searchFilters.title && ram.title && ram.title.toLowerCase().includes(query);
        const brandMatch = this.searchFilters.brand && ram.brand && ram.brand.toLowerCase().includes(query);
        const memoryTypeMatch = this.searchFilters.memory_type && ram.memory_type && ram.memory_type.toLowerCase().includes(query);
        
        return titleMatch || brandMatch || memoryTypeMatch;
      });
    },

    generateRamId() {
      const existingIds = this.rams.map(ram => ram.ram_id);
      for (let i = 20001; i <= 29999; i++) {
        if (!existingIds.includes(i)) {
          return i; // Return the first missing id in the range
        }
      }
      throw new Error('No available Ram ID in the range 20001-29999');
    },

    async addRam() {
      try {
        // Generate a unique ID for the new RAM
        const ram_id = this.generateRamId();
        
        // Add the ID to the new RAM object
        const ramData = { 
          ...this.newRam,
          ram_id 
        };
        
        // Send to server
        await axios.post("http://127.0.0.1:8000/Rams", ramData);
        
        // Reset form and close modal
        this.showAddModal = false;
        
        // Refresh data from server
        await this.fetchRamData();
        
        // Reset form data
        this.newRam = {
          title: '',
          brand: '',
          price: '',
          memory_type: '',
          speed: '',
          number_of_DIMMs: '',
          capacity_per_DIMM: '',
          imgUrl: ''
        };
      } catch (error) {
        console.error("Error adding RAM:", error);
        alert("Failed to add RAM. Please try again.");
      }
    },
    
    async editRam(ramId) {
      this.showEditModal = true;
      // Fetch the RAM data using the ramId and set it to editedRam
      const ramData = await this.fetchRamById(ramId);
      if (ramData) {
        this.editedRam = { ...ramData }; // Populate the editedRam object
      }
    },

    async updateRam() {
      try {
        // Use PUT method to update the RAM data
        const response = await axios.patch(
          `http://127.0.0.1:8000/Rams/${this.editedRam.ram_id}`, 
          this.editedRam
        );
        console.log('RAM updated successfully:', response.data);
        this.showEditModal = false; // Close the modal
        await this.fetchRamData(); // Refresh the RAM list
      } catch (error) {
        console.error('Error updating RAM:', error);
        alert('Failed to update RAM. Please try again.'); // Provide user feedback
      }
    },

    async deleteRam(ramId) {
      if (confirm("Are you sure you want to delete this RAM?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/Rams/${ramId}`);
          await this.fetchRamData();
        } catch (error) {
          console.error("Error deleting RAM:", error);
          alert("Failed to delete RAM. Please try again.");
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

.ram-container {
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

.ram-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 300px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ram-image {
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