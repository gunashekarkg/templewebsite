<template>
  <v-app-bar app :color="isSaffron ? 'saffron' : 'saffron'" elevation="0" class="nav-bar">
    <!-- Theme Toggle - Left Side -->
    <ThemeToggle mobile />

    <v-toolbar-title class="text-white font-weight-bold welcome-title">{{ $t('Navbar.welcome') }}</v-toolbar-title>

    <v-spacer />

    <!-- Desktop Menu -->
    <div v-if="!$vuetify.display.mobile" class="d-flex align-center">
      <LanguageSwitcher />
      <v-btn
        v-for="item in navItems"
        :key="item.route"
        :to="localePath(item.route)"
        variant="text"
        class="text-white mx-1 nav-btn"
      >
        {{ $t(`Navbar.${item.key}`) }}
      </v-btn>
    </div>

    <!-- Hamburger Button - Right Side -->
    <v-btn
      v-if="$vuetify.display.mobile"
      @click.stop="drawer = !drawer"
      icon
      class="hamburger-btn"
      size="large"
      aria-label="Menu"
    >
      <v-icon color="white" size="x-large">mdi-menu</v-icon>
    </v-btn>

    <!-- Mobile Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      color="saffron"
      width="280"
      class="mobile-drawer"
      :style="{ top: $vuetify.display.mobile ? '64px' : '0' }"
    >
      <v-list nav class="py-4" style="margin-top: 20px;">
        <v-list-item class="language-switcher-container">
          <LanguageSwitcher mobile />
        </v-list-item>
        
        <v-divider class="my-2 bg-white" style="opacity: 0.3;" />

        <v-list-item
          v-for="item in navItems"
          :key="'mob-' + item.route"
          :to="localePath(item.route)"
          @click="drawer = false"
          class="mobile-nav-item"
          active-class="mobile-nav-item-active"
        >
          <template #title>
            <span class="text-white font-weight-medium">{{ $t(`Navbar.${item.key}`) }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeToggle from './ThemeToggle.vue'

const { locale } = useI18n()
const drawer = ref(false)
const isSaffron = true
const navItems = [
  { key: 'home', route: '/' },
  { key: 'gallery', route: '/gallery' },
  { key: 'contact', route: '/contact' }
]

const localePath = (path = '') => `/${locale.value}${path}`
</script>

<style scoped>
.nav-bar {
  background-color: #FF9933 !important; /* Hard-coded fallback */ /* Vuetify variable */
}
.hamburger-btn {
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 50% !important;
  margin-right: 12px !important;
  width: 48px !important;
  height: 48px !important;
}

.mobile-drawer {
  z-index: 1001 !important;
  height: calc(100vh - 64px) !important;
  top: 64px !important;
}

.mobile-nav-item {
  margin: 8px 0;
  padding-left: 16px !important;
  border-radius: 4px !important;
}

.mobile-nav-item-active {
  background: rgba(255, 255, 255, 0.15) !important;
  font-weight: bold !important;
}

.text-white {
  color: white !important;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 960px) {
  .v-toolbar__content {
    padding: 0 12px !important;
  }
  
  .v-toolbar-title {
    font-size: 1.1rem !important;
  }
}

.language-switcher-container {
  padding: 16px !important;
  min-height: 64px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.mobile-drawer .language-switcher {
  display: flex !important;
  gap: 8px !important;
  justify-content: center !important;
  width: 100% !important;
  position: relative !important;
  z-index: 100 !important;
}

.mobile-drawer .language-switcher .v-btn {
  color: white !important;
  min-width: 60px !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  margin: 0 4px !important;
  background: rgba(0, 0, 0, 0.1) !important;
  height: 36px !important;
}

.mobile-drawer .language-switcher .v-btn--active {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: bold !important;
}

.v-toolbar-title {
  font-size: clamp(1rem, 2vw + 0.5rem, 1.75rem) !important;
}

.nav-btn {
  font-size: clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem) !important;
}

.mobile-nav-item span {
  font-size: clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem) !important;
}

.welcome-title {
  font-size: 0.9rem !important;
}

</style>