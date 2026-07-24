<template>
  <v-app style="background-color: #08090c !important;">
    <!-- Modern Premium Navigation Bar -->
    <v-app-bar
      flat
      style="background: rgba(22, 25, 37, 0.85) !important; backdrop-filter: blur(16px); border-bottom: 1px solid rgba(99, 102, 241, 0.2) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;"
      class="px-2 px-md-6"
      height="75"
    >
      <!-- Logo & City Selector Group -->
      <div class="d-flex align-center ga-3">
        <v-app-bar-title class="font-weight-black cursor-pointer" @click="$router.push('/')">
          <span class="text-h5 font-weight-black brand-logo d-flex align-center ga-1">
            🎬 CinePass
          </span>
        </v-app-bar-title>

        <!-- 🏙️ Location / City Selector -->
        <v-menu location="bottom start" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="tonal"
              color="indigo-lighten-3"
              size="small"
              class="rounded-pill location-btn px-3 font-weight-bold text-none d-none d-sm-flex"
            >
              <v-icon color="red-accent-2" size="small" class="mr-1">mdi-map-marker</v-icon>
              <span>{{ cityStore?.selectedCity || selectedCityFallback }}</span>
              <v-icon size="x-small" class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list bg-color="#181b26" class="rounded-xl border-glass elevation-12 py-2" width="160">
            <v-list-item
              v-for="city in cities"
              :key="city"
              :value="city"
              @click="setCity(city)"
              class="city-item"
              :class="{ 'active-city': getCurrentCity() === city }"
            >
              <template v-slot:prepend>
                <v-icon size="small" :color="getCurrentCity() === city ? 'indigo-accent-2' : 'grey'">
                  mdi-city
                </v-icon>
              </template>
              <v-list-item-title class="font-weight-medium text-body-2 text-white">
                {{ city }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-spacer></v-spacer>

      <!-- Navigation Links -->
      <div class="d-flex align-center ga-1 ga-md-2">
        <v-btn to="/" variant="text" class="nav-btn" active-class="active-nav">
          <v-icon size="small" class="mr-1">mdi-movie-open</v-icon>
          <span>Movies</span>
        </v-btn>

        <v-btn to="/food" variant="text" class="nav-btn" active-class="active-nav">
          <v-icon size="small" class="mr-1">mdi-popcorn</v-icon>
          <span>Snacks</span>
        </v-btn>

        <!-- ❤️ Wishlist Badge Button -->
        <v-btn to="/wishlist" variant="text" class="nav-btn" active-class="active-nav">
          <v-badge
            :content="wishlistCount"
            color="red-accent-3"
            v-if="wishlistCount > 0"
            offset-x="-2"
            offset-y="-2"
          >
            <v-icon color="red-accent-2" size="small">mdi-heart</v-icon>
          </v-badge>
          <v-icon v-else size="small">mdi-heart-outline</v-icon>
          <span class="ml-2 d-none d-sm-inline">Wishlist</span>
        </v-btn>
        
        <!-- Visible when logged in -->
        <v-btn v-if="isLoggedIn" to="/dashboard" variant="text" class="nav-btn" active-class="active-nav">
          <v-icon size="small" class="mr-1">mdi-ticket-confirmation</v-icon>
          <span>My Tickets</span>
        </v-btn>

        <!-- User Greeting & Action Buttons -->
        <div v-if="isLoggedIn" class="d-flex align-center ga-2 ml-2">
          <v-chip color="indigo-lighten-4" variant="tonal" size="small" class="d-none d-md-flex font-weight-bold border-glass">
            👋 {{ currentUser?.name || 'User' }}
          </v-chip>
          <v-btn @click="handleLogout" variant="outlined" color="red-accent-2" size="small" prepend-icon="mdi-logout" class="rounded-pill font-weight-bold text-none">
            Logout
          </v-btn>
        </div>

        <!-- Vibrant Glowing Login Button -->
        <v-btn v-else to="/login" variant="flat" color="indigo-accent-3" class="glow-btn text-white rounded-pill px-6 font-weight-bold ml-2 text-none">
          Login
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Main View Holder -->
    <v-main style="background-color: #08090c !important;">
      <v-container class="py-8">
        <router-view />
      </v-container>
    </v-main>

    <!-- FOOTER SECTION START -->
    <v-footer style="background-color: #12141c !important;" class="py-10 border-t border-grey-darken-4 mt-12 d-flex flex-column">
      <v-container>
        <v-row class="mb-6">
          <!-- Brand Info -->
          <v-col cols="12" md="4" class="mb-4 mb-md-0">
            <div class="d-flex align-center ga-2 mb-3">
              <span class="text-h5 font-weight-black brand-logo">🎬 CinePass</span>
            </div>
            <p class="text-body-2 text-grey-lighten-1 mb-4">
              Your ultimate movie booking destination. Enjoy seamless ticket booking, exclusive snack pre-orders, and immersive cinema experiences.
            </p>
            <div class="d-flex ga-3">
              <v-btn icon="mdi-facebook" variant="tonal" size="small" color="indigo-lighten-3"></v-btn>
              <v-btn icon="mdi-twitter" variant="tonal" size="small" color="indigo-lighten-3"></v-btn>
              <v-btn icon="mdi-instagram" variant="tonal" size="small" color="indigo-lighten-3"></v-btn>
              <v-btn icon="mdi-youtube" variant="tonal" size="small" color="indigo-lighten-3"></v-btn>
            </div>
          </v-col>

          <!-- Quick Links -->
          <v-col cols="6" sm="4" md="2">
            <h3 class="text-subtitle-1 font-weight-bold text-white mb-3">Explore</h3>
            <div class="d-flex flex-column ga-2 text-body-2 text-grey">
              <router-link to="/" class="footer-link">Now Showing</router-link>
              <router-link to="/food" class="footer-link">Snacks & Drinks</router-link>
              <router-link to="/wishlist" class="footer-link">Wishlist</router-link>
              <router-link to="/dashboard" class="footer-link">My Tickets</router-link>
            </div>
          </v-col>

          <!-- Support Links -->
          <v-col cols="6" sm="4" md="2">
            <h3 class="text-subtitle-1 font-weight-bold text-white mb-3">Support</h3>
            <div class="d-flex flex-column ga-2 text-body-2 text-grey">
              <a href="#" class="footer-link">Help Center</a>
              <a href="#" class="footer-link">Terms of Service</a>
              <a href="#" class="footer-link">Privacy Policy</a>
              <a href="#" class="footer-link">Contact Us</a>
            </div>
          </v-col>

          <!-- Newsletter -->
          <v-col cols="12" sm="4" md="4">
            <h3 class="text-subtitle-1 font-weight-bold text-white mb-3">Stay Updated</h3>
            <p class="text-caption text-grey mb-3">Subscribe to get special offers and movie updates straight to your inbox.</p>
            <v-text-field
              placeholder="Enter your email"
              variant="outlined"
              density="compact"
              color="indigo-accent-2"
              bg-color="grey-darken-4"
              class="rounded-lg mb-2"
              hide-details
            >
              <template v-slot:append-inner>
                <v-btn color="indigo-accent-3" variant="flat" size="small" class="font-weight-bold text-none text-white">
                  Join
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </row>

        <v-divider class="my-6 border-grey-darken-4"></v-divider>

        <!-- Bottom Copyright Line -->
        <div class="d-flex flex-wrap align-center justify-space-between text-caption text-grey ga-2">
          <div>&copy; {{ new Date().getFullYear() }} <strong>CinePass</strong>. All rights reserved.</div>
          <div>Crafted for the ultimate cinema experience.</div>
        </div>
      </v-container>
    </v-footer>
    <!-- FOOTER SECTION END -->
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authStore as auth } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';
import { cityStore } from '@/stores/city';

