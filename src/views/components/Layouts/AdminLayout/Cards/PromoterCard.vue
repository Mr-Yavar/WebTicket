<script setup>

import { BsLightningCharge } from "@kalimahapps/vue-icons/bs";
import { RePencilLine } from "@kalimahapps/vue-icons/re";
import { BsLightningChargeFill } from '@kalimahapps/vue-icons/bs';
import { useRouter } from "vue-router";
import { FILE_PROVIDER } from "@/config/appConfig";

defineProps({
  promoter: Object,
  togglePromoter: Function
});


const router = useRouter();
</script>

<template>
  <div class="mx-auto w-64 mb-2 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
    <div class="flex-1 flex flex-col p-3">
      <img class="w-32 h-32 flex-shrink-0 mx-auto rounded-full" :src="(promoter.img_url ?  FILE_PROVIDER+'?filename='+promoter.img_url : '/image-03.jpg')" alt="">
      <h3 class="mt-6 text-gray-900 text-sm font-medium">{{ promoter.title }}</h3>
      <dl class="mt-1 flex-grow flex flex-col justify-between">
        <dd class="mt-3">
          <span v-if="!promoter.isDeleted"
            class="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">فعال</span>
          <span v-else class="px-2 py-1 text-red-800 text-xs font-medium bg-red-100 rounded-full">غیرفعال</span>
        </dd>
      </dl>
    </div>
    <div>
      <div class="-mt-px flex justify-around py-2">
        <button @click.prevent="router.push({ name: 'editPromoter', params: { id: promoter.id } })"
          class="w-fit flex items-center text-white text-sm justify-around rounded px-2 py-1 bg-orange-600 shadow-sm hover:shadow-md">
          <RePencilLine />ویرایش
        </button>
        <button v-if="!promoter.isDeleted" @click.prevent="togglePromoter(promoter.id)"
          class="w-fit flex items-center text-white text-sm justify-around rounded px-2 py-1 bg-red-400 shadow-sm hover:shadow-md">
          <BsLightningCharge />غیرفعال
        </button>
        <button v-else @click.prevent="togglePromoter(promoter.id)"
          class="w-fit flex items-center text-white text-sm justify-around rounded px-2 py-1 bg-green-400 shadow-sm hover:shadow-md">
          <BsLightningChargeFill />فعال
        </button>
      </div>
    </div>
  </div>

</template>

<style scoped></style>