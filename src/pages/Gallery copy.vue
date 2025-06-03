<template>
  <v-container>
    <h2 class="text-h4 mb-4">Temple Gallery</h2>
    <div class="gallery-grid">
      <a
        v-for="(img, i) in galleryImages"
        :key="i"
        class="glightbox"
        :href="img.src"
        :data-title="img.title"
      >
        <v-img
          :src="img.src"
          :alt="img.title"
          class="gallery-img"
          contain
          height="200"
        />
      </a>
    </div>
    <div class="text-center mt-6" v-if="visibleCount < allImages.length">
      <v-btn color="primary" @click="loadMore">Load More</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import GLightbox from 'glightbox'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import 'glightbox/dist/css/glightbox.min.css'

const allImages = ref([])
const visibleCount = ref(4)
const galleryImages = computed(() => allImages.value.slice(0, visibleCount.value))

const fetchImages = async () => {
  try {
    const response = await axios.get('http://localhost:5000/images')
    allImages.value = response.data.map((url, index) => ({
      src: url,
      title: `Image ${index + 1}`
    }))
  } catch (error) {
    console.error('Failed to fetch images:', error)
  }
}
// Load more handler
function loadMore() {
  visibleCount.value += 4
}

onMounted(() => {
  fetchImages()
  GLightbox({ selector: '.glightbox' })
})
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.gallery-img {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.gallery-img:hover {
  transform: scale(1.03);
}
</style>