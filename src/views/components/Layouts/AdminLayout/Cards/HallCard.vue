<script setup>
import { BsLightningCharge } from '@kalimahapps/vue-icons/bs'
import { RePencilLine } from '@kalimahapps/vue-icons/re'
import { BsLightningChargeFill } from '@kalimahapps/vue-icons/bs'
import { useRouter } from 'vue-router'
import { FILE_PROVIDER2 } from '@/config/appConfig';

defineProps({
    hall: Object,
    place: Object,
    toggleHall: Function
})

const router = useRouter()
</script>

<template>
    
    <div class="mx-auto w-64 mb-2 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
        <div class="flex-1 flex flex-col p-3">
            
            <img class="w-32 h-32 flex-shrink-0 mx-auto rounded-full" :src="FILE_PROVIDER2+hall.imgUrl" alt="" />
            <h3 class="mt-6 text-gray-900 text-sm font-medium">{{ hall.title }}</h3>
            <dl class="mt-1 flex-grow flex flex-col justify-between">
                <dt class="sr-only">شهر</dt>
                <dd class="text-gray-500 text-sm">{{ place.address?.split(',')[0] }}</dd>
                <dt class="sr-only">وضعیت</dt>
                <dd class="mt-3">
                    <span v-if="!hall.isDeleted" class="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">فعال</span>
                    <span v-else class="px-2 py-1 text-red-800 text-xs font-medium bg-red-100 rounded-full">غیرفعال</span>
                </dd>
            </dl>
        </div>
        <div>
            <div class="-mt-px flex justify-around py-2">
                <button @click.prevent="router.push({ name: 'editHall', params: { hallId: hall.id } })" class="w-fit flex items-center text-white text-sm justify-around rounded px-2 py-1 bg-orange-600 shadow-sm hover:shadow-md"><RePencilLine />ویرایش</button>
                <button v-if="!hall.isDeleted" @click.prevent="toggleHall(hall.id)" class="w-fit flex items-center text-white text-sm justify-around rounded px-2 py-1 bg-red-400 shadow-sm hover:shadow-md"><BsLightningCharge />غیرفعال</button>
                <button v-else @click.prevent="toggleHall(hall.id)" class="w-fit flex items-center text-white text-sm justify-around rounded px-2 py-1 bg-green-400 shadow-sm hover:shadow-md"><BsLightningChargeFill />فعال</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
