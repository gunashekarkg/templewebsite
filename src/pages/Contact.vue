<template>
  <v-container class="mt-6">
    <h2 class="text-h4 mb-4">📞 Contact Us</h2>
    <HallBooking />
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Elmshorn Hindu Temple</v-list-item-title>
                <v-list-item-subtitle>
                  Hauptstraße 123, 25335 Elmshorn, Germany
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>+49 123 456789</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>info@elmshorn-temple.de</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <iframe
          width="100%"
          height="300"
          style="border:0"
          loading="lazy"
          allowfullscreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2372.911430122073!2d9.649846715784622!3d53.75312858006345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b3de2b3d72e9ab%3A0xdeadbeef!2sElmshorn!5e0!3m2!1sen!2sde!4v1640000000000"
        ></iframe>
      </v-col>
    </v-row>

    <h2 class="text-h4 mb-4">{{ $t('contact.title') }}</h2>

    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="form.name" :label="$t('contact.name')" required />
      <v-text-field v-model="form.email" :label="$t('contact.email')" required />
      <v-textarea v-model="form.message" :label="$t('contact.message')" rows="5" required />
      <v-btn color="primary" type="submit">{{ $t('contact.submit') }}</v-btn>
    </v-form>

    <v-alert v-if="success" type="success" class="mt-4" border="left">
      {{ $t('contact.success') }}
    </v-alert>
    <v-alert v-if="error" type="error" class="mt-4" border="left">
      {{ $t('contact.error') }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import HallBooking from '@/components/HallBooking.vue'

const form = ref({ name: '', email: '', message: '' })
const success = ref(false)
const error = ref(false)

async function submitForm() {
  try {
    const res = await axios.post('http://localhost:5000/api/contact', form.value)
    if (res.data.success) {
      success.value = true
      error.value = false
      form.value = { name: '', email: '', message: '' }
    }
  } catch {
    error.value = true
    success.value = false
  }
}
</script>

<style scoped>
iframe {
  border-radius: 8px;
}
</style>