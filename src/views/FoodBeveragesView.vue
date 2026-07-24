<template>
  <v-container class="py-8 min-vh-100">
    <!-- Header Step Navigator Bar -->
    <v-card color="#12141c" class="pa-6 mb-8 rounded-24 border-glass elevation-10">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <v-chip color="amber-accent-3" size="small" class="font-weight-bold mb-2">🍿 Movie Snacks</v-chip>
          <h1 class="text-h4 font-weight-black text-white">Grab Your Cinema Snacks</h1>
          <p class="text-caption text-grey-lighten-1 mb-0">Pre-order now to skip long queues at the counter!</p>
        </div>

        <v-btn
          color="grey-darken-3"
          variant="tonal"
          prepend-icon="mdi-arrow-left"
          class="rounded-xl font-weight-bold text-none"
          to="/"
        >
          Back to Movies
        </v-btn>
      </div>
    </v-card>

    <v-row>
      <!-- Main Content: Category Tabs & Food Cards -->
      <v-col cols="12" md="8">
        <!-- Filter Tabs -->
        <div class="d-flex flex-wrap ga-2 mb-6">
          <v-chip
            v-for="cat in categories"
            :key="cat"
            :color="selectedCategory === cat ? 'amber-accent-3' : 'grey-darken-3'"
            :variant="selectedCategory === cat ? 'flat' : 'tonal'"
            class="font-weight-bold cursor-pointer text-body-2 px-4 py-2"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </v-chip>
        </div>

        <!-- Food Grid -->
        <v-row>
          <v-col
            v-for="item in filteredFoodItems"
            :key="item.id"
            cols="12"
            sm="6"
          >
            <v-card color="#12141c" class="food-card rounded-24 border-glass overflow-hidden elevation-8">
              <div class="position-relative">
                <v-img :src="item.image" height="180" cover class="align-end">
                  <div class="card-overlay pa-3 d-flex justify-space-between align-end">
                    <span class="text-caption text-grey-lighten-2 font-weight-medium">🔥 {{ item.calories || '250 kcal' }}</span>
                  </div>
                </v-img>

                <v-chip
                  v-if="item.tag || item.category"
                  color="indigo-accent-3"
                  size="x-small"
                  class="position-absolute top-0 left-0 ma-3 font-weight-black"
                  variant="flat"
                >
                  {{ item.tag || item.category }}
                </v-chip>
              </div>

              <v-card-text class="pa-5">
                <h3 class="text-subtitle-1 font-weight-black text-white text-truncate mb-1">{{ item.name }}</h3>
                <div class="text-h6 font-weight-black text-amber-accent-3 mb-4">₹{{ item.price }}</div>

                <!-- Quantity Controller -->
                <div class="d-flex align-center justify-space-between pt-2 border-t border-grey-darken-3">
                  <span class="text-caption text-grey">Quantity:</span>

                  <div v-if="getItemQuantity(item.id) > 0" class="d-flex align-center ga-2 bg-grey-darken-4 rounded-xl pa-1 border-glass">
                    <v-btn
                      icon="mdi-minus"
                      size="x-small"
                      color="amber-accent-3"
                      variant="tonal"
                      @click="decreaseQty(item)"
                    ></v-btn>

                    <span class="px-2 font-weight-bold text-white text-body-2">{{ getItemQuantity(item.id) }}</span>

                    <v-btn
                      icon="mdi-plus"
                      size="x-small"
                      color="amber-accent-3"
                      variant="flat"
                      @click="increaseQty(item)"
                    ></v-btn>
                  </div>

                  <v-btn
                    v-else
                    color="amber-accent-3"
                    size="small"
                    variant="tonal"
                    prepend-icon="mdi-plus"
                    class="rounded-xl font-weight-bold text-none text-black"
                    @click="increaseQty(item)"
                  >
                    Add
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Cart / Order Summary Sidebar -->
      <v-col cols="12" md="4">
        <v-card color="#12141c" class="rounded-24 border-glass pa-6 elevation-12 position-sticky top-24">
          <div class="d-flex align-center justify-space-between mb-4 pb-3 border-b border-grey-darken-3">
            <h2 class="text-h6 font-weight-black text-white">Order Summary</h2>
            <v-badge :content="cartItems.length" color="amber-accent-3" offset-x="-2" offset-y="-2">
              <v-icon color="indigo-accent-2" size="28">mdi-food-popcorn</v-icon>
            </v-badge>
          </div>

          <!-- Empty Cart State -->
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <v-icon size="48" color="grey-darken-2" class="mb-2">mdi-cart-outline</v-icon>
            <p class="text-caption text-grey mb-0">No snacks added yet.<br/>Pick your favorite movie munchies!</p>
          </div>

          <!-- Selected Items List -->
          <div v-else class="cart-scroll-area mb-4 pr-1">
            <div
              v-for="cartItem in cartItems"
              :key="cartItem.id"
              class="d-flex align-center justify-space-between py-3 border-b border-grey-darken-4"
            >
              <div class="pr-2 overflow-hidden">
                <div class="text-body-2 font-weight-bold text-white text-truncate">{{ cartItem.name }}</div>
                <div class="text-caption text-grey">₹{{ cartItem.price }} × {{ cartItem.qty }}</div>
              </div>

              <div class="d-flex align-center ga-2">
                <span class="text-body-2 font-weight-black text-amber-accent-3">₹{{ cartItem.price * cartItem.qty }}</span>
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  color="grey"
                  @click="removeItem(cartItem.id)"
                ></v-btn>
              </div>
            </div>
          </div>

          <!-- Bill Breakdown -->
          <div v-if="cartItems.length > 0" class="pt-2">
            <div class="d-flex justify-space-between text-caption text-grey mb-2">
              <span>Subtotal</span>
              <span>₹{{ subtotal }}</span>
            </div>
            <div class="d-flex justify-space-between text-caption text-grey mb-3">
              <span>GST (18%)</span>
              <span>₹{{ gstAmount }}</span>
            </div>

            <v-divider class="my-3 border-grey-darken-3"></v-divider>

            <div class="d-flex justify-space-between align-center mb-6">
              <span class="text-subtitle-1 font-weight-bold text-white">Grand Total</span>
              <span class="text-h5 font-weight-black text-amber-accent-3">₹{{ grandTotal }}</span>
            </div>

            <v-btn
              block
              size="large"
              color="amber-accent-3"
              class="rounded-xl font-weight-black text-black text-none elevation-8 mb-2"
              append-icon="mdi-arrow-right"
              @click="proceedToCheckout"
            >
              Proceed to Checkout
            </v-btn>

            <v-btn
              block
              variant="text"
              color="grey"
              size="small"
              class="text-none"
              @click="skipFood"
            >
              Skip Snacks & Proceed
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Modal Dialog -->
    <v-dialog v-model="showPaymentModal" max-width="450">
      <v-card color="#12141c" class="pa-6 rounded-24 border-glass">
        <h3 class="text-h5 font-weight-black text-white mb-2">Confirm Snacks Order</h3>
        <p class="text-caption text-grey mb-6">Total Amount: <strong class="text-amber-accent-3">₹{{ grandTotal }}</strong></p>

        <v-radio-group v-model="selectedPayment" color="amber-accent-3" class="mb-4">
          <v-radio value="UPI" label="GPay / PhonePe / Paytm UPI" class="text-white mb-2"></v-radio>
          <v-radio value="Card" label="Credit / Debit Card" class="text-white mb-2"></v-radio>
          <v-radio value="Cash Counter" label="Pay at Cinema Counter" class="text-white"></v-radio>
        </v-radio-group>

        <v-btn
          color="amber-accent-3"
          size="large"
          block
          class="rounded-xl font-weight-black text-black"
          :loading="checkoutLoading"
          @click="confirmOrder"
        >
          Pay ₹{{ grandTotal }} & Complete
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth';

