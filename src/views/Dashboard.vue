<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-black text-white">My Booked Tickets 🎟️</h1>
        <p class="text-caption text-grey">Manage your active movie passes and receipts</p>
      </div>
      <v-btn
        color="indigo-accent-3"
        variant="tonal"
        prepend-icon="mdi-refresh"
        class="font-weight-bold rounded-lg text-none"
        @click="fetchBookings"
      >
        Refresh
      </v-btn>
    </div>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="indigo-accent-3" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card
      v-else-if="bookings.length === 0"
      color="#12141c"
      class="pa-12 text-center rounded-24 border-glass"
      elevation="0"
    >
      <v-icon size="64" color="grey-darken-1" class="mb-4">mdi-ticket-outline</v-icon>
      <h3 class="text-h6 text-grey-lighten-1 font-weight-bold mb-2">No Tickets Booked Yet</h3>
      <p class="text-body-2 text-grey mb-6">Explore movies and book your first cinema experience now!</p>
      <v-btn color="indigo-accent-3" class="rounded-xl font-weight-bold text-none" to="/">
        Browse Movies
      </v-btn>
    </v-card>

    <!-- Tickets Grid -->
    <v-row v-else>
      <v-col
        v-for="ticket in bookings"
        :key="ticket.id"
        cols="12"
        md="6"
      >
        <v-card color="#12141c" class="rounded-24 border-glass overflow-hidden elevation-10 ticket-card">
          <!-- Ticket Header Banner -->
          <div class="ticket-header pa-4 d-flex justify-space-between align-center">
            <div class="d-flex align-center ga-2">
              <v-icon color="indigo-accent-2">mdi-movie-open</v-icon>
              <span class="font-weight-black text-white text-subtitle-1">{{ ticket.movieTitle || ticket.movie || 'Movie Ticket' }}</span>
            </div>
            <v-chip color="green-accent-3" size="small" variant="flat" class="font-weight-bold">
              CONFIRMED
            </v-chip>
          </div>

          <!-- Ticket Body -->
          <v-card-text class="pa-6">
            <v-row>
              <!-- Details -->
              <v-col cols="7">
                <!-- Cinema / Theatre Field -->
                <div class="mb-3">
                  <span class="text-caption text-grey d-block">THEATRE / LOCATION</span>
                  <span class="text-body-2 font-weight-bold text-indigo-lighten-3 d-flex align-center ga-1">
                    <v-icon size="small">mdi-map-marker</v-icon>
                    {{ ticket.theatre || ticket.theatreName || ticket.location || 'PVR Inox Cinemas' }}
                  </span>
                </div>

                <div class="mb-3">
                  <span class="text-caption text-grey d-block">SHOWTIME & DATE</span>
                  <span class="text-body-2 font-weight-bold text-white">
                    {{ ticket.showtime || 'Standard Show' }} 
                    <template v-if="ticket.date || ticket.bookingDate">({{ ticket.date || ticket.bookingDate }})</template>
                  </span>
                </div>

                <div class="mb-3">
                  <span class="text-caption text-grey d-block">SEATS</span>
                  <div class="d-flex flex-wrap ga-1 mt-1">
                    <template v-if="Array.isArray(ticket.seats)">
                      <v-chip
                        v-for="seat in ticket.seats"
                        :key="seat"
                        color="indigo-accent-2"
                        size="x-small"
                        class="font-weight-bold"
                      >
                        {{ seat }}
                      </v-chip>
                    </template>
                    <v-chip v-else color="indigo-accent-2" size="x-small" class="font-weight-bold">
                      {{ ticket.seats || 'General' }}
                    </v-chip>
                  </div>
                </div>

                <!-- 🍿 Snacks & Beverages Field -->
                <div class="mb-3">
                  <span class="text-caption text-grey d-block">SNACKS & BEVERAGES</span>
                  <div class="d-flex flex-wrap ga-1 mt-1">
                    <template v-if="ticket.snacks && ticket.snacks.length > 0">
                      <v-chip
                        v-for="snack in ticket.snacks"
                        :key="snack.id || snack.name"
                        color="amber-accent-3"
                        variant="tonal"
                        size="x-small"
                        class="font-weight-bold"
                      >
                        {{ snack.name }} (x{{ snack.qty }})
                      </v-chip>
                    </template>
                    <span v-else class="text-body-2 text-grey-lighten-1 font-italic">
                      None
                    </span>
                  </div>
                </div>

                <div class="mb-1">
                  <span class="text-caption text-grey d-block">AMOUNT PAID</span>
                  <span class="text-subtitle-2 font-weight-black text-amber-accent-2">
                    ₹{{ ticket.totalPaid || ticket.totalPrice || ticket.amount || '0' }} 
                    <span class="text-caption text-grey font-weight-regular">({{ ticket.paymentMethod || 'Online' }})</span>
                  </span>
                </div>
              </v-col>

              <!-- QR Code Mock -->
              <v-col cols="5" class="d-flex flex-column align-center justify-center border-l border-grey-darken-3 pl-4">
                <div class="qr-box pa-2 bg-white rounded-lg mb-2">
                  <v-icon size="70" color="black">mdi-qrcode</v-icon>
                </div>
                <span class="text-caption text-grey font-weight-bold">Scan at Entry</span>
              </v-col>
            </row>

            <v-divider class="my-4 border-grey-darken-3"></v-divider>

            <!-- Actions -->
            <div class="d-flex justify-space-between align-center">
              <span class="text-caption text-grey">Booked on: {{ ticket.bookingDate || 'Today' }}</span>
              <div class="d-flex ga-2">
                <v-btn
                  variant="outlined"
                  color="red-accent-2"
                  size="small"
                  class="rounded-lg font-weight-bold text-none"
                  @click="cancelTicket(ticket.id)"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="indigo-accent-3"
                  size="small"
                  class="rounded-lg font-weight-bold text-none"
                  prepend-icon="mdi-printer"
                  @click="printTicket(ticket)"
                >
                  Print
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authStore } from '@/stores/auth';

