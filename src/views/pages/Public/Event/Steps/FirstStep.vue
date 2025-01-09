<template>
    <div>
        <div class="relative mb-3 overflow-hidden rounded-lg">
            <div class="w-full bg-transparent event-cover">
                <img class="w-full rounded-lg h-fit" :src="fileUrl + concert?.poster" border="0" />
                <h1 class="absolute z-10 font-bold text-white bg-transparent rounded-md bg-none bottom-2 right-2">کنسرت {{ concert?.title }}</h1>
            </div>
        </div>
        <div class="w-full rounded-lg md:!text-base sm:!text-sm !text-xs">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="col-span-1">
                    <div class="flex">
                        <div>
                            <span class="p-1 text-center align-text-bottom">
                                <v-icon name="px-calendar-tomorrow" scale="1" class="leading-6 text-black dark:text-white" />
                            </span>
                            <span class="pl-1 font-bold leading-6 text-black dark:text-white">زمان :</span>
                        </div>
                        <div class="leading-6 text-black dark:text-white">{{ eventsDate['dates']?.join(', ') }}</div>
                    </div>
                </div>
                <div class="col-span-1">
                    <div class="flex">
                        <div>
                            <span class="p-1 text-center">
                                <v-icon name="px-clock" scale="1" class="leading-6 text-black dark:text-white" />
                            </span>
                            <span class="pl-1 font-bold leading-6 text-black dark:text-white">ساعت :</span>
                        </div>
                        <div class="leading-6 text-black dark:text-white">{{ eventsDate['times']?.join(' و ') }}</div>
                    </div>
                </div>

                <div class="col-span-full">
                    <div class="flex">
                        <div class="">
                            <span class="p-1 text-center align-text-bottom">
                                <v-icon name="px-gps" scale="1" class="leading-6 text-black dark:text-white" />
                            </span>
                            <span class="pl-1 font-bold leading-6 text-black dark:text-white">محل برگزاری :</span>

                            <span class="leading-6 text-black dark:text-white">{{ concert?.place.name }}</span>
                            <span class="inline-block h-6 leading-6 inline-step"></span>
                            <span class="leading-6 text-black dark:text-white">{{ concert?.place.address }}</span>
                        </div>
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2">
                    <div class="h-[250px]">
                        <MapComponent
                            class="rounded-lg"
                            :map-setter="
                                (map) => {
                                    handleStartMap(map)
                                }
                            "
                            :options="{
                                mapKey: mapKey,
                                mapType: MapTypes.neshanRaster,
                                isTouchPlatform: true,
                                mapTypeControllerOptions: { show: false, position: 'top-right' },
                                poi: true
                            }"
                        />
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2">
                    <div class="inline-flex items-center">
                        <label class="relative flex items-center p-3 rounded-full cursor-pointer" for="link">
                            <input v-model="termsAgreed" type="checkbox" class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10" id="link" />
                            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <v-icon class="relative top-0.5" name="hi-solid-check-circle" />
                            </span>
                        </label>
                        <label class="mt-px font-light text-gray-700 cursor-pointer select-none" for="link">
                            <p class="flex font-sans antialiased font-medium leading-relaxed text-blue-gray-900 md:!text-base !text-sm">
                                با
                                <a @click.prevent="() => toggleTermsModal()" href="#" class="block font-sans antialiased font-medium leading-relaxed text-blue-500 transition-colors hover:text-blue-700"> &nbsp;شرایط و قوانین کنسرت &nbsp; </a>
                                موافقم.
                            </p>
                        </label>
                    </div>
                    <ConcertTermsModal :show="showTermsModal" :on-close-fn="toggleTermsModal" />
                </div>

                <div class="col-span-1 md:col-span-2">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2" v-if="termsAgreed">
                        <div class="col-span-full">
                            <span class="font-bold text-black dark:text-white">بلیت های موجود:</span>
                        </div>

                        <Ticket
                            v-for="event in concert?.events.items"
                            :concertTitle="concert.title"
                            :event="event"
                            :key="event.eventId"
                            :handleClick="
                                () => {
                                    seatMap.JoinGroup(event.eventId)
                                    TicketStore.setSelectedShowing(event.eventId)
                                    $router.push({
                                        name: 'event1',
                                        params: {
                                            ...$route.params,
                                            eventId: Guid({}).fromFullToCompressed(event.eventId)
                                        }
                                    })
                                }
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Ticket from '@/views/components/Pages/Event/Ticket.vue'

