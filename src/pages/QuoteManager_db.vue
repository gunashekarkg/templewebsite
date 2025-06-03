<template>
  <v-container>
    <h2 class="text-h5 mb-4">Manage Quotes</h2>
    <v-form @submit.prevent="addQuote">
      <v-text-field v-model="newQuote.text" label="Quote" required />
      <v-text-field v-model="newQuote.author" label="Author" />
      <v-btn type="submit" color="primary">Add Quote</v-btn>
    </v-form>
    <v-list>
      <v-list-item
        v-for="(quote, index) in quotes"
        :key="index"
      >
        <v-list-item-content>
          <v-list-item-title>"{{ quote.text }}"</v-list-item-title>
          <v-list-item-subtitle>- {{ quote.author }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="deleteQuote(quote._id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quotes = ref([]);
const newQuote = ref({ text: '', author: '' });

const fetchQuotes = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/quotes');
    quotes.value = res.data;
  } catch (err) {
    console.error('Error fetching quotes:', err);
  }
};

const addQuote = async () => {
  try {
    await axios.post('http://localhost:5000/api/quotes', newQuote.value);
    newQuote.value = { text: '', author: '' };
    fetchQuotes();
  } catch (err) {
    console.error('Error adding quote:', err);
  }
};

const deleteQuote = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/quotes/${id}`);
    fetchQuotes();
  } catch (err) {
    console.error('Error deleting quote:', err);
  }
};

onMounted(() => {
  fetchQuotes();
});
</script>