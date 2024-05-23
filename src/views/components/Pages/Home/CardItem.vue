
<template>
  <div id="card"  dir="rtl"
       :style="{background : `url('${cardImg}')`,backgroundSize:'cover'}"
      class="hover:animate-pulse relative mx-auto h-[22rem] w-full max-w-[15rem] flex flex-row items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
    <div
        class="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent  bg-cover bg-clip-border bg-center text-gray-700 shadow-none" >
      <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
    </div>
    <div class="relative w-full p-2">
      <h1 class="block font-sans text-center text-white rtl:fa-font text-2xl mb-1">
        {{concert.title }}
      </h1>
      <h2 class="block text-center text-white rtl:fa-font text-sm">
        (ویژه بانوان)
      </h2>
      <h2 class="block text-right text-white rtl:fa-font text-sm">
        <v-icon name="oi-location" />
        <span class="pr-1">{{ concert.place?.name }}</span>
      </h2>
      <h2 class="block text-right text-white rtl:fa-font tex-sm mb-2">
        <v-icon name="ri-calendar-event-fill" />
        <span class="pr-1">{{startDate}}</span>
      </h2>
      <button
          class="rtl:fa-font  align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-300 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full"
          type="button"
          @click.prevent="RedirectToGettingTicket"
      >
        خرید بلیت
      </button>
   </div>
  </div>
</template>
<script >


import {Guid} from "@/config/helper.js";
import {FILE_PROVIDER} from "@/config/appConfig.js";

export default {
  name:"cardItem",
  props:[
    'concert'
  ],
  data(){

  },
  methods:{
    FILE_PROVIDER() {
      return FILE_PROVIDER
    },
    RedirectToGettingTicket(){

      this.$router.push({
        name : "event",
        params:{
          id : Guid( {}).fromFullToCompressed(this.concert.concertid)
        }
      });
    }
  },
  computed:{
    startDate(){return !this.concert.startDate  ? "" : new Date(this.concert?.startDate).toLocaleString('fa-ir',{ day:"2-digit",month:"long",weekday:"long"});}
    ,cardImg(){return FILE_PROVIDER + this.concert?.img_Url}

  }

}
</script>


<style scoped>


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