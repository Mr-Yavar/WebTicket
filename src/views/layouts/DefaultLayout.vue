<template>

  <Header/>
  <div class="AppGap">
      <div class="AppContainer min-h-[calc(100vh-430px)]">
      <slot></slot>

</div>
  </div>
  <AuthModal/>

  <Footer/>

</template>

<script setup>
import {defineComponent} from "vue";
import Header from "@/views/components/Header/Header.vue";
import Footer from "@/views/components/Footer/Footer.vue";
import AuthModal from "@/views/components/Globals/modal/AuthModal.vue";


</script>

<style scoped>

</style>