<template>
  <v-btn-toggle
    v-model="lang"
    mandatory
    color="primary"
    rounded
    :class="mobile ? 'ma-2' : 'mr-2'"
  >
    <v-btn 
      value="en" 
      :size="mobile ? 'small' : 'default'"
      class="text-white"
    >
      🇬🇧 EN
    </v-btn>
    <v-btn 
      value="de" 
      :size="mobile ? 'small' : 'default'"
      class="text-white"
    >
      🇩🇪 DE
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
.text-white {
  color: white !important;
}
</style>