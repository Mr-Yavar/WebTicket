<template>
  <div dir="rtl" class="block w-full max-w-screen-xl px-2 py-2 mx-auto lg:px-8 lg:py-4">
    <div class="flex items-center rtl:fa-font">
      <div class="flex-1 border-t-2 border-black"></div>
      <span class="px-3 text-black bg-white">{{ title }}</span>
      <div class="flex-1 border-t-2 border-black"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Splitter",
  props: {
    title: {
      type: String
    },
    type:{
      type:String
    }
  }
}
</script>
<style>

</style>