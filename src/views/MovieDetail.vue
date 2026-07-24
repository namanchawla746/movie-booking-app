<template>
  <v-container class="py-8" v-if="movie">
    <!-- Movie Header Info -->
    <v-row align="center">
      <!-- Movie Poster -->
      <v-col cols="12" md="4">
        <v-img 
          :src="movie.image" 
          height="400" 
          cover 
          class="rounded-24 border-glass shadow-lg"
        ></v-img>
      </v-col>

      <!-- Movie Details -->
      <v-col cols="12" md="8">
        <div class="d-flex align-center ga-3 mb-2">
          <v-chip color="amber-accent-3" class="font-weight-black">⭐ {{ movie.rating || '4.5' }}</v-chip>
          <v-chip color="indigo-accent-3" class="font-weight-bold">{{ movie.genre || 'Action' }}</v-chip>
          <v-chip v-if="movie.category" color="grey-darken-2" variant="tonal" class="text-caption">
            {{ movie.category }}
          </v-chip>
        </div>

        <h1 class="text-h3 font-weight-black text-white mb-3">{{ movie.title }}</h1>
        <p class="text-body-1 text-grey-lighten-1 mb-6">{{ movie.description }}</p>

        <!-- Watch Trailer Button -->
        <div class="d-flex ga-4 mb-6">
          <v-btn
            v-if="movie.trailerUrl"
            color="red-accent-3"
            size="large"
            prepend-icon="mdi-youtube"
            class="rounded-xl font-weight-bold text-none shadow-btn"
            @click="showTrailer = true"
          >
            Watch Trailer
          </v-btn>
        </div>

        <!-- Booking Section (Theatre, Date & Showtime) -->
        <v-card color="#12141c" class="pa-5 rounded-24 border-glass">
          
          <!-- 🏢 THEATRE SELECTION MENU -->
          <h3 class="text-h6 font-weight-bold text-white mb-3 d-flex align-center ga-2">
            <v-icon color="indigo-accent-2">mdi-domain</v-icon> Select Theatre
          </h3>
          <v-select
            v-model="selectedTheatre"
            :items="theatres"
            variant="outlined"
            density="comfortable"
            color="indigo-accent-2"
            class="mb-4 rounded-xl text-white"
            hide-details
          ></v-select>

          <!-- 📅 DATE SELECTION MENU -->
          <h3 class="text-h6 font-weight-bold text-white mb-3 d-flex align-center ga-2">
            <v-icon color="indigo-accent-2">mdi-calendar-range</v-icon> Select Booking Date
          </h3>
          
          <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom start">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="formattedDate"
                readonly
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-xl text-white"
                color="indigo-accent-2"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="selectedDate"
              :min="minDate"
              color="indigo-accent-2"
              @update:model-value="dateMenu = false"
            ></v-date-picker>
          </v-menu>

          <!-- 🕒 SHOWTIME SELECTION -->
          <h3 class="text-h6 font-weight-bold text-white mb-3 mt-4 d-flex align-center ga-2">
            <v-icon color="indigo-accent-2">mdi-clock-outline</v-icon> Select Available Showtime
          </h3>

          <div class="d-flex flex-wrap ga-3">
            <v-btn
              v-for="time in showtimes"
              :key="time"
              :color="selectedShowtime === time ? 'indigo-accent-2' : 'grey-darken-3'"
              :variant="selectedShowtime === time ? 'flat' : 'outlined'"
              class="font-weight-bold rounded-xl px-5"
              @click="selectedShowtime = time"
            >
              {{ time }}
            </v-btn>
          </div>

          <!-- Proceed Button with Theatre, Date & Showtime query params -->
          <v-btn
            color="indigo-accent-2"
            size="x-large"
            block
            class="mt-6 rounded-xl font-weight-bold text-none shadow-btn-blue"
            @click="goToSeatSelection"
          >
            Proceed to Seat Selection
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- YouTube Trailer Dialog -->
    <v-dialog v-model="showTrailer" max-width="850" persistent>
      <v-card color="#12141c" class="rounded-24 border-glass pa-4 position-relative">
        <div class="d-flex justify-space-between align-center mb-3 px-2">
          <h3 class="text-subtitle-1 font-weight-bold text-white">🎬 {{ movie.title }} - Official Trailer</h3>
          <v-btn icon="mdi-close" variant="text" color="grey" @click="showTrailer = false"></v-btn>
        </div>

        <div class="video-container rounded-xl overflow-hidden">
          <iframe
            v-if="showTrailer"
            :src="movie.trailerUrl + '?autoplay=1'"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Loading / Not Found Fallback -->
  <v-container v-else class="py-16 text-center">
    <v-progress-circular indeterminate color="indigo-accent-2" size="64" class="mb-4"></v-progress-circular>
    <h2 class="text-h6 text-grey-lighten-1">Loading movie details...</h2>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const movie = ref(null);

// Theatre Selection State
const selectedTheatre = ref('PVR Inox, Select Citywalk');
const theatres = [
  'PVR Inox, Select Citywalk',
  'Cinepolis, DLF Avenue',
  'PVR Superplex, Mall of India',
  'INOX, Nehru Place',
  'Carnival Cinemas, Pacific Mall'
];

// Date Picker State
const dateMenu = ref(false);
const selectedDate = ref(new Date());

// Minimum Date (Today)
const today = new Date();
const minDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

// Format Selected Date to YYYY-MM-DD cleanly
const formattedDate = computed(() => {
  if (!selectedDate.value) return minDate;
  const d = new Date(selectedDate.value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

// Showtimes
const showtimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'];
const selectedShowtime = ref('10:00 AM');

// Trailer Dialog
const showTrailer = ref(false);

// Fallback Movie Data agar static fetch fail ho
const defaultMovie = {
  id: Number(route.params.id) || 1,
  title: 'Inception',
  description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  rating: '8.8',
  genre: 'Sci-Fi / Action',
  category: 'Blockbuster',
  image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
  trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0'
};

onMounted(async () => {
  try {
    // Single static db.json fetch
    const res = await fetch('/db.json');
    if (res.ok) {
      const data = await res.json();
      const foundMovie = data.movies?.find(m => String(m.id) === String(route.params.id));
      movie.value = foundMovie || defaultMovie;
    } else {
      movie.value = defaultMovie;
    }
  } catch (err) {
    console.error('Failed to load movie details, using default:', err);
    movie.value = defaultMovie;
  }
});

const goToSeatSelection = () => {
  if (!movie.value) return;
  router.push({
    path: `/book/${movie.value.id}/${formattedDate.value}/${encodeURIComponent(selectedShowtime.value)}`,
    query: {
      movieTitle: movie.value.title,
      theatreName: selectedTheatre.value,
      date: formattedDate.value,
      showtime: selectedShowtime.value
    }
  });
};
</script>

<style scoped>
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.rounded-24 {
  border-radius: 24px !important;
}

.shadow-btn {
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.shadow-btn-blue {
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>