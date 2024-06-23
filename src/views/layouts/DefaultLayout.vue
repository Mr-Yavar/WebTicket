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

import Header from "@/views/components/Layouts/DefaultLayout/Header/Header.vue";
import Footer from "@/views/components/Layouts/DefaultLayout/Footer/Footer.vue";
import AuthModal from "@/views/components/Globals/modal/AuthModal.vue";


</script>

<style scoped>

</style>