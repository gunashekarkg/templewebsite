<template>
  <v-btn-toggle
    v-model="lang"
    mandatory
    rounded
    :class="mobile ? 'ma-2' : 'mr-2'"
    class="language-toggle"
  >
    <v-btn 
      v-for="code in ['en', 'de']"
      :key="code"
      :value="code"
      :size="mobile ? 'small' : 'default'"
      :class="[
        lang === code ? 'lang-active' : 'lang-inactive'
      ]"
    >
      {{ code.toUpperCase() }}
    </v-btn>
  </v-btn-toggle>
</template>


<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const { locale } = useI18n()
const lang = ref(locale.value)

watch(lang, (val) => {
  locale.value = val
  localStorage.setItem('lang', val)
  emit('change')
})
</script>

<style scoped>
.language-toggle .v-btn {
  min-width: 60px;
  margin: 0 4px;
  height: 36px;
  border-radius: 20px;
  font-weight: bold;
  transition: all 0.2s ease;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.lang-active {
  background-color: white !important;
  color: #FF9933 !important; /* saffron text */
  border: 1px solid white !important;
}

.lang-inactive {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}
</style>