<script >

export default {
  name:"cardItem",

}
</script>

<template>
  <div id="card" dir="rtl" style=""
      class="relative  h-[22rem] w-full max-w-[15rem] flex flex-row items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
    <div
        class="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url('https://images.unsplash.com/photo-1552960562-daf630e9278b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
      <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
    </div>
    <div class="relative w-full p-2">
      <h2 class="block font-sans text-center text-white rtl:fa-font text-xl">
        کنسرت گروه نوشه
      </h2>
      <h1 class="block text-right text-white rtl:fa-font text-sm">
        <v-icon name="oi-location" />
        <span class="pr-1">تهران ، برج میلاد</span>
      </h1>
      <h1 class="block text-right text-white rtl:fa-font text-sm mb-2">
        <v-icon name="ri-calendar-event-fill" />
        <span class="pr-1">شنبه 07 خرداد</span>
      </h1>
      <button
          class="rtl:fa-font  align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-300 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full"
          type="button">
        خرید بلیت
      </button>
   </div>
  </div>
</template>

<style scoped>
#card{
  background:  url('https://static.honarticket.com/resource/files/cache/23e896429ee15c8b.2d42c6.jpeg');
  background-size:cover ;
}

#card::before,#card::after{
  content: '';
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  bottom: 10.25rem;
  z-index: 1;
}
#card::after{
  left: -10px;
}

#card::before{
  right:-10px;
}
</style>