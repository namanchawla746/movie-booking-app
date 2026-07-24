import { reactive } from 'vue';

export const cityStore = reactive({
  // Default 'All Cities' rakha hai taaki shuru me saare theatres/movies dikhein
  selectedCity: localStorage.getItem('selectedCity') || 'All Cities',
  
  setCity(city) {
    this.selectedCity = city;
    localStorage.setItem('selectedCity', city);
  }
});