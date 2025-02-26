<template>
  <div>
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="edit-modal">
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
            <input type="number" id="price" v-model="editedRam.price" step="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="socket">Socket:</label>
            <input type="text" id="socket" v-model="editedRam.Socket" required>
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
            <label for="imgUrl">Image URL:</label>
            <input type="text" id="imgUrl" v-model="editedRam.imgUrl">
          </div>
          
          <div class="modal-buttons">
            <button type="submit" class="save-button">Save Changes</button>
            <button type="button" @click="cancelEdit" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div class="ram-container mt-5">
      <div v-if="!rams.length">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-for="ram in rams" :key="ram.ram_id" class="ram-card">
        <img :src="ram.imgUrl" alt="RAM Image" class="ram-image"/>
        <h2>{{ ram.title }}</h2>
        <p><strong>Brand:</strong> {{ ram.brand }}</p>
        <p><strong>Price:</strong> ${{ ram.price }}</p>
        <p><strong>Socket:</strong> {{ ram.Socket }}</p>
        <p><strong>Memory Type:</strong> {{ ram.memory_type }}</p>
        <p><strong>Speed:</strong> {{ ram.speed }}</p>

        <!-- Edit and Delete Buttons on the same level -->
        <div class="button-container mt-auto">
          <button @click="editRam(ram)" class="edit-btn" aria-label="Edit RAM">Edit</button>
          <button @click="deleteRam(ram.ram_id)" class="delete-btn" aria-label="Delete RAM">Delete</button>
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
      error: null,
      showEditModal: false,
      editedRam: {
        ram_id: null,
        title: '',
        brand: '',
        price: 0,
        Socket: '',
        memory_type: '',
        speed: '',
        imgUrl: ''
      }
    };
  },
  async created() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/Rams');
      console.log(response.data); // Check what data you are getting
      this.rams = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.error = 'Failed to load RAM data. Please try again later.';
    }
  },
  methods: {
    editRam(ram) {
      // Create a deep copy of the RAM object to avoid direct mutation
      this.editedRam = { ...ram };
      this.showEditModal = true;
    },
    
    async updateRam() {
      try {
        // Send updated RAM data to the server
        const response = await axios.put(
          `http://127.0.0.1:8000/Rams/${this.editedRam.ram_id}`,
          this.editedRam
        );
        
        // Update the RAM in the local array
        const index = this.rams.findIndex(ram => ram.ram_id === this.editedRam.ram_id);
        if (index !== -1) {
          this.rams[index] = response.data || this.editedRam;
        }
        
        // Close the modal
        this.showEditModal = false;
        
        // Optional: Show success message
        alert('RAM updated successfully!');
      } catch (error) {
        console.error('Error updating RAM:', error);
        alert('Failed to update RAM. Please try again.');
      }
    },
    
    cancelEdit() {
      this.showEditModal = false;
      this.editedRam = {
        ram_id: null,
        title: '',
        brand: '',
        price: 0,
        Socket: '',
        memory_type: '',
        speed: '',
        imgUrl: ''
      };
    },
    
    async deleteRam(ramId) {
      if (confirm('Are you sure you want to delete this RAM?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/Rams/${ramId}`);
          // Remove the deleted RAM from the local array
          this.rams = this.rams.filter(ram => ram.ram_id !== ramId);
          alert('RAM deleted successfully!');
        } catch (error) {
          console.error('Error deleting RAM:', error);
          alert('Failed to delete RAM. Please try again.');
        }
      }
    }
  }
};
</script>

<style scoped>
.ram-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
}

.ram-card {
  display: flex;
  flex-direction: column; /* Ensure items are stacked vertically */
  justify-content: space-between; /* Space out the content */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 200px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ram-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Improved button container */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
}

.edit-btn {
  background-color: #69d465;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
  font-size: 14px;
  flex: 1;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #0b852f;
}

.delete-btn {
  background-color: #e75643;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
  font-size: 14px;
  flex: 1;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #991f0f;
}

/* Modal Styles */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
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
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #d32f2f;
}
</style>