const bookings = ref([]);
const loading = ref(true);

const fetchBookings = async () => {
  loading.value = true;
  let fetchedList = [];

  // 1. Fetch from static db.json safely
  try {
    const res = await fetch('/db.json');
    if (res.ok) {
      const data = await res.json();
      fetchedList = data.bookings || [];
    }
  } catch (err) {
    console.warn('Could not fetch static db.json, relying on localStorage:', err);
  }

  // 2. Fetch local storage orders (created during seat selection or food order)
  const localBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
  
  // Combine both sources without duplicates
  const combined = [...localBookings, ...fetchedList];
  const uniqueBookingsMap = new Map();
  combined.forEach(item => {
    if (item.id) uniqueBookingsMap.set(item.id, item);
  });
  
  const allBookings = Array.from(uniqueBookingsMap.values());

  // 3. Filter by current logged in user
  const currentUser = authStore?.user || JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    bookings.value = allBookings.filter(
      (b) => String(b.userId) === String(currentUser.id) || b.userEmail === currentUser.email
    );
  } else {
    bookings.value = allBookings;
  }

  loading.value = false;
};

onMounted(() => {
  fetchBookings();
});

const cancelTicket = (id) => {
  if (confirm('Are you sure you want to cancel this booking?')) {
    // Local storage update
    const localBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedLocal = localBookings.filter(b => String(b.id) !== String(id));
    localStorage.setItem('userBookings', JSON.stringify(updatedLocal));

    // Reactive State Update
    bookings.value = bookings.value.filter(b => String(b.id) !== String(id));
    alert('Ticket cancelled successfully!');
  }
};

const printTicket = (ticket) => {
  window.print();
};
</script>

<style scoped>
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.rounded-24 {
  border-radius: 24px !important;
}

.ticket-header {
  background: rgba(99, 102, 241, 0.15);
  border-bottom: 1px solid rgba(99, 102, 241, 0.3);
}

.ticket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5) !important;
}

.qr-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>