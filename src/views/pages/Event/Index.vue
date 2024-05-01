<template>
  <div class="relative top-1/2 text-center hidden">
    <v-icon name="pr-spinner" animation="spin" scale="1.5" speed="1.5"/>
  </div>
  <div class="relative overflow-hidden rounded-lg mb-3">
    <div class="w-full event-cover  bg-transparent ">
      <img class="h-fit w-full rounded-lg" src="https://static.honarticket.com/resource/files/cache/fa41b9fa14be3bc8.951409.jpeg" border="0">
      <h1 class="bg-none bg-transparent rounded-md text-white font-bold absolute bottom-2 right-2 z-10">کنسرت ماکان
        بند</h1>
    </div>
  </div>
  <div class="w-full rounded-lg ">
    <div class="grid md:grid-cols-2  grid-cols-1 space-y-3">
      <div class="col-span-1">
        <div class="flex">
          <div>
              <span class="p-1 text-center align-text-bottom">
                <v-icon name="px-calendar-tomorrow" scale="1"/>
              </span>
            <span class="leading-6 font-bold pl-1">زمان :</span>
          </div>
          <div> سه شنبه 15 مرداد</div>
        </div>
      </div>
      <div class="col-span-1">
        <div class="flex">
          <div>
              <span class="p-1 text-center align-text-bottom">
                <v-icon name="px-clock" scale="1"/>
              </span>
            <span class="leading-6 font-bold pl-1">ساعت :</span>
          </div>
          <div> ساعت 18:30 و 21:30</div>
        </div>
      </div>

      <div class="col-span-1">
        <div class="flex">
          <div>
              <span class="p-1 text-center align-text-bottom ">
                <v-icon name="px-gps" scale="1"/>
              </span>
            <span class="leading-6 font-bold pl-1">محل برگزاری :</span>
          </div>
          <div class="flex">
            <span>تهران ، برج میلاد</span>
            <div class="inline-step h-6 inline-block"></div>
            <span>تهران ، .................</span>
          </div>
        </div>
      </div>

      <div class="col-span-1 md:col-span-2 ">

        <div class="h-[250px] ">
          <MapComponent
              class="rounded-lg"
              :map-setter="(map)=>{
              handleStartMap(map);

            }"
              :options="{
            mapKey:'web.5b632ac9f6354a3f8bcba1b4c043a009',
            mapType:MapTypes.neshanRaster,
            isTouchPlatform : true,
            mapTypeControllerOptions:{show:false , position:'top-right'},
            poi : true
              }"
          />
        </div>

      </div>

      <div class="col-span-1 md:col-span-2 ">
        <div class="inline-flex items-center">
          <label class="relative flex items-center p-3 rounded-full cursor-pointer" for="link">
            <input type="checkbox" class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10" id="link"/>
            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <v-icon class="relative top-0.5" name="hi-solid-check-circle"/>
            </span>
          </label>
          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" for="link">
            <p class="flex font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
              با
              <a @click.prevent="toggleTermsModal()" href="#" class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-500 transition-colors hover:text-blue-700">
                &nbsp;شرایط و قوانین کنسرت &nbsp;
              </a>
              موافقم.
            </p>
          </label>
        </div>
        <ConcertTermsModal :show="showTermsModal" :on-close-fn="toggleTermsModal"/>
      </div>

      <div class="col-span-1 md:col-span-2 ">
        <div class="relative inline-flex">
          <div class="cardWrap">
            <div class="card cardLeft relative">
              <div class="absolute top-3 text-center text-white block w-[85%]"><span class="font-extrabold text-lg">کنسرت ماکان بند</span>
              </div>
              <div class="h-full flex flex-col justify-end items-center">
                <span class="text-center block leading-6"><span class="font-bold">ساعت :</span> 18:30 تا 20:30</span>
                <span class="text-center block leading-10 mt-5">
                  <button class="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">خرید بلیت</button>
              </span>
              </div>
            </div>
            <div class="card  cardRight relative ">
              <div class="absolute top-3 text-center text-white block right-8"> جمعه</div>
              <div class="h-full flex  flex-col justify-end">
                <span class="text-center block leading-6"> 26</span>
                <span class="text-center block leading-10"> اردیبهشت</span>
                <span class="text-center block leading-10"> 1403</span>
              </div>
            </div>

          </div>
          <span class="absolute w-[12px] h-[12px] rounded-full py-1 px-1 text-xl font-medium content-[''] leading-2 grid place-items-center top-[-2%] left-[-1%]  bg-green-400 text-white ">
   </span>
          <span class="absolute w-[12px] h-[12px] rounded-full py-1 px-1 text-xl font-medium content-[''] leading-2 grid place-items-center top-[-2%] left-[-1%]  bg-green-300 text-white animate-ping ">
    </span>
        </div>

      </div>

    </div>
  </div>


</template>

<script setup>

import {MapComponent, MapTypes} from "@neshan-maps-platform/mapbox-gl-vue";
import "@neshan-maps-platform/mapbox-gl-vue/dist/style.css";
import {ref} from "vue";
import mapboxgl from "mapbox-gl";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import ConcertTermsModal from "@/views/components/Globals/modal/ConcertTermsModal.vue";


const showTermsModal = ref(false);

function toggleTermsModal() {
  showTermsModal.value = !showTermsModal.value;
}

function handleStartMap(map) {

  map.fitBounds(map.getBounds(), {
    padding: {top: 50, bottom: 50, left: 50, right: 50},
    center: [54.34967466221554, 31.90364059190512],
    maxZoom: 20,
    zoom: 15,
    minZoom: 7,
    animate: true,
    around: [54.34967466221554, 31.90364059190512],

  });


  const marker = new nmp_mapboxgl.Marker({
    color: "black",
    title: "فلان جا",
    draggable: false,
  }).setLngLat([54.34967466221554, 31.90364059190512]);


  marker.addTo(map);


}

</script>

<style scoped>
.card {
  @apply h-[11em] float-left relative p-[1em];
  background: linear-gradient(to bottom, black 0%, black 26%, whitesmoke 26%, whitesmoke 100%);
}

.cardLeft {
  @apply w-[16em] rounded-tl-lg rounded-bl-lg  ;

}

.cardRight {
  @apply w-[6.5em] rounded-tr-lg rounded-br-lg border-l-[0.18em] border-l-white border-dashed before:top-[-0.4em] after:bottom-[-0.4em] ;

}

.cardRight:before,
.cardRight:after {
  @apply content-[""] absolute block w-[0.9em] h-[0.9em] left-[-0.5em] rounded-[50%];
  background: #fff;
}


</style>

