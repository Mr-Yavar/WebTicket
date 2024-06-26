<script setup>

import {ClAddPlus} from "@kalimahapps/vue-icons/cl";
import PlaceCard from "@/views/components/Layouts/AdminLayout/Cards/PlaceCard.vue";
import {PrSpinner} from "@kalimahapps/vue-icons/pr";
import {useRouter} from "vue-router";

const router = useRouter();
import {useQuery} from "@tanstack/vue-query";


import {GetAllPlacesService} from "@/services/PlacesService.js";
import Splitter from "@/views/components/Splitter/Splitter.vue";

const GetAllPlaceServiceCall = useQuery({
  queryKey: ["api/place/GetAllPlaces"],
  queryFn: GetAllPlacesService,

  enabled: true
});

</script>

<template>
  <Splitter title="همه مکانهای برگزاری" border-class=" border-black " type="middle" title-class="text-black"/>
  <div class="grid grid-cols-6 gap-1 my-3">
    <div>
      <button  @click="router.push({name:'createPlace'})" class="inline-flex items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <span><ClAddPlus class="inline text-lg"/></span><span> ایجاد</span>
      </button>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
    <template v-if="!GetAllPlaceServiceCall.isLoading.value && !!GetAllPlaceServiceCall.data.value">
      <PlaceCard v-for="item in GetAllPlaceServiceCall.data.value" :place="item" :key="item.id"/>

      <div class="self-center">
        <div class="w-fit mx-auto  h-32 ">
          <button @click="router.push({name:'createPlace'})" type="button" class="relative top-[53%] block items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <PrSpinner class="animate-spin block w-full mx-auto scale-125 mt-8 " />
    </template>
  </div>
</template>

<style scoped>

</style>