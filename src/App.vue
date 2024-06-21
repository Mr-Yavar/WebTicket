<template>



  <component :is="layout">
  <router-view/>
  </component>

</template>

<script setup>

import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";
import useSeatMapStore from "@/stores/seatMap.js";
import {TicketsRepository} from "@/db/ticketsRepository.js";
import useTicketStore from "@/stores/Ticket.js";

const route = useRoute();
/**
 *  This is a computed property that will return the name
 *  of the current route
 */
const layout = computed(() => {
  const layout = route?.meta?.layout;

  if (layout) {
    return `${layout}Layout`;
  }
  return 'div';
});

const seatmap = useSeatMapStore();
const TicketStore = useTicketStore();
onMounted(()=>{
  new TicketsRepository();

})
</script>

<style>

</style>