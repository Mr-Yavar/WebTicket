<template>
    <div>
        <!-- سربرگ اطلاعات رویداد -->
        <div class="text-center text-black text-md dark:text-gray-100">
            کنســــرت <span class="text-xl font-extrabold">{{ GetConcertInfoService.data.value?.title }}</span>
        </div>
        <div class="grid grid-cols-1 gap-2 text-center">
            <div class="grid grid-cols-1 px-3 mt-2 text-black dark:text-gray-100 sm:grid-cols-2">
                <p>
                    <v-icon class="text-black dark:text-white" name="px-calendar-tomorrow" scale="1" />
                    <span class="font-bold text-md"> تاریخ : </span>
                    <span>{{ executionDate ? new Date(executionDate).toLocaleDateString('fa-ir') : '-' }}</span>
                </p>
                <p>
                    <v-icon class="text-black dark:text-white" name="px-clock" scale="1" />
                    <span class="font-bold text-md"> ساعت : </span>
                    <span>
                        {{
                            executionDate
                                ? new Date(executionDate).toLocaleTimeString('fa-ir', { hour: '2-digit', minute: '2-digit', hour12: false }) +
                                  ' - ' +
                                  new Date(new Date(executionDate) * 1 + 90 * 60 * 1000).toLocaleTimeString('fa-ir', { hour: '2-digit', minute: '2-digit', hour12: false })
                                : '-'
                        }}
                    </span>
                </p>
            </div>

            <!-- بخش نقشه صندلی‌ها با Apache ECharts -->
            <div class="col-span-full">
                <div class="p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
                    <!-- تب‌های انتخاب طبقه -->
                    <div class="tabs grid flex-end align-center tabs-boxed mb-3 !bg-gray-100 dark:bg-gray-700 !text-black dark:!text-white" role="tablist">
                        <template v-for="floor in Floors" :key="`tab-` + floor">
                            <a :class="{ 'tab-active': tab === floor }" class="tab font-bold" role="tab" @click.prevent="changeTab(floor)">
                                {{ floor }}
                            </a>
                        </template>
                    </div>

                    <!-- ظرف نمایش نقشه با کنترل‌های کامل Apache ECharts -->
                    <div class="relative w-full h-[540px] md:h-[620px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                        <!-- وضعیت در حال بارگذاری -->
                        <div v-if="isCurrentMapLoading" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
                            <PrSpinner class="animate-spin text-4xl mb-2 text-indigo-500" />
                            <span class="text-sm font-medium">در حال دریافت و بارگذاری پلان صندلی‌ها...</span>
                        </div>

                        <!-- کامپوننت Vue-ECharts -->
                        <v-chart
                            v-else-if="currentMapRegistered"
                            ref="chartRef"
                            class="w-full h-full"
                            :option="chartOption"
                            :init-options="{ renderer: 'svg' }"
                            autoresize
                            @click="handleChartClick"
                            @mouseover="handleChartMouseOver"
                            @mouseout="handleChartMouseOut"
                        />

                        <!-- پیام در صورت عدم وجود نقشه -->
                        <div v-else class="text-gray-400 text-sm">
                            پلان این طبقه در دسترس نیست.
                        </div>

                        <!-- نوار ابزار کنترل نقشه (Apache ECharts Roam / Map Controls) -->
                        <div class="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <!-- دکمه بزرگ‌نمایی -->
                            <button
                                type="button"
                                class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm"
                                title="بزرگ‌نمایی (Zoom In)"
                                @click="zoomIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            <!-- دکمه بازنشانی نما -->
                            <button
                                type="button"
                                class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm text-xs font-bold"
                                title="بازنشانی اندازه و موقعیت (Reset View)"
                                @click="resetZoom"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>

                            <!-- دکمه کوچک‌نمایی -->
                            <button
                                type="button"
                                class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm"
                                title="کوچک‌نمایی (Zoom Out)"
                                @click="zoomOut"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                                </svg>
                            </button>
                        </div>

                        <!-- نشانگر راهنمای تعامل روی نقشه -->
                        <div class="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm pointer-events-none">
                            💡 جابجایی با کشیدن ماوس | زوم با اسکرول ماوس
                        </div>
                    </div>

                    <!-- راهنمای وضعیت صندلی‌ها -->
                    <div class="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs md:text-sm text-gray-800 dark:text-gray-200">
                        <div class="font-bold flex items-center justify-center">راهنما:</div>
                        <div class="flex items-center justify-center">
                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30 mx-1 bg-[#178d17]"></span>
                            آزاد
                        </div>
                        <div class="flex items-center justify-center">
                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30 mx-1 bg-[#33b7db]"></span>
                            انتخاب شما
                        </div>
                        <div class="flex items-center justify-center">
                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30 mx-1 bg-[#f6b93b]"></span>
                            در انتظار پرداخت
                        </div>
                        <div class="flex items-center justify-center">
                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30 mx-1 bg-[#e55039]"></span>
                            رزرو شده
                        </div>
                        <div class="flex items-center justify-center">
                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30 mx-1 bg-[#0e0e0e]"></span>
                            غیر قابل خرید
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- کارت‌های صندلی‌های انتخابی کاربر -->
        <div class="grid md:grid-cols-2 grid-cols-1 mt-4 gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
            <div class="font-bold text-black col-span-full dark:text-gray-200 text-base">
                بلیت‌های انتخابی شما ({{ TicketStore.Tickets.length }} عدد):
            </div>
            <div v-if="TicketStore.Tickets.length === 0" class="font-medium text-center text-gray-500 dark:text-gray-400 col-span-full py-4 text-sm">
                هیچ بلیتی انتخاب نشده است. از روی نقشه صندلی‌های مورد نظر خود را انتخاب کنید.
            </div>
            <SelectedTicket
                v-for="item in TicketStore.Tickets ?? []"
                :key="item.id"
                :concertTitle="concert?.title"
                :handleDelete="() => handleClickOnDeleteSeat(item.id)"
                :has-delete="true"
                :index="item.id"
                :seatInfo="item"
            />
        </div>
    </div>

    <!-- دکمه‌های کنترل مراحل -->
    <ControlSteps :to-next="onNext" :to-previous="onPreviuos" />
</template>

<script setup>
import { computed, ref, watch, watchEffect, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery } from '@tanstack/vue-query'
import Swal from 'sweetalert2'

// کتابخانه Vue-ECharts و ماژول‌های مورد نیاز Apache ECharts
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import { GeoComponent, TooltipComponent, ToolboxComponent } from 'echarts/components'
import { MapChart } from 'echarts/charts'

// ثبت ماژول‌های ECharts
use([
    SVGRenderer,
    CanvasRenderer,
    GeoComponent,
    TooltipComponent,
    ToolboxComponent,
    MapChart
])

// آیکون‌ها و کامپوننت‌های پروژه
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import SelectedTicket from '@/views/components/Pages/Event/SelectedTicket.vue'
import ControlSteps from './controlSteps.vue'

// Storeها و سرویس‌ها
import useTicketStore from '@/stores/Ticket.js'
import useUserStore from '@/stores/user'
import useSeatMapStore from '@/stores/seatMap.js'
import { useAuthModalStore } from '@/stores/componentStore/authModal.js'
import { Guid } from '@/config/helper'
import { GetSeatMapService } from '@/services/ConcertsService.js'
import { CRPlacesService } from '@/services/PlacesService'
import { ConcertsQueryKeys, get_apiConcertsGetConcertInfo, get_apiConcertsGetSpecificEvent } from '@/api/ConcertsService'

// Props و روت
const props = defineProps({
    stepControls: Object,
    concert: Object,
    toNext: Function,
    toPrevious: Function
})

const route = useRoute()
const chartRef = ref(null)
const tab = ref('')
const isLoadingMap = ref(false)
const registeredMaps = ref(new Set())

const TicketStore = useTicketStore()
const userStore = useUserStore()
const seatMapService = useSeatMapStore()
const AuthModalStore = useAuthModalStore()

const ChosenEvent = computed(() => Guid({}).fromCompressedToFull(route.params.eventId))

// دریافت اطلاعات سانس
const GetSpecificEventService = useQuery({
    queryKey: [ConcertsQueryKeys.get_apiConcertsGetSpecificEvent(ChosenEvent.value)],
    queryFn: () => get_apiConcertsGetSpecificEvent(ChosenEvent.value),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
})

const executionDate = computed(() => GetSpecificEventService.data.value?.events?.[0]?.executionDate)

// دریافت اطلاعات کلی کنسرت
const GetConcertInfoServiceKey = computed(() => [
    ConcertsQueryKeys.get_apiConcertsGetConcertInfo(route?.params?.id && Guid({}).fromCompressedToFull(route?.params?.id))
])
const GetConcertInfoService = useQuery({
    queryKey: GetConcertInfoServiceKey,
    queryFn: () => get_apiConcertsGetConcertInfo(route?.params?.id && Guid({}).fromCompressedToFull(route?.params?.id)),
    enabled: true
})

// استخراج اطلاعات طبقات و صندلی‌ها
const Floors = computed(() => GetSpecificEventService.data.value?.events?.[0]?.floors?.map((x) => x.title) ?? [])

const currentFloorObj = computed(() => {
    const floors = GetSpecificEventService.data.value?.events?.[0]?.floors ?? []
    return floors.find((x) => x.title === tab.value) || floors[0]
})

const currentFloorDisplayOrder = computed(() => currentFloorObj.value?.displayOrder ?? 0)

// استخراج تمام بلیت‌های طبقه جاری با نرمال‌سازی نام‌ها و قیمت‌ها
const currentFloorTickets = computed(() => {
    const floor = currentFloorObj.value
    if (!floor) return []
    const seatsInfo = floor.seatsInfo || floor.SeatsInfo
    const rawItems = seatsInfo?.items || seatsInfo?.Items || []
    return rawItems.map((item) => ({
        ...item,
        id: item.id || item.Id || item.ticketId || item.TicketId,
        name: item.name || item.Name,
        price: item.price ?? item.Price ?? item.amount ?? item.Amount ?? 0,
        isReserved: Boolean(item.isReserved ?? item.IsReserved)
    }))
})

// نقشه جامع تمام بلیت‌ها در همه طبقات بر اساس نام صندلی
const allTicketsMap = computed(() => {
    const map = new Map()
    const floors = GetSpecificEventService.data.value?.events?.[0]?.floors ?? []
    floors.forEach((fl) => {
        const seatsInfo = fl.seatsInfo || fl.SeatsInfo
        const rawItems = seatsInfo?.items || seatsInfo?.Items || []
        rawItems.forEach((item) => {
            const name = item.name || item.Name
            if (name) {
                map.set(name, {
                    ...item,
                    id: item.id || item.Id || item.ticketId || item.TicketId,
                    name: name,
                    price: item.price ?? item.Price ?? item.amount ?? item.Amount ?? 0,
                    isReserved: Boolean(item.isReserved ?? item.IsReserved),
                    floorTitle: fl.title || fl.Title
                })
            }
        })
    })
    return map
})

// نگه‌داری شناسه تمام صندلی‌های موجود در SVG هر طبقه
const floorSvgSeatNames = ref({})

// نام نقشه جاری برای Apache ECharts
const currentMapName = computed(() => `seat_map_floor_${currentFloorDisplayOrder.value}`)
const currentMapRegistered = computed(() => registeredMaps.value.has(currentMapName.value))
const isCurrentMapLoading = computed(() => isLoadingMap.value && !currentMapRegistered.value)

// پالت رنگی وضعیت صندلی‌ها
const COLORS = {
    free: '#178d17',
    selected: '#33b7db',
    waiting: '#f6b93b',
    reserved: '#e55039',
    notForSale: '#0e0e0e'
}

// دانلود، اصلاح اتریبیوت‌ها، پاکسازی استایل‌های پیش‌فرض و ثبت SVG نقشه در Apache ECharts
watchEffect(async () => {
    const floors = GetSpecificEventService.data.value?.events?.[0]?.floors ?? []
    if (floors.length === 0) return

    for (let floor of floors) {
        const mapName = `seat_map_floor_${floor.displayOrder}`
        if (registeredMaps.value.has(mapName)) continue

        try {
            isLoadingMap.value = true
            const rawSvg = await GetSeatMapService(floor.seatMap_url)

            if (rawSvg) {
                let processedSvg = rawSvg
                const detectedSeatIds = []

                try {
                    const parser = new DOMParser()
                    const svgDoc = parser.parseFromString(rawSvg, 'image/svg+xml')

                    // حذف تمام تگ‌ها و اتریبیوت‌های title از SVG تا تولتیپ پیش‌فرض مرورگر روی صندلی‌ها باز نشود
                    svgDoc.querySelectorAll('title').forEach((el) => el.remove())
                    svgDoc.querySelectorAll('[title]').forEach((el) => el.removeAttribute('title'))

                    // پاکسازی fillهای اجباری از تگ‌های style تا استایل ECharts بازنویسی نشود
                    svgDoc.querySelectorAll('style').forEach((styleEl) => {
                        let text = styleEl.textContent || ''
                        // تبدیل fill در کلاس‌های صندلی به مقدار قابل بازنویسی توسط ویژگی‌های ECharts
                        text = text.replace(/(\.seat[^{]*\{[^}]*?)fill\s*:[^;]+;/gi, '$1fill: inherit;')
                        styleEl.textContent = text
                    })

                    // شناسایی صندلی‌ها صرفاً بر اساس attribute id و پل ارتباطی با ECharts
                    const elementsWithId = svgDoc.querySelectorAll('[id]')
                    elementsWithId.forEach((el) => {
                        const id = el.getAttribute('id')
                        if (id && /^f\d+[-_]r\d+[-_]c\d+/i.test(id)) {
                            el.setAttribute('name', id)
                            // حذف fill صریح المان تا ECharts کنترل کامل داشته باشد
                            el.removeAttribute('fill')
                            if (el.style) {
                                el.style.removeProperty('fill')
                            }
                            detectedSeatIds.push(id)
                        } else {
                            el.removeAttribute('name')
                        }
                    })

                    processedSvg = new XMLSerializer().serializeToString(svgDoc)
                } catch {
                    // روش رزرو با regex در صورت عدم دسترسی به DOMParser
                    processedSvg = rawSvg.replace(/id="(f[0-9]{1,3}_r[0-9]{1,3}_c[0-9]{1,9})"/g, 'id="$1" name="$1"')
                }

                floorSvgSeatNames.value[floor.displayOrder] = detectedSeatIds

                // ثبت SVG به عنوان نقشه برداری تعاملی در Apache ECharts
                echarts.registerMap(mapName, { svg: processedSvg })
                registeredMaps.value.add(mapName)
                registeredMaps.value = new Set(registeredMaps.value)
            }
        } catch (error) {
            console.error(`خطا در ثبت نقشه طبقه ${floor.title}:`, error)
        } finally {
            isLoadingMap.value = false
        }
    }
})

// تعیین وضعیت یک صندلی بر اساس داده‌های استور و SSE
function getSeatState(seatName) {
    const ticket = currentFloorTickets.value.find((x) => x.name === seatName) || allTicketsMap.value.get(seatName)

    if (!ticket) {
        return {
            status: 'notForSale',
            label: 'غیر قابل خرید',
            color: COLORS.notForSale,
            ticket: null
        }
    }

    const ticketId = ticket.id

    // آیا توسط کاربر جاری انتخاب شده؟
    if (TicketStore.Tickets.some((x) => x.id === ticketId)) {
        return {
            status: 'selected',
            label: 'انتخاب شما',
            color: COLORS.selected,
            ticket
        }
    }

    // آیا رزرو قطعی شده؟
    if (ticket.isReserved || seatMapService.Reserved_Tickets?.includes(ticketId)) {
        return {
            status: 'reserved',
            label: 'رزرو شده',
            color: COLORS.reserved,
            ticket
        }
    }

    // آیا در انتظار پرداخت شخص دیگری است؟
    if (seatMapService.Locked_Tickets?.includes(ticketId)) {
        return {
            status: 'waiting',
            label: 'در انتظار پرداخت',
            color: COLORS.waiting,
            ticket
        }
    }

    // صندلی آزاد است
    return {
        status: 'free',
        label: 'آزاد',
        color: COLORS.free,
        ticket
    }
}

// تولید آرایه regions در Apache ECharts برای رنگ‌آمیزی و استایل‌دهی کامل تمام صندلی‌ها
const currentRegions = computed(() => {
    if (!currentMapRegistered.value) return []

    const regions = []
    // جمع‌آوری تمامی صندلی‌های شناخته شده در SVG و داده‌های بلیت
    const svgSeats = floorSvgSeatNames.value[currentFloorDisplayOrder.value] || []
    const ticketSeats = currentFloorTickets.value.map((t) => t.name).filter(Boolean)
    const allSeatSet = new Set([...svgSeats, ...ticketSeats])

    for (let seatName of allSeatSet) {
        const state = getSeatState(seatName)

        regions.push({
            name: seatName,
            itemStyle: {
                areaColor: state.color,
                color: state.color,
                borderColor: '#1e293b',
                borderWidth: 0.8
            },
            emphasis: {
                itemStyle: {
                    areaColor: state.color,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    shadowBlur: 8,
                    shadowColor: 'rgba(0,0,0,0.4)'
                }
            }
        })
    }

    return regions
})

// پیکربندی آپشن جامع Apache ECharts
const chartOption = computed(() => {
    if (!currentMapRegistered.value) return {}

    const tooltipConfig = {
        show: true,
        trigger: 'item',
        renderMode: 'html',
        confine: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
            color: '#f8fafc',
            fontFamily: 'Vazir, Tahoma, sans-serif',
            fontSize: 12
        },
        extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4); border-radius: 10px; direction: rtl; text-align: right; z-index: 9999;',
        formatter: (params) => {
            const p = Array.isArray(params) ? params[0] : params
            const seatName = p?.name
            if (!seatName) return ''

            const match = seatName.match(/f(\d+)[-_]r(\d+)[-_]c(\d+)/i)
            if (!match) return ''

            const floorIdx = match[1]
            const row = match[2]
            const column = match[3]
            const floorTitle = currentFloorObj.value?.title || Floors.value[floorIdx] || tab.value || `طبقه ${floorIdx}`

            const state = getSeatState(seatName)

            // استخراج و فرمت هزینه صندلی
            const rawPrice =
                state.ticket?.price ??
                state.ticket?.Price ??
                state.ticket?.amount ??
                state.ticket?.Amount ??
                GetSpecificEventService.data.value?.events?.[0]?.price ??
                GetSpecificEventService.data.value?.events?.[0]?.Price
            const priceNum = Number(rawPrice)
            const priceFormatted =
                rawPrice !== undefined && rawPrice !== null && !isNaN(priceNum) && priceNum > 0
                    ? `${priceNum.toLocaleString('fa-ir')} تومان`
                    : rawPrice === 0
                      ? 'رایگان'
                      : 'تعیین نشده'

            if (!state.ticket) {
                return `
                    <div style="direction: rtl; text-align: right; line-height: 1.8;">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 2px;">کنسرت ${GetConcertInfoService.data.value?.title || ''}</div>
                        <div><strong>طبقه:</strong> ${floorTitle}</div>
                        <div><strong>ردیف:</strong> ${row} | <strong>ستون:</strong> ${column}</div>
                        <div><strong>هزینه صندلی:</strong> <span style="color: #94a3b8; font-weight: bold;">غیر قابل خرید</span></div>
                        <div style="margin-top: 3px;">
                            <strong>وضعیت:</strong>
                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${COLORS.notForSale}; margin-right: 4px;"></span>
                            <span style="color: #94a3b8; font-weight: bold;">غیر قابل خرید</span>
                        </div>
                    </div>
                `
            }

            return `
                <div style="direction: rtl; text-align: right; line-height: 1.8;">
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 2px;">کنسرت ${GetConcertInfoService.data.value?.title || ''}</div>
                    <div><strong>طبقه:</strong> ${floorTitle}</div>
                    <div><strong>ردیف:</strong> ${row} | <strong>ستون:</strong> ${column}</div>
                    <div><strong>هزینه صندلی:</strong> <span style="color: #38bdf8; font-weight: bold;">${priceFormatted}</span></div>
                    <div style="margin-top: 3px;">
                        <strong>وضعیت:</strong>
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${state.color}; margin-right: 4px;"></span>
                        <span style="color: ${state.color}; font-weight: bold;">${state.label}</span>
                    </div>
                </div>
            `
        }
    }

    return {
        backgroundColor: 'transparent',
        tooltip: tooltipConfig,
        geo: {
            tooltip: tooltipConfig,
            map: currentMapName.value,
            roam: true, // امکان حرکت با درگ و زوم با اسکرول ماوس
            layoutCenter: ['50%', '50%'],
            layoutSize: '95%',
            scaleLimit: {
                min: 0.5,
                max: 8
            },
            itemStyle: {
                areaColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0
            },
            emphasis: {
                focus: 'self',
                itemStyle: {
                    borderColor: '#ffffff',
                    borderWidth: 2
                }
            },
            regions: currentRegions.value
        }
    }
})

// کنترل‌های نقشه Apache ECharts (بزرگ‌نمایی، کوچک‌نمایی و بازنشانی متمرکز)
function zoomIn() {
    if (!chartRef.value) return
    const width = typeof chartRef.value.getWidth === 'function' ? chartRef.value.getWidth() : 600
    const height = typeof chartRef.value.getHeight === 'function' ? chartRef.value.getHeight() : 400
    chartRef.value.dispatchAction({
        type: 'geoRoam',
        componentType: 'geo',
        geoIndex: 0,
        zoom: 1.3,
        originX: width / 2,
        originY: height / 2
    })
}

function zoomOut() {
    if (!chartRef.value) return
    const width = typeof chartRef.value.getWidth === 'function' ? chartRef.value.getWidth() : 600
    const height = typeof chartRef.value.getHeight === 'function' ? chartRef.value.getHeight() : 400
    chartRef.value.dispatchAction({
        type: 'geoRoam',
        componentType: 'geo',
        geoIndex: 0,
        zoom: 0.77,
        originX: width / 2,
        originY: height / 2
    })
}

function resetZoom() {
    if (!chartRef.value) return
    chartRef.value.setOption({
        geo: {
            zoom: 1,
            center: undefined
        }
    })
}

// تغییر مکان‌نما (Cursor) هنگام حرکت روی صندلی‌های قابل کلیک
function handleChartMouseOver(params) {
    if (params?.name && /^f\d+_r\d+_c\d+/.test(params.name)) {
        try {
            const zr = chartRef.value?.getZr?.()
            if (zr) zr.setCursor('pointer')
        } catch {}
    }
}

function handleChartMouseOut() {
    try {
        const zr = chartRef.value?.getZr?.()
        if (zr) zr.setCursor('default')
    } catch {}
}

// انتخاب و کلیک روی صندلی در نقشه
function handleChartClick(params) {
    if (!params || !params.name) return
    const seatName = params.name

    const regex = /^f[0-9]{1,3}_r[0-9]{1,3}_c[0-9]{1,9}/
    if (!regex.test(seatName)) return

    const state = getSeatState(seatName)
    if (!state.ticket) return

    const ticket = state.ticket
    const ticketId = ticket.id

    // اگر رزرو شده است
    if (state.status === 'reserved') {
        Swal.fire({
            title: 'صندلی رزرو شده',
            text: 'این صندلی قبلاً رزرو شده و امکان خرید آن وجود ندارد.',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
        return
    }

    // اگر در انتظار پرداخت شخص دیگری است
    if (state.status === 'waiting') {
        Swal.fire({
            title: 'در انتظار پرداخت',
            text: 'این صندلی در حال حاضر توسط کاربر دیگری در دست پرداخت است.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
        return
    }

    // اگر قبلاً توسط همین کاربر انتخاب شده بود -> لغو انتخاب
    if (state.status === 'selected') {
        handleClickOnDeleteSeat(ticketId)
        return
    }

    // انتخاب صندلی آزاد
    const [floor, row, column] = seatName.replaceAll('f', '').replaceAll('r', '').replaceAll('c', '').split('_')
    TicketStore.addToTicket({
        ...ticket,
        floor,
        row,
        column,
        floorTitle: currentFloorObj.value?.title || Floors.value[floor] || tab.value
    })
}

// حذف صندلی از سبد خرید
function handleClickOnDeleteSeat(seatId) {
    TicketStore.removeTicket(seatId)
}

// تغییر طبقه
function changeTab(selectedTab) {
    tab.value = selectedTab
    resetZoom()
}

// همگام‌سازی طبقه اولیه
watch(
    Floors,
    (newFloors) => {
        if (newFloors && newFloors.length > 0 && (!tab.value || !newFloors.includes(tab.value))) {
            tab.value = newFloors[0]
        }
    },
    { immediate: true }
)

// واکنش به تغییرات صندلی‌های رزرو شده از طریق سرور (SSE)
watch([() => seatMapService.Reserved_Tickets], () => {
    if (!seatMapService.Reserved_Tickets) return
    const userTicketsToLock = []
    const userSelectedIds = TicketStore.Tickets.map((x) => x.id)

    seatMapService.Reserved_Tickets.forEach((item) => {
        if (userSelectedIds.includes(item)) {
            TicketStore.removeTicket(item)
            userTicketsToLock.push(item)
        }
    })

    if (userTicketsToLock.length > 0) {
        Swal.fire({
            title: 'توجه',
            text: 'برخی از صندلی‌های انتخابی شما توسط شخص دیگری رزرو قطعی شد و از سبد خرید شما خارج شد.',
            icon: 'warning',
            confirmButtonText: 'متوجه شدم',
            showClass: { popup: 'direction-rtl vazir-font' }
        })
    }
})

// واکنش به تغییرات صندلی‌های در حال پرداخت از طریق سرور (SSE)
watch([() => seatMapService.Locked_Tickets], () => {
    if (!seatMapService.Locked_Tickets) return
    const userTicketsToLock = []
    const userSelectedIds = TicketStore.Tickets.map((x) => x.id)

    seatMapService.Locked_Tickets.forEach((item) => {
        if (userSelectedIds.includes(item)) {
            TicketStore.removeTicket(item)
            userTicketsToLock.push(item)
        }
    })

    if (userTicketsToLock.length > 0) {
        Swal.fire({
            title: 'توجه',
            text: 'برخی از صندلی‌های انتخابی شما توسط شخص دیگری به مرحله پرداخت رفت و از سبد خرید شما حذف شد.',
            icon: 'info',
            confirmButtonText: 'متوجه شدم',
            showClass: { popup: 'direction-rtl vazir-font' }
        })
    }
})

// ارسال درخواست رزرو و رفتن به مرحله بعدی
const { mutate } = useMutation({
    mutationKey: ['Reservation'],
    mutationFn: CRPlacesService
})

async function onNext() {
    if (!userStore.isAuthenticated && userStore.expireTime <= new Date()) {
        userStore.logOut()
        AuthModalStore.setTitle('برای ادامه حساب کاربری لازمه!')
        AuthModalStore.toggleMenu()
        return false
    }

    if (TicketStore.Tickets.length === 0) {
        Swal.fire({
            title: 'خطا!',
            text: 'لطفاً حداقل یک بلیت را از روی نقشه انتخاب کنید.',
            icon: 'info',
            confirmButtonText: 'باشه',
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
                Authorization: 'Bearer ' + userStore.accessToken
            }
        },
        {
            onSuccess: async (data) => {
                if (data.tempReservationId == null) return false

                try {
                    await seatMapService.notifyLockTickets()
                } catch (e) {
                    return false
                }

                await seatMapService.LeaveGroup()
                props.toNext()
            }
        }
    )
}

// بازگشت به مرحله قبلی
async function onPreviuos() {
    if (TicketStore.Tickets.length !== 0) {
        const { isConfirmed } = await Swal.fire({
            title: 'هشدار',
            html: 'با برگشت به مرحله قبل، صندلی‌های انتخاب‌شده شما حذف خواهند شد.<br/>آیا مطمئن هستید؟',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'بله، بازگرد',
            cancelButtonText: 'انصراف',
            customClass: {
                actions: 'flex justify-around w-full flex-row-reverse'
            },
            showClass: { popup: 'direction-rtl vazir-font' }
        })

        if (!isConfirmed) {
            await seatMapService.LeaveGroup()
            return false
        }
    }

    TicketStore.removeAllTickets()
    props.toPrevious()
}

// هوک اتصال و آغاز به کار
onMounted(() => {
    TicketStore.setSelectedShowing(ChosenEvent.value)
    seatMapService.notifyUnLockTickets()
    seatMapService.JoinGroup(ChosenEvent.value)

    if (Floors.value && Floors.value.length > 0) {
        tab.value = Floors.value[0]
    }
})
</script>

<style scoped>
.tab {
    @apply w-full;
    position: relative;
    grid-row-start: 1;
    display: block;
    height: 2.25rem;
    cursor: pointer;
    user-select: none;
    text-align: center;
    font-size: 0.875rem;
    line-height: 2.25rem;
    transition: all 0.2s ease-in-out;
    @apply bg-transparent rounded-lg;
}

.tab-active {
    @apply dark:!text-white !text-white !bg-indigo-600 shadow-md;
}

.tabs {
    @apply p-1 rounded-xl shadow-inner;
}
</style>
