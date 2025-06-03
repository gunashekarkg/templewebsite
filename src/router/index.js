import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Gallery from '@/pages/Gallery.vue'
import Login from '@/pages/Login.vue'
import Admin from '@/pages/Admin.vue'
import Contact  from '@/pages/Contact.vue'
import NotFound from '@/pages/NotFound.vue'
import LocaleLayout from '@/layouts/LocaleLayout.vue'
import { useLocaleStore } from '@/stores/localeStore'
import i18n from '@/i18n'
const supportedLocales = ['en', 'de']
const defaultLocale = 'en'

const routes = [
  {
    path: '/:locale',
    component: LocaleLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'gallery', name: 'Gallery', component: Gallery },
      { path: 'login', name: 'Login', component: Login },
      { path: 'Contact', name: 'Contact', component: Contact },
      { path: 'admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/en',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const locale = to.params.locale
  const localeStore = useLocaleStore()

  if (!locale) {
    const saved = localStorage.getItem('locale') || 'en'
    return next({
      path: `/${saved}${to.fullPath}`,
      replace: true
    })
  }

  if (!['en', 'de'].includes(locale)) {
    return next('/en')
  }

// Sync i18n + store
  if (localeStore.currentLocale !== locale) {
    localeStore.setLocale(locale)
  }
// 🔐 Auth Guard
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return next(`/${locale}/login`)
  }

  next()
})

export default router