

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
export default {
  name: "App",
  components : {Footer, CardItem, Select, Header,Carousel,Splitter}
}
</script>

