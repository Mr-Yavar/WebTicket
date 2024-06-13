<template>



  <component :is="layout">
  <router-view/>
  </component>

</template>

<script setup>
import Header from "@/views/components/DefaultLayout/Header/Header.vue";
import Carousel from "@/views/components/Slider/Carousel.vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import Select from "@/views/components/Select/Select.vue";
import CardItem from "@/views/components/Pages/Home/CardItem.vue";
import Footer from "@/views/components/DefaultLayout/Footer/Footer.vue";
import SearchBox from "@/views/components/Select/SearchBox.vue";
import Modal from "@/views/components/Globals/modal/modal.vue";
import AuthModal from "@/views/components/Globals/modal/AuthModal.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";
import useSeatMapStore from "@/stores/seatMap.js";

const route = useRoute();
/**
 *  This is a computed property that will return the name
 *  of the current route
 */
const layout = computed(() => {
  const layout = route?.meta?.layout;

  if (layout) {
    return `${layout}Layout`;
  }
  return 'div';
});

const seatmap = useSeatMapStore();

</script>

<style>

</style>