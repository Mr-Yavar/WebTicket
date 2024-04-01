<template>


  <Header/>

  <router-view/>
  <Footer/>
</template>

<script>
import Header from "@/views/components/Header/Header.vue";
import Carousel from "@/views/components/Slider/Carousel.vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import Select from "@/views/components/Select/Select.vue";
import CardItem from "@/views/components/CardItem.vue";
import Footer from "@/views/components/Footer/Footer.vue";
import SearchBox from "@/views/components/Select/SearchBox.vue";

export default {
  name: "App",
  components: {SearchBox, Footer, CardItem, Select, Header, Carousel, Splitter}
}
</script>

<style>

</style>