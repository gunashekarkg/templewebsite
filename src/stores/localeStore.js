// src/stores/localeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref(localStorage.getItem('locale') || 'en')

  const setLocale = (newLocale) => {
    currentLocale.value = newLocale
    localStorage.setItem('locale', newLocale)
    i18n.global.locale.value = newLocale
  }

  return {
    currentLocale,
    setLocale,
  }
})
