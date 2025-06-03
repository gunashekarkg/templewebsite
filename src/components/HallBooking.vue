<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Temple Hall Booking Calendar</span>
            <v-btn color="primary" @click="showBookingDialog = true">
              Book Hall
            </v-btn>
          </v-card-title>
          
          <v-calendar
            ref="calendar"
            v-model="selectedDate"
            :events="bookings"
            event-overlap-mode="stack"
            event-color="getEventColor"
            @click:date="onDateClick"
            @click:event="onEventClick"
          ></v-calendar>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card v-if="selectedDate">
          <v-card-title>
            Availability for {{ formattedDate }}
          </v-card-title>
          
          <v-card-text>
            <v-chip
              v-for="slot in timeSlots"
              :key="slot.hour"
              :color="slot.available ? 'green' : 'red'"
              class="ma-1"
            >
              {{ slot.hour }}:00 - {{ slot.hour + 1 }}:00
              <v-icon right>
                {{ slot.available ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </v-chip>
          </v-card-text>
        </v-card>
        
        <v-card v-if="isAdmin" class="mt-4">
          <v-card-title>Pending Approvals</v-card-title>
          <v-list>
            <v-list-item
              v-for="booking in pendingBookings"
              :key="booking.id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ booking.eventName }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ booking.date }} | {{ booking.startTime }} - {{ booking.endTime }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Booked by: {{ booking.bookedBy }}
                </v-list-item-subtitle>
              </v-list-item-content>
              
              <v-list-item-action>
                <v-btn icon color="green" @click="updateBooking(booking.id, 'approved')">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="updateBooking(booking.id, 'rejected')">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Booking Dialog -->
    <v-dialog v-model="showBookingDialog" max-width="600">
      <v-card>
        <v-card-title>Book Temple Hall</v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="submitBooking">
            <v-text-field
              v-model="newBooking.eventName"
              label="Event Name"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="newBooking.bookedBy"
              label="Your Name"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="newBooking.date"
              type="date"
              label="Date"
              required
              :min="new Date().toISOString().split('T')[0]"
            ></v-text-field>
            
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="newBooking.startTime"
                  :items="availableStartTimes"
                  label="Start Time"
                  required
                ></v-select>
              </v-col>
              
              <v-col cols="6">
                <v-select
                  v-model="newBooking.endTime"
                  :items="availableEndTimes"
                  label="End Time"
                  required
                ></v-select>
              </v-col>
            </v-row>
            
            <v-textarea
              v-model="newBooking.notes"
              label="Additional Notes"
            ></v-textarea>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showBookingDialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit">Submit Booking</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <!-- Event Details Dialog -->
    <v-dialog v-model="showEventDialog" max-width="500">
      <v-card>
        <v-card-title>{{ selectedEvent.eventName }}</v-card-title>
        <v-card-text>
          <p><strong>Date:</strong> {{ selectedEvent.date }}</p>
          <p><strong>Time:</strong> {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}</p>
          <p><strong>Booked By:</strong> {{ selectedEvent.bookedBy }}</p>
          <p><strong>Status:</strong> 
            <v-chip small :color="getStatusColor(selectedEvent.status)">
              {{ selectedEvent.status }}
            </v-chip>
          </p>
          <p v-if="selectedEvent.notes"><strong>Notes:</strong> {{ selectedEvent.notes }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const bookings = ref([]);
const timeSlots = ref([]);
const showBookingDialog = ref(false);
const showEventDialog = ref(false);
const selectedEvent = ref({});
const isAdmin = ref(true); // Set based on user role
const pendingBookings = computed(() => 
  bookings.value.filter(b => b.status === 'pending')
);

const newBooking = ref({
  eventName: '',
  bookedBy: '',
  date: selectedDate.value,
  startTime: '09:00',
  endTime: '10:00',
  notes: ''
});

// Format date for display
const formattedDate = computed(() => {
  return new Date(selectedDate.value).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Get available start times based on selected date
const availableStartTimes = computed(() => {
  const hours = [];
  for (let i = 9; i <= 21; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return hours;
});

// Get available end times based on start time
const availableEndTimes = computed(() => {
  if (!newBooking.value.startTime) return [];
  const startHour = parseInt(newBooking.value.startTime.split(':')[0]);
  const hours = [];
  for (let i = startHour + 1; i <= 22; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return hours;
});

// Fetch bookings from server
async function fetchBookings() {
  try {
    const response = await axios.get('http://localhost:5000/api/bookings');
    bookings.value = response.data.map(booking => ({
      ...booking,
      start: `${booking.date} ${booking.startTime}`,
      end: `${booking.date} ${booking.endTime}`,
      name: booking.eventName
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
}

// Fetch availability for selected date
async function fetchAvailability() {
  try {
    const response = await axios.get('http://localhost:5000/api/availability', {
      params: { date: selectedDate.value }
    });
    timeSlots.value = response.data;
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
}

// Submit new booking
async function submitBooking() {
  try {
    await axios.post('http://localhost:5000/api/bookings', newBooking.value);
    showBookingDialog.value = false;
    await fetchBookings();
    await fetchAvailability();
    resetNewBooking();
  } catch (error) {
    console.error('Error submitting booking:', error);
  }
}

// Update booking status (admin)
async function updateBooking(id, status) {
  try {
    await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
    await fetchBookings();
    await fetchAvailability();
  } catch (error) {
    console.error('Error updating booking:', error);
  }
}

// Reset new booking form
function resetNewBooking() {
  newBooking.value = {
    eventName: '',
    bookedBy: '',
    date: selectedDate.value,
    startTime: '09:00',
    endTime: '10:00',
    notes: ''
  };
}

// Handle date click
function onDateClick({ date }) {
  selectedDate.value = date;
}

// Handle event click
function onEventClick({ event }) {
  selectedEvent.value = event;
  showEventDialog.value = true;
}

// Get event color based on status
function getEventColor(event) {
  return {
    pending: 'orange',
    approved: 'green',
    rejected: 'red'
  }[event.status] || 'blue';
}

// Get status color for chips
function getStatusColor(status) {
  return {
    pending: 'orange',
    approved: 'green',
    rejected: 'red'
  }[status] || 'grey';
}

// Watch selected date for changes
watch(selectedDate, () => {
  fetchAvailability();
});

// Initialize component
onMounted(() => {
  fetchBookings();
  fetchAvailability();
});
</script>

<style scoped>
.v-calendar {
  height: 600px;
}
</style>