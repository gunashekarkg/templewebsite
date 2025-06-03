<template>
  <v-container class="mt-10" max-width="400">
    <v-card>
      <v-card-title>Admin Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="Username" />
        <v-text-field v-model="password" label="Password" type="password" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      username: username.value,
      password: password.value,
    })
    localStorage.setItem('token', res.data.token)
    router.push('/admin')
  } catch (err) {
    alert('Login failed')
  }
}
</script>