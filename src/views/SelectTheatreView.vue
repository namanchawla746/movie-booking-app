<template>
  <v-container class="py-6 min-vh-100">
    <!-- Header / Selected Movie Banner -->
    <v-card color="#12141c" class="pa-6 mb-8 rounded-24 border-glass elevation-10">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <v-chip color="indigo-accent-2" size="small" class="font-weight-bold mb-2">Step 1: Select Theatre & Time</v-chip>
          <h1 class="text-h4 font-weight-black text-white">{{ movie.title || 'Select Cinema' }}</h1>
          <p class="text-caption text-grey-lighten-1 mb-0">Choose your preferred cinema hall, date, and showtime</p>
        </div>

        <v-btn color="grey-darken-3" variant="tonal" prepend-icon="mdi-arrow-left" class="rounded-xl font-weight-bold text-none" to="/">
          Back
        </v-btn>
      </div>
    </v-card>

    <!-- Date Picker Bar -->
    <div class="mb-8">
      <h3 class="text-subtitle-1 font-weight-bold text-white mb-3">Select Date</h3>
      <div class="d-flex ga-3 overflow-x-auto pb-2">
        <v-card
          v-for="(date, idx) in dates"
          :key="idx"
          :color="selectedDate === date.fullDate ? 'indigo-accent-3' : '#12141c'"
          class="pa-3 text-center cursor-pointer border-glass rounded-xl min-w-100"
          flat
          @click="selectedDate = date.fullDate"
        >
          <div class="text-caption text-grey-lighten-1">{{ date.day }}</div>
          <div class="text-h6 font-weight-black text-white">{{ date.date }}</div>
          <div class="text-caption text-grey-lighten-1">{{ date.month }}</div>
        </v-card>
      </div>
    </div>

    <!-- Filter by Cinema Chain -->
    <div class="d-flex align-center ga-2 mb-6">
      <span class="text-body-2 text-grey mr-2">Chain:</span>
      <v-chip
        v-for="chain in ['All', 'Cinepolis', 'PVR', 'INOX']"
        :key="chain"
        :color="selectedChain === chain ? 'indigo-accent-3' : 'grey-darken-3'"
        :variant="selectedChain === chain ? 'flat' : 'tonal'"
        class="font-weight-bold cursor-pointer"
        @click="selectedChain = chain"
      >
        {{ chain }}
      </v-chip>
    </div>

    <!-- Theatres List -->
    <v-row>
      <v-col v-for="theatre in filteredTheatres" :key="theatre.id" cols="12">
        <v-card color="#12141c" class="pa-6 rounded-24 border-glass elevation-6">
          <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-4 mb-4">
            <div>
              <div class="d-flex align-center ga-2 mb-1">
                <v-icon color="red-accent-2">mdi-map-marker</v-icon>
                <h2 class="text-h6 font-weight-black text-white mb-0">{{ theatre.name }}</h2>
              </div>
              <div class="text-caption text-grey ml-7">{{ theatre.location }}</div>
            </div>

            <!-- Facilities Tags -->
            <div class="d-flex flex-wrap ga-2 ml-7 ml-md-0">
              <v-chip
                v-for="fac in theatre.facilities"
                :key="fac"
                size="x-small"
                color="indigo-lighten-3"
                variant="outlined"
                class="font-weight-bold"
              >
                {{ fac }}
              </v-chip>
            </div>
          </div>

          <v-divider class="my-4 border-grey-darken-4"></v-divider>

          <!-- Showtimes Buttons -->
          <div>
            <span class="text-caption text-grey d-block mb-3">Available Showtimes:</span>
            <div class="d-flex flex-wrap ga-3">
              <v-btn
                v-for="time in theatre.shows"
                :key="time"
                variant="outlined"
                color="indigo-accent-2"
                class="rounded-lg font-weight-bold showtime-btn text-none"
                @click="selectShow(theatre, time)"
              >
                {{ time }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const movie = ref({});
const selectedChain = ref('All');
const selectedDate = ref('Today');

// Default fallback theatres list (In case API isn't populated)
const defaultTheatres = [
  {
    id: 1,
    name: 'PVR Inox Grand Cinema',
    chain: 'PVR',
    location: 'Central Mall, 3rd Floor',
    facilities: ['4DX', 'Dolby Atmos', 'Recliner'],
    shows: ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM']
  },
  {
    id: 2,
    name: 'Cinepolis Megaplex',
    chain: 'Cinepolis',
    location: 'City Center Mall, Sector 18',
    facilities: ['VIP Lounge', 'IMAX 3D', 'Dolby 7.1'],
    shows: ['11:00 AM', '02:30 PM', '06:00 PM', '09:15 PM']
  },
  {
    id: 3,
    name: 'INOX Multiplex',
    chain: 'INOX',
    location: 'Galaxy Galleria, 2nd Floor',
    facilities: ['Dolby Atmos', 'Laser Projection'],
    shows: ['09:45 AM', '01:15 PM', '04:45 PM', '08:00 PM']
  }
];

const theatres = ref(defaultTheatres);

// Dates list generation for selection
const dates = [
  { day: 'TODAY', date: '24', month: 'JUL', fullDate: 'Today' },
  { day: 'FRI', date: '25', month: 'JUL', fullDate: '25 Jul' },
  { day: 'SAT', date: '26', month: 'JUL', fullDate: '26 Jul' },
  { day: 'SUN', date: '27', month: 'JUL', fullDate: '27 Jul' },
];

onMounted(async () => {
  const movieId = route.params.id || route.query.movieId;
  try {
    // Fetch Movie details
    if (movieId) {
      const resMovie = await fetch(`http://localhost:3001/movies/${movieId}`);
      if (resMovie.ok) {
        movie.value = await resMovie.json();
      }
    }
    // Fetch Theatres list
    const resTheatres = await fetch('http://localhost:3001/theatres');
    if (resTheatres.ok) {
      const apiTheatres = await resTheatres.json();
      if (apiTheatres && apiTheatres.length > 0) {
        theatres.value = apiTheatres;
      }
    }
  } catch (err) {
    console.warn('Using default theatres data due to fetch error:', err);
  }
});

const filteredTheatres = computed(() => {
  if (selectedChain.value === 'All') return theatres.value;
  return theatres.value.filter(
    (t) => t.chain && t.chain.toLowerCase() === selectedChain.value.toLowerCase()
  );
});

const selectShow = (theatre, showtime) => {
  // Pass selected details to next step (Seat selection view)
  router.push({
    path: '/seats', // Aapke seat selection route ka path (ya name: 'seats')
    query: {
      movieId: movie.value.id || route.params.id || '1',
      movieTitle: movie.value.title || 'Movie',
      theatreId: theatre.id,
      theatreName: theatre.name,
      showtime: showtime,
      date: selectedDate.value
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

.min-w-100 {
  min-width: 90px;
}

.showtime-btn {
  transition: all 0.2s ease;
}

.showtime-btn:hover {
  background-color: #6366f1 !important;
  color: #ffffff !important;
  transform: translateY(-2px);
}
</style>