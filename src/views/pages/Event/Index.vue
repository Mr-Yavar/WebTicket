<template>
  <div class="relative top-1/2 text-center hidden">
    <v-icon name="pr-spinner" animation="spin" scale="1.5" speed="1.5"/>
  </div>
  <div class="relative overflow-hidden rounded-lg mb-3">
    <div class="w-full event-cover  bg-transparent ">
      <img class="h-fit w-full rounded-lg" src="https://static.honarticket.com/resource/files/cache/fa41b9fa14be3bc8.951409.jpeg" border="0">
      <h1 class="bg-none bg-transparent rounded-md text-white font-bold absolute bottom-2 right-2 z-10">کنسرت ماکان
        بند</h1>
    </div>
  </div>
  <div class="w-full rounded-lg ">
    <div class="grid md:grid-cols-2  grid-cols-1">
      <div class="col-span-1">
          <div class="flex">
            <div >
              <span class="p-1 text-center align-text-bottom">
                <v-icon name="px-calendar-tomorrow"  scale="1"/>
              </span>
              <span class="leading-6 font-bold pl-1">زمان :</span>
            </div>
            <div> سه شنبه 15 مرداد</div>
          </div>
      </div>
      <div class="col-span-1">
        <div class="flex">
          <div >
              <span class="p-1 text-center align-text-bottom">
                <v-icon name="px-clock"  scale="1"/>
              </span>
            <span class="leading-6 font-bold pl-1">ساعت :</span>
          </div>
          <div> ساعت 18:30 و 21:30</div>
        </div>
      </div>

      <div class="col-span-1">
        <div class="flex">
          <div >
              <span class="p-1 text-center align-text-bottom">
                <v-icon name="px-gps"  scale="1"/>
              </span>
            <span class="leading-6 font-bold pl-1">محل برگزاری :</span>
          </div>
          <div class="flex">
            <span>تهران ، برج میلاد</span>
            <div class="inline-step h-6 inline-block"></div>
            <span>تهران ، .................</span>
          </div>
        </div>
      </div>


    </div>
  </div>

</template>

<script setup>


</script>

<style scoped>
.event-cover::after {
  content: '';
  background: linear-gradient(-4deg, rgba(0, 0, 0, 0.3) 22%, transparent 41%, transparent);
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: block;
  position: absolute;
  bottom: 0;

}

.event-cover {

}
</style>