const router = useRouter();

const foodItems = ref([]);
const selectedCategory = ref('All');
const categories = ['All', 'Popcorn', 'Beverages', 'Snacks', 'Combos'];

// Cart & Payment states
const cart = ref({});
const showPaymentModal = ref(false);
const selectedPayment = ref('UPI');
const checkoutLoading = ref(false);

// Fallback food items agar db.json empty ya missing ho
const fallbackFoodItems = [
  { id: 101, name: 'Caramel Popcorn (Large)', price: 320, category: 'Popcorn', calories: '450 kcal', image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400', tag: 'Bestseller' },
  { id: 102, name: 'Cheese & Butter Popcorn', price: 290, category: 'Popcorn', calories: '410 kcal', image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400', tag: 'Must Try' },
  { id: 103, name: 'Cold Coffee / Pepsi', price: 180, category: 'Beverages', calories: '180 kcal', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400' },
  { id: 104, name: 'Cheese Nachos Combo', price: 340, category: 'Combos', calories: '520 kcal', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=400' }
];

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/foodItems');
    if (res.ok) {
      const data = await res.json();
      foodItems.value = data.length > 0 ? data : fallbackFoodItems;
    } else {
      foodItems.value = fallbackFoodItems;
    }
  } catch (err) {
    console.error('Failed to load food items, using fallbacks', err);
    foodItems.value = fallbackFoodItems;
  }
});

const filteredFoodItems = computed(() => {
  if (selectedCategory.value === 'All') return foodItems.value;
  return foodItems.value.filter(item => item.category === selectedCategory.value);
});

const getItemQuantity = (id) => cart.value[id]?.qty || 0;

const increaseQty = (item) => {
  if (!cart.value[item.id]) {
    cart.value[item.id] = { ...item, qty: 1 };
  } else {
    cart.value[item.id].qty += 1;
  }
};

const decreaseQty = (item) => {
  if (cart.value[item.id]) {
    cart.value[item.id].qty -= 1;
    if (cart.value[item.id].qty <= 0) {
      delete cart.value[item.id];
    }
  }
};

const removeItem = (id) => {
  delete cart.value[id];
};

const cartItems = computed(() => Object.values(cart.value));

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
});

