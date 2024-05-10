import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

 const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(false);


  return {isAuthenticated }
})
export default useUserStore;