<template>


  <Header/>
  <Carousel/>
  <div dir="rtl" class="my-container">
    <Splitter title="برنامه ها" type="middle" border-class="border-gray-500 border-dashed"/>
  </div>
  <div dir="rtl" class="my-container rtl:fa-font ">
    <div class="flex items-center">
      <div class="flex">
        <div class="rtl:fa-font w-fit whitespace-pre px-1 leading-10">برنامه ها در</div>
        <Select/>
        <div class="rtl:fa-font w-fit whitespace-pre px-1 leading-10"> با موضوع</div>
        <Select/>
      </div>
      <div class="inline-step h-20 inline-block"></div>
      <SearchBox/>
    </div>


  </div>
  <div class="my-container grid xl:grid-cols-4 xl:gap-y-4  lg:grid-cols-3 grid-cols-1 gap-y-2 " dir="rtl">


    <CardItem v-for="index in [0,1,2,3,4,5,6,7,8,9]" :key="index"/>

  </div>

  <Footer/>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import Carousel from "@/components/Slider/Carousel.vue";
import Splitter from "@/components/Splitter/Splitter.vue";
import Select from "@/components/Select/Select.vue";
import CardItem from "@/components/CardItem.vue";
import Footer from "@/components/Footer/Footer.vue";
import SearchBox from "@/components/Select/SearchBox.vue";

export default {
  name: "App",
  components: {SearchBox, Footer, CardItem, Select, Header, Carousel, Splitter}
}
</script>

<style>
.inline-step {
  border-right: solid 1px rgba(0, 0, 0, 0.15);


  margin: 0 5px -4px;
}
</style>