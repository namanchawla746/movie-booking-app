<template>
  <v-container class="py-8 hero-container">
    <!-- 🚀 Enhanced Modern Hero Banner -->
    <v-row class="mb-10">
      <v-col cols="12">
        <v-card color="transparent" class="pa-10 rounded-24 hero-banner border-glass position-relative overflow-hidden text-center">
          <div class="hero-glow"></div>
          <v-chip color="indigo-accent-2" size="small" class="mb-3 font-weight-bold text-uppercase px-4 py-1 border-subtle">
            ✨ Premium Cinema Experience
          </v-chip>
          <h1 class="text-h2 font-weight-black text-white mb-3 hero-title">
            Experience Cinema Like <span class="gradient-text">Never Before</span>
          </h1>
          <p class="text-subtitle-1 text-grey-lighten-2 max-w-600 mx-auto">
            Book tickets for blockbusters in high definition, filter by your favorite genres, or discover top-rated releases in your city!
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- 🔍 Modern Floating Filters Bar -->
    <v-card color="#12141c" class="pa-4 rounded-24 border-glass mb-8 filter-card">
      <v-row class="align-center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search movies, actors, genres..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            bg-color="rgba(255, 255, 255, 0.05)"
            density="comfortable"
            class="rounded-xl custom-input"
            hide-details
            color="indigo-accent-2"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Category"
            variant="solo"
            bg-color="rgba(255, 255, 255, 0.05)"
            density="comfortable"
            class="rounded-xl custom-input"
            hide-details
            color="indigo-accent-2"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort By"
            variant="solo"
            bg-color="rgba(255, 255, 255, 0.05)"
            density="comfortable"
            class="rounded-xl custom-input"
            hide-details
            color="indigo-accent-2"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- 🏷️ Modern Genre Pill Chips -->
    <div class="d-flex flex-wrap ga-3 mb-10 align-center">
      <span class="text-caption font-weight-bold text-grey-lighten-1 mr-2 text-uppercase letter-spacing-1">
        <v-icon size="16" class="mr-1">mdi-filter-variant</v-icon> Genres:
      </span>
      <v-chip
        v-for="genre in genres"
        :key="genre"
        :class="['genre-chip', selectedGenre === genre ? 'active-chip' : '']"
        elevation="2"
        @click="selectedGenre = genre"
      >
        {{ genre }}
      </v-chip>
    </div>

    <!-- 🎬 SECTION 1: NOW SHOWING MOVIES -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-black text-white d-flex align-center ga-2">
          <v-icon color="indigo-accent-2" size="32">mdi-filmstrip</v-icon> Now Showing
          <v-chip color="indigo-accent-2" size="small" variant="flat" class="font-weight-bold">
            📍 {{ cityStore.selectedCity }}
          </v-chip>
        </h2>
        <p class="text-caption text-grey mt-1">Catch the latest movies playing near you</p>
      </div>

      <v-btn
        v-if="selectedGenre !== 'All' || searchQuery || cityStore.selectedCity !== 'All Cities'"
        variant="tonal"
        color="red-accent-2"
        size="small"
        class="text-none font-weight-bold rounded-xl px-4"
        prepend-icon="mdi-refresh"
        @click="resetFilters"
      >
        Reset Filters
      </v-btn>
    </div>

    <!-- 🍿 Movie Cards Grid -->
    <v-row v-if="filteredMovies.length > 0" class="mb-12">
      <v-col
        v-for="movie in filteredMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card color="#12141c" class="rounded-24 border-glass h-100 d-flex flex-column movie-card position-relative overflow-hidden">
          <!-- Poster Image with Gradient Overlay -->
          <div class="poster-wrapper">
            <v-img :src="movie.image" height="340" cover class="rounded-t-24 poster-img">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="indigo-accent-2"></v-progress-circular>
                </div>
              </template>
            </v-img>
            <div class="poster-overlay"></div>

            <!-- Heart Wishlist Button -->
            <v-btn
              icon
              size="small"
              class="position-absolute top-0 right-0 ma-3 wishlist-btn"
              @click.stop="wishlistStore.toggleWishlist(movie)"
            >
              <v-icon :color="wishlistStore.isInWishlist(movie.id) ? 'red-accent-3' : 'white'">
                {{ wishlistStore.isInWishlist(movie.id) ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>

            <!-- Rating Glow Badge -->
            <div class="position-absolute bottom-0 left-0 ma-3 rating-glow-badge">
              <span class="star">★</span>
              <span class="rating-num">{{ movie.rating }}</span>
            </div>

            <!-- Viewer Category Tag -->
            <div v-if="movie.category" class="position-absolute bottom-0 right-0 ma-3 category-tag">
              {{ movie.category }}
            </div>
          </div>

          <!-- Card Body -->
          <v-card-item class="pt-4">
            <div class="text-caption text-indigo-accent-2 font-weight-bold text-uppercase letter-spacing-1 mb-1">
              {{ movie.genre }}
            </div>
            <h3 class="text-h6 font-weight-black text-white text-truncate card-title">{{ movie.title }}</h3>
          </v-card-item>

          <v-card-text class="text-grey-lighten-1 text-body-2 line-clamp-2 pt-0 flex-grow-1">
            {{ movie.description }}
          </v-card-text>

          <!-- Card Actions -->
          <v-card-actions class="pa-4 pt-0 justify-space-between align-center">
            <div>
              <span class="text-caption text-grey d-block">Ticket Price</span>
              <div class="text-h6 font-weight-black text-white">₹{{ movie.price }}</div>
            </div>

            <v-btn
              color="indigo-accent-2"
              variant="flat"
              class="rounded-xl font-weight-bold text-none px-6 book-btn"
              :to="`/movie/${movie.id}`"
            >
              Book Tickets
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-else color="#12141c" class="pa-12 text-center rounded-24 border-glass mb-12 empty-card">
      <v-icon size="80" color="indigo-accent-2" class="mb-4 pulse-icon">mdi-filmstrip-off</v-icon>
      <h3 class="text-h5 font-weight-bold text-white mb-2">No Movies Found</h3>
      <p class="text-body-2 text-grey-lighten-1 mb-6 max-w-500 mx-auto">
        No movies available in <strong class="text-white">{{ cityStore.selectedCity }}</strong> matching your current filters or search query.
      </p>
      <v-btn color="indigo-accent-2" size="large" class="rounded-xl font-weight-bold text-none px-8 glow-btn" @click="resetFilters">
        Show All Movies
      </v-btn>
    </v-card>

    <v-divider class="my-12 border-opacity-25" color="indigo-accent-2"></v-divider>

    <!-- 🚀 SECTION 2: ATTRACTIVE UPCOMING MOVIES -->
    <div class="mb-6 d-flex align-center justify-space-between">
      <div>
        <h2 class="text-h4 font-weight-black text-white d-flex align-center ga-2">
          <v-icon color="deep-purple-accent-2" class="flame-pulse" size="32">mdi-fire</v-icon> Upcoming Releases
        </h2>
        <p class="text-caption text-grey mt-1">Get an exclusive preview of blockbuster movies heading to cinemas</p>
      </div>
    </div>

    <v-row v-if="upcomingMovies.length > 0">
      <v-col
        v-for="movie in upcomingMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card color="#12141c" class="rounded-24 upcoming-card h-100 d-flex flex-column hover-card overflow-hidden">
          <div class="position-relative">
            <v-img :src="movie.image" height="300" cover class="rounded-t-24"></v-img>
            <div class="poster-overlay"></div>

            <div class="position-absolute top-0 left-0 ma-3 date-badge-glow">
              <v-icon size="16" class="mr-1" color="white">mdi-calendar-month</v-icon>
              <span>{{ movie.releaseDate }}</span>
            </div>
          </div>

          <v-card-item class="pt-4">
            <div class="text-caption text-deep-purple-accent-1 font-weight-bold mb-1">{{ movie.genre }}</div>
            <h3 class="text-h6 font-weight-black text-white text-truncate">{{ movie.title }}</h3>
          </v-card-item>

          <v-card-text class="text-grey-lighten-1 text-body-2 line-clamp-2 pt-0 flex-grow-1">
            {{ movie.description }}
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-btn
              block
              color="red-accent-3"
              variant="flat"
              prepend-icon="mdi-youtube"
              class="rounded-xl font-weight-bold text-none glow-red-btn py-3"
              @click="openTrailer(movie)"
            >
              Watch Teaser
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 🎬 UPCOMING TRAILER DIALOG -->
    <v-dialog v-model="showTrailer" max-width="850" persistent>
      <v-card color="#12141c" class="rounded-24 border-glass pa-4 position-relative">
        <div class="d-flex justify-space-between align-center mb-3 px-2">
          <h3 class="text-subtitle-1 font-weight-bold text-white">🎬 {{ selectedTrailerMovie?.title }} - Official Teaser</h3>
          <v-btn icon="mdi-close" variant="tonal" size="small" color="grey-lighten-1" @click="closeTrailer"></v-btn>
        </div>

        <div class="video-container rounded-xl overflow-hidden">
          <iframe
            v-if="showTrailer && selectedTrailerMovie"
            :src="selectedTrailerMovie.trailerUrl + '?autoplay=1'"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWishlistStore } from '../stores/wishlist';
import { cityStore } from '../stores/city';

const wishlistStore = useWishlistStore();

const movies = ref([]);
const upcomingMovies = ref([]);
const searchQuery = ref('');
const selectedGenre = ref('All');
const selectedCategory = ref('All Categories');
const sortBy = ref('Popularity');

const showTrailer = ref(false);
const selectedTrailerMovie = ref(null);

const genres = ['All', 'Sci-Fi', 'Action', 'Biography', 'Animation', 'Fantasy', 'Crime'];
const categories = ['All Categories', 'Trending', 'Blockbuster', 'Critically Acclaimed', 'Visual Masterpiece'];
const sortOptions = ['Popularity', 'Rating: High to Low', 'Price: Low to High', 'Price: High to Low'];

onMounted(async () => {
  try {
    const [resMovies, resUpcoming] = await Promise.all([
      fetch('http://localhost:3001/movies'),
      fetch('http://localhost:3001/upcomingMovies')
    ]);
    movies.value = await resMovies.json();
    upcomingMovies.value = await resUpcoming.json();
  } catch (err) {
    console.error('Failed to load home page data:', err);
  }
});

const openTrailer = (movie) => {
  selectedTrailerMovie.value = movie;
  showTrailer.value = true;
};

const closeTrailer = () => {
  showTrailer.value = false;
  selectedTrailerMovie.value = null;
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedGenre.value = 'All';
  selectedCategory.value = 'All Categories';
  sortBy.value = 'Popularity';
  cityStore.setCity('All Cities');
};

const filteredMovies = computed(() => {
  return movies.value
    .filter((movie) => {
      const selected = cityStore.selectedCity;
      let matchesCity = false;

      if (!selected || selected === 'All Cities') {
        matchesCity = true;
      } else if (movie.city) {
        if (Array.isArray(movie.city)) {
          matchesCity = movie.city.some(
            (c) => String(c).trim().toLowerCase() === String(selected).trim().toLowerCase()
          );
        } else {
          matchesCity = String(movie.city).trim().toLowerCase() === String(selected).trim().toLowerCase();
        }
      } else {
        matchesCity = true;
      }

      const matchesSearch =
        !searchQuery.value ||
        movie.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchQuery.value.toLowerCase());

      const matchesGenre =
        selectedGenre.value === 'All' || movie.genre?.includes(selectedGenre.value);

      const matchesCategory =
        selectedCategory.value === 'All Categories' || movie.category === selectedCategory.value;

      return matchesCity && matchesSearch && matchesGenre && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy.value === 'Rating: High to Low') return (b.rating || 0) - (a.rating || 0);
      if (sortBy.value === 'Price: Low to High') return (a.price || 0) - (b.price || 0);
      if (sortBy.value === 'Price: High to Low') return (b.price || 0) - (a.price || 0);
      return 0;
    });
});
</script>

