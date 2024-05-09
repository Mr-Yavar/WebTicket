

<template>
  <div class="text-md text-black dark:text-gray-100 md:!text-right text-center ">کنســــرت <span class="font-extrabold text-xl">ماکان بند</span></div>
  <div class="grid grid-cols-1 md:grid-cols-2  md:!text-right text-center gap-2">
    <div class="text-black dark:text-gray-100 mt-2 px-3">
      <p> <v-icon name="px-calendar-tomorrow" scale="1" class="dark:text-white text-black"/><span class="font-bold text-md"> تاریخ :  </span> <span>1402/02/03</span>   </p>
      <p> <v-icon name="px-clock" scale="1" class="dark:text-white text-black"/><span class="font-bold text-md">ساعت : </span> <span>18:30 - 20:30</span>   </p>
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
                <div @click.prevent="">
                  <VueZoomable
                      class="w-full mx-auto overflow-hidden"
                      selector="#zoomable"
                      :minZoom="1"
                      :maxZoom="3"
                      :zoom="1"
                      :enableControllButton="true"
                  >
                  <div v-html="SVG" class="w-fit mx-auto " id="zoomable"></div>
                  </VueZoomable>
                </div>
              </TabPanel>
              <TabPanel>
                <div class="flex items-start">
                  <div class="w-20 h-20 ltr:mr-4 rtl:ml-4 flex-none">
                    <img src="" alt="" class="w-20 h-20 m-0 rounded-full ring-2 ring-[#ebedf2] dark:ring-white-dark object-cover" />
                  </div>
                  <div class="flex-auto">
                    <h5 class="text-xl font-medium mb-4">Media heading</h5>
                    <p class="text-white-dark">
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra
                      turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                    </p>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </TabPanel>
            </TabPanels>
          </TabGroup>

        </div>
    </div>

  </div>
</template>

<script setup>
import "vue-zoomable/dist/style.css";
import VueZoomable from "vue-zoomable"
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {onMounted, reactive, ref} from "vue";


const SVG = ref("");


function handleClickOnSeat($event){

    if($event.target.tagName==='ellipse'){
      $event.target.style.fill='red';

    }



}



onMounted(()=>{

    let t = fetch("http://localhost:5173/public/drawing11.svg").then((res)=>res.text()).then((res)=>{
      SVG.value = res;
    })

})
</script>

<style scoped>

</style>