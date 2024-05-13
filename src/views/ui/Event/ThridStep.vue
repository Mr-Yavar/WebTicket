<template>
  <div
      class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
    <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
    <div v-if=" TicketStore.Tickets.length===0"
         class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">
      هیچ بلیتی انتخاب نشده است!
    </div>
    <SelectedTicket v-for="(item,index) in TicketStore.Tickets" :seatInfo="item" :has-delete="false" :index="index+1"
                    key="item"/>
  </div>
  <div
      class="grid md:grid-cols-2 grid-cols-1 mt-4 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
    <div class="col-span-full dark:text-gray-200 text-black font-bold">صورتحساب:</div>
    <div class="col-span-1 rtl:!text-right text-left dark:text-gray-200 text-black text-md font-bold">
      <span>مبلغ قابل پرداخت : </span>
      <span>{{ TicketStore.Tickets.reduce((price, item) => price += price + item.price, 0) }}</span>
    </div>
    <div class="col-span-1 flex rtl:!text-right text-left dark:text-gray-200 text-black text-md font-bold">
      <span class="leading-10 pl-3">کد تخفیف : </span>
      <span >
        <div class="relative ">
        <div class="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 left-3 -translate-y-2/4">
        <v-icon name="md-discount-twotone" aria-hidden="true"></v-icon>
      </div>
        <input type="text" placeholder="کد تخفیف ..." class=" h-10 rounded-[7px] rtl:fa-font !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"/>
        </div>
        
   </span>
    </div>
  </div>
</template>
<script setup>
import useTicketStore from "@/stores/Ticket.js";
import SelectedTicket from "@/views/components/Pages/Event/SelectedTicket.vue";

const TicketStore = useTicketStore();
</script>
<style scoped>


</style>