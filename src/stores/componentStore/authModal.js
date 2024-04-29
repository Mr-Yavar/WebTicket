import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthModalStore = defineStore('authModal', () => {
  const show = ref(false)

  function toggleMenu() {
    this.show =!this.show;
  }

  return { show,toggleMenu }
})
