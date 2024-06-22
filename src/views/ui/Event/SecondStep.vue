<template>
  <div>
    <div class="text-md text-black dark:text-gray-100 md:!text-right text-center ">کنســــرت
      <span class="font-extrabold text-xl">ماکان بند</span></div>
    <div class="grid grid-cols-1 md:grid-cols-2  md:!text-right text-center gap-2">
      <div class="text-black dark:text-gray-100 mt-2 px-3">
        <p>
          <v-icon class="dark:text-white text-black" name="px-calendar-tomorrow" scale="1"/>
          <span class="font-bold text-md"> تاریخ :  </span> <span>1402/02/03</span></p>
        <p>
          <v-icon class="dark:text-white text-black" name="px-clock" scale="1"/>
          <span class="font-bold text-md">ساعت : </span> <span>18:30 - 20:30</span></p>
      </div>
      <div class="text-black dark:text-gray-100 mt-2 px-3">
        <v-icon class="dark:text-white text-black" name="px-gps" scale="1"/>
        <span class="font-bold text-md"> مکان برگزاری : </span>
        <span>تهران ، .......</span>
      </div>

      <div class="col-span-full">
        <div class="p-2 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
          <div class="tabs grid flex-end align-center tabs-boxed mb-2 !bg-gray-100 dark:bg-gray-600 !text-black dark:!text-white" role="tablist">
            <template v-for="(floor,index) in Floors" :key="`tab`+floor">
              <a :class="{'tab-active':tab===floor}" class="tab " role="tab" @click.prevent="changeTab(floor)">{{
                  floor
                }}</a>
            </template>
          </div>
          <div class="body">

            <template v-for="(map,index) in SeatMaps" :key="`tabcontent`+Floors[index]">
              <div :class="{'hidden' : tab!==Floors[index] }" class="p-1">

                <div @click.prevent="handleClickOnSeat">
                  <SvgPanZoom

                      :key="'map'+MapKey[index]"
                      :center="true"
                      :controlIconsEnabled="true"
                      :dblClickZoomEnabled="false"
                      :fit="true"
                      :min-zoom="0.5"
                      :mouseWheelZoomEnabled="true"
                      :preventMouseEventsDefault="false"
                      :viewportSelector="'#seatMap'+index+' svg'"

                      :zoomEnabled="true"

                  >
                    <div :id="'seatMap'+index" v-tippy="{...tippyOption}" class="w-full mx-auto border-dark-600 border-2" v-html="map">

                    </div>
                  </SvgPanZoom>
                </div>


              </div>

            </template>

          </div>


          <div class="grid grid-cols-6 w-full text-center text-gray-900 dark:text-gray-100">
            <div class="">راهنما:</div>
            <div class="mx-2">
              <span :class="TicketsTypes['free-tickets']" class="w-[10px] h-[10px]  inline-block border border-black mx-1"></span>آزاد
            </div>
            <div class="mx-2">
              <span :class="TicketsTypes['selected-tickets']" class="w-[10px] h-[10px]  inline-block border border-black mx-1"></span>انتخاب
              شما
            </div>
            <div class="mx-2">
              <span :class="TicketsTypes['waiting-tickets']" class="w-[10px] h-[10px]  inline-block border border-black mx-1"></span>در
              انتظار
              پرداخت
            </div>
            <div class="mx-2">
              <span :class="TicketsTypes['reserved-tickets']" class="w-[10px] h-[10px]  inline-block border border-black mx-1"></span>رزرو
              شده
            </div>

            <div class="mx-2">
              <span :class="TicketsTypes['not-tickets']" class="w-[10px] h-[10px]  inline-block border border-black mx-1"></span>
              غیر قابل خرید
            </div>

          </div>


        </div>
      </div>

    </div>

    <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
      <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
      <div v-if=" TicketStore.Tickets.length===0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">
        هیچ بلیتی انتخاب نشده است!
      </div>
      <SelectedTicket v-for="(item,key) in (TicketStore.Tickets ?? [])" :key="item.id" :handleDelete="()=> handleClickOnDeleteSeat(item.id)" :has-delete="true" :index="item.id" :seatInfo="item"/>
    </div>
  </div>

  <slot name="controlSteps"/>
</template>

<script setup>
import "vue-zoomable/dist/style.css";

import {computed, nextTick, reactive, ref, useCssModule, watch, watchEffect} from "vue";
import SelectedTicket from "@/views/components/Pages/Event/SelectedTicket.vue";
import useTicketStore from "@/stores/Ticket.js";

import {SvgPanZoom} from "vue-svg-pan-zoom";
import {useQuery} from "@tanstack/vue-query";

import {GetSeatMapService, GetSpecificEventService} from "@/services/ConcertsService.js";
import useSeatMapStore from "@/stores/seatMap.js";
import Swal from "sweetalert2";


const tab = ref(0);

