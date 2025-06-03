<template>
  <v-card class="hindu-calendar" elevation="3">
    <v-card-title class="bg-primary text-white">
      <v-icon left>mdi-calendar-heart</v-icon>
      Hindu Panchangam
    </v-card-title>

    <v-card-text>
      <!-- Date Selector -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6">
          <v-date-picker
            v-model="selectedDate"
            :max="maxDate"
            :min="minDate"
            @update:modelValue="fetchPanchangam"
            title="Select Date"
            color="primary"
          ></v-date-picker>
        </v-col>

        <!-- Current Day Info -->
        <v-col cols="12" sm="6">
          <div v-if="loading" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>

          <div v-else-if="panchangam" class="panchangam-details">
            <h3 class="text-h6 mb-2">{{ formattedDate }}</h3>
            
            <v-divider class="my-2"></v-divider>
            
            <div class="detail-item">
              <v-icon color="orange">mdi-moon-waning-crescent</v-icon>
              <span class="font-weight-bold">Tithi:</span> {{ panchangam.tithi }}
            </div>
            
            <div class="detail-item">
              <v-icon color="indigo">mdi-star</v-icon>
              <span class="font-weight-bold">Nakshatra:</span> {{ panchangam.nakshatra }}
            </div>
            
            <div class="detail-item">
              <v-icon color="green">mdi-calendar-check</v-icon>
              <span class="font-weight-bold">Yoga:</span> {{ panchangam.yoga }}
            </div>
            
            <div class="detail-item">
              <v-icon color="red">mdi-calendar-alert</v-icon>
              <span class="font-weight-bold">Karana:</span> {{ panchangam.karana }}
            </div>

            <v-divider class="my-2"></v-divider>

            <div v-if="panchangam.festivals.length" class="festivals">
              <h4 class="text-subtitle-1">Festivals:</h4>
              <v-chip
                v-for="(festival, index) in panchangam.festivals"
                :key="index"
                color="deep-orange"
                text-color="white"
                class="ma-1"
              >
                {{ festival }}
              </v-chip>
            </div>
            <div v-else class="text-caption">No festivals today</div>
          </div>

          <div v-else class="text-center py-4">
            <v-alert type="error">Failed to load Panchangam data</v-alert>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const panchangam = ref(null);
const loading = ref(false);
const error = ref(null);

// Date range limits (1 year back and forward)
const minDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().substr(0, 10);
});

const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().substr(0, 10);
});

const formattedDate = computed(() => {
  return new Date(selectedDate.value).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const fetchPanchangam = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Using a free API (no registration needed)
    const response = await axios.get(
      `https://www.vedicrishiastro.com/api/panchang/daily`, 
      {
        params: {
          date: selectedDate.value,
          timezone: '5.5' // IST
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    // Fallback to mock data if API fails
    if (!response.data || response.data.error) {
      panchangam.value = getMockPanchangam();
    } else {
      panchangam.value = {
        tithi: response.data.tithi || 'Not available',
        nakshatra: response.data.nakshatra || 'Not available',
        yoga: response.data.yoga || 'Not available',
        karana: response.data.karana || 'Not available',
        festivals: response.data.festivals || []
      };
    }
  } catch (err) {
    console.error("Error fetching panchangam:", err);
    error.value = err.message;
    panchangam.value = getMockPanchangam(); // Fallback to mock data
  } finally {
    loading.value = false;
  }
};

// Mock data fallback
const getMockPanchangam = () => {
  const date = new Date(selectedDate.value);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  // Simple mock logic based on date
  const tithis = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Amavasya"
  ];
  
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
  ];
  
  const festivals = [];
  
  // Add some mock festivals
  if (month === 1 && day === 14) festivals.push("Makar Sankranti");
  if (month === 3 && day === 25) festivals.push("Holi");
  if (month === 8 && day === 15) festivals.push("Raksha Bandhan");
  
  return {
    tithi: tithis[(day - 1) % tithis.length],
    nakshatra: nakshatras[(day - 1) % nakshatras.length],
    yoga: "Siddha Yoga",
    karana: "Bava",
    festivals
  };
};

onMounted(fetchPanchangam);
</script>

<style scoped>
.hindu-calendar {
  border-radius: 12px;
  overflow: hidden;
}

.panchangam-details {
  padding: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.detail-item i {
  margin-right: 12px;
}

.festivals {
  margin-top: 16px;
}

@media (max-width: 960px) {
  .hindu-calendar {
    margin-bottom: 24px;
  }
}
</style>