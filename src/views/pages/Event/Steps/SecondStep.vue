<template>
    <div>
        <div class="text-md text-black dark:text-gray-100 md:!text-right text-center">کنســــرت <span class="font-extrabold text-xl">ماکان بند</span></div>
        <div class="grid grid-cols-1 md:grid-cols-2 md:!text-right text-center gap-2">
            <div class="text-black dark:text-gray-100 mt-2 px-3">
                <p>
                    <v-icon class="dark:text-white text-black" name="px-calendar-tomorrow" scale="1" />
                    <span class="font-bold text-md"> تاریخ : </span> <span>1402/02/03</span>
                </p>
                <p>
                    <v-icon class="dark:text-white text-black" name="px-clock" scale="1" />
                    <span class="font-bold text-md">ساعت : </span> <span>18:30 - 20:30</span>
                </p>
            </div>
            <div class="text-black dark:text-gray-100 mt-2 px-3">
                <v-icon class="dark:text-white text-black" name="px-gps" scale="1" />
                <span class="font-bold text-md"> مکان برگزاری : </span>
                <span>تهران ، .......</span>
            </div>

            <div class="col-span-full">
                <div class="p-2 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
                    <div class="tabs grid flex-end align-center tabs-boxed mb-2 !bg-gray-100 dark:bg-gray-600 !text-black dark:!text-white" role="tablist">
                        <template v-for="(floor, index) in Floors" :key="`tab` + floor">
                            <a :class="{ 'tab-active': tab === floor }" class="tab" role="tab" @click.prevent="changeTab(floor)">{{ floor }}</a>
                        </template>
                    </div>
                    <div class="body">
                        <div v-for="(map, index) in SeatMaps" :id="'mapElm' + index" :key="`tabcontent` + Floors[index]" :class="{ hidden: tab !== Floors[index] }" class="p-1 border-dark-600 border-2">
                            <div :id="'seatMap' + index" @click="handleClickOnSeat" :ref="(el) => panZoomInit(el, index)" class="w-full mx-auto mapContainer" v-html="map"></div>
                            <div class="flex justify-center">
                                <div>
                                    <button class="btn btn-sm bg-green-300 btnZoomIn text-base"><PxZoomIn /></button>
                                </div>
                                <div>
                                    <button class="btn btn-sm bg-green-300 btnZoomReset text-base"><FlFilledZoomFit /></button>
                                </div>
                                <div>
                                    <button class="btn btn-sm bg-green-300 btnZoomOut text-base"><PxZoomOut /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-6 w-full text-center text-gray-900 dark:text-gray-100">
                        <div class="">راهنما:</div>
                        <div class="mx-2"><span :class="TicketsTypes['free-tickets']" class="w-[10px] h-[10px] inline-block border border-black mx-1"></span>آزاد</div>
                        <div class="mx-2"><span :class="TicketsTypes['selected-tickets']" class="w-[10px] h-[10px] inline-block border border-black mx-1"></span>انتخاب شما</div>
                        <div class="mx-2"><span :class="TicketsTypes['waiting-tickets']" class="w-[10px] h-[10px] inline-block border border-black mx-1"></span>در انتظار پرداخت</div>
                        <div class="mx-2"><span :class="TicketsTypes['reserved-tickets']" class="w-[10px] h-[10px] inline-block border border-black mx-1"></span>رزرو شده</div>

                        <div class="mx-2">
                            <span :class="TicketsTypes['not-tickets']" class="w-[10px] h-[10px] inline-block border border-black mx-1"></span>
                            غیر قابل خرید
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 p-4 rounded-2xl shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
            <div class="col-span-full dark:text-gray-200 text-black font-bold">بلیت های انتخابی شما:</div>
            <div v-if="TicketStore.Tickets.length === 0" class="col-span-full text-center dark:text-gray-200 text-black text-md font-bold">هیچ بلیتی انتخاب نشده است!</div>
            <SelectedTicket :concertTitle="concert?.title" v-for="(item, key) in TicketStore.Tickets ?? []" :key="item.id" :handleDelete="() => handleClickOnDeleteSeat(item.id)" :has-delete="true" :index="item.id" :seatInfo="item" />
        </div>
    </div>

    <ControlSteps :to-next="onNext" :to-previous="onPreviuos" />