const tippyTitle = ref("");
const tippyOption = {
  content: tippyTitle,
  arrow: true,
  theme: 'light',
  touch: true,
  followCursor: true,
  hideOnClick: false,
  trigger: 'click focus',
  onTrigger(instance, event) {
    if (event.target.tagName.toLowerCase() !== "circle") {
      instance.hide();
      instance.disable();
      setTimeout(() => {
        instance.enable();
      }, 1);
    }
  },
  onShow(instance) {
    setTimeout(() => {
      instance.hide();
    }, 1500);
  }
};

const MapKey = reactive([]);
const TicketStore = useTicketStore();
const SeatMaps = reactive([]);
const TicketsTypes = useCssModule("TicketsTypes");

const seatMapService = useSeatMapStore();
const GetSpecificEventServiceCall = useQuery({
  queryKey: ["/api/Concerts/GetSpecificEvent", TicketStore.selectedShowing],
  queryFn: GetSpecificEventService,
  enabled: SeatMaps.length === 0,
  refetchInterval: false,
  refetchIntervalInBackground: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,

});


const props = defineProps({
  stepControls: Object
})

function changeTab(selectedTab) {
  this.tab = selectedTab;

}

watch(tab, () => {
  let index = Floors.value.indexOf(tab.value);
  if (index !== -1 && MapKey[index] % 1 !== 0)
    MapKey[index] = Math.floor(Math.random() * 10000)


});


function handleClickOnSeat($event) {

  const regex = /f[0-9]{1,3}_r[0-9]{1,3}_c[0-9]{1,9}/gm;

  if ($event.target.closest("[id*='seatMap']") !== null && ($event.target.id.match(regex) !== null)) {
    let ticketId = $event.target.getAttribute("tid");
    let Ticket = Tickets.value[currentFloor.value].filter(x => x.id === ticketId)[0];
    tippyTitle.value = JSON.stringify(Ticket);

    //یعنی این تیکت در حالت قفل است
    if(seatMapService.Locked_Tickets.indexOf(ticketId)!==-1)
      return;

    if (!$event.target.classList.contains(TicketsTypes["reserved-tickets"]) && !$event.target.classList.contains(TicketsTypes["waiting-tickets"]) && !$event.target.classList.contains(TicketsTypes["not-tickets"])) {

      if (!$event.target.classList.contains(TicketsTypes["selected-tickets"])) {

        console.log(Tickets.value, currentFloor.value);

        let [floor, row, column] = $event.target.id.split('_');
        $event.target.classList.remove(TicketsTypes["free-tickets"]);
        $event.target.classList.add(TicketsTypes["selected-tickets"]);
        TicketStore.addToTicket({
          ...Ticket,
          floor,
          row,
          column
        });

      } else {

        $event.target.classList.remove(TicketsTypes["selected-tickets"]);
        $event.target.classList.add(TicketsTypes["free-tickets"]);
        TicketStore.removeTicket($event.target.id);
      }


    }

  }


}

function handleClickOnDeleteSeat(seatId) {
  console.log(seatId);
  TicketStore.removeTicket(seatId);
  document.querySelector("[tid='" + seatId+"']").classList.remove(TicketsTypes["selected-tickets"]);
  document.querySelector("[tid='" + seatId+"']").classList.add(TicketsTypes["free-tickets"]);

}


const Floors = computed(() => GetSpecificEventServiceCall.data.value?.events[0].floors.map(x => x.title));

const Tickets = computed(() => {

  let res = {};


  GetSpecificEventServiceCall.data.value?.events[0].floors.forEach(floor => {

    res[floor.displayOrder] = floor.seatsInfo.items;

  });

  return res;
});

const currentFloor = computed(() => (GetSpecificEventServiceCall.data.value?.events[0].floors.filter(x => x.title === tab.value)[0])?.displayOrder);
watchEffect(async () => {
  if (GetSpecificEventServiceCall.data.value?.events[0] !== undefined)
    for (let floor of GetSpecificEventServiceCall.data.value?.events[0]?.floors) {

      let res = await GetSeatMapService(floor.seatMap_url);

      let dom = new DOMParser();
      let tempDoc = dom.parseFromString(res, 'text/html');

      let CriticalIds = [];
      tempDoc.body.querySelector("svg").classList.add("w-full", "mx-auto");
      tempDoc.body.querySelectorAll('defs').forEach(def => {
        def.querySelectorAll("[id]").forEach(item => CriticalIds.push(item.id))
      });

      CriticalIds.forEach(id => {
        let newId = id + '_' + floor.floorId;
        tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll('id="' + id + '"', 'id="' + newId + '"');
        tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll('#' + id, "#" + newId);
      });

      // نوشتن آیدی های بلیت روی صندلی ها و در صورت رزرو بودن قفل کردن آنها
      Tickets.value[floor.displayOrder].forEach(item => {
        let temp = tempDoc?.querySelector(`#${item.name}`);
        temp?.setAttribute("tid", item.id);
        if (item.isReserved)
          temp.classList.add(TicketsTypes["reserved-tickets"]);
      });

      //قفل کردن صندلی ها انتخاب شده و درحال پرداخت
      seatMapService.Locked_Tickets.forEach(item => {
        tempDoc?.querySelector(`[tid='${item}']`)?.classList.add(TicketsTypes["waiting-tickets"]);

      });

      tempDoc?.querySelectorAll(`*[id^="f"]:not([tid])`).forEach(item => {

        item?.classList.add(TicketsTypes["not-tickets"]);
      });

      //نوشتن صندلی ها انتخابی توسط کاربر
      TicketStore.Tickets.forEach(item => {

        tempDoc?.querySelector(`[tid='${item.id}']`)?.classList.add(TicketsTypes["selected-tickets"]);
      });



      let exception = Object.keys(TicketsTypes).map(x=>TicketsTypes[x]).join(",.")
      tempDoc?.querySelectorAll(`*[id^="f"]:not(.${exception})`).forEach((seat) => {
        seat.classList.add(TicketsTypes["free-tickets"]);

      });

      tempDoc.body.querySelector('svg').id = floor.floorId;

      SeatMaps.push(tempDoc.body.innerHTML);
      await nextTick(() => console.log("changed"));


    }


})


