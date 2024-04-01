<script setup>

import EventPartial from "@/views/ui/Home/EventPartial.vue";
import CardItem from "@/views/components/CardItem.vue";
</script>

<template>
  <EventPartial>
    <template #Events>
      <div class="mt-4 grid xl:grid-cols-4 xl:gap-y-4  lg:grid-cols-3   md:grid-cols-2 grid-cols-1 gap-y-2 " dir="rtl">
        <CardItem v-for="index in [0,1,2,3,4,5,6,7,8,9]" :key="index"/>
      </div>
    </template>
  </EventPartial>


</template>

<style scoped>

</style>