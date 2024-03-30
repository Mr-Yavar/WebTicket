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
  <div class="relative h-10 w-52 min-w-[120px] inline-block" :class="parentClass">
    <select class="block w-full rounded-xl outline-0 bg-gray-50 border border-gray-200 border-solid px-2 py-1 " dir="rtl">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>5</option>
    </select>
  </div>
</template>

<style scoped>

</style>