watch(seatMapService.Locked_Tickets, () => {

  let userTicketsToLock = [];
  let classesToRemove = Object.keys(TicketsTypes).map(x=>TicketsTypes[x]);
  let tickets = TicketStore.Tickets.map(x=>x.id);
  seatMapService.Locked_Tickets.forEach(item => {
    if(tickets.indexOf(item)!==-1) {
      TicketStore.removeTicket(item);
      userTicketsToLock.push(item);
    }

    document.querySelector(`[tid='${item}']`)?.classList.remove(...(classesToRemove));
    document.querySelector(`[tid='${item}']`)?.classList.add(TicketsTypes["waiting-tickets"]);



  });


  if(userTicketsToLock.length!==0){



    let floors =Object.keys(Tickets.value);
    let msg = userTicketsToLock.map(ticket=>{


      for (let i = 0; i < floors.length; i++) {
        let temp = Tickets.value[floors[i]].filter(item=>{
          return item.id===ticket;
        });

        if(!!temp && temp.length===1){
          let [floor, row, column] = temp[0].name.replace("f","").replace("r","").replace("c","").split('_');

          let txt =  `<br/><p dir="rtl">${column}  ستون : ${row} ردیف : ${Floors.value[floors[i]]}  طبقه : `;
            txt+="   </p>";
            return txt;
        }
      }



    });

    Swal.fire({
      title: '',
      html: 'برخی از صندلیها انتخابی شما توسط شخص دیگری به مرحله پرداخت رفته اند!<br/>'+msg,
      icon: 'info',
      showConfirmButton: false,
      showCloseButton: true,
      showClass: {popup: "direction-rtl vazir-font"},

    });


  }

});
watch(seatMapService.UnLocked_Tickets, () => {



  seatMapService.UnLocked_Tickets.forEach(item => {
    let chair =  document.querySelector(`[tid='${item}']`);
    if(!!chair && chair.classList.contains(TicketsTypes["waiting-tickets"])) {
      chair.classList.remove(TicketsTypes["waiting-tickets"]);
    }
      chair?.classList.add(TicketsTypes["free-tickets"]);



  });


});

watch(SeatMaps.value?.length, async () => {
  this.MapKey = GetSpecificEventServiceCall.data.value?.events[0].floors.map((floor) => Math.random());


})

watch(TicketStore.Tickets,()=>{
  TicketStore.Tickets.forEach(item=>{
    document.querySelector(`[tid='${item.id}']`)?.classList.add(TicketsTypes["selected-tickets"])

  });
  document.querySelectorAll(`.${TicketsTypes["selected-tickets"]}`).forEach(item=>{
    if(TicketStore.Tickets.filter(x=>x.id===item.getAttribute("tid"))[0]===undefined) {
      item.classList.remove(TicketsTypes["selected-tickets"]);
      item.classList.add(TicketsTypes["free-tickets"]);
    }
  });



});
</script>

<style module="TicketsTypes">


.free-tickets {
  fill: #4eef4f !important;
  background-color: #4eef4f !important;
}

.selected-tickets {
  fill: #63dbfc !important;
  background-color: #63dbfc !important;
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

<style scoped>

.tab {
  @apply w-full ;
  position: relative;
  grid-row-start: 1;
  display: block;
  height: 2rem;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: .875rem;
  line-height: 1.25rem;
  line-height: 2;

  @apply bg-transparent rounded-lg
}

.tab-active {
  @apply dark:!text-white !text-white !bg-indigo-400;
}

.tabs {
  @apply bg-gray-50 p-1 rounded-md shadow-inner
}


*[id*="seatMap"] svg {
  @apply !w-full mx-auto;
}
</style>