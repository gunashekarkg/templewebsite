import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  const locales = import.meta.glob('./locales/*.json', { eager: true })
  const messages = {}

  for (const path in locales) {
    const locale = path.split('/').pop().replace('.json', '')
    messages[locale] = locales[path].default
  }

  return messages
}

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
})