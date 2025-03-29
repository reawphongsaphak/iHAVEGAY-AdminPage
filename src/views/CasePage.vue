<template>
    <div>
      <!-- Search and Add Section -->
      <div class="controls-container">
        <div class="search-container">
          <div class="search-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search by name, brand, or motherboard support..." 
              class="search-input"
              @input="searchCases"
            />
            <div class="search-filters">
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.title" @change="searchCases"> Name
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.brand" @change="searchCases"> Brand
              </label>
              <label class="filter-label">
                <input type="checkbox" v-model="searchFilters.support_mb" @change="searchCases"> Support MB
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
          <h2>Edit Case</h2>
          <form @submit.prevent="updateCase">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="editedCase.title" required>
            </div>
            
            <div class="form-group">
              <label for="brand">Brand:</label>
              <input type="text" id="brand" v-model="editedCase.brand" required>
            </div>
            
            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" id="price" v-model="editedCase.price" required>
            </div>
            
            <div class="form-group">
              <label for="support_mb">Supported Motherboards:</label>
              <div v-for="(item, index) in editedCase.support_mb" :key="'edit-mb-'+index" class="support-mb-item">
                <input type="text" v-model="editedCase.support_mb[index]" required>
                <button type="button" @click="removeEditSupportMB(index)" class="remove-button">Remove</button>
              </div>
              <button type="button" @click="addEditSupportMB" class="add-more-button">+ Add More</button>
            </div>

            <div class="form-group">
              <label for="quantity">Qauantity:</label>
              <input type="number" id="quantity" v-model="editedCase.quantity" required>
            </div>

            <div class="form-group">
              <label for="imgUrl">Image URL:</label>
              <input type="text" id="imgUrl" v-model="editedCase.imgUrl" required>
            </div>
            
            <div class="modal-buttons">
              <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Case Cards Display -->
      <div class="Case-container mt-5">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="filteredCases.length === 0" class="no-results">
          No Cases found matching your search criteria
        </div>
        <div v-for="Case in filteredCases" :key="Case.case_id" class="Case-card">
          <img :src="Case.imgUrl" alt="Case Image" class="Case-image"/>
          <h2>{{ Case.title }}</h2>
          <p><strong>ID:</strong> {{ Case.case_id }}</p>
          <p><strong>Brand:</strong> {{ Case.brand }}</p>
          <p><strong>Price:</strong> {{ Case.price }} ฿</p>
          <p><strong>Supported Motherboards: </strong>\
            <span v-if="Array.isArray(Case.support_mb)">{{ Case.support_mb.join(", ") }}</span>
            <span v-else>{{ Case.support_mb }}</span>
          </p>
          <p><strong>Quantity:</strong> {{ Case.quantity }}</p>
          <!-- Edit and Delete Buttons -->
          <div class="del-edit-botton-container">
              <button @click="editCase(Case.case_id)" class="edit-button" aria-label="Edit Case">Edit</button>
              <button @click="deleteCase(Case.case_id)" class="delete-button" aria-label="Delete Case">Delete</button>
          </div>
        </div>
      </div>
  
      <!-- Add Case Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Add New Case</h2>
          <form @submit.prevent="addCase">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="newCase.title" required>
            </div>
            <div class="form-group">
              <label for="brand">Brand</label>
              <input type="text" id="brand" v-model="newCase.brand" required>
            </div>

            <div class="form-group">
              <label for="price">Price (฿)</label>
              <input type="number" id="price" v-model="newCase.price" required>
            </div>
  
            <div class="form-group">
              <label for="support_mb">Supported Motherboards:</label>
              <div v-for="(item, index) in newCase.support_mb" :key="'new-mb-'+index" class="support-mb-item">
                <input type="text" v-model="newCase.support_mb[index]" required>
                <button type="button" @click="removeSupportMB(index)" class="remove-button">Remove</button>
              </div>
              <button type="button" @click="addSupportMB" class="add-more-button">+ Add More</button>
            </div>

            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" v-model="newCase.quantity" required>
            </div>

            <div class="form-group">
              <label for="imgUrl">Image URL</label>
              <input type="text" id="imgUrl" v-model="newCase.imgUrl" required>
            </div>
            <div class="modal-buttons">
              <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button">Add Case</button>
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
        Cases: [],
        filteredCases: [],
        searchQuery: '',
        searchFilters: {
          title: true,
          brand: true,
          support_mb: true,
        },
        loading: true,
        error: null,
        showAddModal: false,
        newCase: {
            title: '',
            brand: '',
            price: '',
            quantity:'',
            support_mb: [''],
            imgUrl: ''
        },
        showEditModal: false,
        editedCase: {
            case_id: '',
            title: '',
            brand: '',
            price: '',
            quantity: '',
            support_mb: [''],
            imgUrl: ''
        }
      };
    },
  
    async created() {
      await this.fetchCaseData();
    },
  
    methods: {
      async fetchCaseData() {
        try {
          this.loading = true;
          const response = await axios.get('https://ea80-2001-44c8-4407-365d-a95d-f2b-1a2c-525f.ngrok-free.app/api/v1/cases');
          this.Cases = response.data;
          this.filteredCases = [...this.Cases];
          this.loading = false;
        } catch (error) {
          console.error('Error fetching Case data:', error);
          this.error = 'Failed to load Case data. Please try again.';
          this.loading = false;
        }
      },
  
      async fetchCaseById(caseId) {
        console.log('Fetching case with caseId:', caseId);
        try {
            const response = await axios.get(`https://ea80-2001-44c8-4407-365d-a95d-f2b-1a2c-525f.ngrok-free.app/api/v1/cases/${caseId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Case data:', error);
            alert('Failed to fetch Case data. Please try again.');
            return null;
        }
      },
    
      searchCases() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
          this.filteredCases = [...this.Cases];
          return;
        }
        
        this.filteredCases = this.Cases.filter(Case => {
          const titleMatch = this.searchFilters.title && Case.title && Case.title.toLowerCase().includes(query);
          const brandMatch = this.searchFilters.brand && Case.brand && Case.brand.toLowerCase().includes(query);
          
          let support_mbMatch = false;
          if (this.searchFilters.support_mb && Case.support_mb) {
            if (Array.isArray(Case.support_mb)) {
              support_mbMatch = Case.support_mb.some(mb => mb.toLowerCase().includes(query));
            } else if (typeof Case.support_mb === 'string') {
              support_mbMatch = Case.support_mb.toLowerCase().includes(query);
            }
          }
          
          return titleMatch || brandMatch || support_mbMatch;
        });
      },
  
      addSupportMB() {
        this.newCase.support_mb.push(""); // Add empty string for new entry
      },
      
      removeSupportMB(index) {
        if (this.newCase.support_mb.length > 1) {
          this.newCase.support_mb.splice(index, 1); // Remove selected entry
        } else {
          // If it's the last one, just clear it
          this.newCase.support_mb = [''];
        }
      },
  
      addEditSupportMB() {
        if (!Array.isArray(this.editedCase.support_mb)) {
          this.editedCase.support_mb = [''];
        }
        this.editedCase.support_mb.push("");
      },
      
      removeEditSupportMB(index) {
        if (!Array.isArray(this.editedCase.support_mb)) {
          this.editedCase.support_mb = [''];
          return;
        }
        
        if (this.editedCase.support_mb.length > 1) {
          this.editedCase.support_mb.splice(index, 1); // Remove selected entry
        } else {
          // If it's the last one, just clear it
          this.editedCase.support_mb = [''];
        }
      },
  
      generateCaseId() {
        const existingIds = this.Cases.map(Case => Case.case_id);
        for (let i = 60001; i <= 69999; i++) {
          if (!existingIds.includes(i)) {
            return i; // Return the first missing id in the range
          }
        }
        throw new Error('No available Case ID in the range 60001-69999');
      },
  
      async addCase() {
        try {
            const case_id = this.generateCaseId();
            
            // Convert price to integer
            const price = parseInt(this.newCase.price, 10);
            
            // Clean up empty entries in support_mb
            const cleanedSupportMb = this.newCase.support_mb.filter(item => item.trim() !== '');
            
            // Ensure support_mb is stored as an array and never empty
            const supportMb = cleanedSupportMb.length > 0 ? cleanedSupportMb : [''];
            
            const caseData = { 
              title: this.newCase.title,
              brand: this.newCase.brand,
              price,
              case_id,
              quantity: this.newCase.quantity,
              support_mb: supportMb,
              imgUrl: this.newCase.imgUrl
            };
            
            console.log('Sending new case data:', caseData);
            
            await axios.post("https://ea80-2001-44c8-4407-365d-a95d-f2b-1a2c-525f.ngrok-free.app/api/v1/cases", caseData);
            
            this.showAddModal = false;
            await this.fetchCaseData();
            
            this.newCase = {
              title: '',
              brand: '',
              price: '',
              quantity:'',
              support_mb: [''],
              imgUrl: ''
            };
        } catch (error) {
            console.error("Error adding Case:", error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            alert("Failed to add Case. Please try again.");
        }
      },
      
      async editCase(caseId) {
        try {
            const caseData = await this.fetchCaseById(caseId);
            if (caseData) {
              console.log('Case data retrieved:', caseData);
              
              // Create a deep copy of the case data
              const editCase = JSON.parse(JSON.stringify(caseData));
  
              // Ensure support_mb is always a valid array
              if (!editCase.support_mb) {
                  editCase.support_mb = [''];
              } else if (!Array.isArray(editCase.support_mb)) {
                  // If it's a string, convert to array
                  editCase.support_mb = [editCase.support_mb];
              } else if (editCase.support_mb.length === 0) {
                  editCase.support_mb = [''];
              }
  
              this.editedCase = editCase;
              this.showEditModal = true;
            }
        } catch (error) {
            console.error('Error in edit case function:', error);
            alert('Failed to prepare case for editing. Please try again.');
        }
      },
  
      async updateCase() {
        try {
            console.log('Updating case with data:', this.editedCase);
            
            // Convert price to integer
            const price = parseInt(this.editedCase.price, 10);
            
            // Clean up empty entries in support_mb
            let supportMb = [];
            if (Array.isArray(this.editedCase.support_mb)) {
                supportMb = this.editedCase.support_mb.filter(item => item && item.trim() !== '');
                // Ensure we have at least one value
                if (supportMb.length === 0) {
                    supportMb = [''];
                }
            } else if (typeof this.editedCase.support_mb === 'string' && this.editedCase.support_mb.trim() !== '') {
                supportMb = [this.editedCase.support_mb];
            } else {
                supportMb = [''];
            }
            
            const updatedCase = {
              title: this.editedCase.title,
              brand: this.editedCase.brand,
              price,
              quantity: this.editedCase.quantity,
              support_mb: supportMb,
              imgUrl: this.editedCase.imgUrl
            };
  
            // Log what we're about to send
            console.log('Sending update data:', updatedCase);
  
            await axios.patch(`https://ea80-2001-44c8-4407-365d-a95d-f2b-1a2c-525f.ngrok-free.app/api/v1/cases/${this.editedCase.case_id}`, updatedCase);
            this.showEditModal = false;
            await this.fetchCaseData();
        } catch (error) {
            console.error('Error updating Case:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            alert('Failed to update Case. Please try again.');
        }
      },
  
      async deleteCase(caseId) {
        if (confirm("Are you sure you want to delete this Case?")) {
          try {
            await axios.delete(`https://ea80-2001-44c8-4407-365d-a95d-f2b-1a2c-525f.ngrok-free.app/api/v1/cases/${caseId}`);
            await this.fetchCaseData();
          } catch (error) {
            console.error("Error deleting Case:", error);
            alert("Failed to delete Case. Please try again.");
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
  
  .Case-container {
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
  
  .Case-card {
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
  
  .Case-image {
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
  
  /* Support MB items styling */
  .support-mb-item {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
  }
  
  .remove-button {
    background-color: #dc3545;
    color: white;
    flex: 0 0 auto;
    padding: 4px 8px;
  }
  
  .add-more-button {
    background-color: #007bff;
    color: white;
    margin-top: 5px;
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