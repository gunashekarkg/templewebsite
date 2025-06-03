<template>
  <v-container class="position-relative">
    <h2 class="text-h4 mb-4">{{ $t('home.welcome') }}</h2>

    <!-- 🧾 Daily Quote in a Card -->
    <v-card class="mb-6" color="indigo lighten-5" elevation="1">
      <v-card-title>
        <v-icon class="mr-2" color="indigo">mdi-format-quote-open</v-icon>
        <span class="font-weight-medium">{{ $t('home.dailyQuote') }}</span>
      </v-card-title>
      <v-card-text class="text-subtitle-1 font-italic">
        "{{ dailyQuote }}"
      </v-card-text>
    </v-card>

    <!-- 🌄 Carousel -->
    <div class="carousel-wrapper mb-6">
      <v-carousel
        v-model="currentSlide"
        cycle
        height="400"
        hide-delimiters
        transition="fade-transition"
        interval="4000"
      >
        <v-carousel-item
          v-for="(item, i) in carouselItems"
          :key="i"
        >
          <v-img :src="item.src" height="100%">
            <v-container
              class="fill-height d-flex align-end justify-center"
              style="background: rgba(0, 0, 0, 0.3);"
            >
              <h3 class="text-white">{{ $t(item.captionKey) }}</h3>
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

    <p class="mt-4">{{ $t('home.description') }}</p>

    <!-- 🌐 Language Dropdown Selector -->
    <v-select
      class="mt-4 mb-6"
      :items="[
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' }
      ]"
      item-title="label"
      item-value="value"
      v-model="currentLocale"
      label="Language"
      variant="outlined"
      style="max-width: 250px"
    />

    <!-- 📅 Events -->
    <v-divider class="my-6"></v-divider>
    <h3 class="text-h5 mb-2">{{ $t('home.upcomingEvents') }}</h3>
    <v-list two-line class="elevation-1 rounded-lg mb-6">
      <v-list-item v-for="(event, i) in events" :key="i">
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">{{ event.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ event.date }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="primary">mdi-calendar</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <!-- 🗓️ Calendar -->
    <v-select
      v-model="calendarType"
      :items="['month', 'week', 'day']"
      label="View"
      class="mb-4"
      style="max-width: 200px"
    />
    <v-sheet height="600" class="mb-8">
      <v-calendar
        :type="calendarType"
        :events="calendarEvents"
        color="primary"
        @click:event="onEventClick"
      />
    </v-sheet>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

const { locale, t } = useI18n()
const currentLocale = locale

const dailyQuote = ref('')
const events = ref([])
const calendarEvents = ref([])
const calendarType = ref('month')

const selectedEvent = ref(null)
const showDialog = ref(false)

function onEventClick({ event }) {
  // Only show dialog if admin (future enhancement)
  selectedEvent.value = event
  showDialog.value = true
}

async function fetchDailyQuote(lang) {
  try {
    const quoteRes = await axios.get(`http://localhost:5000/api/quotes/daily?lang=${lang}`)
    dailyQuote.value = quoteRes.data.quote
  } catch (err) {
    console.error('Quote error:', err)
    dailyQuote.value = t('home.noQuote') // fallback
  }
}

async function fetchEvents() {
  try {
    const bookingRes = await axios.get('http://localhost:5000/api/bookings')
    const approved = bookingRes.data.filter(b => b.status === 'approved')

    events.value = approved.map(b => ({
      title: b.program,
      date: b.date
    }))

    calendarEvents.value = approved.map(b => ({
      name: b.program,
      start: b.date,
      end: b.date,
      color: 'indigo'
    }))
  } catch (err) {
    console.error('Booking error:', err)
  }
}

watch(currentLocale, (newLang) => {
  locale.value = newLang
  fetchDailyQuote(newLang)
})

onMounted(() => {
  fetchDailyQuote(currentLocale.value)
  fetchEvents()
})

// Carousel logic
const currentSlide = ref(0)
const carouselItems = [
  { src: '/elmshorn-temple.png', captionKey: 'home.captions.view' },
  { src: '/elmshorn-temple1.png', captionKey: 'home.captions.puja' },
  { src: '/elmshorn-temple2.png', captionKey: 'home.captions.festival' },
  { src: '/elmshorn-temple3.png', captionKey: 'home.captions.community' }
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
</style>