<template>
  <div class="w-full px-8 py-4">

    <div class="relative flex items-center justify-between w-full">
        <div class="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300"></div>
        <div class="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-900 transition-all duration-500"></div>
      <div class="relative z-10 grid w-10 h-10 font-bold text-white transition-all duration-300 bg-gray-900 rounded-full place-items-center">
        1
      </div>
      <div class="relative z-10 grid w-10 h-10 font-bold text-gray-900 transition-all duration-300 bg-gray-300 rounded-full place-items-center">
        2
      </div>
      <div class="relative z-10 grid w-10 h-10 font-bold text-gray-900 transition-all duration-300 bg-gray-300 rounded-full place-items-center">
        3
      </div>
      <div class="relative z-10 grid w-10 h-10 font-bold text-gray-900 transition-all duration-300 bg-gray-300 rounded-full place-items-center">
        4
      </div>
    </div>
    <div>
      <Splitter title="گام اول : انتخاب سانس" type="middle" border-class="border-gray-500 border-dashed" titleClass="font-bold text-md text-gray-900" class="my-3"/>
    </div>

    <transition>
      <FirstStep v-if="step===1" :stepControls="{nextFn:toNext,previousFn:toPrevious}"/>
      <SecondStep v-else-if="step===2"/>
      <ThridStep v-else-if="step===3"/>
      <FourthStep v-else-if="step===4"/>
    </transition>


    <div class="flex justify-between mt-16" v-if="step!==1">
      <button
          class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button" disabled>
        Prev
      </button>
      <button
          class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
        Next
      </button>
    </div>
  </div>





</template>

<script setup>
import {ref} from "vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import FirstStep from "@/views/ui/Event/FirstStep.vue";
import SecondStep from "@/views/ui/Event/SecondStep.vue";
import ThridStep from "@/views/ui/Event/ThridStep.vue";
import FourthStep from "@/views/ui/Event/FourthStep.vue";
import useTicketStore from "@/stores/Ticket.js";

const step = ref(1);

function toNext(){
  step.value++;
}

function toPrevious(){
  step.value--;
}

const TicketStore = useTicketStore();

</script>

<style scoped>


</style>

