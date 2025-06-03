<template>
  <v-data-table :headers="headers" :items="bookings" item-key="id">
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn small color="success" @click="updateStatus(item.id, 'approved')">Approve</v-btn>
      <v-btn small color="error" @click="updateStatus(item.id, 'rejected')">Reject</v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const bookings = ref([])
const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Date', value: 'date' },
  { text: 'Program', value: 'program' },
  { text: 'Status', value: 'status' },
  { text: 'Actions', value: 'actions', sortable: false },
]

const fetchBookings = async () => {
  const res = await axios.get('http://localhost:5000/api/bookings', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  bookings.value = res.data
}

const updateStatus = async (id, status) => {
  await axios.put(
    `http://localhost:5000/api/bookings/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )
  fetchBookings()
}

onMounted(fetchBookings)
</script>