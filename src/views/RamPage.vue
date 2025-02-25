<template>
  <div>
    <div class="ram-container mt-5">
      <div v-if="!rams.length">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-for="ram in rams" :key="ram.ram_id" class="ram-card">
        <img :src="ram.imgUrl" alt="ram Image" class="ram-image"/>
        <h2>{{ ram.title }}</h2>
        <p><strong>Brand:</strong> {{ ram.brand }}</p>
        <p><strong>Price:</strong> ${{ ram.price }}</p>
        <p><strong>Socket:</strong> {{ ram.Socket }}</p>
        <p><strong>Memory Type:</strong> {{ ram.memory_type }}</p>
        <p><strong>Speed:</strong> {{ ram.speed }}</p>

        <!-- Edit and Delete Buttons -->
        <div class="edit-button">
          <button @click="editram(ram.ram_id)" aria-label="Edit RAM">Edit</button>
        </div>

        <div class="delete-button">
          <button @click="deleteram(ram.ram_id)" aria-label="Delete RAM">Delete</button>
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

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.edit-button button {
  background-color: #69d465; /* Red background color */
  color: white; /* White text color */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  padding: 1px 7px; /* Padding for better spacing */
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 14px; /* Font size */
  transition: background-color 0.3s; /* Smooth background transition */
}

.edit-button button:hover {
  background-color: #0b852f; /* Darker red on hover */
}

.delete-button button {
  background-color: #e75643;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 1px 7px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.delete-button button:hover {
  background-color: #991f0f; /* Darker red on hover */
}
</style>
