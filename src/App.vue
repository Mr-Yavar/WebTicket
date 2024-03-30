

<template>


  <Header/>
  <Carousel/>
  <Splitter title="برنامه ها"/>
  <div dir="rtl" class="my-container rtl:fa-font">
    <span class="rtl:fa-font px-1">برنامه ها در</span>
    <Select/>
   <span class="rtl:fa-font px-1"> با موضوع</span>
    <Select/>

  </div>
  <div class="my-container">
    <CardItem/>

  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import Carousel from "@/components/Slider/Carousel.vue";
import Splitter from "@/components/Splitter/Splitter.vue";
import Select from "@/components/Select/Select.vue";
import CardItem from "@/components/CardItem.vue";
export default {
  name: "App",
  components : {CardItem, Select, Header,Carousel,Splitter}
}
</script>

