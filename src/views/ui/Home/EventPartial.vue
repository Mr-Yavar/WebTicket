<script setup>

import Select from "@/views/components/Select/Select.vue";
import SearchBox from "@/views/components/Select/SearchBox.vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import CardItem from "@/views/components/Pages/Home/CardItem.vue";
import Carousel from "@/views/components/Slider/Carousel.vue";
</script>

<template>

  <Carousel/>

  <div class="AppGap">
    <div class="AppContainer">
      <Splitter title="برنامه ها" type="middle" border-class="border-gray-500 border-dashed"
                titleClass="font-bold text-xl"/>

      <div class="block">
        <div class="lg:flex lg:justify-center items-center">
          <div class="flex sm:flex-row flex-col justify-around">
            <Select text-before=" برنامه ها در"/>
            <Select text-before=" با موضوع"/>
          </div>
          <div class="inline-step h-20 lg:inline-block hidden"></div>
          <SearchBox/>
        </div>
      </div>

      <slot name="Events"></slot>
    </div>
  </div>
</template>

<style scoped>

</style>