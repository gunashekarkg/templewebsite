<template>
  <v-btn
    icon
    @click="toggleTheme"
    class="theme-toggle"
    size="small"
    aria-label="Toggle theme"
  >
    <v-icon v-if="$vuetify.theme.current.dark">mdi-weather-sunny</v-icon>
    <v-icon v-else>mdi-white-balance-sunny</v-icon>
  </v-btn>
</template>

<script setup>
import { useTheme } from 'vuetify'

defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
})

const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style scoped>
.theme-toggle {
  margin-left: 0 8px;
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 4px;
}

.theme-toggle .v-icon {
  font-size: 24px !important;
}
</style>