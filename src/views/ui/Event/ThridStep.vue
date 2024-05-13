

<template>
  <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
    <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
    <div v-if=" TicketStore.Tickets.length===0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">
      هیچ بلیتی انتخاب نشده است!
    </div>
    <SelectedTicket v-for="item in TicketStore.Tickets" :seatInfo="item" :handleDelete="handleClickOnDeleteSeat" key="item"/>
  </div>
</template>
<script setup>
import useTicketStore from "@/stores/Ticket.js";
import SelectedTicket from "@/views/components/Pages/Event/SelectedTicket.vue";

const TicketStore = useTicketStore();
</script>
<style scoped>


</style>