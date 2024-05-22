<script setup>

import EventPartial from "@/views/ui/Home/EventPartial.vue";
import CardItem from "@/views/components/Pages/Home/CardItem.vue";
import {useQuery} from "@tanstack/vue-query";
import {GetAllConcertService} from "@/services/ConcertsService.js";
import {computed} from "vue";

const GetAllConcertsServiceCall = useQuery({
  queryKey: ["api/Concerts/GetAllConcerts",new Date()],
  queryFn: GetAllConcertService,

  enabled:true
});

 const Concerts = computed(()=>GetAllConcertsServiceCall.data.value?.concerts);



</script>

<template>
  <EventPartial>
    <template #Events>

      <div class="mt-4 grid xl:grid-cols-4 xl:gap-y-4  lg:grid-cols-3   md:grid-cols-2 grid-cols-1 gap-y-2 " dir="rtl" v-if="GetAllConcertsServiceCall.data">
        <CardItem v-for="item in Concerts" :concert="item" :key="4"/>
      </div>
    </template>
  </EventPartial>


</template>

<style scoped>

</style>