<template>
  <v-container>
    <h2 class="text-h5 mb-4">Manage Gallery</h2>
    <v-file-input
      v-model="files"
      label="Upload Images"
      multiple
      accept="image/*"
      prepend-icon="mdi-camera"
    />
    <v-btn color="primary" class="mt-2" @click="handleUpload">
      Upload
    </v-btn>
    <v-row>
      <v-col
        v-for="(img, index) in images"
        :key="index"
        cols="12"
        sm="4"
        md="3"
      >
        <v-img :src="img" height="150" class="mb-2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const files = ref([]);
const images = ref([]);

const fetchImages = async () => {
  try {
    const res = await axios.get('http://localhost:5000/images');
    images.value = res.data;
  } catch (err) {
    console.error('Error fetching images:', err);
  }
};

const handleUpload = async () => {
  if (!files.value.length) return;
  const formData = new FormData();
  formData.append('image', files.value[0]);
  try {
    await axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    files.value = [];
    fetchImages();
  } catch (err) {
    console.error('Upload failed:', err);
  }
};

onMounted(() => {
  fetchImages();
});
</script>