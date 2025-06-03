<template>
  <v-container>
    <h2 class="text-h5 mb-4">Admin Dashboard</h2>

    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab>Gallery Upload</v-tab>
      <v-tab>Quotes</v-tab>
      <v-tab>Hall Bookings</v-tab>
    </v-tabs>

   <v-tabs-items v-model="tab">
      <v-tab-item>
        <GalleryUpload />
      </v-tab-item>
      <v-tab-item>
        <BookingAdmin />
      </v-tab-item>
      <v-tab-item>
        <QuoteManager />
      </v-tab-item>
    </v-tabs-items>
    <v-btn class="mt-4" color="error" @click="logout">Logout</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Import each tab's component (create them below)
import GalleryUpload from './GalleryUpload.vue'
import QuoteManager from './QuoteManager.vue'
import BookingAdmin from './BookingAdmin.vue'

const tab = ref(0)
const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>