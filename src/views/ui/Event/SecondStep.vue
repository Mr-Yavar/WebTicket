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
          <div role="tablist" class="tabs grid flex-end align-center tabs-boxed mb-2 !bg-gray-100 dark:bg-gray-600 !text-black dark:!text-white">
            <template v-for="(floor,index) in Floors" :key="`tab`+floor" >
              <a role="tab" class="tab " :class="{'tab-active':tab===floor}" @click.prevent="changeTab(floor)">{{ floor }}</a>
            </template>
          </div>
          <div class="body">

            <template v-for="(map,index) in SeatMaps" :key="`tabcontent`+Floors[index]">
              <div class="p-1" :class="{'hidden' : tab!==Floors[index] }"  >

                <div   @click.prevent="handleClickOnSeat" >
                  <SvgPanZoom

                      :zoomEnabled="true"
                      :controlIconsEnabled="true"
                      :fit="true"
                      :center="true"
                      :preventMouseEventsDefault="false"
                      :dblClickZoomEnabled="false"
                      :mouseWheelZoomEnabled="true"
                      :viewportSelector="'#seatMap'+index+' svg'"
                      :min-zoom="0.5"

                      :key="'map'+MapKey[index]"

                  >
                      <div  :id="'seatMap'+index" class="w-full mx-auto border-dark-600 border-2" v-tippy="{...tippyOption}">
                        <template  v-html="map" v-inline-svg  class="w-full mx-auto"   ></template>
                      </div>
                  </SvgPanZoom>
                </div>


              </div>

            </template>

          </div>


          <div class="grid grid-cols-6 w-full text-center text-gray-900 dark:text-gray-100">
            <div class="">راهنما:</div>
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


        </div>
      </div>

    </div>

    <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] ">
      <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
      <div v-if=" TicketStore.Tickets.length===0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">
        هیچ بلیتی انتخاب نشده است!
      </div>
      <SelectedTicket v-for="(item,key) in (TicketStore.Tickets ?? [])" :seatInfo="item" :index="item.id" :has-delete="true" :handleDelete="()=> handleClickOnDeleteSeat(item.id)" :key="item.id"/>
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
import {useQuery, useQueryClient} from "@tanstack/vue-query";

import {GetSeatMapService, GetSpecificEventService} from "@/services/ConcertsService.js";

const MapRefs = ref([]);
const tab = ref(0);

const MapKey = reactive([]);

const MapController = reactive([]);
const SeatMaps  =reactive([]);

const props = defineProps({
  stepControls: Object
})

function changeTab(selectedTab){
  this.tab = selectedTab;

}

watch(tab,()=>{
  let index = Floors.value.indexOf(tab.value);
  if(index!==-1 && MapKey[index]%1!==0)
    MapKey[index] = Math.floor(Math.random()*10000)


});

const tippyTitle = ref("");


const TicketStore = useTicketStore();
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
    }, 1000);
  }
};

function handleClickOnSeat($event) {

  const regex = /f[0-9]{1,3}_r[0-9]{1,3}_c[0-9]{1,9}/gm;

  if ($event.target.closest("[id*='seatMap']") !== null && ($event.target.id.match(regex)!==null)) {



    tippyTitle.value = $event.target.querySelector("title").innerHTML;

    if (!$event.target.classList.contains(TicketsTypes["reserved-tickets"]) && !$event.target.classList.contains(TicketsTypes["waiting-tickets"]) && !$event.target.classList.contains(TicketsTypes["not-tickets"])) {

      if (!$event.target.classList.contains(TicketsTypes["selected-tickets"])) {

        let [floor, row, column] = $event.target.id.split('_');
        $event.target.classList.remove(TicketsTypes["free-tickets"]);
        $event.target.classList.add(TicketsTypes["selected-tickets"]);
        TicketStore.addToTicket({
          id: $event.target.id,
          price: $event.target.getAttribute('price'),
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
  document.querySelector("#" + seatId).classList.remove(TicketsTypes["selected-tickets"]);
  document.querySelector("#" + seatId).classList.add(TicketsTypes["free-tickets"]);

}

const TicketsTypes = useCssModule("TicketsTypes");
const queryClient = useQueryClient();

const GetSpecificEventServiceCall = useQuery({
  queryKey: ["/api/Concerts/GetSpecificEvent", TicketStore.selectedShowing],
  queryFn: GetSpecificEventService,

  enabled: true
});

const Floors = computed(() => GetSpecificEventServiceCall.data.value?.events[0].floors.map(x => x.title));

const Tickets = computed(() => {

  let res = {};


  GetSpecificEventServiceCall.data.value?.events[0].floors.forEach(floor => {

    res[floor.displayOrder] = floor.seatsInfo.items;

  });

  return res;
});


watchEffect(async ()=>{
  if(GetSpecificEventServiceCall.data.value?.events[0]!==undefined)
  for(let floor of GetSpecificEventServiceCall.data.value?.events[0]?.floors) {

    let res = await GetSeatMapService(floor.seatMap_url);

    let dom = new DOMParser();
    let tempDoc = dom.parseFromString(res, 'text/html');

    let CriticalIds = [];
    tempDoc.body.querySelectorAll('defs').forEach(def => {
      def.querySelectorAll("[id]").forEach(item => CriticalIds.push(item.id))
    });

    CriticalIds.forEach(id => {
      let newId = id + '_' + floor.floorId;
      tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll('id="' + id + '"', 'id="' + newId + '"');
      tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll('#' + id, "#" + newId);
    });

    TicketStore.Tickets.forEach(item => {

      tempDoc?.querySelector(`#${item.id}`).classList.add(TicketsTypes["selected-tickets"]);
    });

    tempDoc?.querySelectorAll(`*[id^="f"]:not(.${TicketsTypes["selected-tickets"]})`).forEach((seat) => {
      seat.classList.add(TicketsTypes["free-tickets"]);

    });

    tempDoc.body.querySelector('svg').id = floor.floorId;

    SeatMaps.push(tempDoc.body.innerHTML);
    await nextTick(() => console.log("changed"));


  }



})





watch(SeatMaps.value?.length,async ()=>{
  this.MapKey=GetSpecificEventServiceCall.data.value?.events[0].floors.map((floor) => Math.random());


})
function resetMap(index){

  this.MapKey[index] = Math.floor(Math.random()*1000);

}


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
</style>