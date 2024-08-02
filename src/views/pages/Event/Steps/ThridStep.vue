<template>
    <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
        <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
        <div v-if="TicketStore.Tickets.length === 0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">هیچ بلیتی انتخاب نشده است!</div>
        <SelectedTicket :concertTitle="concert?.title" v-for="(item, index) in GetUserTempoReservation.data.value?.tickets" :has-delete="false" :index="index + 1" :seatInfo="item" :key="item.id" />
    </div>
    <div class="grid md:grid-cols-2 grid-cols-1 mt-4 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
        <div class="col-span-full dark:text-gray-200 text-black font-bold">صورتحساب:</div>
        <div class="col-span-1 rtl:!text-right text-left dark:text-gray-200 text-black">
            <p class="leading-10">
                <span class="!text-sm font-bold">مبلغ قابل پرداخت : </span>
                <span :class="{ strikethrough: usedDiscount!=='' }">{{ GetUserTempoReservation.data.value?.amount ?? '-' }} تومان</span>
                <span v-if="usedDiscount!==''" class="px-3">{{ discountPrice }} تومان</span>
            </p>
        </div>
        <div v-if="usedDiscount!==''" class="col-span-1 rtl:!text-right text-left dark:text-gray-200 text-black">
            <p class="leading-10">
                <span class="!text-sm font-bold">تخفیف اعمال شده : </span>
                <span class="">{{ discountPrice }} تومان</span>
                <span class="px-3 text-red-700" title="حذف تخفیف" @click.prevent="usedDiscount=''">X</span>
            </p>
        </div>
        <div v-else class="col-span-1 flex rtl:!text-right text-left dark:text-gray-200 text-black text-md font-bold">
            <span class="leading-10 pl-3">کد تخفیف : </span>
            <span>
                <div class="flex !justify-between">
                    <div class="relative w-fit">
                        <div class="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 left-3 -translate-y-2/4">
                            <v-icon aria-hidden="true" name="md-discount-twotone"></v-icon>
                        </div>
                        <input class="h-10 rounded-[7px] rtl:fa-font !border !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50" placeholder="کد تخفیف ..." type="text" v-model="discount" />
                    </div>
                    <div class="w-fit px-2 self-center">
                        <button class="select-none rounded-lg bg-gray-900 py-2.5 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" @click.prevent="useDiscount">اعمال کد</button>
                    </div>
                </div>
            </span>
        </div>
    </div>

    <ControlSteps :to-next="onNext" :to-previous="onPreviuos" />
</template>
<script setup>
import { Guid } from '@/config/helper'
import { sendRequest } from '@/services/service'
import useTicketStore from '@/stores/Ticket.js'
import SelectedTicket from '@/views/components/Pages/Event/SelectedTicket.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ControlSteps from './controlSteps.vue'
import useUserStore from '@/stores/user'
import { CRPlacesService } from '@/services/PlacesService'
import useSeatMapStore from '@/stores/seatMap'
const props = defineProps({
    stepControls: Object,
    toNext: Function,
    toPrevious: Function
})

const route = useRoute()

const TicketStore = useTicketStore()
const seatMapService = useSeatMapStore()
const usedDiscount = ref('')

const userStore = useUserStore()
const { mutate } = useMutation({
    mutationKey: ['Reservation'],
    mutationFn: CRPlacesService
});

const GetSpecificConcertServiceCallKey = computed(() => ['/api/Concerts/GetConcertInfo/', route?.params?.id && Guid({}).fromCompressedToFull(route?.params?.id)])
const GetSpecificConcertServiceCall = useQuery({
    queryKey: GetSpecificConcertServiceCallKey,
    queryFn: async ({ queryKey }) => {
        return sendRequest({
            url: queryKey.join(''),
            method: 'Get'
        })
    },

    enabled: true
})

const GetUserTempoReservation = useQuery({
    queryKey: ['/api/Concerts/GetReservation'],
    queryFn: async ({ queryKey }) => {
        return sendRequest({
            url: queryKey.join(''),
            method: 'Get',
            headers: {
                Authorization: 'Bearer ' + userStore.accessToken
            }
        })
    },
    enabled: true
})
const discount = ref('')
const discountKey = computed(() => ['/api/Billing/GetDiscount/', discount])
const GetDiscount = useQuery({
    queryKey: discountKey,
    queryFn: async ({ queryKey }) => {
        return sendRequest({
            url: queryKey.join(''),
            method: 'Get',
            headers: {
                Authorization: 'Bearer ' + userStore.accessToken
            }
        })
    },
    enabled: false
})
const ChosenEvent = computed(() => Guid({}).fromCompressedToFull(route.params.eventId))
watch([GetUserTempoReservation.data], () => {
    if (!GetUserTempoReservation.data) return

    TicketStore.removeAllTickets()
    GetUserTempoReservation.data.value?.tickets.forEach((ticket) => {
        TicketStore.addToTicket(ticket)
    })
})

async function useDiscount() {
    const { data } = await GetDiscount.refetch()
    console.log(data,data.isActive,new Date(data.expirationDate),new Date());
    if (data != null && data.isActive && new Date(data.expirationDate) > new Date()) {
        usedDiscount.value = data.id;
        console.log(usedDiscount.value);
    }


}

const concert = computed(() => GetSpecificConcertServiceCall.data.value)

const discountPrice = computed(() => {
    let res = GetUserTempoReservation.data.value?.amount;

    if(!GetDiscount.data.value && usedDiscount.value=="")
    return res;

    if (GetDiscount.data.value.percentage == null && GetDiscount.data.value.maxDiscount != null) {
        res = GetUserTempoReservation.data.value.amount - GetDiscount.data.value.maxDiscoun
        res = res < 0 ? 0 : res;
    }else if (GetDiscount.data.value.percentage != null && GetDiscount.data.value.maxDiscount == null) {
        let tempDis = GetUserTempoReservation.data.value.amount * GetDiscount.data.value.percentage /100;

        res = GetUserTempoReservation.data.value.amount - tempDis;
        res = res < 0 ? 0 : res;
    }else{
        let tempDis = GetUserTempoReservation.data.value.amount * GetDiscount.data.value.percentage /100;
        tempDis = tempDis > GetDiscount.data.value.maxDiscount ?  GetDiscount.data.value.maxDiscount : tempDis;
        res = GetUserTempoReservation.data.value.amount - tempDis;
        res = res < 0 ? 0 : res;
    }

    return res;
});

function onNext(){

}

async function onPreviuos(){

    await mutate(
        {
            url: '/api/Concerts/RemoveFromResevation?api-version=1.0',
            body: JSON.stringify({
                concertId: Guid({}).fromCompressedToFull(route.params.id),
                eventId: Guid({}).fromCompressedToFull(route.params.eventId),
                ticketIds: [...TicketStore.Tickets.map((x) => x.id)]
            }),
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization'  : "Bearer "+userStore.accessToken
            }
        },
        {
            onSuccess: async (data) => {

                try {
                    await seatMapService.notifyUnLockTickets()
                } catch (e) {
                    return false
                }

                await seatMapService.JoinGroup(ChosenEvent);

                props.toPrevious();
            }
        }
    );

}
</script>
<style scoped></style>
