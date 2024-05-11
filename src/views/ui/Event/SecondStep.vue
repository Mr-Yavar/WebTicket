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
                      selector="#seatMap"
                      :minZoom="1"
                      :maxZoom="3"
                      :zoom="1"
                      :touchEnabled="false"
                      :enableControllButton="true"
                      :buttonPanStep="2"
                  >
                    <div v-html="SVG" class="w-fit mx-auto " id="seatMap"  ref="seatMap"></div>
                  </VueZoomable>
                </div>
              </TabPanel>


            </TabPanels>

            <div class="flex w-full justify-center text-gray-900 dark:text-gray-100">
              <div class="rtl:ml-4 mr-4 ">راهنما:</div>
              <div class="mx-2">
                <span class="w-[10px] h-[10px]  inline-block border border-black mx-1" :class="TicketsTypes['free-tickets']"></span>آزاد
              </div>
              <div class="mx-2">
                <span class="w-[10px] h-[10px]  inline-block border border-black mx-1" :class="TicketsTypes['selected-tickets']"></span>انتخاب
                شما
              </div>
              <div class="mx-2">
                <span class="w-[10px] h-[10px]  inline-block border border-black mx-1" :class="TicketsTypes['waiting-tickets']"></span>در
                انتظار
                پرداخت
              </div>
              <div class="mx-2">
                <span class="w-[10px] h-[10px]  inline-block border border-black mx-1" :class="TicketsTypes['reserved-tickets']"></span>رزرو
                شده
              </div>

              <div class="mx-2">
                <span class="w-[10px] h-[10px]  inline-block border border-black mx-1" :class="TicketsTypes['not-tickets']"></span>
                غیر قابل خرید
              </div>

            </div>
          </TabGroup>

        </div>
      </div>

    </div>

    <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
      <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
      <div v-if=" TicketStore.Tickets.length===0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">
        هیچ بلیتی انتخاب نشده است!
      </div>
      <SelectedTicket v-for="item in TicketStore.Tickets" :seatInfo="item" :handleDelete="handleClickOnDeleteSeat" key="item"/>
    </div>
  </div>
</template>

<script setup>
import "vue-zoomable/dist/style.css";
import VueZoomable from "vue-zoomable"
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {onMounted, reactive, ref, useCssModule, vModelSelect, watch} from "vue";
import SelectedTicket from "@/views/components/Pages/Event/SelectedTicket.vue";
import useTicketStore from "@/stores/Ticket.js";
import {useTippy} from "vue-tippy";


const props = defineProps({
  stepControls: Object
})

const SVG = ref("");
const seatMap = ref(null);
const tippyTitle = ref("sfasf");



const seat = ref(null);
const seats = reactive([]);

const TicketStore = useTicketStore();
useTippy(seatMap,{
  content: tippyTitle,
  arrow: true,
  theme: 'light',
  touch:true,
  followCursor: true,
  hideOnClick:false,
  trigger: 'click focus',
  onTrigger(instance, event) {
    if(event.target.tagName.toLowerCase()!=="circle") {
      instance.hide();
      instance.disable();
      setTimeout(()=>{
        instance.enable();
      },1);
    }
  },
  onShow(instance) {
    setTimeout(()=>{
      instance.hide();
    },1000);
  }
});
function handleClickOnSeat($event) {


  if (($event.target.tagName === 'ellipse' || $event.target.tagName === 'circle') && $event.target.closest("#seatMap") !== null) {

    console.log($event.target.querySelector("title"));
    tippyTitle.value = $event.target.querySelector("title").innerHTML;
    seat.value = $event.target;
    if (!$event.target.classList.contains(TicketsTypes["reserved-tickets"]) && !$event.target.classList.contains(TicketsTypes["waiting-tickets"]) && !$event.target.classList.contains(TicketsTypes["not-tickets"])) {

      if (!$event.target.classList.contains(TicketsTypes["selected-tickets"])) {
        TicketStore.addToTicket($event.target.id);
        $event.target.classList.remove(TicketsTypes["free-tickets"]);
        $event.target.classList.add(TicketsTypes["selected-tickets"]);
      } else {
        $event.target.classList.remove(TicketsTypes["selected-tickets"]);
        $event.target.classList.add(TicketsTypes["free-tickets"]);
        TicketStore.removeTicket($event.target.id)
      }
    }

  }


}

function handleClickOnDeleteSeat(seatId) {

  TicketStore.removeTicket(seatId)
  document.querySelector("#" + seatId).classList.remove(TicketsTypes["selected-tickets"]);
  document.querySelector("#" + seatId).classList.add(TicketsTypes["free-tickets"]);

}


const TicketsTypes = useCssModule("TicketsTypes");

onMounted(() => {

  let t = fetch("http://localhost:5173/public/drawing.svg").then((res) => res.text()).then((res) => {

    let dom = new DOMParser();
    let tempDoc = dom.parseFromString(res, 'text/html');
    TicketStore.Tickets.forEach(item => {

      tempDoc.querySelector(`#${item}`).classList.add(TicketsTypes["selected-tickets"]);
    });

    tempDoc.querySelectorAll(`*[id^="f"]:not(.${TicketsTypes["selected-tickets"]})`).forEach((seat) => {
      seat.classList.add(TicketsTypes["free-tickets"]);

    });

    tempDoc.querySelectorAll(`*[id^="f"]`).forEach((seat) => {
      seats.push(seat);

    });


    SVG.value = tempDoc.querySelector("svg").outerHTML;


  });

});

</script>

<style module="TicketsTypes">


.free-tickets {
  fill: #28be29 !important;
  background-color: #28be29 !important;
}

.selected-tickets {
  fill: #1bc6ef !important;
  background-color: #1bc6ef !important;
}

.reserved-tickets {
  fill: #e55039 !important;
  background-color: #e55039 !important;
}

.waiting-tickets {
  fill: #f6b93b !important;
  background-color: #f6b93b !important;
}

.not-tickets {
  fill: #0e0e0e !important;
  background-color: #0e0e0e !important;
}
</style>