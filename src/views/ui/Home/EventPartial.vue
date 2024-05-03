<script setup>

import Select from "@/views/components/Select/Select.vue";
import SearchBox from "@/views/components/Select/SearchBox.vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import CardItem from "@/views/components/Pages/Home/CardItem.vue";
import Carousel from "@/views/components/Slider/Carousel.vue";
import Vselect from "vue-select"
</script>

<template>

  <Carousel/>

  <div class="AppGap">
    <div class="AppContainer">
      <Splitter title="برنامه ها" type="middle" border-class="border-gray-500 border-dashed"
                titleClass="font-bold text-xl"/>

      <div class="block">
        <div class="lg:flex lg:justify-center items-center">
          <div class="grid grid-cols-2 lg:w-[50%] w-full">
            <div class="mx-2">
              <p class="rtl:fa-font flex  items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700">
                <v-icon name="si-openstreetmap"/>
                شهرها...
              </p>
            <Vselect multiple  :options="['Canada','United States']" class="w-full"/>
            </div>
            <div class="mx-2">
              <p class="rtl:fa-font flex  items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700">
                <v-icon name="md-category-outlined"/>
                نوع اجرا ...
              </p>
              <Vselect multiple  :options="['Canada','United States']" class="w-full"/>

            </div>
          </div>
          <div class="inline-step h-20 lg:inline-block hidden"></div>
          <div class="lg:w-[50%] w-full">
          <SearchBox/>
          </div>
        </div>
      </div>

      <slot name="Events"></slot>
    </div>
  </div>
</template>

<style scoped>

</style>