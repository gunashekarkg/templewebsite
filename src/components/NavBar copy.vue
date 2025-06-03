<template>
  <v-app-bar app :color="isScrolled ? 'saffron-light' : 'saffron'" elevation="0" class="transition-all">
    <!-- Hamburger for mobile - Fixed -->
    <v-app-bar-nav-icon
      class="d-sm-none"
      @click="drawer = !drawer"
      color="white"
    />

    <v-toolbar-title 
      class="text-white" 
      :class="{
        'text-h3': $vuetify.display.lgAndUp,
        'text-h4': $vuetify.display.mdAndUp,
        'text-h5': $vuetify.display.smAndUp,
        'text-h6': $vuetify.display.smAndDown
      }"
    >
      {{ $t('Navbar.welcome') }}
    </v-toolbar-title>

    <v-spacer />

    <!-- Language Switcher (Desktop) -->
    <div class="d-none d-sm-flex mr-4">
      <v-btn
        v-for="lang in languages"
        :key="lang.value"
        @click="switchLanguage(lang.value)"
        :class="{ 'text-white': selectedLang === lang.value, 'text-grey-lighten-2': selectedLang !== lang.value }"
        variant="text"
        height="32"
        min-width="36"
      >
        {{ lang.label }}
      </v-btn>
    </div>

    <!-- Desktop Nav Links -->
    <div class="d-none d-sm-flex">
      <v-btn 
        :to="localePath('/')" 
        variant="text"
        class="text-white"
      >{{ $t('Navbar.home') }}</v-btn>
      <v-btn 
        :to="localePath('/gallery')" 
        variant="text"
        class="text-white"
      >{{ $t('Navbar.gallery') }}</v-btn>
      <v-btn 
        :to="localePath('/contact')" 
        variant="text"
        class="text-white"
      >{{ $t('Navbar.contact') }}</v-btn>
      <v-btn 
        v-if="isAdmin" 
        :to="localePath('/admin')" 
        variant="text"
        class="text-white"
      >Admin</v-btn>
    </div>

    <!-- Admin login/logout button -->
    <v-btn 
      variant="text" 
      @click="toggleLogin" 
      class="ml-2 text-white"
    >
      {{ isAdmin ? 'Logout' : 'Admin Login' }}
    </v-btn>

    <!-- Mobile Drawer - Fixed -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="d-sm-none"
      location="left"
      :color="isScrolled ? 'saffron-light' : 'saffron'"
    >
      <v-list nav class="py-0">
        <!-- Language Switcher (Mobile) -->
        <v-list-item
          v-for="lang in languages"
          :key="lang.value"
          @click="switchLanguage(lang.value); drawer = false"
          :class="{ 'bg-saffron-dark': selectedLang === lang.value }"
        >
          <v-list-item-title class="text-white">
            {{ lang.label }}
            <v-icon v-if="selectedLang === lang.value" color="white" class="ml-2">mdi-check</v-icon>
          </v-list-item-title>
        </v-list-item>

        <v-divider class="my-2 bg-white" />

        <!-- Nav Links -->
        <v-list-item 
          :to="localePath('/')" 
          @click="drawer = false"
          class="text-white"
        >
          <v-list-item-title class="text-white">{{ $t('Navbar.home') }}</v-list-item-title>
        </v-list-item>
        <v-list-item 
          :to="localePath('/gallery')" 
          @click="drawer = false"
          class="text-white"
        >
          <v-list-item-title class="text-white">{{ $t('Navbar.gallery') }}</v-list-item-title>
        </v-list-item>
        <v-list-item 
          :to="localePath('/contact')" 
          @click="drawer = false"
          class="text-white"
        >
          <v-list-item-title class="text-white">{{ $t('Navbar.contact') }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="isAdmin"
          :to="localePath('/admin')"
          @click="drawer = false"
          class="text-white"
        >
          <v-list-item-title class="text-white">Admin</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/localeStore.js'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const langStore = useLocaleStore()

const drawer = ref(false)
const isScrolled = ref(false)
const languages = [
  { label: 'EN', value: 'en' },
  { label: 'DE', value: 'de' }
]
const selectedLang = ref(langStore.currentLocale|| 'en')

// Handle scroll for dynamic background
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const current = route.params.locale || 'en'
  langStore.setLocale(current)
  i18n.locale.value = current
  selectedLang.value = current
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const localePath = (path = '') => `/${selectedLang.value}${path}`

const switchLanguage = (lang) => {
  if (lang === selectedLang.value) return
  const pathWithoutLocale = route.fullPath.replace(/^\/(en|de)/, '')
  const newPath = `/${lang}${pathWithoutLocale || '/'}`
  langStore.setLocale(lang)
  i18n.locale.value = lang
  selectedLang.value = lang
  router.push(newPath)
}

const isAdmin = ref(!!localStorage.getItem('token'))

const toggleLogin = () => {
  if (isAdmin.value) {
    localStorage.removeItem('token')
    isAdmin.value = false
    router.push(localePath('/'))
  } else {
    router.push(localePath('/login')) // Redirect to proper login page
  }
}

watch(() => route.params.locale, (newLocale) => {
  if (newLocale && selectedLang.value !== newLocale) {
    langStore.setLocale(newLocale)
    i18n.locale.value = newLocale
    selectedLang.value = newLocale
  }
})
</script>

<style>
/* Saffron color palette */
:root {
  --saffron: #FF9933;
  --saffron-light: #FFB366;
  --saffron-dark: #E68A2E;
}

.bg-saffron {
  background-color: var(--saffron) !important;
}

.bg-saffron-light {
  background-color: var(--saffron-light) !important;
}

.bg-saffron-dark {
  background-color: var(--saffron-dark) !important;
}

.text-saffron {
  color: var(--saffron) !important;
}

/* Fix for mobile drawer z-index */
.v-navigation-drawer--temporary {
  z-index: 1002 !important;
  width: 250px !important;
}

/* Make sure app bar has proper z-index */
.v-app-bar {
  z-index: 1001 !important;
}

/* Smooth transition for app bar */
.transition-all {
  transition: all 0.3s ease;
}

/* Ensure proper spacing for mobile */
@media (max-width: 600px) {
  .v-toolbar__content {
    padding: 0 12px !important;
  }
}

@media (max-width: 599px) {
  .v-toolbar-title {
    font-size: 1rem !important; /* Mobile size */
    line-height: 1.5rem !important;
  }
}

/* Desktop sizes (will override automatically) */
@media (min-width: 600px) {
  .v-toolbar-title {
    font-size: 1.25rem !important; /* Small desktop */
  }
}

@media (min-width: 960px) {
  .v-toolbar-title {
    font-size: 1.5rem !important; /* Medium desktop */
  }
}

@media (min-width: 1264px) {
  .v-toolbar-title {
    font-size: 1.75rem !important; /* Large desktop */
  }
}
</style>