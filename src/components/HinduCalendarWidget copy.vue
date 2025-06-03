<template>
  <v-card class="hindu-calendar" elevation="3">
    <v-card-title class="bg-primary text-white">
      <v-icon left>mdi-calendar-heart</v-icon>
      Hindu Panchangam (Elmshorn)
    </v-card-title>

    <v-card-text>
      <v-date-picker
        v-model="selectedDate"
        @update:modelValue="calculatePanchangam"
        color="primary"
        class="mb-4"
      ></v-date-picker>

      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else class="panchangam-details">
        <h3 class="text-h6 mb-2">{{ formattedDate }}</h3>
        <v-divider class="my-2" />

        <!-- Panchangam Details -->
        <div
          v-for="(label, key) in basicDetails"
          :key="key"
          class="detail-item"
        >
          <v-icon :color="label.color">{{ label.icon }}</v-icon>
          <span class="font-weight-bold">{{ label.title }}:</span>
          {{ panchangam[key] || 'N/A' }}
        </div>

        <!-- Sunrise & Sunset -->
        <div class="detail-item">
          <v-icon color="orange">mdi-weather-sunset-up</v-icon>
          <span class="font-weight-bold">Sunrise:</span> {{ formattedSunrise }}
        </div>
        <div class="detail-item">
          <v-icon color="orange">mdi-weather-sunset-down</v-icon>
          <span class="font-weight-bold">Sunset:</span> {{ formattedSunset }}
        </div>

        <v-divider class="my-2" />

        <!-- Inauspicious Times -->
        <h4 class="text-subtitle-1 mb-2">Inauspicious Times:</h4>
        <div
          v-for="(label, key) in inauspiciousTimes"
          :key="key"
          class="detail-item"
        >
          <v-icon color="red">mdi-alert</v-icon>
          <span class="font-weight-bold">{{ label }}:</span>
          {{ formatTime(panchangam[key]?.start) }} - {{ formatTime(panchangam[key]?.end) }}
        </div>

        <v-divider class="my-2" />

        <!-- Auspicious Times -->
        <h4 class="text-subtitle-1 mb-2">Auspicious Times:</h4>
        <div class="detail-item">
          <v-icon color="green">mdi-clock-check</v-icon>
          <span class="font-weight-bold">Abhijit Muhurta:</span>
          {{ formatTime(panchangam.abhijit?.start) }} - {{ formatTime(panchangam.abhijit?.end) }}
        </div>

        <v-divider class="my-2" />

        <!-- Lagna -->
        <div class="detail-item">
          <v-icon color="purple">mdi-zodiac-aries</v-icon>
          <span class="font-weight-bold">Current Lagna:</span> {{ panchangam.lagna || 'N/A' }}
        </div>

        <v-divider class="my-2" />

        <!-- Festivals -->
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
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { HinduCalendar } from '@/utils/hindicalendar';
import { DateTime } from 'luxon';

const selectedDate = ref(new Date());
const loading = ref(false);

const panchangam = ref({
  tithi: '',
  suryaNakshatra: '',
  chandraNakshatra: '',
  yoga: '',
  karana: '',
  paksha: '',
  ritu: '',
  ayana: '',
  samvatsara: '',
  sunrise: null,
  sunset: null,
  rahukalam: { start: null, end: null },
  yamagandam: { start: null, end: null },
  gulikai: { start: null, end: null },
  abhijit: { start: null, end: null },
  lagna: '',
  festivals: []
});

const formattedDate = computed(() =>
  DateTime.fromJSDate(selectedDate.value).setLocale('en').toLocaleString(DateTime.DATE_HUGE)
);

const formatTime = (date) => {
  return date ? DateTime.fromJSDate(date).toLocaleString(DateTime.TIME_SIMPLE) : '--:--';
};

const formattedSunrise = computed(() => formatTime(panchangam.value.sunrise));
const formattedSunset = computed(() => formatTime(panchangam.value.sunset));

const calculatePanchangam = async () => {
  try {
    loading.value = true;
    const hc = new HinduCalendar(selectedDate.value, 53.755, 9.656); // Elmshorn
    await hc.calculateAll();

    panchangam.value = {
      tithi: hc.tithi,
      suryaNakshatra: hc.suryaNakshatra,
      chandraNakshatra: hc.chandraNakshatra,
      yoga: hc.yoga,
      karana: hc.karana,
      paksha: hc.paksha,
      ritu: hc.ritu,
      ayana: hc.ayana,
      samvatsara: hc.samvatsara,
      sunrise: hc.sunrise,
      sunset: hc.sunset,
      rahukalam: hc.rahukalam || { start: null, end: null },
      yamagandam: hc.yamagandam || { start: null, end: null },
      gulikai: hc.gulikai || { start: null, end: null },
      abhijit: hc.abhijit || { start: null, end: null },
      lagna: hc.lagna,
      festivals: hc.festivals || []
    };
  } catch (err) {
    console.error('Failed to calculate Panchangam:', err);
  } finally {
    loading.value = false;
  }
};

const basicDetails = {
  tithi: { title: 'Tithi', icon: 'mdi-moon-waning-crescent', color: 'orange' },
  suryaNakshatra: { title: 'Surya Nakshatra', icon: 'mdi-weather-sunny', color: 'yellow' },
  chandraNakshatra: { title: 'Chandra Nakshatra', icon: 'mdi-weather-night', color: 'blue' },
  yoga: { title: 'Yoga', icon: 'mdi-yoga', color: 'green' },
  karana: { title: 'Karana', icon: 'mdi-calendar-alert', color: 'red' },
  paksha: { title: 'Paksha', icon: 'mdi-moon-first-quarter', color: 'purple' },
  ritu: { title: 'Ritu', icon: 'mdi-seasons', color: 'teal' },
  ayana: { title: 'Ayana', icon: 'mdi-compass', color: 'indigo' },
  samvatsara: { title: 'Samvatsara', icon: 'mdi-calendar-star', color: 'brown' }
};

const inauspiciousTimes = {
  rahukalam: 'Rahukalam',
  yamagandam: 'Yamagandam',
  gulikai: 'Gulikai'
};

onMounted(calculatePanchangam);
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
  gap: 8px;
  margin: 8px 0;
}

.festivals {
  margin-top: 16px;
}
</style>