import { MapComponent, MapTypes } from '@neshan-maps-platform/mapbox-gl-vue'
import '@neshan-maps-platform/mapbox-gl-vue/dist/style.css'
import { computed, onMounted, ref, watchEffect } from 'vue'
import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl'
import useTicketStore from '@/stores/Ticket.js'
import useSeatMapStore from '@/stores/seatMap.js'
import { useQuery } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { Guid } from '@/config/helper'
import { FILE_PROVIDER2, MAP_API } from '@/config/appConfig'
import ConcertTermsModal from '@/global/modal/ConcertTermsModal.vue'
import { reactive } from 'vue'
import { ConcertsQueryKeys, get_apiConcertsGetSpecificConcert } from '@/api/ConcertsService'

export default {
    components: { ConcertTermsModal, Ticket, MapComponent },
    props: { stepControls: Object, toNext: Function, toPrevious: Function },
    setup: () => {
        const mapKey = ref(MAP_API)
        const fileUrl = ref(FILE_PROVIDER2)
        const route = useRoute()

        const GetSpecificConcertServiceCallKey = computed(() => [ConcertsQueryKeys.get_apiConcertsGetSpecificConcert(route?.params?.id && Guid({}).fromCompressedToFull(route?.params?.id))])
        const GetSpecificConcertServiceCall = useQuery({
            queryKey: GetSpecificConcertServiceCallKey,
            queryFn: () => get_apiConcertsGetSpecificConcert(route?.params?.id && Guid({}).fromCompressedToFull(route?.params?.id)),

            enabled: true
        })

        const concert = computed(() => GetSpecificConcertServiceCall.data.value?.concerts[0])

        const seatMap = useSeatMapStore()

        const eventsDate = computed(() => {
            let DateTimes = concert.value?.events.items.map((e) => new Date(e.executionDate))

            let res = {}

            res['dates'] = DateTimes?.reduce((acc, item) => {
                acc.push(item.toLocaleString('fa-ir', { day: '2-digit', month: 'long', weekday: 'long' }))
                return acc
            }, [])

            res['times'] = DateTimes?.reduce((acc, item) => {
                let time = item.toLocaleString('fa-ir', { hour: '2-digit', minute: '2-digit', hour12: false })
                if (acc.indexOf(time) === -1) acc.push(time)
                return acc
            }, []).sort()

            return res
        })

        const TicketStore = useTicketStore()

        const termsAgreed = ref(false)

        const showTermsModal = ref(false)

        function toggleTermsModal() {
            console.log(showTermsModal.value)
            showTermsModal.value = !showTermsModal.value
        }
        const neshanMap = reactive({ map: null })
        const marker = new nmp_mapboxgl.Marker({
            color: 'black',
            title: 'محل برگزاری',
            draggable: false
        }).setLngLat([51.375, 35.7449])

        function handleStartMap(map) {
            map.fitBounds(map.getBounds(), {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                center: [51.375, 35.7449],
                maxZoom: 20,
                zoom: 15,
                minZoom: 7,
                animate: true,
                around: [51.375, 35.7449]
            })

            neshanMap.map = map
            //marker.setLngLat([concert.value.place.lng ,concert.value.place.lat]);
            // marker.addTo(map)
        }

        watchEffect(() => {
            if (!neshanMap.map) return

            marker.setLngLat([concert.value.lng, concert.value.lat])
            marker.addTo(neshanMap.map)
            neshanMap.map.flyTo({ center: [concert.value.lng, concert.value.lat], zoom: 14 })
        })

        onMounted(() => {
            seatMap.LeaveGroup()
        })

        const router = useRouter()

        return { concert, router, route, seatMap, handleStartMap, toggleTermsModal, termsAgreed, TicketStore, eventsDate, MapTypes, Guid, fileUrl, mapKey, showTermsModal }
        // same as beforeRouteUpdate option but with no access to `this`
    }
}
</script>
<style scoped></style>
