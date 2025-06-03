<template>
  <v-container>
    <h3 class="mb-4">Manage Quotes</h3>
    <v-textarea
      v-model="newQuote"
      label="Add a new quote"
      rows="3"
      outlined
    ></v-textarea>
    <v-btn color="primary" class="mt-2" @click="addQuote">Add Quote</v-btn>

    <v-list two-line class="mt-6">
      <v-list-item
        v-for="(quote, i) in quotes"
        :key="i"
      >
        <v-list-item-content>
          <v-list-item-title>{{ quote }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="deleteQuote(i)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const quotes = ref([])
const newQuote = ref('')

const headers = {
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}

const fetchQuotes = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/quotes', { headers })
    quotes.value = res.data
  } catch (err) {
    console.error('Failed to fetch quotes:', err)
  }
}

const addQuote = async () => {
  if (!newQuote.value.trim()) return
  try {
    await axios.post(
      'http://localhost:5000/api/quotes',
      { quote: newQuote.value },
      { headers }
    )
    newQuote.value = ''
    fetchQuotes()
  } catch (err) {
    console.error('Add quote error:', err)
  }
}

const deleteQuote = async (index) => {
  try {
    await axios.delete(`http://localhost:5000/api/quotes/${index}`, { headers })
    fetchQuotes()
  } catch (err) {
    console.error('Delete error:', err)
  }
}

onMounted(fetchQuotes)
</script>