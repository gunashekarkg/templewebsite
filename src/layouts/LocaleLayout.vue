<template>
  <div class="layout-wrapper">
    <NavBar />
    <v-main>
      <router-view />
    </v-main>
  
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'

</script>

<style scoped>
.layout-wrapper {
  position: relative;
}
</style>