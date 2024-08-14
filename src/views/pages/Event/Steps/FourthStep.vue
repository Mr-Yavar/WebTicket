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
        <button class="btn btn-sm btn-primary" @click.prevent="GoToHome">بازگشت به صفحه اصلی</button>
    </div>
</template>
<script setup>
import { VueToPrint } from 'vue-to-print'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import { sendRequest } from '@/services/service'
import useUserStore from '@/stores/user'
import TicketForPrint from '@/views/components/Pages/Event/TicketForPrint.vue'
import { useQuery } from '@tanstack/vue-query'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/scrollbar'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import required modules
import { Scrollbar, Navigation, Pagination, Thumbs } from 'swiper/modules'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { Guid } from '@/config/helper'

const router = useRouter()
const userStore = useUserStore()
function GoToHome() {
    router.push({
        name: 'home'
    })
};

const route = useRoute();
const reservationId = computed(()=>Guid({}).fromCompressedToFull(route.params.reservationId));
const GetUserReservation = useQuery({
    queryKey: ['/api/Concerts/GetUserReservation/',reservationId.value],
    queryFn: async ({ queryKey }) => {
        return sendRequest({
            url: queryKey.join(''),
            method: 'Get',
            headers: {
                Authorization: 'Bearer ' + userStore.accessToken
            }
        })
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: !!reservationId.value
});

const data = computed(()=>{
    return GetUserReservation.data.value?.seats.map((seat)=>{
        const [floor,row,column] = seat.name.replace("f","").replace("r","").replace("c","").split("_");
        return {
            id:seat.id,
            floor : GetUserReservation.data.value.eventInfo.floors.find(x=>x.displayOrder==floor)?.title,
            row,
            column,
            amount : seat.price,
            hall : GetUserReservation.data.value.hall.name,
            place : {
                 ...GetUserReservation.data.value.place
                
            },
            OwnerName : userStore.FullName,
            concert : {
                ...GetUserReservation.data.value.concertInfo
            },
            event : {
                executionDate:GetUserReservation.data.value.eventInfo.executionDate
            }
        };

    })
});
</script>
<style scoped></style>
