<template>
    <div class="grid grid-cols-4">
        <div class="my-2 mx-1 flex flex-row">
            <vue-to-print :content="getComponentToPrint" document-title="تیکتها" :copy-styles="true" :body-class="'vazir-font direction-rtl w-full'">
                <template #trigger>
                    <button class="items-center px-2 py-1 w-fit border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">چاپ</button>
                </template>
            </vue-to-print>
        </div>
        <div class="my-2 mx-1 flex flex-row-reverse col-span-1 col-start-4">
            <button @click="router.push({ name: 'MyReservations' })" class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><CiCircleChevLeft class="scale-125 font-bold" /></button>
        </div>
    </div>

    <div v-if="GetUserReservation.isLoading.value">
        <PrSpinner class="animate-spin block w-full mx-auto text-3xl mt-8" />
    </div>
    <template v-else>
        <PerfectScrollbar>
            <div ref="componentRef">
                <template v-for="ticket in data" :key="ticket.id">
                    <div class="my-1">
                        <TicketForPrint :ticket="ticket" />
                    </div>
                </template>
            </div>
        </PerfectScrollbar>
    </template>
</template>
<script setup>
import useUserStore from '@/stores/user'
import TicketForPrint from '@/views/pages/Public/components/TicketForPrint.vue'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import { useQuery } from '@tanstack/vue-query'
import { VueToPrint } from 'vue-to-print'
import { ConcertsQueryKeys, get_apiConcertsGetUserReservation } from '@/api/ConcertsService'
import { Guid } from '@/config/helper'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
const componentRef = ref()
const getComponentToPrint = () => {
    return componentRef.value
}
const router = useRouter()
const userStore = useUserStore()

const route = useRoute()

const reservationId = computed(() => route.params.reservationId && Guid({}).fromCompressedToFull(route.params.reservationId))

const GetUserReservation = useQuery({
    queryKey: [ConcertsQueryKeys.get_apiConcertsGetUserReservation(reservationId.value)],
    queryFn: () => get_apiConcertsGetUserReservation(reservationId.value),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: !!reservationId.value
})

const data = computed(() => {
    return GetUserReservation.data.value?.seats.map((seat) => {
        const [floor, row, column] = seat.name.replace('f', '').replace('r', '').replace('c', '').split('_')
        return {
            id: seat.id,
            floor: GetUserReservation.data.value.eventInfo.floors.find((x) => x.displayOrder == floor)?.title,
            row,
            column,
            amount: seat.price,
            hall: GetUserReservation.data.value.hall.name,
            place: {
                ...GetUserReservation.data.value.place
            },
            OwnerName: userStore.FullName,
            concert: {
                ...GetUserReservation.data.value.concertInfo
            },
            event: {
                executionDate: GetUserReservation.data.value.eventInfo.executionDate
            },
            reservationId:reservationId.value
        }
    })
})
</script>
<style scoped>
.ps {
    height: calc(100dvh - 200px);
}
</style>
