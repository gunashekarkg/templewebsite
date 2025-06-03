<template>
  <v-container>
    <h2 class="text-h5 mb-4">Manage Bookings</h2>
    <v-form @submit.prevent="addBooking">
      <v-text-field v-model="newBooking.name" label="Name" required />
      <v-text-field v-model="newBooking.date" label="Date" required />
      <v-btn type="submit" color="primary">Add Booking</v-btn>
    </v-form>
    <v-list>
      <v-list-item
        v-for="(booking, index) in bookings"
        :key="index"
      >
        <v-list-item-content>
          <v-list-item-title>{{ booking.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ booking.date }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="deleteBooking(booking._id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const bookings = ref([]);
const newBooking = ref({ name: '', date: '' });

const fetchBookings = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/bookings');
    bookings.value = res.data;
  } catch (err) {
    console.error('Error fetching bookings:', err);
  }
};

const addBooking = async () => {
  try {
    await axios.post('http://localhost:5000/api/bookings', newBooking.value);
    newBooking.value = { name: '', date: '' };
    fetchBookings();
  } catch (err) {
    console.error('Error adding booking:', err);
  }
};

const deleteBooking = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/bookings/${id}`);
    fetchBookings();
  } catch (err) {
    console.error('Error deleting booking:', err);
  }
};

onMounted(() => {
  fetchBookings();
});
</script>