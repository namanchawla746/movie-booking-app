<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-black text-white d-flex align-center ga-2">
        <v-icon color="red-accent-3">mdi-heart</v-icon> My Wishlist
      </h1>
      <v-chip color="red-accent-3" class="font-weight-bold">
        {{ wishlistStore.wishlistCount }} Movies
      </v-chip>
    </div>

    <!-- Empty Wishlist State -->
    <v-card 
      v-if="wishlistStore.wishlist.length === 0" 
      color="#12141c" 
      class="pa-12 text-center rounded-24 border-glass my-8"
    >
      <v-icon size="80" color="grey-darken-2" class="mb-4">mdi-heart-broken</v-icon>
      <h2 class="text-h5 text-white font-weight-bold mb-2">Your Wishlist is Empty</h2>
      <p class="text-body-1 text-grey mb-6">Explore movies and tap the heart icon to save your favorites!</p>
      <v-btn color="indigo-accent-2" size="large" class="rounded-xl font-weight-bold text-none" to="/">
        Explore Movies
      </v-btn>
    </v-card>

    <!-- Wishlist Movies Grid -->
    <v-row v-else>
      <v-col
        v-for="movie in wishlistStore.wishlist"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card color="#12141c" class="rounded-24 border-glass h-100 d-flex flex-column hover-card">
          <div class="position-relative">
            <v-img :src="movie.image" height="300" cover class="rounded-t-24"></v-img>

            <!-- Remove Button -->
            <v-btn
              icon="mdi-close"
              size="small"
              color="red-accent-3"
              class="position-absolute top-0 right-0 ma-3"
              @click="wishlistStore.toggleWishlist(movie)"
            ></v-btn>

            <v-chip color="amber-accent-3" class="position-absolute bottom-0 left-0 ma-3 font-weight-black" size="small">
              ⭐ {{ movie.rating }}
            </v-chip>
          </div>

          <v-card-item class="pt-4">
            <div class="text-caption text-indigo-accent-2 font-weight-bold mb-1">{{ movie.genre }}</div>
            <h3 class="text-h6 font-weight-black text-white text-truncate">{{ movie.title }}</h3>
          </v-card-item>

          <v-card-text class="text-grey-lighten-1 text-body-2 line-clamp-2 pt-0 flex-grow-1">
            {{ movie.description }}
          </v-card-text>

          <v-card-actions class="pa-4 pt-0 justify-space-between align-center">
            <div class="text-h6 font-weight-bold text-white">₹{{ movie.price }}</div>
            <v-btn
              color="indigo-accent-2"
              variant="flat"
              class="rounded-xl font-weight-bold text-none px-6"
              :to="`/movie/${movie.id}`"
            >
              Book Now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useWishlistStore } from '../stores/wishlist';

const wishlistStore = useWishlistStore();
</script>

<style scoped>
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.rounded-24 {
  border-radius: 24px !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>