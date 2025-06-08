<template>
  <v-card class="hindu-calendar" elevation="3">
    <v-card-title class="bg-primary text-white">
      <v-icon left>mdi-calendar-heart</v-icon>
      Panchangam for {{ location }}
    </v-card-title>

    <!-- Date Picker -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-date-picker
              v-model="selectedDate"
              @update:modelValue="calculatePanchangam"
              color="primary"
              class="custom-calendar"
            />
          </v-col>
        </v-row>
    <v-card-text>
      <!-- Loading Spinner -->
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <template v-else>
        <!-- Main Panchang Grid -->
        <v-row class="panchang-grid" dense>
          <!-- Column 1: Basic Panchang -->
          <v-col cols="12" md="4">
            <v-card flat>
              <v-card-title class="text-subtitle-1">Basic Panchang</v-card-title>
              <v-divider />
              <v-card-text>
                <div class="detail-item">
                  <span class="font-weight-bold">Tithi:</span> 
                  {{ panchangam.tithi }} <span v-if="panchangam.Tithi">(until {{ formatTime(panchangam.Tithi.end) }})</span>
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Paksha:</span> {{ panchangam.paksha }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Nakshatra:</span> 
                  {{ panchangam.chandraNakshatra }} <span v-if="panchangam.Nakshatra">(until {{ formatTime(panchangam.Nakshatra.end) }})</span>
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Yoga:</span> 
                  {{ panchangam.yoga }} <span v-if="panchangam.Yoga">(until {{ formatTime(panchangam.Yoga.end) }})</span>
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Karana:</span> 
                  {{ panchangam.karana }} <span v-if="panchangam.Karna">(until {{ formatTime(panchangam.Karna.end) }})</span>
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Vaar:</span> {{ panchangam.Day?.name || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Ritu:</span> {{ panchangam.ritu }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Ayana:</span> {{ panchangam.ayana }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Column 2: Zodiac & Samvatsara -->
          <v-col cols="12" md="4">
            <v-card flat>
              <v-card-title class="text-subtitle-1">Zodiac & Year</v-card-title>
              <v-divider />
              <v-card-text>
                <div class="detail-item">
                  <span class="font-weight-bold">Moon Zodiac:</span> {{ panchangam.Raasi?.moon || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Sun Zodiac:</span> {{ panchangam.Raasi?.sun || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Surya Nakshatra:</span> {{ panchangam.suryaNakshatra }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Samvatsara:</span> {{ panchangam.samvatsara }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Vikram Samvat:</span> {{ panchangam.SamvatYears?.vikram || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Saka Samvat:</span> {{ panchangam.SamvatYears?.saka || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Kali Samvat:</span> {{ panchangam.SamvatYears?.kali || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Gujarati Samvat:</span> {{ panchangam.SamvatYears?.gujarati || 'N/A' }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Column 3: Sunrise/Sunset & Lagna -->
          <v-col cols="12" md="4">
            <v-card flat>
              <v-card-title class="text-subtitle-1">Time & Lagna</v-card-title>
              <v-divider />
              <v-card-text>
                <div class="detail-item">
                  <span class="font-weight-bold">Sunrise:</span> {{ formattedSunrise }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Sunset:</span> {{ formattedSunset }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Day Length:</span> {{ panchangam.DayLength?.day || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Night Length:</span> {{ panchangam.DayLength?.night || 'N/A' }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Moonrise:</span> {{ formatTime(panchangam.MoonTimes?.moonrise) }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Moonset:</span> {{ formatTime(panchangam.MoonTimes?.moonset) }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Current Lagna:</span> {{ panchangam.lagna }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Lagna Degree:</span> {{ panchangam.Lagna?.degree ? Math.round(panchangam.Lagna.degree) + '°' : 'N/A' }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Auspicious/Inauspicious Times Section -->
        <v-row class="mt-4" dense>
          <v-col cols="12" md="6">
            <v-card flat>
              <v-card-title class="text-subtitle-1 bg-green-lighten-4">Auspicious Times</v-card-title>
              <v-divider />
              <v-card-text>
                <div class="detail-item">
                  <span class="font-weight-bold">Abhijit Muhurta:</span>
                  {{ formatTime(panchangam.AuspiciousTimes?.abhijit?.start) }} - {{ formatTime(panchangam.AuspiciousTimes?.abhijit?.end) }}
                </div>
                <div v-for="(item, index) in panchangam.Choghadiya?.day" :key="'day-'+index" class="detail-item">
                  <span class="font-weight-bold">{{ item.name }}:</span>
                  {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
                  <v-chip x-small :color="isAuspicious(item.name) ? 'green' : 'red'" text-color="white" class="ml-2">
                    {{ isAuspicious(item.name) ? 'Auspicious' : 'Inauspicious' }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card flat>
              <v-card-title class="text-subtitle-1 bg-red-lighten-4">Inauspicious Times</v-card-title>
              <v-divider />
              <v-card-text>
                <div class="detail-item">
                  <span class="font-weight-bold">Rahukalam:</span>
                  {{ formatTime(panchangam.InauspiciousTimes?.rahukalam?.start) }} - {{ formatTime(panchangam.InauspiciousTimes?.rahukalam?.end) }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Yamagandam:</span>
                  {{ formatTime(panchangam.InauspiciousTimes?.yamagandam?.start) }} - {{ formatTime(panchangam.InauspiciousTimes?.yamagandam?.end) }}
                </div>
                <div class="detail-item">
                  <span class="font-weight-bold">Gulikai:</span>
                  {{ formatTime(panchangam.InauspiciousTimes?.gulikai?.start) }} - {{ formatTime(panchangam.InauspiciousTimes?.gulikai?.end) }}
                </div>
                <div v-for="(item, index) in panchangam.Choghadiya?.night" :key="'night-'+index" class="detail-item">
                  <span class="font-weight-bold">{{ item.name }}:</span>
                  {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
                  <v-chip x-small :color="isAuspicious(item.name) ? 'green' : 'red'" text-color="white" class="ml-2">
                    {{ isAuspicious(item.name) ? 'Auspicious' : 'Inauspicious' }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Festivals Section -->
        <v-row v-if="panchangam.Festivals?.length" class="mt-4">
          <v-col cols="12">
            <v-card flat>
              <v-card-title class="text-subtitle-1">Festivals</v-card-title>
              <v-divider />
              <v-card-text>
                <v-chip
                  v-for="(festival, index) in panchangam.Festivals"
                  :key="index"
                  color="deep-orange"
                  text-color="white"
                  class="ma-1"
                >
                  {{ festival }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- More Info Button -->
        <v-row v-if="panchangam.hasDetailedData" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-btn
              @click="showMoreInfo = !showMoreInfo"
              color="primary"
              variant="outlined"
              size="small"
              class="mb-4"
            >
              <v-icon left>{{ showMoreInfo ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              {{ showMoreInfo ? 'Hide Detailed Info' : 'Show Detailed Info' }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- Detailed Info Section -->
        <v-expand-transition>
          <div v-if="showMoreInfo">
            <!-- Hora Tables -->
            <v-row dense>
              <v-col cols="12" md="6">
                <v-card flat>
                  <v-card-title class="text-subtitle-1">Day Hora</v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Planet</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(hora, index) in panchangam.Hora.day" :key="'day-hora-'+index">
                          <td>
                            <v-icon :color="getPlanetColor(hora.ruler)" left>
                              {{ getPlanetIcon(hora.ruler) }}
                            </v-icon>
                            {{ hora.ruler }}
                          </td>
                          <td>{{ formatTime(hora.start) }} - {{ formatTime(hora.end) }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card flat>
                  <v-card-title class="text-subtitle-1">Night Hora</v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Planet</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(hora, index) in panchangam.Hora.night" :key="'night-hora-'+index">
                          <td>
                            <v-icon :color="getPlanetColor(hora.ruler)" left>
                              {{ getPlanetIcon(hora.ruler) }}
                            </v-icon>
                            {{ hora.ruler }}
                          </td>
                          <td>{{ formatTime(hora.start) }} - {{ formatTime(hora.end) }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Lagna Timings -->
            <v-row class="mt-4">
              <v-col cols="12">
                <v-card flat>
                  <v-card-title class="text-subtitle-1">Lagna Timings</v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Zodiac Sign</th>
                          <th>Time</th>
                          <th>Degree</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(lagna, index) in panchangam.LagnaTimings" :key="'lagna-'+index">
                          <td>
                            <v-icon left>{{ getZodiacIcon(lagna.sign) }}</v-icon>
                            {{ lagna.sign }}
                          </td>
                          <td>{{ formatTime(lagna.start) }} - {{ formatTime(lagna.end) }}</td>
                          <td>{{ Math.round(lagna.degree) }}°</td>
                        </tr>
                      </tbody>
                    </v-table>
                    <div class="text-caption text-grey mt-2">
                      * Times after midnight indicate next day before sunrise
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { HinduCalendar } from '@/utils/hindicalendar';
import { DateTime } from 'luxon';

const location = "Elmshorn, Germany";
const selectedDate = ref(new Date());
const loading = ref(false);
const showMoreInfo = ref(false);

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
  Day: {},
  Tithi: {},
  Nakshatra: {},
  Yoga: {},
  Karna: {},
  Raasi: {},
  SamvatYears: {},
  DayLength: {},
  MoonTimes: {},
  AuspiciousTimes: {},
  InauspiciousTimes: {},
  Choghadiya: {},
  Hora: {},
  LagnaTimings: [],
  Festivals: [],
  Lagna: {},
  hasDetailedData: false
});

const formattedDate = computed(() =>
  DateTime.fromJSDate(selectedDate.value).setLocale('en').toLocaleString(DateTime.DATE_HUGE)
);

const formatTime = (date) => {
  if (!date) return '--:--';
  return DateTime.fromJSDate(date).toFormat('HH:mm');
};

const formattedSunrise = computed(() => formatTime(panchangam.value.sunrise));
const formattedSunset = computed(() => formatTime(panchangam.value.sunset));

const isAuspicious = (name) => {
  const auspiciousNames = ['Shubh', 'Labh', 'Amrit', 'Char'];
  return auspiciousNames.includes(name);
};

const getPlanetIcon = (planet) => {
  const icons = {
    'Surya': 'mdi-weather-sunny',
    'Chandra': 'mdi-weather-night',
    'Mangal': 'mdi-planet',
    'Budha': 'mdi-planet',
    'Guru': 'mdi-planet',
    'Shukra': 'mdi-planet',
    'Shani': 'mdi-planet'
  };
  return icons[planet] || 'mdi-star';
};

const getPlanetColor = (planet) => {
  const colors = {
    'Surya': 'orange',
    'Chandra': 'blue',
    'Mangal': 'red',
    'Budha': 'green',
    'Guru': 'yellow',
    'Shukra': 'white',
    'Shani': 'black'
  };
  return colors[planet] || 'primary';
};

const getZodiacIcon = (sign) => {
  const icons = {
    'Mesha': 'mdi-zodiac-aries',
    'Vrushabha': 'mdi-zodiac-taurus',
    'Mithuna': 'mdi-zodiac-gemini',
    'Karkataka': 'mdi-zodiac-cancer',
    'Simha': 'mdi-zodiac-leo',
    'Kanya': 'mdi-zodiac-virgo',
    'Tula': 'mdi-zodiac-libra',
    'Vrushchika': 'mdi-zodiac-scorpio',
    'Dhanu': 'mdi-zodiac-sagittarius',
    'Makara': 'mdi-zodiac-capricorn',
    'Kumbha': 'mdi-zodiac-aquarius',
    'Meena': 'mdi-zodiac-pisces'
  };
  return icons[sign] || 'mdi-zodiac-aries';
};

const calculatePanchangam = async () => {
  try {
    loading.value = true;
    showMoreInfo.value = false;
    const hc = new HinduCalendar(selectedDate.value, 53.755, 9.656);
    await hc.calculateAll();

    panchangam.value = {
      ...hc,
      sunrise: hc.sunrise,
      sunset: hc.sunset,
      tithi: hc.tithi,
      suryaNakshatra: hc.suryaNakshatra,
      chandraNakshatra: hc.chandraNakshatra,
      yoga: hc.yoga,
      karana: hc.karana,
      paksha: hc.paksha,
      ritu: hc.ritu,
      ayana: hc.ayana,
      samvatsara: hc.samvatsara,
      lagna: hc.lagna,
      festivals: hc.festivals || [],
      hasDetailedData: hc.hasDetailedData
    };
  } catch (err) {
    console.error('Failed to calculate Panchangam:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(calculatePanchangam);
</script>

<style scoped>
.panchang-grid {
  margin-bottom: 16px;
}
.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  flex-wrap: wrap;
}
.hindu-calendar {
  border-radius: 12px;
  overflow: hidden;
}
.custom-calendar {
  width: 100%;
}
::v-deep(.v-date-picker__title) {
  display: none !important;
}

/* Table styling */
.v-table {
  width: 100%;
  border-collapse: collapse;
}
.v-table th {
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.05);
}
.v-table td, .v-table th {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .panchang-grid .v-col {
    margin-bottom: 16px;
  }
}
</style>