</template>

<script setup>
import 'vue-zoomable/dist/style.css'
import { FlFilledZoomFit } from '@kalimahapps/vue-icons/fl'
import { computed, ref, useCssModule, watch, watchEffect } from 'vue'
import SelectedTicket from '@/views/components/Pages/Event/SelectedTicket.vue'
import useTicketStore from '@/stores/Ticket.js'
import Panzoom from '@panzoom/panzoom'
import tippy from 'tippy.js'
import { Guid } from '@/config/helper'
import { useRafFn } from '@vueuse/core'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import ControlSteps from './controlSteps.vue'
import useUserStore from '@/stores/user'
import { useMutation, useQuery } from '@tanstack/vue-query'

import { GetSeatMapService, GetSpecificEventService } from '@/services/ConcertsService.js'
import useSeatMapStore from '@/stores/seatMap.js'
import Swal from 'sweetalert2'
import { onMounted } from 'vue'

const tab = ref(0)
const route = useRoute()
const TicketStore = useTicketStore()
const SeatMaps = ref([])
const TicketsTypes = useCssModule('TicketsTypes')
const ChosenEvent = computed(() => Guid({}).fromCompressedToFull(route.params.eventId))
const seatMapService = useSeatMapStore()
const GetSpecificEventServiceCall = useQuery({
    queryKey: ['/api/Concerts/GetSpecificEvent', ChosenEvent.value],
    queryFn: GetSpecificEventService,
    enabled: SeatMaps.value.length === 0,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
})
import { useAuthModalStore } from '@/stores/componentStore/authModal.js'
import { CRPlacesService } from '@/services/PlacesService'
const props = defineProps({
    stepControls: Object,
    concert: Object,
    toNext: Function,
    toPrevious: Function
})
const { mutate } = useMutation({
    mutationKey: ['Reservation'],
    mutationFn: CRPlacesService
})

