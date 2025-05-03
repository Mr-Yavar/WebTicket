<template>
  

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

    <div class="mx-auto w-fit mt-12 grid grid-cols-2 gap-2">
        <button class="btn btn-sm btn-dark" @click.prevent="GoToHome">بازگشت به صفحه اصلی</button>
        <vue-to-print :content="getComponentToPrint" document-title="تیکتها" :copy-styles="true" :body-class="'vazir-font direction-rtl w-full'">
                <template #trigger>
                    <button class="btn btn-sm btn-dark w-fit">🖨️</button>
                </template>
            </vue-to-print>
    </div>
</template>
<script setup>
import useUserStore from '@/stores/user'
import TicketForPrint from '@/views/pages/Public/components/TicketForPrint.vue'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import { useQuery } from '@tanstack/vue-query'
import { VueToPrint } from 'vue-to-print'

import { ConcertsQueryKeys, get_apiConcertsGetUserReservation } from '@/api/ConcertsService'
import { Guid } from '@/config/helper'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
function GoToHome() {
    router.push({
        name: 'home'
    })
}
const componentRef = ref()
const getComponentToPrint = () => {
    return componentRef.value
}
const route = useRoute()
const reservationId = computed(() => Guid({}).fromCompressedToFull(route.params.reservationId))

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
            reservationId: GetUserReservation.data.value?.reservationId
        }
    })
})
</script>
<style scoped></style>
