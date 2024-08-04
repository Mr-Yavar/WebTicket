<template>
    <div class="mx-auto my-2 text-center" v-tippy="{ content: '.در این زمان شما فرصت دارید تا خرید خود را نهایی کنید' }">
        <vue-countdown v-show="GetUserTempoReservation.data.value?.amount != -1 && GetUserTempoReservation.data.value?.tickets.length !== 0" :time="expirationTimeOut" v-slot="{ minutes, seconds }">مدت زمان باقیمانده : {{ minutes.toString().padStart(2, '0') }}:{{ seconds.toString().padStart(2, '0') }} </vue-countdown>
    </div>

    {{ route }}
    <ControlSteps :to-next="onNext" :to-previous="onPreviuos">
        <template #nextBtn>
            <button v-if="!GetUserTempoReservation.isError.value && (GetUserTempoReservation.data.value?.amount != -1 && GetUserTempoReservation.data.value?.tickets.length !== 0)" class="select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" @click.prevent="onNext">پرداخت</button>
            <span v-else></span>
        </template>
    </ControlSteps>
</template>
<script setup>
import { Guid } from '@/config/helper'
import { sendRequest } from '@/services/service'
import useTicketStore from '@/stores/Ticket.js'
import SelectedTicket from '@/views/components/Pages/Event/SelectedTicket.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ControlSteps from './Steps/controlSteps.vue'
import useUserStore from '@/stores/user'
import { CRPlacesService } from '@/services/PlacesService'
import useSeatMapStore from '@/stores/seatMap'
import VueCountdown from '@chenfengyuan/vue-countdown'

const props = defineProps({
    stepControls: Object,
    toNext: Function,
    toPrevious: Function
})

const route = useRoute()

const TicketStore = useTicketStore()
const seatMapService = useSeatMapStore()

const userStore = useUserStore()
const { mutate } = useMutation({
    mutationKey: ['Reservation'],
    mutationFn: CRPlacesService
})

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
    refetchInterval:false,
    enabled: true
})

const amount = computed(() => (GetUserTempoReservation.data.value?.amount > 0 ? GetUserTempoReservation.data.value?.amount : 0))
const expirationTimeOut = computed(() => (new Date(GetUserTempoReservation.data.value?.expirationDate) - new Date() > 0 ? new Date(GetUserTempoReservation.data.value?.expirationDate) - new Date() : 0))


const ChosenEvent = computed(() => Guid({}).fromCompressedToFull(route.params.eventId))
watch([GetUserTempoReservation.data], () => {
    if (!GetUserTempoReservation.data) return

    TicketStore.removeAllTickets()
    GetUserTempoReservation.data.value?.tickets.forEach((ticket) => {
        TicketStore.addToTicket(ticket)
    })
})



const concert = computed(() => GetSpecificConcertServiceCall.data.value)


function onNext() {}

async function onPreviuos() {
    await mutate(
        {
            url: '/api/Concerts/RemoveFromResevation?api-version=1.0',
            body: JSON.stringify(GetUserTempoReservation.data.value.tempReservationId),
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + userStore.accessToken
            }
        },
        {
            onSuccess: async (data) => {
                try {
                    await seatMapService.notifyUnLockTickets()
                } catch (e) {
                    return false
                }

                await seatMapService.JoinGroup(ChosenEvent.value)

                props.toPrevious()
            }
        }
    )
}
</script>
<style scoped></style>