const AuthModalStore = useAuthModalStore()
const userStore = useUserStore()
async function onNext() {
    if (!userStore.isAuthenticated && userStore.expireTime <= new Date()) {
        userStore.logOut();
        AuthModalStore.setTitle('برای ادامه حساب کاربری لازمه!');
        AuthModalStore.toggleMenu();

        return false
    }

    if (TicketStore.selectedShowing.length === 0) {
        Swal.fire({
            title: 'خطا جانم!',
            text: 'اینجا بدون انتخاب سانس چیکار میکنی؟',
            icon: 'info',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
        return false
    }

    if (TicketStore.Tickets.length === 0) {
        Swal.fire({
            title: 'خطا جانم!',
            text: 'حداقل یدونه بلیت انتخاب کن!',
            icon: 'info',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
        return false
    }

    await seatMapService.LeaveGroup()

    await mutate(
        {
            url: '/api/Concerts/AddToResevation?api-version=1.0',
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
                if(data.tempReservationId==null)
                return false;
            
                try {
                    await seatMapService.notifyLockTickets()
                } catch (e) {
                    return false
                }

                await seatMapService.LeaveGroup();

                props.toNext();
            }
        }
    );


}

async function onPreviuos() {
    if (TicketStore.Tickets.length !== 0) {
        const { isConfirmed } = await Swal.fire({
            title: 'سوال',
            html: 'با برگشتن به مرحله قبل بلیت های انتخاب شده حذف میشن!' + '<br/>' + 'از این عمل مطمئن هستی؟',
            icon: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'مطمئنم',
            cancelButtonText: 'لغو',
            customClass: {
                actions: 'flex justify-around w-full flex-row-reverse'
            },
            showClass: { popup: 'direction-rtl vazir-font ' }
        })

        if (!isConfirmed) {
            await seatMapService.LeaveGroup()
            return false
        }
    }
    TicketStore.removeAllTickets()

    props.toPrevious()
}

function changeTab(selectedTab) {
    tab.value = selectedTab
}

function handleClickOnSeat($event) {
    const regex = /f[0-9]{1,3}_r[0-9]{1,3}_c[0-9]{1,9}/gm

    if ($event.target.closest("[id*='seatMap']") !== null && $event.target.id.match(regex) !== null) {
        let ticketId = $event.target.getAttribute('tid')
        let Ticket = Tickets.value[currentFloor.value].filter((x) => x.id === ticketId)[0]

        //یعنی این تیکت در حالت قفل است
        if (seatMapService.Locked_Tickets.indexOf(ticketId) !== -1) return

        if (!$event.target.classList.contains(TicketsTypes['reserved-tickets']) && !$event.target.classList.contains(TicketsTypes['waiting-tickets']) && !$event.target.classList.contains(TicketsTypes['not-tickets'])) {
            if (!$event.target.classList.contains(TicketsTypes['selected-tickets'])) {
                let [floor, row, column] = $event.target.id.split('_')
                $event.target.classList.remove(TicketsTypes['free-tickets'])
                $event.target.classList.add(TicketsTypes['selected-tickets'])
                TicketStore.addToTicket({
                    ...Ticket,
                    floor,
                    row,
                    column
                })
            } else {
                handleClickOnDeleteSeat($event.target.getAttribute('tid'))
            }
        }
    }
}

function handleClickOnDeleteSeat(seatId) {
    TicketStore.removeTicket(seatId)
    document.querySelector("[tid='" + seatId + "']").classList.remove(TicketsTypes['selected-tickets'])
    document.querySelector("[tid='" + seatId + "']").classList.add(TicketsTypes['free-tickets'])
}

const Floors = computed(() => GetSpecificEventServiceCall.data.value?.events[0].floors.map((x) => x.title))

const Tickets = computed(() => {
    let res = {}

    GetSpecificEventServiceCall.data.value?.events[0].floors.forEach((floor) => {
        res[floor.displayOrder] = floor.seatsInfo.items
    })

    return res
})

const currentFloor = computed(() => GetSpecificEventServiceCall.data.value?.events[0].floors.filter((x) => x.title === tab.value)[0]?.displayOrder)
watchEffect(async () => {
    if (GetSpecificEventServiceCall.data.value?.events[0] !== undefined)
        for (let floor of GetSpecificEventServiceCall.data.value?.events[0]?.floors) {
            let res = await GetSeatMapService(floor.seatMap_url)

            let dom = new DOMParser()
            let tempDoc = dom.parseFromString(res, 'text/html')

            let CriticalIds = []
            tempDoc.body.querySelector('svg').classList.add('w-full', 'mx-auto')
            tempDoc.body.querySelectorAll('defs').forEach((def) => {
                def.querySelectorAll('[id]').forEach((item) => CriticalIds.push(item.id))
            })

            CriticalIds.forEach((id) => {
                let newId = id + '_' + floor.floorId
                tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll('id="' + id + '"', 'id="' + newId + '"')
                tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll('#' + id, '#' + newId)
            })

            // نوشتن آیدی های بلیت روی صندلی ها و در صورت رزرو بودن قفل کردن آنها
            Tickets.value[floor.displayOrder].forEach((item) => {
                let temp = tempDoc?.querySelector(`#${item.name}`)
                temp?.setAttribute('tid', item.id)
                if (item.isReserved) temp.classList.add(TicketsTypes['reserved-tickets'])
            })
            console.log(seatMapService.Locked_Tickets)
            //قفل کردن صندلی ها انتخاب شده و درحال پرداخت
            seatMapService.Locked_Tickets.forEach((item) => {
                let elem = tempDoc?.querySelector(`[tid='${item}']`);
                if(!elem)
                    return;

                   if(!elem.classList.contains(TicketsTypes['reserved-tickets']))
                        elem?.classList.add(TicketsTypes['waiting-tickets'])
            })

            tempDoc?.querySelectorAll(`*[id^="f"]:not([tid])`).forEach((item) => {
                item?.classList.add(TicketsTypes['not-tickets'])
            })

            //نوشتن صندلی ها انتخابی توسط کاربر
            TicketStore.Tickets.forEach((item) => {

                let elem = tempDoc?.querySelector(`[tid='${item.id}']`);
                if(!elem)
                    return;

                   if(!elem.classList.contains(TicketsTypes['reserved-tickets']))
                        elem?.classList.add(TicketsTypes['selected-tickets']);
            })

            let exception = Object.keys(TicketsTypes)
                .map((x) => TicketsTypes[x])
                .join(',.')
            tempDoc?.querySelectorAll(`*[id^="f"]:not(.${exception})`).forEach((seat) => {
                seat.classList.add(TicketsTypes['free-tickets'])
            })

            tempDoc.body.querySelector('svg').id = floor.floorId

            SeatMaps.value = [...SeatMaps.value, tempDoc.body.innerHTML]
        }
})

watch([seatMapService.Locked_Tickets], () => {
    console.log(seatMapService.Locked_Tickets)
    let userTicketsToLock = []
    let classesToRemove = Object.keys(TicketsTypes).map((x) => TicketsTypes[x])
    let tickets = TicketStore.Tickets.map((x) => x.id)
    seatMapService.Locked_Tickets.forEach((item) => {
        let chair =  document.querySelector(`[tid='${item}']`);
        if(!chair)
            return;

        if (tickets.indexOf(item) !== -1) {
            TicketStore.removeTicket(item)
            userTicketsToLock.push(item)
        }
        
        if(chair.classList.contains(TicketsTypes['reserved-tickets']))
        return;

        chair?.classList.remove(...classesToRemove)
        chair?.classList.add(TicketsTypes['waiting-tickets'])
    })

    if (userTicketsToLock.length !== 0) {
        let floors = Object.keys(Tickets.value)
        let msg = userTicketsToLock.map((ticket) => {
            for (let i = 0; i < floors.length; i++) {
                let temp = Tickets.value[floors[i]].filter((item) => {
                    return item.id === ticket
                })

                if (!!temp && temp.length === 1) {
                    let [floor, row, column] = temp[0].name.replace('f', '').replace('r', '').replace('c', '').split('_')

                    let txt = `<br/><p dir="rtl">${column}  ستون : ${row} ردیف : ${Floors.value[floors[i]]}  طبقه : `
                    txt += '   </p>'
                    return txt
                }
            }
        })

        Swal.fire({
            title: '',
            html: 'برخی از صندلیها انتخابی شما توسط شخص دیگری به مرحله پرداخت رفته اند!<br/>' + msg,
            icon: 'info',
            showConfirmButton: false,
            showCloseButton: true,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
    }
})
watch([seatMapService.UnLocked_Tickets], () => {
    seatMapService.UnLocked_Tickets.forEach((item) => {
        let chair = document.querySelector(`[tid='${item}']`)
        if (!!chair && chair.classList.contains(TicketsTypes['waiting-tickets'])) {
            chair.classList.remove(TicketsTypes['waiting-tickets'])
        }

        if(chair.classList.contains(TicketsTypes['reserved-tickets']))
            return;

        chair?.classList.add(TicketsTypes['free-tickets'])
    })
})

function panZoomInit(map, index) {
    if (!map || !document.querySelector('#seatMap' + index)) return

    if (map.getAttribute('setup')) return

    const pzoom = Panzoom(map, {
        maxScale: 5,

        cursor: 'default'
    })
    pzoom.pan(10, 10)
    pzoom.zoom(1, { animate: true })

    // Panning and pinch zooming are bound automatically (unless disablePan is true).
    // There are several available methods for zooming
    // that can be bound on button clicks or mousewheel.
    map.closest('#mapElm' + index)
        .querySelector('.btnZoomIn')
        .addEventListener('click', pzoom.zoomIn)
    map.closest('#mapElm' + index)
        .querySelector('.btnZoomOut')
        .addEventListener('click', pzoom.zoomOut)
    map.closest('#mapElm' + index).addEventListener('wheel', pzoom.zoomWithWheel)
    map.setAttribute('setup', 'true')
    map.querySelectorAll(`*[id^="f"][tid]`).forEach((item) => {
        let ticket = Tickets.value[currentFloor.value].find((x) => x.id === item.getAttribute('tid'))

        tippy(item, {
            allowHTML: true,
            onTrigger(instance, event) {
                let [floor, row, column] = item.id.split('_')
                instance.setContent(` <div class="direction-rtl vazir-font text-right">
                <p>طبقه : ${floor}</p>
                <p>ردیف : ${row}</p>
                <p>ستون :${column}</p>
                     <p>قیمت :${ticket.price} تومان</p>
                <p><span class="${instance.reference.className.baseVal} block text-center ">${tellMeStatus(instance.reference.className.baseVal)}</span> </p>
</div>`)
            }
        })
    })

    map.querySelectorAll(`*[id^="f"]:not([tid])`).forEach((item) => {
        let [floor, row, column] = item.id.split('_')

        tippy(item, {
            content: `
                <div class="direction-rtl vazir-font text-right">
                <p>طبقه : ${floor}</p>
                <p>ردیف : ${row}</p>
                <p>ستون :${column}</p>
                <p>قیمت : <span class="inline-block w-[20px] text-center">-</span> تومان</p>
                <p><span class="${item.className.baseVal} block text-center ">${tellMeStatus(item.className.baseVal)}</span> </p>
</div>
                `,
            allowHTML: true
        })
    })
}

watch(Floors, () => {
    let index = Floors.value.indexOf(tab.value)
    if (index === -1) tab.value = Floors.value[0]
})

watch([TicketStore.Tickets], () => {
    TicketStore.Tickets.forEach((item) => {
        document.querySelector(`[tid='${item.id}']`)?.classList.add(TicketsTypes['selected-tickets'])
    })
    document.querySelectorAll(`.${TicketsTypes['selected-tickets']}`).forEach((item) => {
        if (TicketStore.Tickets.filter((x) => x.id === item.getAttribute('tid'))[0] === undefined) {
            item.classList.remove(TicketsTypes['selected-tickets'])
            item.classList.add(TicketsTypes['free-tickets'])
        }
    })
})

onMounted(() => {
    seatMapService.notifyUnLockTickets()

    //TicketStore.removeAllTickets()

    if (TicketStore.selectedShowing.length === 0) {
        Swal.fire({
            title: 'خطا جانم!',
            text: 'اینجا بدون انتخاب سانس چیکار میکنی؟',
            icon: 'info',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
    }

    seatMapService.JoinGroup(ChosenEvent.value)

    if (!Floors.value) return
    tab.value = Floors.value[0]
})

function tellMeStatus(ticketType) {
    switch (ticketType) {
        case TicketsTypes['free-tickets']:
            return 'آزاد'
        case TicketsTypes['selected-tickets']:
            return 'انتخاب شما'
        case TicketsTypes['waiting-tickets']:
            return 'در انتظار پرداخت'
        case TicketsTypes['reserved-tickets']:
            return 'رزرو شده'
        case TicketsTypes['not-tickets']:
            return 'غیر قابل خرید'
    }
}
</script>

<style module="TicketsTypes">
.free-tickets {
    fill: #4eef4f !important;
    background-color: #4eef4f !important;
}

.selected-tickets {
    fill: #63dbfc !important;
    background-color: #63dbfc !important;
}

.reserved-tickets {
    fill: #e55039 !important;
    background-color: #e55039 !important;
}

.waiting-tickets {
    fill: #f6b93b !important;
    background-color: #f6b93b !important;
}

.not-tickets {
    fill: #0e0e0e !important;
    background-color: #0e0e0e !important;
}
</style>

<style scoped>
.tab {
    @apply w-full;
    position: relative;
    grid-row-start: 1;
    display: block;
    height: 2rem;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 2;

    @apply bg-transparent rounded-lg;
}

.tab-active {
    @apply dark:!text-white !text-white !bg-indigo-400;
}

.tabs {
    @apply bg-gray-50 p-1 rounded-md shadow-inner;
}

*[id*='seatMap'] svg {
    @apply !w-full mx-auto;
}
</style>
