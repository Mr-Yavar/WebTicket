import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthModalStore = defineStore('authModal', () => {
  const show = ref(false)
  const title = ref("سلام، کدومش؟");
  function toggleMenu() {
    this.show =!this.show;
     if(this.show)
       document.body.classList.add("overflow-hidden");
     else {
         this.title ="سلام، کدومش؟";
       document.body.classList.remove("overflow-hidden");
     }
  }

  function setTitle(newTitle){
    this.title = newTitle;
  }

  return { show,toggleMenu,title,setTitle }
})
