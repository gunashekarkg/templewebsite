<!-- App.vue -->
<template>
  <v-app>
    <router-view />
    <v-footer app padless>
      <v-col class="text-center py-4" cols="12">
        <p>
          📍 Hauptstraße 123, 25335 Elmshorn | 📞 +49 123 456789 | ✉️ info@elmshorn-temple.de
        </p>
        <small>&copy; {{ new Date().getFullYear() }} Elmshorn Hindu Temple</small>
      </v-col>
    </v-footer>
  </v-app>
</template>