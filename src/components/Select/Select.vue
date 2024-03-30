<script>
export default {
  name: "Select",
  props:{
    parentClass:{
      type:String
    }
  }
}
</script>

<template>
  <div class="relative h-10 w-52 min-w-[120px] block " :class="parentClass">
    <select class="block w-full absolute rounded-[7px] outline-0 bg-gray-50 border border-gray-200 border-solid px-3 py-2.5  " dir="rtl">
      <option>تمامی شهرها</option>
      <option>2</option>
      <option>3</option>
      <option>5</option>
    </select>
  </div>
</template>

<style scoped>

</style>