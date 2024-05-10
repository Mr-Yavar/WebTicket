<template>
  <div>
    <div class="text-md text-black dark:text-gray-100 md:!text-right text-center ">کنســــرت
      <span class="font-extrabold text-xl">ماکان بند</span></div>
    <div class="grid grid-cols-1 md:grid-cols-2  md:!text-right text-center gap-2">
      <div class="text-black dark:text-gray-100 mt-2 px-3">
        <p>
          <v-icon name="px-calendar-tomorrow" scale="1" class="dark:text-white text-black"/>
          <span class="font-bold text-md"> تاریخ :  </span> <span>1402/02/03</span></p>
        <p>
          <v-icon name="px-clock" scale="1" class="dark:text-white text-black"/>
          <span class="font-bold text-md">ساعت : </span> <span>18:30 - 20:30</span></p>
      </div>
      <div class="text-black dark:text-gray-100 mt-2 px-3">
        <v-icon name="px-gps" scale="1" class="dark:text-white text-black"/>
        <span class="font-bold text-md"> مکان برگزاری : </span>
        <span>تهران ، .......</span>
      </div>

      <div class="col-span-full">
        <div class="p-2 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
          <!-- justify tabs -->
          <TabGroup as="div" class="mb-5">
            <TabList class="flex flex-wrap justify-between mt-3 w-1/2 mx-auto border-b border-gray-900 dark:border-[#191e3a] text-center bg-gray-400 rounded-t-md text-white dark:text-gray-300">
              <Tab as="template" v-slot="{ selected }">
                <a
                    href="javascript:;"
                    class="flex-auto p-3.5 py-2 -mb-[1px] block border border-transparent hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black !outline-none transition duration-300 "
                    :class="{ '!border-white-light !border-b-white dark:!border-[#191e3a] dark:!border-b-black bg-gray-100 dark:text-white text-black': selected }"
                >Home</a
                >
              </Tab>
              <Tab as="template" v-slot="{ selected }">
                <a
                    href="javascript:;"
                    class="flex-auto p-3.5 py-2 -mb-[1px] block border border-transparent hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black !outline-none transition duration-300"
                    :class="{ '!border-white-light !border-b-white dark:!border-[#191e3a] dark:!border-b-black bg-gray-100 dark:text-white text-black' : selected }"
                >Profile</a
                >
              </Tab>
              <Tab as="template" v-slot="{ selected }">
                <a
                    href="javascript:;"
                    class="flex-auto p-3.5 py-2 -mb-[1px] block border border-transparent hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black !outline-none transition duration-300"
                    :class="{ '!border-white-light !border-b-white dark:!border-[#191e3a] dark:!border-b-black bg-gray-100 dark:text-white text-black': selected }"
                >Contact</a
                >
              </Tab>
            </TabList>
            <TabPanels class="pt-5 flex-1 text-sm">
              <TabPanel>
                <div @click.prevent="handleClickOnSeat">
                  <VueZoomable
                      class="w-full mx-auto overflow-hidden"
                      selector="#zoomable"
                      :minZoom="1"
                      :maxZoom="3"
                      :zoom="1"
                      :enableControllButton="true"
                  >
                    <div v-html="SVG" class="w-fit mx-auto " id="zoomable"  ></div>
                  </VueZoomable>
                </div>
              </TabPanel>


            </TabPanels>
          </TabGroup>

        </div>
      </div>

    </div>

    <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
      <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
      <div v-if=" TicketStore.Tickets.length===0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold" >هیچ بلیتی انتخاب نشده است!</div>
      <SelectedTicket v-for="item in TicketStore.Tickets" :seatInfo="item" :handleDelete="handleClickOnDeleteSeat" key="item"/>
    </div>
  </div>
</template>

<script setup>
import "vue-zoomable/dist/style.css";
import VueZoomable from "vue-zoomable"
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {onMounted, reactive, ref, vModelSelect, watch} from "vue";
import SelectedTicket from "@/views/components/Pages/Event/SelectedTicket.vue";
import useTicketStore from "@/stores/Ticket.js";


const props = defineProps({
  stepControls: Object
})

const SVG = ref("");


const TicketStore = useTicketStore();

function handleClickOnSeat($event) {

  if ($event.target.tagName === 'ellipse' || $event.target.tagName === 'circle') {
    if ($event.target.style.fill !== 'red')
      TicketStore.addToTicket($event.target.id)
    else
      TicketStore.removeTicket($event.target.id)

    $event.target.style.fill = $event.target.style.fill === 'red' ? 'black' : 'red';
  }

}

function handleClickOnDeleteSeat(seatId) {

  TicketStore.removeTicket(seatId)
  document.querySelector("#" + seatId).style.fill = 'black';


}


onMounted(() => {

  let t = fetch("http://localhost:5173/public/drawing.svg").then((res) => res.text()).then((res) => {

    let dom =new DOMParser();
    let tempDoc = dom.parseFromString(res,'text/html');
    TicketStore.Tickets.forEach(item => {
      tempDoc.querySelector(`#${item}`).style.fill = "red";
    });
    SVG.value = tempDoc.querySelector("svg").outerHTML;
  });

});

</script>

<style scoped>

</style>