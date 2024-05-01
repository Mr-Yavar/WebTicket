<style>
.tab-active {
  @apply bg-neutral text-white;
}
</style>

<template>


  <modal :show="show" :on-close-fn="onCloseFn" >
    <template #title>
      <h3 class="font-bold text-lg mb-4 rtl:text-right">قوانین و مقررات</h3>
    </template>
    <template #body>
      <ul>
        <li>تست 1</li>
        <li>تست 2</li>
        <li>تست 3</li>
        <li>تست 1</li>
        <li>تست 1</li>
      </ul>
    </template>
  </modal>
</template>

<script setup>

import Modal from "@/views/components/Globals/modal/modal.vue";

defineProps({
  show : Boolean,
  onCloseFn : Function
})


</script>
