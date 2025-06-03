<template>
  <v-container>
    <h2 :class="['gallery-title', { 'mobile': $vuetify.display.mobile }]">Temple Gallery</h2>
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
          :height="$vuetify.display.mobile ? 150 : 200"
        />
      </a>
    </div>
    <div class="text-center mt-6" v-if="visibleCount < allImages.length">
      <v-btn color="primary" @click="loadMore" size="small">Load More</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import GLightbox from 'glightbox'
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import 'glightbox/dist/css/glightbox.min.css'
const base = import.meta.env.BASE_URL

const { mobile } = useDisplay()

// Local images from public folder
const imageFiles = [
  `${base}gallery/img1.jpg`,
  `${base}gallery/img2.jpg`,
  `${base}gallery/img3.jpg`,
  `${base}gallery/img4.jpg`,
  `${base}gallery/img5.jpg`,
  `${base}gallery/img6.jpg`,
  `${base}gallery/img7.jpg`,
]

const allImages = ref([])
const visibleCount = ref(mobile.value ? 2 : 4) // Show fewer images initially on mobile
const galleryImages = computed(() => allImages.value.slice(0, visibleCount.value))

// Initialize images
const initImages = () => {
  allImages.value = imageFiles.map((file, index) => ({
    src: file,
    title: `Temple Image ${index + 1}`
  }))
}

// Load more handler
function loadMore() {
  visibleCount.value += mobile.value ? 2 : 4 // Load fewer images on mobile
}

onMounted(() => {
  initImages()
  GLightbox({ 
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    openEffect: 'zoom',
    closeEffect: 'fade'
  })
})
</script>

<style scoped>
.gallery-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.gallery-title.mobile {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: 16px;
}

.gallery-img {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%;
}

.gallery-img:hover {
  transform: scale(1.03);
}

@media (max-width: 600px) {
  .gallery-grid {
    gap: 12px;
  }
}
</style>