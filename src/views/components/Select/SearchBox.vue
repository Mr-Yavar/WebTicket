<script>
export default {
  name: "SearchBox"
}
</script>

<template>
  <div class="lg:my-0 my-2 mt-3" dir="rtl">
    <div class="relative h-10 w-full min-w-[200px] ">
      <div class="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 left-3 -translate-y-2/4">
        <v-icon name="fa-search" aria-hidden="true"></v-icon>
      </div>
      <input type="text" placeholder="برای یافتن..."
             class="peer h-full w-full rounded-[7px] rtl:fa-font !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50" />
    </div>
    <p class="rtl:fa-font flex  items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 -mt-px">
        <path fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"></path>
      </svg>
      نام خواننده، گروه و ...
    </p>
  </div>
</template>

<style scoped>

</style>