import { createApp, watch } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { mdiMenu } from '@mdi/js'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { createPinia } from 'pinia'

import { en, de } from 'vuetify/locale'
import router from './router'

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      menu: mdiMenu
    }
  },
  directives,
  locale: {
    locale: 'en',
    messages: { en, de },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#ffffff',
          surface: '#f5f5f5',
          primary: '#4caf50',
          secondary: '#ff9800',
          saffron: '#FF9933',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1e1e1e',
          primary: '#81c784',
          secondary: '#ffb74d',
          saffron: '#FF9933',
        },
      }
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(createPinia())

// Keep Vuetify in sync with i18n locale
watch(() => i18n.global.locale.value, (newLocale) => {
  vuetify.locale.current.value = newLocale
})

app.mount('#app')