<style scoped>
/* 🌟 Advanced Glassmorphism & Borders */
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: rgba(18, 20, 28, 0.75) !important;
  backdrop-filter: blur(16px);
}

.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.rounded-24 {
  border-radius: 24px !important;
}

/* 🚀 Hero Banner Styling */
.hero-banner {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(18, 20, 28, 0.95) 100%) !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
}

.gradient-text {
  background: linear-gradient(90deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.max-w-600 { max-width: 600px; }
.max-w-500 { max-width: 500px; }

/* 🏷️ Genre Chips Styling */
.genre-chip {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #a1a1aa !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  font-weight: 700;
  border-radius: 12px;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.genre-chip:hover {
  background: rgba(99, 102, 241, 0.2) !important;
  color: #ffffff !important;
  border-color: rgba(99, 102, 241, 0.5) !important;
  transform: translateY(-2px);
}

.active-chip {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

/* 🍿 Poster Overlay & Hover Card */
.movie-card {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4) !important;
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
}

.poster-img {
  transition: transform 0.5s ease;
}

.movie-card:hover .poster-img {
  transform: scale(1.08);
}

.poster-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(18, 20, 28, 0) 50%, rgba(18, 20, 28, 0.95) 100%);
  pointer-events: none;
}

/* ❤️ Wishlist Button Glass */
.wishlist-btn {
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease;
}

.wishlist-btn:hover {
  transform: scale(1.15);
}

/* 🌟 Badges */
.rating-glow-badge {
  background: #000000 !important;
  color: #fbbf24;
  border: 1.5px solid #fbbf24;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 0.85rem;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
  display: flex;
  align-center: center;
  gap: 4px;
}

.category-tag {
  background: rgba(99, 102, 241, 0.85);
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  text-uppercase: uppercase;
  backdrop-filter: blur(4px);
}

.date-badge-glow {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
}

/* 🔘 Buttons Styling */
.book-btn {
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
}

.book-btn:hover {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  transform: translateY(-2px);
}

.glow-red-btn {
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.glow-red-btn:hover {
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
}

.glow-btn {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

/* 🎥 Video Container */
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
}

.video-container iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

/* 📜 Utilities */
.letter-spacing-1 { letter-spacing: 1px; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.flame-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
</style>
