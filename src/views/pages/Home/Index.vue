<template>
  <EventPartial>
    <template #Events>

      <div class="grid grid-cols-1 mt-4 xl:grid-cols-4 xl:gap-y-4 lg:grid-cols-3 md:grid-cols-2 gap-y-2 " dir="rtl" v-if="GetAllConcertsServiceCall.data">
        <CardItem v-for="item in Concerts" :concert="item" :key="item.concertId"/>
      </div>
    </template>
  </EventPartial>


</template>

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


<style scoped>

</style>