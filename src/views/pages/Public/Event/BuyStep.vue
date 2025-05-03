<template>
    <div class="mx-auto my-2 text-center" v-tippy="{ content: '.در این زمان شما فرصت دارید تا خرید خود را نهایی کنید' }">
        <vue-countdown v-show="GetUserTempoReservation.data.value?.amount != -1 && GetUserTempoReservation.data.value?.tickets.length !== 0 && resultOfVerify?.result?.success !== true" :time="expirationTimeOut" v-slot="{ minutes, seconds }">مدت زمان باقیمانده : {{ minutes.toString().padStart(2, '0') }}:{{ seconds.toString().padStart(2, '0') }} </vue-countdown>
    </div>

    <template v-if="!DataToVerify">
        <SwalWarningIcon />
        <p class="text-center my-2">اطلاعات پرداخت ناقص است!</p>
        <div class="mx-auto w-fit mt-12 grid grid-cols-3 gap-2">
            <button class="btn btn-sm btn-primary col-start-2" @click.prevent="GoToHome">بازگشت به صفحه اصلی</button>
        </div>
    </template>
    <template v-else-if="isPending">
        <PrSpinner class="animate-spin block w-full mx-auto text-3xl" />
    </template>
    <template v-else-if="!resultOfVerify.result.success">
        <SwalErrorIcon />
        <p class="text-center my-2 w-full">{{ resultOfVerify.result.message }}</p>
        <div class="mx-auto w-fit mt-12 grid gap-2" :class="{ 'grid-cols-2': expirationTimeOut != 0, 'grid-cols-1': expirationTimeOut == 0 }">
            <button class="btn btn-sm btn-info" v-show="expirationTimeOut != 0" @click.prevent="GoToThridStep">بازگشت به مرحله 3</button>
            <button class="btn btn-sm btn-primary" @click.prevent="GoToHome">بازگشت به صفحه اصلی</button>
        </div>
    </template>
    <template v-else-if="resultOfVerify.result.success">
        <SwalSuccessIcon />
        <p class="text-center my-2 w-full relative bottom-0">{{ resultOfVerify.result.message }}</p>
        <div class="mx-auto w-fit mt-12 grid grid-cols-2 gap-2">
            <button class="btn btn-sm btn-primary" @click.prevent="GoToHome">بازگشت به صفحه اصلی</button>
            <button class="btn btn-sm btn-info" @click.prevent="GoToFourthStep">مشاهده بلیت‌ها</button>
        </div>
    </template>

    <ControlSteps :to-next="onNext" :to-previous="onPreviuos" v-show="!!resultOfVerify.result.success">
        <template #previousBtn v-if="resultOfVerify.result.success"><span></span></template>
        <template #nextBtn><span></span></template>
    </ControlSteps>
</template>
<script setup>
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import { Guid } from '@/config/helper'
import useTicketStore from '@/stores/Ticket.js'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ControlSteps from './Steps/controlSteps.vue'
import useSeatMapStore from '@/stores/seatMap'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { payServices } from '@/config/PayServices'
import { reactive } from 'vue'
import SwalWarningIcon from '@/global/SwalIcons/SwalWarningIcon.vue'
import SwalErrorIcon from '@/global/SwalIcons/SwalErrorIcon.vue'
import SwalSuccessIcon from '@/global/SwalIcons/SwalSuccessIcon.vue'
import { BillingQueryKeys, post_apiBillingVerify } from '@/api/BillingService'
import { ConcertsQueryKeys, get_apiConcertsGetReservation } from '@/api/ConcertsService'

defineProps({
    stepControls: Object,
    toNext: Function,
    toPrevious: Function
})

const route = useRoute()

const TicketStore = useTicketStore()
const seatMapService = useSeatMapStore()

const VerifyMutation = useMutation({
    mutationKey: [BillingQueryKeys.post_apiBillingVerify],
    mutationFn: post_apiBillingVerify,
    onSuccess: async (data) => {
        console.log(data)
        resultOfVerify.result = { ...data }
        if (data.success) {
            await seatMapService.notifyReservedTickets()
            await TicketStore.removeAllTickets()
        }
    }
})
console.log(VerifyMutation);
const isPending = computed(() => VerifyMutation.isPending.value)

// const GetSpecificConcertServiceCallKey = computed(() => ['/api/Concerts/GetConcertInfo/', route?.params?.id && Guid({}).fromCompressedToFull(route?.params?.id)]);
// const GetSpecificConcertServiceCall = useQuery({
//     queryKey: GetSpecificConcertServiceCallKey,
//     queryFn: async ({ queryKey }) => {
//         return sendRequest({
//             url: queryKey.join(''),
//             method: 'Get'
//         })
//     },
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     refetchInterval: false,
//     enabled: true
// });

const GetUserTempoReservation = useQuery({
    queryKey: [ConcertsQueryKeys.get_apiConcertsGetReservation],
    queryFn: get_apiConcertsGetReservation,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: true
})

watch([GetUserTempoReservation.data], () => {
    if (!GetUserTempoReservation.data) return

    TicketStore.removeAllTickets()
    GetUserTempoReservation.data.value?.tickets.forEach((ticket) => {
        TicketStore.addToTicket(ticket)
    })
})

//const amount = computed(() => (GetUserTempoReservation.data.value?.amount > 0 ? GetUserTempoReservation.data.value?.amount : 0));
const expirationTimeOut = computed(() => (new Date(GetUserTempoReservation.data.value?.expirationDate) - new Date() > 0 ? new Date(GetUserTempoReservation.data.value?.expirationDate) - new Date() : 0))

//const concert = computed(() => GetSpecificConcertServiceCall.data.value)
//const ChosenEvent = computed(() => Guid({}).fromCompressedToFull(route.params.eventId))
//const ChosenConcert = computed(() => Guid({}).fromCompressedToFull(route.params.id))
const transactionId = computed(() => Guid({}).fromCompressedToFull(route.params.txId))

const resultOfVerify = reactive({ result: {} })

const DataToVerify = computed(() => {
    switch (route.params.payService) {
        case payServices['-1']:
            return {
                refId: '',
                clientrefid: transactionId.value,
                payService: -1
            }

        case payServices['0']:
            return {
                refId: route.query.refid,
                clientrefid: transactionId.value,
                payService: 0
            }

        case payServices['1']:
            if (route.query.Status === 'NOK') return true
            return {
                refId: route.query.Authority,
                clientrefid: transactionId.value,
                payService: 1
            }
        case payServices['2']:
            return {
                refId: route.query.trackId,
                clientrefid: transactionId.value,
                payService: 1
            }
        default:
            return true
    }
})

watchEffect(async () => {
    console.log(DataToVerify.value)
    if (!DataToVerify.value) return
    if (DataToVerify.value === true) {
        resultOfVerify.result = {
            success: false,
            message: 'پرداخت ناموفق'
        }
        return
    }

    resultOfVerify.result = await VerifyMutation.mutate(DataToVerify.value)
})

function GoToHome() {
    router.push({
        name: 'home'
    })
}

function GoToThridStep() {
    router.push({
        name: 'event2',
        params: {
            ...route.params
        }
    })
}

function GoToFourthStep() {
    console.log(resultOfVerify)
    router.push({
        name: 'event3',
        params: {
            ...route.params,
            reservationId: Guid({}).fromFullToCompressed(resultOfVerify.result.reservationId)
        }
    })
}

function onNext() {
    if (isPending.value) return
}
const router = useRouter()
async function onPreviuos() {
    router.push({
        name: 'event3',
        params: {
            ...route.params
        }
    })

    return true
}
</script>
<style scoped></style>
