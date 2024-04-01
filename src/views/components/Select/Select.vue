<script>
export default {
  name: "Select",
  props: {
    parentClass: {
      type: String
    }, textBefore: {
      type: String
    }
  }
}
</script>

<template>
  <div class="relative h-10 w-80 min-w-[10em] block mx-auto mt-2 sm:mt-0" :class="parentClass">
    <div class="flex justify-between">
      <div class="rtl:fa-font w-full whitespace-pre px-1 leading-10 text-center">{{ textBefore }}</div>
      <select
          class="block w-full  rounded-[7px] outline-0 bg-gray-50 border border-gray-200 border-solid px-3 py-2.5  "
          dir="rtl">
        <option>تمامی شهرها</option>
        <option>2</option>
        <option>3</option>
        <option>5</option>
      </select>
    </div>
  </div>
</template>

<style scoped>

</style>