const router = useRouter();
const route = useRoute();

let wishlistStore = null;
try {
  wishlistStore = useWishlistStore();
} catch (e) {
  console.warn('Wishlist store initialization fallback');
}

const cities = ['All Cities', 'Pune', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad'];
const selectedCityFallback = ref('All Cities');
const currentUser = ref(null);
const isLoggedIn = ref(false);

const updateAuthState = () => {
  if (auth && typeof auth.isLoggedIn === 'function') {
    isLoggedIn.value = auth.isLoggedIn();
    currentUser.value = auth.user;
  } else {
    const localUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    isLoggedIn.value = !!localUser;
    currentUser.value = localUser;
  }
};

onMounted(() => {
  updateAuthState();
});

watch(() => route.path, () => {
  updateAuthState();
});

const wishlistCount = computed(() => {
  if (wishlistStore && wishlistStore.wishlistCount !== undefined) {
    return wishlistStore.wishlistCount;
  }
  return 0;
});

const getCurrentCity = () => {
  if (cityStore && cityStore.selectedCity) {
    return cityStore.selectedCity;
  }
  return selectedCityFallback.value;
};

const setCity = (city) => {
  if (cityStore && typeof cityStore.setCity === 'function') {
    cityStore.setCity(city);
  } else {
    selectedCityFallback.value = city;
  }
};

const handleLogout = () => {
  if (auth && typeof auth.logout === 'function') {
    auth.logout();
  } else {
    localStorage.removeItem('currentUser');
  }
  updateAuthState();
  router.push('/login');
};
</script>

<style scoped>
.brand-logo {
  background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  filter: drop-shadow(0 2px 8px rgba(99, 102, 241, 0.4));
}

.location-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  transition: all 0.3s ease;
}

.location-btn:hover {
  border-color: #818cf8 !important;
  background: rgba(99, 102, 241, 0.15) !important;
}

.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.city-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.city-item:hover {
  background: rgba(99, 102, 241, 0.15) !important;
}

.active-city {
  background: rgba(99, 102, 241, 0.25) !important;
}

.nav-btn {
  font-weight: 700 !important;
  color: #cbd5e1 !important;
  text-transform: none !important;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.06) !important;
}

.active-nav {
  color: #818cf8 !important;
  background: rgba(99, 102, 241, 0.12) !important;
}

.glow-btn {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
  transition: all 0.3s ease;
}

.glow-btn:hover {
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.85);
  transform: translateY(-1px);
}

.cursor-pointer {
  cursor: pointer;
}

.footer-link {
  color: #9e9e9e;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #818cf8;
}
</style>