<template>
  <v-container class="position-relative pa-4">
    <h2 class="responsive-heading mb-3 mb-sm-4">{{ $t('home.welcome') }}</h2>

    <!-- Carousel -->
    <div class="carousel-wrapper mb-4 mb-sm-6">
      <v-carousel
        v-model="currentSlide"
        cycle
        :height="carouselHeight"
        hide-delimiters
        transition="fade-transition"
        interval="4000"
      >
        <v-carousel-item v-for="(item, i) in carouselItems" :key="i">
          <v-img :src="item.src" height="100%">
            <v-container class="fill-height d-flex align-end justify-center" style="background: rgba(0, 0, 0, 0.3);">
              <h3 class="responsive-subheading text-white">{{ $t(item.captionKey) }}</h3>
            </v-container>
          </v-img>
        </v-carousel-item>
      </v-carousel>

      <v-btn icon class="diya-btn left" @click="prevSlide">
        <div class="diya-wrapper">
          <img src="/diya.png" alt="Previous" class="diya-img" />
          <div class="flicker"></div>
        </div>
      </v-btn>

      <v-btn icon class="diya-btn right" @click="nextSlide">
        <div class="diya-wrapper">
          <img src="/diya.png" alt="Next" class="diya-img" />
          <div class="flicker"></div>
        </div>
      </v-btn>
    </div>

    <p class="responsive-paragraph text-white">{{ $t('home.description') }}</p>

    <!-- Daily Quote -->
    <v-img
        :src="`${base}shubhashini-bg.jpg`"
        :height="quoteImageHeight"
        class="mb-6 mb-sm-8"
        cover
      />
      <v-container
        class="fill-height d-flex align-center justify-center text-center px-2 px-sm-4"
        style="background: rgba(0, 0, 0, 0.4);"
      >
        <div>
          <h2 class="text-h6 text-sm-h4 text-white font-weight-bold mb-1 mb-sm-2">{{ $t('home.shubhashiniTitle') }}</h2>
          <p class="text-caption text-sm-body-1 text-white">{{ $t('home.shubhashiniDescription') }}</p>
        </div>
      </v-container>
    </v-img>

    <!-- Events List -->
    <v-divider class="my-4 my-sm-6"></v-divider>
    <h3 class="text-subtitle-1 text-sm-h5 mb-2">{{ $t('home.upcomingEvents') }}</h3>
    <v-list two-line class="elevation-1 rounded-lg mb-4 mb-sm-6">
      <v-list-item v-for="(event, i) in events" :key="i" @click="openEventModal(event)">
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium text-body-2 text-sm-body-1">{{ event.title }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption text-sm-body-2">{{ formatDate(event.date) }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="primary" size="small" class="text-sm-medium">mdi-calendar</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <!-- Your existing content -->
    <HinduCalendarWidget />

    
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { useDisplay } from 'vuetify'
import HinduCalendarWidget from '@/components/HinduCalendarWidget.vue'

const { smAndDown } = useDisplay()
const { locale, t } = useI18n()
const quoteImageHeight = computed(() => smAndDown.value ? 200 : 400)
const API = import.meta.env.VITE_API_BASE_URL

const dailyQuote = ref('')
const events = ref([])
const calendarEvents = ref([])
const calendarType = ref('month')

const selectedEvent = ref(null)
const showDialog = ref(false)

const carouselHeight = computed(() => smAndDown.value ? 250 : 400)

function onEventClick({ event }) {
  selectedEvent.value = event
  showDialog.value = true
}

function openEventModal(event) {
  selectedEvent.value = {
    ...event,
    start: new Date(event.date)
  }
  showDialog.value = true
}

function formatDate(date) {
  return dayjs(date).locale(locale.value).format('MMMM D, YYYY')
}

async function fetchDailyQuote(lang) {
  try {
    const quoteRes = await axios.get(`${API}/api/quotes/daily?lang=${lang}`)
    dailyQuote.value = quoteRes.data.quote
  } catch (err) {
    console.error('Quote error:', err)
    dailyQuote.value = t('home.noQuote')
  }
}

async function fetchEvents() {
  try {
    const bookingRes = await axios.get(`${API}/api/bookings`)
    const approved = bookingRes.data.filter(b => b.status === 'approved')

    events.value = approved.map(b => ({
      title: b.program,
      date: b.date
    }))

    calendarEvents.value = approved.map(b => ({
      name: b.program,
      start: new Date(b.date),
      end: new Date(b.date),
      color: 'indigo'
    }))
  } catch (err) {
    console.error('Booking error:', err)
  }
}

watch(locale, (newLang) => {
  fetchDailyQuote(newLang)
})

onMounted(() => {
  fetchDailyQuote(locale.value)
  fetchEvents()
})
const base = import.meta.env.BASE_URL
// Carousel
const currentSlide = ref(0)
const carouselItems = [
  { src: `${base}elmshorn-temple.png`, captionKey: 'home.captions.view' },
  { src: `${base}elmshorn-temple1.png`, captionKey: 'home.captions.puja' },
  { src: `${base}elmshorn-temple2.png`, captionKey: 'home.captions.festival' },
  { src: `${base}elmshorn-temple3.png`, captionKey: 'home.captions.community' }
]

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % carouselItems.length
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + carouselItems.length) % carouselItems.length
}
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
}

.diya-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.diya-btn.left {
  left: 10px;
}

.diya-btn.right {
  right: 10px;
}

.diya-wrapper {
  position: relative;
  display: inline-block;
}

.diya-img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 15px 5px rgba(255, 136, 0, 0.6);
  animation: pulseGlow 4s infinite ease-in-out;
  transition: transform 0.3s ease;
}

.diya-img:hover {
  transform: scale(1.1);
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 10px 4px rgba(255, 136, 0, 0.6); }
  50% { box-shadow: 0 0 20px 10px rgba(255, 136, 0, 1); }
  100% { box-shadow: 0 0 10px 4px rgba(255, 136, 0, 0.6); }
}

.flicker {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 16px;
  background: radial-gradient(circle, #ff9a00 20%, transparent 70%);
  border-radius: 50% 50% 20% 20%;
  animation: flicker 0.15s infinite alternate;
  opacity: 0.8;
}

@keyframes flicker {
  0% { transform: translateX(-50%) scaleY(1); opacity: 0.9; }
  100% { transform: translateX(-50%) scaleY(0.85); opacity: 0.6; }
}

@media (max-width: 600px) {
  .diya-img {
    width: 40px;
    height: 40px;
  }

  .diya-btn.left {
    left: 5px;
  }

  .diya-btn.right {
    right: 5px;
  }
}

.responsive-heading {
  font-size: clamp(1.5rem, 2vw + 0.5rem, 2.5rem);
  font-weight: bold;
}

.responsive-subheading {
  font-size: clamp(1.125rem, 1.5vw + 0.5rem, 1.75rem);
}

.responsive-paragraph {
  font-size: clamp(0.875rem, 1vw + 0.3rem, 1.125rem);
}
</style>
