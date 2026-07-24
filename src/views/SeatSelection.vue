<template>
  <v-container class="py-6" v-if="movie || route.query.movieTitle">
    <v-btn
      variant="text"
      color="indigo-accent-2"
      class="mb-4 font-weight-bold"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
    >
      Change Showtime / Theatre
    </v-btn>

    <v-row>
      <!-- Left Column: Seat Grid & Integrated Snacks Section -->
      <v-col cols="12" md="8">
        <!-- Interactive Cinema Seat Grid -->
        <v-card color="#12141c" class="pa-6 rounded-24 border-glass mb-6" elevation="0">
          <!-- Curved Cinema Screen -->
          <div class="screen-container text-center mb-10">
            <div class="curved-screen mb-2">SCREEN THIS WAY</div>
            <span class="text-caption text-grey">All Eyes On The Screen</span>
          </div>

          <!-- Seat Grid -->
          <div class="d-flex flex-column align-center ga-3 mb-8">
            <div v-for="row in rows" :key="row" class="d-flex align-center ga-2">
              <span class="text-caption text-grey font-weight-bold mr-2" style="width: 15px;">{{ row }}</span>
              <v-btn
                v-for="col in cols"
                :key="col"
                size="small"
                min-width="36"
                height="36"
                :color="getSeatColor(row + col)"
                class="rounded-md font-weight-bold px-0"
                @click="toggleSeat(row + col)"
              >
                {{ col }}
              </v-btn>
            </div>
          </div>

          <!-- Seat Legend -->
          <div class="d-flex justify-center ga-6 pt-4 border-t border-grey-darken-3">
            <div class="d-flex align-center ga-2">
              <div class="legend-box bg-grey-darken-3"></div>
              <span class="text-caption text-grey">Available</span>
            </div>
            <div class="d-flex align-center ga-2">
              <div class="legend-box bg-indigo-accent-3"></div>
              <span class="text-caption text-grey">Selected</span>
            </div>
          </div>
        </v-card>

        <!-- 🍿 Integrated Food & Beverages Section -->
        <v-card color="#12141c" class="pa-6 rounded-24 border-glass" elevation="0">
          <h3 class="text-h6 font-weight-black text-white mb-1 d-flex align-center ga-2">
            🍿 Add Cinema Snacks & Drinks
          </h3>
          <p class="text-caption text-grey mb-4">Pre-book snacks to skip the concession queue!</p>

          <v-row>
            <v-col v-for="snack in availableSnacks" :key="snack.id" cols="12" sm="6">
              <div class="d-flex align-center justify-space-between pa-3 rounded-xl bg-grey-darken-4 border-glass">
                <div class="d-flex align-center ga-3">
                  <span class="text-h5">{{ snack.icon }}</span>
                  <div>
                    <div class="text-body-2 font-weight-bold text-white">{{ snack.name }}</div>
                    <div class="text-caption text-amber-accent-2 font-weight-bold">₹{{ snack.price }}</div>
                  </div>
                </div>

                <div class="d-flex align-center ga-2">
                  <v-btn
                    icon="mdi-minus"
                    size="x-small"
                    color="grey-darken-2"
                    variant="flat"
                    :disabled="getSnackQty(snack.id) === 0"
                    @click="updateSnackQty(snack, -1)"
                  ></v-btn>
                  <span class="text-body-2 font-weight-bold text-white px-1">{{ getSnackQty(snack.id) }}</span>
                  <v-btn
                    icon="mdi-plus"
                    size="x-small"
                    color="indigo-accent-3"
                    variant="flat"
                    @click="updateSnackQty(snack, 1)"
                  ></v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Right Column: Booking Summary & Consolidated Billing -->
      <v-col cols="12" md="4">
        <v-card color="#12141c" class="pa-6 rounded-24 border-glass" elevation="0" style="position: sticky; top: 90px;">
          <h3 class="text-h6 font-weight-black text-white mb-4">Booking Summary</h3>

          <div class="mb-4">
            <h4 class="text-subtitle-1 font-weight-bold text-indigo-lighten-3">
              {{ movie?.title || route.query.movieTitle || 'Movie Ticket' }}
            </h4>
            
            <!-- Display Selected Theatre & Showtime -->
            <div class="text-caption text-white font-weight-bold mt-1 d-flex align-center ga-1">
              <v-icon size="x-small" color="red-accent-2">mdi-map-marker</v-icon>
              {{ theatreName }}
            </div>
            <div class="text-caption text-grey mt-1">
              📅 {{ selectedDate }} | 🕒 {{ showtime }}
            </div>
          </div>

          <v-divider class="mb-4 border-grey-darken-3"></v-divider>

          <!-- Selected Seats breakdown -->
          <div class="mb-4">
            <span class="text-caption text-grey d-block mb-1">Selected Seats</span>
            <div v-if="selectedSeats.length > 0" class="d-flex flex-wrap ga-1">
              <v-chip v-for="seat in selectedSeats" :key="seat" color="indigo-accent-2" size="small" class="font-weight-bold">
                {{ seat }}
              </v-chip>
            </div>
            <span v-else class="text-caption text-amber-accent-3">No seats selected yet</span>
          </div>

          <!-- Selected Snacks breakdown -->
          <div class="mb-4" v-if="selectedSnacks.length > 0">
            <span class="text-caption text-grey d-block mb-1">Added Snacks</span>
            <div v-for="item in selectedSnacks" :key="item.id" class="d-flex justify-space-between text-caption text-grey-lighten-1 mb-1">
              <span>{{ item.name }} x{{ item.qty }}</span>
              <span>₹{{ item.price * item.qty }}</span>
            </div>
          </div>

          <!-- Promo Code / Discount Section -->
          <div class="mb-4">
            <span class="text-caption text-grey d-block mb-1">Available Offers & Promo Code</span>
            <div class="d-flex ga-2">
              <v-text-field
                v-model="promoCode"
                placeholder="Enter Code (FIRST50)"
                variant="outlined"
                density="compact"
                hide-details
                color="indigo-accent-2"
              ></v-text-field>
              <v-btn color="indigo-accent-3" density="compact" class="font-weight-bold my-auto text-none" height="40" @click="applyPromo">
                Apply
              </v-btn>
            </div>
            <span v-if="discount > 0" class="text-caption text-green-accent-3 mt-1 d-block">
              🎉 Promo Applied! Flat ₹{{ discount }} OFF
            </span>
          </div>

          <!-- Combined Price Calculation -->
          <div class="bg-grey-darken-4 pa-4 rounded-xl mb-6">
            <div class="d-flex justify-space-between text-body-2 mb-1 text-grey">
              <span>Tickets (x{{ selectedSeats.length }})</span>
              <span>₹{{ rawTotal }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-1 text-grey" v-if="snacksTotal > 0">
              <span>Snacks & Drinks</span>
              <span>₹{{ snacksTotal }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-1 text-green-accent-3" v-if="discount > 0">
              <span>Discount</span>
              <span>-₹{{ discount }}</span>
            </div>
            <v-divider class="my-2 border-grey-darken-2"></v-divider>
            <div class="d-flex justify-space-between text-subtitle-1 font-weight-black text-white">
              <span>Total Amount</span>
              <span class="text-amber-accent-2">₹{{ finalTotal }}</span>
            </div>
          </div>

          <v-btn
            color="indigo-accent-3"
            size="large"
            block
            class="rounded-xl font-weight-bold text-white shadow-btn text-none"
            :disabled="selectedSeats.length === 0"
            @click="openPaymentModal"
          >
            Proceed to Payment
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Modal -->
    <v-dialog v-model="showPaymentModal" max-width="450">
      <v-card color="#12141c" class="pa-6 rounded-24 border-glass">
        <h3 class="text-h5 font-weight-black text-white mb-2">Select Payment Method</h3>
        <p class="text-caption text-grey mb-6">Amount to Pay: <strong class="text-amber-accent-2">₹{{ finalTotal }}</strong></p>

        <v-radio-group v-model="selectedPayment" color="indigo-accent-3" class="mb-4">
          <v-radio value="UPI" label="GPay / PhonePe / Paytm UPI" class="text-white mb-2"></v-radio>
          <v-radio value="Card" label="Credit / Debit Card" class="text-white mb-2"></v-radio>
          <v-radio value="NetBanking" label="Net Banking" class="text-white"></v-radio>
        </v-radio-group>

        <v-btn
          color="indigo-accent-3"
          size="large"
          block
          class="rounded-xl font-weight-bold text-white shadow-btn text-none"
          :loading="bookingLoading"
          @click="confirmBooking"
        >
          Pay ₹{{ finalTotal }} & Confirm Ticket
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const movie = ref(null);

// Safe computed getters from query/params
const showtime = computed(() => {
  return route.query.showtime || (route.params.showtime ? decodeURIComponent(route.params.showtime) : '07:00 PM');
});

const theatreName = computed(() => {
  return route.query.theatreName || 'PVR Inox Cinemas';
});

const selectedDate = computed(() => {
  return route.query.date || 'Today';
});

const rows = ['A', 'B', 'C', 'D'];
const cols = [1, 2, 3, 4, 5, 6];

const selectedSeats = ref([]);
const promoCode = ref('');
const discount = ref(0);

// Food & Beverages State
const availableSnacks = ref([
  { id: 1, name: 'Large Popcorn (Salted)', price: 290, icon: '🍿' },
  { id: 2, name: 'Pepsi / Coca Cola (500ml)', price: 180, icon: '🥤' },
  { id: 3, name: 'Cheese Nachos Combo', price: 340, icon: '🧀' },
  { id: 4, name: 'Chicken / Veg Burger', price: 220, icon: '🍔' }
]);

const selectedSnacks = ref([]);

const showPaymentModal = ref(false);
const selectedPayment = ref('UPI');
const bookingLoading = ref(false);

onMounted(async () => {
  const movieId = route.params.id || route.query.movieId;
  if (movieId) {
    try {
      const res = await fetch('/db.json');
      if (res.ok) {
        const data = await res.json();
        const found = (data.movies || []).find(m => String(m.id) === String(movieId));
        if (found) {
          movie.value = found;
        }
      }
    } catch (err) {
      console.error('Error loading movie:', err);
    }
  }
});

const toggleSeat = (seatCode) => {
  if (selectedSeats.value.includes(seatCode)) {
    selectedSeats.value = selectedSeats.value.filter(s => s !== seatCode);
  } else {
    selectedSeats.value.push(seatCode);
  }
};

const getSeatColor = (seatCode) => {
  return selectedSeats.value.includes(seatCode) ? 'indigo-accent-3' : 'grey-darken-3';
};

// Snack Handlers
const getSnackQty = (id) => {
  const item = selectedSnacks.value.find(s => s.id === id);
  return item ? item.qty : 0;
};

const updateSnackQty = (snack, delta) => {
  const itemIndex = selectedSnacks.value.findIndex(s => s.id === snack.id);
  if (itemIndex > -1) {
    selectedSnacks.value[itemIndex].qty += delta;
    if (selectedSnacks.value[itemIndex].qty <= 0) {
      selectedSnacks.value.splice(itemIndex, 1);
    }
  } else if (delta > 0) {
    selectedSnacks.value.push({ ...snack, qty: 1 });
  }
};

// Price Calculations
const rawTotal = computed(() => {
  const ticketPrice = movie.value?.price || 250;
  return selectedSeats.value.length * ticketPrice;
});

const snacksTotal = computed(() => {
  return selectedSnacks.value.reduce((sum, item) => sum + (item.price * item.qty), 0);
});

const finalTotal = computed(() => {
  const totalGross = rawTotal.value + snacksTotal.value;
  return Math.max(0, totalGross - discount.value);
});

const applyPromo = () => {
  const code = promoCode.value.trim().toUpperCase();
  if (code === 'FIRST50') {
    discount.value = 50;
  } else if (code === 'CINE100') {
    discount.value = 100;
  } else {
    alert('Invalid Promo Code! Try FIRST50 or CINE100');
    discount.value = 0;
  }
};

const openPaymentModal = () => {
  showPaymentModal.value = true;
};

const confirmBooking = async () => {
  bookingLoading.value = true;

  const currentUser = authStore?.user || JSON.parse(localStorage.getItem('currentUser'));

  // Complete Ticket Object with Theatre Info & Snacks
  const ticketData = {
    id: 'BK-' + Date.now(),
    userId: currentUser?.id || 1,
    userEmail: currentUser?.email || 'user@example.com',
    movieTitle: movie.value?.title || route.query.movieTitle || 'Movie Ticket',
    theatre: theatreName.value,
    theatreName: theatreName.value,
    showtime: `${selectedDate.value} | ${showtime.value}`,
    seats: [...selectedSeats.value],
    snacks: [...selectedSnacks.value],
    totalPaid: finalTotal.value,
    paymentMethod: selectedPayment.value,
    bookingDate: new Date().toLocaleDateString()
  };

  try {
    // Save to LocalStorage for static client persistence
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.unshift(ticketData);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    showPaymentModal.value = false;
    alert('🎟️ Ticket & Food Booked Successfully!');
    router.push('/dashboard');
  } catch (err) {
    console.error('Booking error:', err);
    alert('Failed to complete booking');
  } finally {
    bookingLoading.value = false;
  }
};
</script>

<style scoped>
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.rounded-24 {
  border-radius: 24px !important;
}

.screen-container {
  perspective: 400px;
}

.curved-screen {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 100%);
  border-top: 3px solid #6366f1;
  border-radius: 50% 50% 0 0 / 20px 20px 0 0;
  padding: 12px;
  color: #a5b4fc;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 2px;
  box-shadow: 0 -10px 20px rgba(99, 102, 241, 0.2);
}

.legend-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.shadow-btn {
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}
</style>