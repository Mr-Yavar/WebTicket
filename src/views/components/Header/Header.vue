<script>

</script>

<template>
  <header class="AppGap rtl:fa-font">
    <nav class="AppContainer text-white bg-white border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">

    <div class="flex items-center justify-between text-blue-gray-900">
        <a href="#" class="block antialiased  leading-relaxed text-inherit mr-4 cursor-pointer py-1.5 font-bold text-2xl"><v-icon name="io-ticket-sharp" scale="1.5" animation="wrench" speed="slow" fill="red"/> تـیـکــتــیوم</a>
        <div class="flex items-center gap-4">
          <div class="mr-4 hidden lg:block">
            <ul class="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal">
                <router-link :to="{name:'home'}" class="flex items-center">صفحه اصلی</router-link>
              </li>
              <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal">
                <a href="#" class="flex items-center">حساب کاربری</a>
              </li>
              <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal">
                <a href="#" class="flex items-center">درباره ما</a>
              </li>
              <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal border-2 border-dashed border-dark-400 rounded-md">
                <a href="#" class="flex items-center">بررسی بلیت</a>
              </li>
            </ul>
          </div>
          <div class="flex items-center gap-x-1">

            <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] hidden lg:inline-block" type="button" @click.prevent="authModal.toggleMenu()">
              <span>ثبت نام /  ورود</span>
            </button>
          </div>
          <button class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none max-w-[40px] max-h-[40px] rounded-lg text-xs ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden" type="button">
        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" @click.prevent="toggleMenu()">
          <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-if="showMenu" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </span>
          </button>
        </div>
      </div>
      <transition name="fade">
      <div v-if="showMenu" class="block w-full basis-full overflow-hidden lg:hidden" style="">
        <ul class="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal">
            <a href="#" class="flex items-center">صفحه اصلی</a>
          </li>
          <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal">
            <a href="#" class="flex items-center">حساب کاربری</a>
          </li>
          <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal">
            <a href="#" class="flex items-center">درباره ما</a>
          </li>
          <li class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 p-1 font-normal ">
            <a href="#" class="flex items-center">بررسی بلیت</a>
          </li>
        </ul>
        <div class="flex items-center gap-x-1">
          <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 block w-full" type="button">
            <span>Log In</span>
          </button>
          <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] block w-full" type="button">
            <span>Sign in</span>
          </button>
        </div>
      </div>
      </transition>
    </nav>
  </header>
</template>
<script setup>


      import {ref} from "vue";
      import {useAuthModalStore} from "@/stores/componentStore/authModal.js"

      const authModal = useAuthModalStore();

      const showMenu = ref(false);


    function toggleMenu(){
      this.showMenu =!this.showMenu;
    }


</script>
<style>
.fade-enter-from{
  height:0;
}

.fade-enter-active,
.fade-leave-active {
  transition: height 0.5s ease;
}

.fade-leave-from{
  height:196px;
}

.fade-enter-to{
  height: 196px;
}

.fade-enter-from,
.fade-leave-to {

  height: 0;
}
</style>