const gstAmount = computed(() => Math.round(subtotal.value * 0.18));

const grandTotal = computed(() => subtotal.value + gstAmount.value);

// Open Payment Dialog Modal
const proceedToCheckout = () => {
  if (cartItems.value.length === 0) return;
  showPaymentModal.value = true;
};

// Confirm and save order into JSON Server
const confirmOrder = async () => {
  checkoutLoading.value = true;
  const currentUser = authStore.user || JSON.parse(localStorage.getItem('currentUser'));

  const orderData = {
    userId: currentUser?.id || 1,
    userEmail: currentUser?.email || 'user@example.com',
    movieTitle: 'Cinema Snacks Pass 🍿',
    theatre: 'Snacks Concession Counter',
    showtime: 'Pickup at Counter',
    seats: ['NA'],
    snacks: cartItems.value.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })),
    totalPaid: grandTotal.value,
    paymentMethod: selectedPayment.value,
    bookingDate: new Date().toLocaleDateString()
  };

  try {
    const res = await fetch('http://localhost:3001/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      showPaymentModal.value = false;
      alert('🍿 Snacks Order Confirmed Successfully!');
      cart.value = {};
      router.push('/dashboard');
    } else {
      alert('Failed to place order. Try again.');
    }
  } catch (err) {
    console.error('Error completing checkout:', err);
    alert('Failed to connect to backend server!');
  } finally {
    checkoutLoading.value = false;
  }
};

// Skip Button Action
const skipFood = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.rounded-24 {
  border-radius: 24px !important;
}

.top-24 {
  top: 24px;
}

.food-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(255, 193, 7, 0.15) !important;
}

.card-overlay {
  background: linear-gradient(0deg, rgba(18, 20, 28, 0.9) 0%, rgba(18, 20, 28, 0) 100%);
  width: 100%;
}

.cart-scroll-area {
  max-height: 280px;
  overflow-y: auto;
}

/* Custom Scrollbar */
.cart-scroll-area::-webkit-scrollbar {
  width: 4px;
}
.cart-scroll-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>