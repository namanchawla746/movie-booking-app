import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  // Saved movies ki list
  const wishlist = ref([])

  // Movie add ya remove karne ka function
  const toggleWishlist = (movie) => {
    const index = wishlist.value.findIndex(item => item.id === movie.id)
    if (index > -1) {
      wishlist.value.splice(index, 1) 
    } else {
      wishlist.value.push(movie) 
    }
  }

  
  const isInWishlist = (movieId) => {
    return wishlist.value.some(item => item.id === movieId)
  }

  // Total count
  const wishlistCount = computed(() => wishlist.value.length)

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount
  }
})