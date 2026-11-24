<script setup>
import { Field, useFieldArray, useForm } from 'vee-validate'
import Splitter from '@/global/Splitter/Splitter.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { CRPlacesService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { FILE_PROVIDER2 } from '@/config/appConfig'
import vueSelectUmd from 'vue-select'
import { sendRequest, getFile } from '@/services/service'
import randomColor from 'randomcolor'
import dateHelper from '@/utils/dateHelper'
import { v4 } from 'uuid'

// کتابخانه Vue-ECharts و ماژول‌های مورد نیاز Apache ECharts
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { MapChart } from 'echarts/charts'
use([SVGRenderer, CanvasRenderer, GeoComponent, TooltipComponent, MapChart])

const router = useRouter()
const route = useRoute()

// ─── رنگ پایه صندلی (همان SecondStep) ────────────────────────────────────────
const COLOR_FREE = '#178d17'       // صندلی بدون قیمت (آزاد)
const COLOR_NO_SALE = '#0e0e0e'   // غیر قابل فروش

// ─── تنظیمات فرم ─────────────────────────────────────────────────────────────
const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})
const [concertTitle] = defineField('concert.title')
// eslint-disable-next-line no-unused-vars
const [concertDesc] = defineField('concert.description')
const cocertCardImage = defineField('concert.image')
// eslint-disable-next-line no-unused-vars
const concertStartDate = defineField('concert.startdate')
// eslint-disable-next-line no-unused-vars
const cocertEndDate = defineField('concert.enddate')
const cocertPosterImage = defineField('concert.poster')
const [concertCategory] = defineField('concert.category')
const [concertPlace] = defineField('concert.place')
const [concertPromoter] = defineField('concert.promoter')
const { push, remove, fields } = useFieldArray('events')

const eventFields = {
    EventId: undefined,
    hallId: null,
    StartSaleDate: new Date().toJSON().replace('T', ' ').replace('Z', ''),
    EndSaleDate: new Date().toJSON().replace('T', ' ').replace('Z', ''),
    ExecutionDate: new Date().toJSON().replace('T', ' ').replace('Z', ''),
    Note: '',
    SeatsInfo: {},
    lock: false,
    price: 0,
    cleaner: false
}

const concertId = !route.params.concertId ? null : route.params.concertId
const tempHallId = ref(null)

// ─── به ازای هر رویداد، به ازای هر قیمت یک رنگ تصادفی ───────────────────────
const priceClassColor = reactive({})

// ─── ECharts: نقشه‌های ثبت‌شده و ref چارت‌ها ─────────────────────────────────
// کلید: `ev${eventId}_fl${floorIdx}` → mapName
const registeredMaps = ref(new Map())
// کلید: `ev${eventId}_fl${floorIdx}` → { seats: [...] }
const floorSeatData = reactive({})
// کلید: `ev${eventId}_fl${floorIdx}` → boolean
const isLoadingMap = reactive({})
// ref چارت‌ها: کلید → instance
const chartRefs = ref({})

// ─── Queries ──────────────────────────────────────────────────────────────────
const getConceretServiceCall = useQuery({
    queryKey: ['/api/Manager/GetConcertWithDetails/', concertId],
    queryFn: async ({ queryKey }) => sendRequest({ url: queryKey.join(''), method: 'GET' }),
    enabled: !!concertId
})

const getCategoryServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetCategories'],
    queryFn: ({ queryKey }) => sendRequest({ url: queryKey.join(''), method: 'GET' }),
    enabled: true
})
const getPlacesServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetPlaces'],
    queryFn: ({ queryKey }) => sendRequest({ url: queryKey.join(''), method: 'GET' }),
    enabled: true
})
const getPromotersServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetPromoters'],
    queryFn: ({ queryKey }) => sendRequest({ url: queryKey.join(''), method: 'GET' }),
    enabled: true
})
const placeSelected = computed(() => !!concertPlace.value)
const getHallsServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetHallsAndFloorsByPlaceId?Id=', concertPlace],
    queryFn: ({ queryKey }) => sendRequest({ url: queryKey.join(''), method: 'GET' }),
    enabled: placeSelected
})

const { mutate, isPending } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService,
    onError: (err) => {
        console.error(err)
        Swal.fire({ text: 'ناموفق', icon: 'error', showConfirmButton: false, showCloseButton: true, timer: 2000, timerProgressBar: true, showClass: { popup: 'direction-rtl vazir-font' } })
    }
})

const categories = computed(() =>
    getCategoryServiceCall.data.value
        ?.filter((x) => x.parentId != null)
        ?.map((x) => ({ label: x.title, value: x.id, parent: getCategoryServiceCall.data.value.find((y) => y.id === x.parentId)?.title }))
)
const places = computed(() => getPlacesServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.city })))
const promoters = computed(() => getPromotersServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.categoryName })))
const halls = computed(() => getHallsServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: places.value?.find((y) => y.value === x.placeId)?.title })))

// ─── استخراج صندلی‌های ذخیره‌شده یک طبقه ──────────────────────────────────
function getExistingSeatsForFloor(eventData, floorIdx) {
    if (!eventData) return []
    const seatsInfo = eventData.SeatsInfo || eventData.seatsInfo
    if (!seatsInfo) return []
    if (Array.isArray(seatsInfo)) return seatsInfo
    if (Array.isArray(seatsInfo[floorIdx])) return seatsInfo[floorIdx]
    if (Array.isArray(seatsInfo[`${floorIdx}`])) return seatsInfo[`${floorIdx}`]
    if (Array.isArray(seatsInfo.items)) return seatsInfo.items
    if (Array.isArray(seatsInfo.Items)) return seatsInfo.Items
    return []
}

// ─── ادغام صندلی‌های پلان با صندلی‌های ذخیره‌شده و ثبت پالت قیمت‌ها ───────────
function mergeFloorSeatsWithSaved(floorSeats = [], savedSeats = [], eventId) {
    if (!priceClassColor[eventId]) priceClassColor[eventId] = {}

    const savedMap = new Map()
    savedSeats.forEach((s) => {
        if (s.floorSeatId != null) savedMap.set(String(s.floorSeatId), s)
        if (s.name) savedMap.set(String(s.name), s)
    })

    const merged = floorSeats.map((fs) => {
        const saved = (fs.floorSeatId != null ? savedMap.get(String(fs.floorSeatId)) : null) || (fs.name ? savedMap.get(String(fs.name)) : null)
        const price = Number(saved?.price || fs.price || 0)
        const isReserved = !!(saved?.isReserved ?? fs.isReserved)

        if (price > 0 && !priceClassColor[eventId][price]) {
            priceClassColor[eventId][`${price}`] = randomColor({
                luminosity: 'bright',
                format: 'rgb'
            })
        }

        return {
            ...fs,
            ...(saved || {}),
            price,
            isReserved
        }
    })

    // صندلی‌هایی که احیاناً در پلان نبودند اما در داده‌های ذخیره‌شده رویداد هستند
    savedSeats.forEach((s) => {
        const exists = merged.some((m) => (s.floorSeatId != null && m.floorSeatId === s.floorSeatId) || (s.name && m.name === s.name))
        if (!exists) {
            const price = Number(s.price || 0)
            if (price > 0 && !priceClassColor[eventId][price]) {
                priceClassColor[eventId][`${price}`] = randomColor({
                    luminosity: 'bright',
                    format: 'rgb'
                })
            }
            merged.push({
                ...s,
                price,
                isReserved: !!s.isReserved
            })
        }
    })

    return merged
}

// ─── به‌روزرسانی قیمت‌های صندلی‌های نقشه ثبت‌شده ─────────────────────────────
function updateFloorSeatPrices(eventId, floorIdx, floorSeats) {
    const key = `ev${eventId}_fl${floorIdx}`
    const existingSeats = getExistingSeatsForFloor(values?.events?.[eventId], floorIdx)
    const baseSeats = (floorSeats && floorSeats.length > 0) ? floorSeats : (floorSeatData[key]?.seats ?? [])
    const allSeats = mergeFloorSeatsWithSaved(baseSeats, existingSeats, eventId)

    if (floorSeatData[key]) {
        floorSeatData[key].seats = allSeats
    } else {
        floorSeatData[key] = { seats: allSeats, mapName: registeredMaps.value.get(key) }
    }
    setFieldValue(`events[${eventId}]SeatsInfo[${floorIdx}]`, [...allSeats])
    refreshChart(eventId, floorIdx)
}

// ─── ثبت نقشه SVG یک طبقه در ECharts ───────────────────────────────────────
async function registerFloorMap(svgText, eventId, floorIdx, floorSeats) {
    const key = `ev${eventId}_fl${floorIdx}`
    isLoadingMap[key] = true

    try {
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')

        // جایگزینی idهای defs با uuid
        let criticalIds = []
        svgDoc.querySelectorAll('defs').forEach((def) => {
            def.querySelectorAll('[id]').forEach((item) => criticalIds.push(item.id))
        })
        criticalIds.forEach((tagId) => {
            const newId = v4().replaceAll('-', '_')
            const svg = svgDoc.querySelector('svg')
            svg.innerHTML = svg.innerHTML
                .replaceAll(`id="${tagId}"`, `id="${newId}"`)
                .replaceAll(`#${tagId}`, `#${newId}`)
        })

        // حذف تمام تگ‌ها و اتریبیوت‌های title از SVG تا تولتیپ پیش‌فرض مرورگر روی صندلی‌ها باز نشود
        svgDoc.querySelectorAll('title').forEach((el) => el.remove())
        svgDoc.querySelectorAll('[title]').forEach((el) => el.removeAttribute('title'))

        // شناسایی صندلی‌ها صرفاً بر اساس attribute id
        svgDoc.querySelectorAll(`*[id]`).forEach((el) => {
            const id = el.getAttribute('id')
            if (id && /^f\d+[-_]r\d+[-_]c\d+/i.test(id)) {
                el.setAttribute('name', id)
                el.removeAttribute('fill')
                if (el.style) {
                    el.style.removeProperty('fill')
                }
            } else {
                el.removeAttribute('name')
            }
        })

        const processedSvg = new XMLSerializer().serializeToString(svgDoc)
        const mapName = `concert_ev${eventId}_fl${floorIdx}_${Date.now()}`
        echarts.registerMap(mapName, { svg: processedSvg })

        // ادغام صندلی‌های پلان با صندلی‌های ذخیره‌شده رویداد
        const existingSeats = getExistingSeatsForFloor(values?.events?.[eventId], floorIdx)
        const allSeats = mergeFloorSeatsWithSaved(floorSeats, existingSeats, eventId)

        floorSeatData[key] = { seats: allSeats, mapName }
        registeredMaps.value = new Map(registeredMaps.value.set(key, mapName))

        // ذخیره در فرم
        setFieldValue(`events[${eventId}]SeatsInfo[${floorIdx}]`, [...allSeats])
    } catch (err) {
        console.error('خطا در ثبت نقشه:', err)
    } finally {
        isLoadingMap[key] = false
    }
}

// ─── بارگذاری نقشه‌های طبقات یک رویداد ───────────────────────────────────────
function loadFloorMaps(eventId, hallId) {
    const hall = getHallsServiceCall.data.value?.find((x) => x.id === hallId)
    if (!hall) return
    hall.floorInfoDtos.forEach((floor, floorIdx) => {
        const key = `ev${eventId}_fl${floorIdx}`
        if (registeredMaps.value.has(key)) {
            updateFloorSeatPrices(eventId, floorIdx, floor.seatsInfo?.items ?? [])
            return
        }
        getFile({ baseUrl: FILE_PROVIDER2, url: floor.seatMap_url, method: 'GET' })
            .then((file) => {
                const reader = new FileReader()
                reader.onload = (e) => registerFloorMap(e.target.result, eventId, floorIdx, floor.seatsInfo?.items ?? [])
                reader.readAsText(file)
            })
            .catch((e) => console.error('خطا در دریافت نقشه:', e))
    })
}

// ─── گزینه ECharts برای یک طبقه ─────────────────────────────────────────────
function getChartOption(eventId, floorIdx) {
    const key = `ev${eventId}_fl${floorIdx}`
    const data = floorSeatData[key]
    if (!data?.mapName) return {}

    const eventPriceColors = priceClassColor[eventId] ?? {}
    const regions = []

    data.seats.forEach((seat) => {
        let color = COLOR_FREE
        if (seat.price && seat.price > 0) {
            if (!priceClassColor[eventId]) priceClassColor[eventId] = {}
            if (!priceClassColor[eventId][seat.price]) {
                priceClassColor[eventId][`${seat.price}`] = randomColor({
                    luminosity: 'bright',
                    format: 'rgb'
                })
            }
            color = priceClassColor[eventId][seat.price]
        }

        regions.push({
            name: seat.name,
            label: {
                show: false
            },
            itemStyle: {
                areaColor: color,
                color: color,
                borderColor: '#1e293b',
                borderWidth: 0.8
            },
            emphasis: {
                label: {
                    show: false
                },
                itemStyle: {
                    areaColor: color,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    shadowBlur: 8,
                    shadowColor: 'rgba(0,0,0,0.3)'
                }
            },
            select: {
                label: {
                    show: false
                }
            }
        })
    })

    const tooltipConfig = {
        show: true,
        trigger: 'item',
        renderMode: 'html',
        confine: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: '#f8fafc', fontFamily: 'Vazir, Tahoma, sans-serif', fontSize: 12 },
        extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); border-radius: 10px; direction: rtl; text-align: right; z-index: 9999;',
        formatter: (params) => {
            const p = Array.isArray(params) ? params[0] : params
            const seatName = p?.name
            if (!seatName) return ''

            const match = seatName.match(/f(\d+)[-_]r(\d+)[-_]c(\d+)/i)
            if (!match) return ''

            const floor = match[1]
            const row = match[2]
            const col = match[3]

            const seat = data.seats.find((s) => s.name === seatName)
            const seatPrice = seat?.price ?? 0
            const isReserved = seat?.isReserved ?? false

            let priceColor = COLOR_FREE
            let priceLabel = 'تعیین نشده'
            if (seatPrice > 0 && eventPriceColors[seatPrice]) {
                priceColor = eventPriceColors[seatPrice]
                priceLabel = Number(seatPrice).toLocaleString('fa-ir') + ' تومان'
            } else if (seatPrice > 0) {
                priceLabel = Number(seatPrice).toLocaleString('fa-ir') + ' تومان'
            }

            return `
                <div style="direction: rtl; text-align: right; line-height: 1.9;">
                    ${isReserved ? `<div style="text-align:center; color:#f6b93b; font-weight:bold; margin-bottom:4px;">⚠️ رزرو شده</div>` : ''}
                    <div><strong>طبقه:</strong> ${floor} | <strong>ردیف:</strong> ${row} | <strong>ستون:</strong> ${col}</div>
                    <div style="margin-top:3px;">
                        <strong>قیمت:</strong>
                        <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${priceColor}; margin: 0 4px 0 2px; vertical-align:middle;"></span>
                        <span style="color:${priceColor}; font-weight:bold;">${priceLabel}</span>
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
            map: data.mapName,
            roam: true,
            layoutCenter: ['50%', '50%'],
            layoutSize: '95%',
            scaleLimit: { min: 0.5, max: 10 },
            itemStyle: {
                areaColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0
            },
            label: {
                show: false
            },
            emphasis: {
                focus: 'self',
                label: {
                    show: false
                },
                itemStyle: { borderColor: '#ffffff', borderWidth: 2 }
            },
            select: {
                label: {
                    show: false
                }
            },
            regions
        }
    }
}

// ─── اعمال عملیات روی صندلی (با هاور یا کلیک) ───────────────────────────────
function applySeatAction(seatName, eventId, floorIdx) {
    if (!seatName) return
    const match = seatName.match(/f(\d+)[-_]r(\d+)[-_]c(\d+)/i)
    if (!match) return

    const key = `ev${eventId}_fl${floorIdx}`
    const data = floorSeatData[key]
    if (!data) return

    const seatIndex = data.seats.findIndex((s) => s.name === seatName)
    if (seatIndex === -1) return

    const eventData = values.events?.[eventId]
    if (!eventData) return

    if (eventData.cleaner) {
        // پاک کردن قیمت صندلی
        if (data.seats[seatIndex].price !== 0) {
            data.seats[seatIndex] = { ...data.seats[seatIndex], price: 0 }
            setFieldValue(`events[${eventId}]SeatsInfo[${floorIdx}][${seatIndex}].price`, 0)
            refreshChart(eventId, floorIdx)
        }
        return
    }

    if (eventData.lock && eventData.price) {
        const price = Number(eventData.price)
        if (data.seats[seatIndex].price !== price) {
            if (!priceClassColor[eventId]) priceClassColor[eventId] = {}
            if (!priceClassColor[eventId][price]) {
                priceClassColor[eventId][`${price}`] = randomColor({ luminosity: 'bright', format: 'rgb' })
            }
            data.seats[seatIndex] = { ...data.seats[seatIndex], price }
            setFieldValue(`events[${eventId}]SeatsInfo[${floorIdx}][${seatIndex}].price`, price)
            refreshChart(eventId, floorIdx)
        }
    }
}

// هاور روی صندلی: اگر قفل اشاره‌گر یا پاک‌کن فعال باشد، مستقیماً اعمال می‌شود
function handleChartMouseOver(params, eventId, floorIdx) {
    const seatName = params?.name
    if (!seatName) return
    const eventData = values.events?.[eventId]
    if (eventData?.cleaner || (eventData?.lock && eventData?.price)) {
        applySeatAction(seatName, eventId, floorIdx)
    }
}

// کلیک روی صندلی
function handleChartClick(params, eventId, floorIdx) {
    const seatName = params?.name
    if (!seatName) return
    applySeatAction(seatName, eventId, floorIdx)
}

// ─── بازآفرینی آپشن چارت (رنگ‌ها به‌روز شوند) ──────────────────────────────
function refreshChart(eventId, floorIdx) {
    const key = `ev${eventId}_fl${floorIdx}`
    const chart = chartRefs.value[key]
    if (chart) {
        chart.setOption(getChartOption(eventId, floorIdx), { notMerge: false })
    }
}

// ─── کنترل‌های زوم ───────────────────────────────────────────────────────────
function zoomIn(eventId, floorIdx) {
    const chart = chartRefs.value[`ev${eventId}_fl${floorIdx}`]
    if (!chart) return
    const w = chart.getWidth?.() ?? 600, h = chart.getHeight?.() ?? 400
    chart.dispatchAction({ type: 'geoRoam', componentType: 'geo', geoIndex: 0, zoom: 1.3, originX: w / 2, originY: h / 2 })
}
function zoomOut(eventId, floorIdx) {
    const chart = chartRefs.value[`ev${eventId}_fl${floorIdx}`]
    if (!chart) return
    const w = chart.getWidth?.() ?? 600, h = chart.getHeight?.() ?? 400
    chart.dispatchAction({ type: 'geoRoam', componentType: 'geo', geoIndex: 0, zoom: 0.77, originX: w / 2, originY: h / 2 })
}
function resetZoom(eventId, floorIdx) {
    const chart = chartRefs.value[`ev${eventId}_fl${floorIdx}`]
    if (!chart) return
    chart.setOption({ geo: { zoom: 1, center: undefined } })
}
function setChartRef(el, eventId, floorIdx) {
    if (el) chartRefs.value[`ev${eventId}_fl${floorIdx}`] = el
}

// ─── تب طبقه هر رویداد ───────────────────────────────────────────────────────
const eventFloorTab = ref({}) // key: eventId → floorIdx
function getEventFloorTab(eventId) {
    return eventFloorTab.value[eventId] ?? 0
}
function setEventFloorTab(eventId, idx) {
    eventFloorTab.value = { ...eventFloorTab.value, [eventId]: idx }
}

// ─── تغییر مکان پلیس → پاک‌کردن رویدادها ────────────────────────────────────
watch(concertPlace, () => {
    if (concertId) return
    for (let i = fields.value.length - 1; i >= 0; i--) remove(i)
    tempHallId.value = null
})

// ─── بارگذاری داده‌های ویرایش ─────────────────────────────────────────────────
watch([getConceretServiceCall.data], async () => {
    const d = getConceretServiceCall.data.value
    if (!d) return

    setFieldValue('concert.place', d.placeId)

    const formEvents = d.events.items.map((event, eventId) => {
        const sDate = event.startSaleDate ? event.startSaleDate.replace('T', ' ') : ''
        const eDate = event.endSaleDate ? event.endSaleDate.replace('T', ' ') : ''
        const exDate = event.executionDate ? event.executionDate.replace('T', ' ') : ''

        if (!priceClassColor[eventId]) priceClassColor[eventId] = {}

        const seatsInfo = event.seatsInfo ?? {}
        // پیمایش روی تمام صندلی‌های ذخیره‌شده و استخراج قیمت‌ها جهت رنگ‌آمیزی
        Object.keys(seatsInfo).forEach((flKey) => {
            const seatsList = Array.isArray(seatsInfo[flKey]) ? seatsInfo[flKey] : []
            seatsList.forEach((s) => {
                const p = Number(s.price || 0)
                if (p > 0 && !priceClassColor[eventId][p]) {
                    priceClassColor[eventId][`${p}`] = randomColor({
                        luminosity: 'bright',
                        format: 'rgb'
                    })
                }
            })
        })

        return {
            EventId: event.eventId,
            hallId: event.hallId,
            StartSaleDate: sDate,
            EndSaleDate: eDate,
            ExecutionDate: exDate,
            Note: '',
            SeatsInfo: { ...seatsInfo },
            lock: false,
            price: 0,
            cleaner: false
        }
    })

    await resetForm({
        values: {
            concert: {
                title: d.title,
                description: d.description,
                startdate: new Date(d.startDate),
                enddate: new Date(d.endDate),
                category: d.categoryId,
                place: d.placeId,
                promoter: d.promoterId
            },
            events: formEvents
        }
    })

    // به‌روزرسانی یا بارگذاری نقشه‌ها و اعمال قیمت‌های قبلی
    if (getHallsServiceCall.data.value) {
        formEvents.forEach((ev, eventId) => {
            if (ev.hallId) loadFloorMaps(eventId, ev.hallId)
        })
    }
})

// ─── بارگذاری نقشه‌ها هنگام آماده شدن halls ─────────────────────────────────
watch(
    [getHallsServiceCall.data, fields],
    () => {
        if (!getHallsServiceCall.data.value) return
        fields.value.forEach((field, eventId) => {
            const hallId = field.value.hallId
            if (hallId) loadFloorMaps(eventId, hallId)
        })
    },
    { deep: true }
)

// ─── افزودن رویداد جدید ───────────────────────────────────────────────────────
function addNewEvent() {
    const newIdx = fields.value.length
    priceClassColor[newIdx] = {}
    push({ ...eventFields, hallId: tempHallId.value })
    if (tempHallId.value) {
        // بارگذاری نقشه‌ها بعد از اینکه fields به‌روز شد
        setTimeout(() => loadFloorMaps(newIdx, tempHallId.value), 100)
    }
    tempHallId.value = null
}

// ─── تاریخ کنسرت ─────────────────────────────────────────────────────────────
function setStartSaleEvent(e) {
    if (!e) return
    let startDate = values.concert.startdate
    if (!startDate || e.valueOf() < startDate.valueOf()) setFieldValue('concert.startdate', e.toDate())
}
function setEndSaleEvent(e) {
    if (!e) return
    let endDate = values.concert.enddate
    if (!endDate || e.valueOf() > endDate.valueOf()) setFieldValue('concert.enddate', e.toDate())
}
function setExecEvent() {}

// ─── ارسال فرم ───────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (data) => {
    const Data = {
        Concertid: concertId ?? null,
        Title: data.concert.title,
        PlaceId: data.concert.place,
        CategoryId: data.concert.category,
        Note: data.concert.description,
        PromoterId: data.concert.promoter,
        startDate: dateHelper.dateToISO(data.concert?.startdate),
        endDate: dateHelper.dateToISO(data.concert?.enddate),
        Events: {
            ItemTitle: '',
            ItemDescription: '',
            Items: data.events.map((event) => ({
                ...event,
                StartSaleDate: dateHelper.persianStringToISO(event.StartSaleDate),
                EndSaleDate: dateHelper.persianStringToISO(event.EndSaleDate),
                ExecutionDate: dateHelper.persianStringToISO(event.ExecutionDate)
            }))
        }
    }

    const formData = new FormData()
    let offset = 0
    if (!!data.concert.image && data.concert.image?.length !== 0) {
        formData.append('Files.Files[0].File', data.concert.image[0])
        formData.append('Files.Files[0].Key', 'img_url')
        offset++
    }
    if (!!data.concert.poster && data.concert.poster?.length !== 0) {
        formData.append(`Files.Files[${offset}].File`, data.concert.poster[0])
        formData.append(`Files.Files[${offset}].Key`, 'poster')
        offset++
    }
    if (!formData.has('Files.Files[0].File')) formData.append('Files.Files', null)
    formData.append('Concert', JSON.stringify(Data))

    if (!concertId) {
        mutate({ url: '/api/Manager/CreateConcert?api-version=1.0', body: formData, method: 'POST' }, {
            onSuccess: async () => {
                await Swal.fire({ text: 'با موفقیت ایجاد شد!', icon: 'success', showConfirmButton: false, showCloseButton: true, timer: 2000, timerProgressBar: true, showClass: { popup: 'direction-rtl vazir-font' } })
                router.push({ name: 'ManageConcerts' })
            }
        })
    } else {
        mutate({ url: '/api/Manager/UpdateConcert?api-version=1.0', body: formData, method: 'PATCH' }, {
            onSuccess: async () => {
                await Swal.fire({ text: 'با موفقیت بروز شد!', icon: 'success', showConfirmButton: false, showCloseButton: true, timer: 2000, timerProgressBar: true, showClass: { popup: 'direction-rtl vazir-font' } })
                router.push({ name: 'ManageConcerts' })
            }
        })
    }
})
</script>

<template>
    <div>
        <!-- سربرگ چسبنده -->
        <div class="sticky top-0 z-40 h-fit">
            <div class="w-full !bg-white dark:!bg-gray-900 shadow-sm">
                <Splitter v-if="!concertId" border-class="border-black" title="کنسرت جدید" title-class="text-black" type="middle" />
                <Splitter v-else border-class="border-black" title="ویرایش یک کنسرت" title-class="text-black" type="middle" />
            </div>
            <div class="flex flex-row-reverse mx-1 my-2">
                <button class="items-center px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm w-fit hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" @click="router.push({ name: 'AllConcerts' })">
                    <CiCircleChevLeft class="font-bold scale-125" />
                </button>
            </div>
        </div>

        <!-- فرم اصلی -->
        <form :class="!getConceretServiceCall.isFetched && getConceretServiceCall.isLoading ? 'hidden' : ''" @submit.prevent="onSubmit">
            <div class="grid grid-cols-8 gap-3 p-2">

                <!-- ردیف اول: نام + تصویر کارت + تصویر پوستر -->
                <div class="col-span-2 col-start-2">
                    <label class="form-label">نام کنسرت</label>
                    <input v-model="concertTitle" class="form-input mt-1" type="text" placeholder="نام کنسرت را وارد کنید" />
                </div>
                <div class="col-span-2 col-start-4">
                    <label class="form-label">تصویر کارت</label>
                    <input class="form-input mt-1" type="file" accept="image/*" @change="($event) => { cocertCardImage[0].value = $event.target.files }" />
                </div>
                <div class="col-span-2 col-start-6">
                    <label class="form-label">تصویر پوستر</label>
                    <input class="form-input mt-1" type="file" accept="image/*" @change="($event) => { cocertPosterImage[0].value = $event.target.files }" />
                </div>

                <!-- ردیف دوم: مکان + برگزارکننده + دسته‌بندی -->
                <div class="col-span-2 col-start-2">
                    <label class="form-label">محل برگزاری</label>
                    <vue-Select-Umd
                        v-model="concertPlace"
                        :options="places"
                        :reduce="(place) => place.value"
                        label="label"
                        class="style-chooser mt-1"
                        :disabled="!!concertId"
                    >
                        <template #selected-option="{ label, parent }">
                            <div style="display: flex; align-items: baseline; padding: 0">
                                <strong class="text-sm"> {{ label }} </strong>
                                <em class="mx-1 text-xs"> {{ parent }} </em>
                            </div>
                        </template>
                        <template #option="{ label, parent }">
                            <div class="text-right">
                                <h3 style="margin: 0">{{ label }}</h3>
                                <em>{{ parent }}</em>
                            </div>
                        </template>
                    </vue-Select-Umd>
                </div>
                <div class="col-span-2 col-start-4">
                    <label class="form-label">برگزارکننده</label>
                    <vue-Select-Umd
                        v-model="concertPromoter"
                        :options="promoters"
                        :reduce="(p) => p.value"
                        label="label"
                        class="style-chooser mt-1"
                        :disabled="!!concertId"
                    >
                        <template #selected-option="{ label, parent }">
                            <div style="display: flex; align-items: baseline; padding: 0">
                                <strong class="text-sm"> {{ label }} </strong>
                                <em class="mx-1 text-xs"> {{ parent }} </em>
                            </div>
                        </template>
                        <template #option="{ label, parent }">
                            <div class="text-right"><h3 style="margin: 0">{{ label }}</h3><em>{{ parent }}</em></div>
                        </template>
                    </vue-Select-Umd>
                </div>
                <div class="col-span-2 col-start-6">
                    <label class="form-label">دسته‌بندی</label>
                    <vue-Select-Umd
                        v-model="concertCategory"
                        :options="categories"
                        :reduce="(cat) => cat.value"
                        label="label"
                        class="style-chooser mt-1"
                    >
                        <template #selected-option="{ label, parent }">
                            <div style="display: flex; align-items: baseline; padding: 0">
                                <strong class="text-sm"> {{ label }} </strong>
                                <em class="mx-1 text-xs"> {{ parent }} </em>
                            </div>
                        </template>
                        <template #option="{ label, parent }">
                            <div class="text-right"><h3 style="margin: 0">{{ label }}</h3><em>{{ parent }}</em></div>
                        </template>
                    </vue-Select-Umd>
                </div>

                <!-- ─── رویدادها ─────────────────────────────────────────────── -->
                <div class="col-span-full">
                    <template v-for="(filed, eventId) in fields" :key="`event-${eventId}`">

                        <!-- جداکننده رویداد -->
                        <div class="my-3">
                            <div class="flex items-center gap-2">
                                <hr class="flex-grow border-t border-gray-300 dark:border-gray-600" />
                                <span class="px-3 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                    <span
                                        v-if="!filed.value.EventId"
                                        class="text-red-500 cursor-pointer hover:animate-pulse select-none"
                                        @click.prevent="remove(eventId)"
                                    >❌</span>
                                    <span v-else class="select-none">🚯</span>
                                    <span class="font-semibold">رویداد شماره {{ eventId + 1 }}</span>
                                    <span class="text-sm text-gray-500">
                                        ({{ halls?.find((x) => x.value === filed.value.hallId)?.label ?? '—' }})
                                    </span>
                                </span>
                                <hr class="flex-grow border-t border-gray-300 dark:border-gray-600" />
                            </div>
                        </div>

                        <!-- فیلدهای تاریخ -->
                        <div class="grid grid-cols-8 gap-3 mb-3">
                            <div class="col-span-2 col-start-2">
                                <label class="form-label">تاریخ شروع فروش</label>
                                <Field :name="`events[${eventId}].StartSaleDate`" v-slot="{ field, componentField }">
                                    <AB-Date-Picker mode="single" type="datetime" click-on="all" format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD HH:mm" locale="fa" :column="1" :modal="false" auto-submit :show="false" display-format="jYYYY/jMM/jDD HH:mm" v-bind="field" v-model="componentField.modelValue" @select="setStartSaleEvent($event, eventId)" />
                                </Field>
                            </div>
                            <div class="col-span-2 col-start-4">
                                <label class="form-label">تاریخ پایان فروش</label>
                                <Field :name="`events[${eventId}].EndSaleDate`" v-slot="{ field, componentField }">
                                    <AB-Date-Picker mode="single" type="datetime" click-on="all" locale="fa" :column="1" display-format="jYYYY/jMM/jDD HH:mm" format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD HH:mm" :modal="false" auto-submit :show="false" v-bind="field" v-model="componentField.modelValue" @select="setEndSaleEvent($event, eventId)" />
                                </Field>
                            </div>
                            <div class="col-span-2 col-start-6">
                                <label class="form-label">تاریخ اجرا</label>
                                <Field :name="`events[${eventId}].ExecutionDate`" v-slot="{ field, componentField }">
                                    <AB-Date-Picker mode="single" type="datetime" click-on="all" locale="fa" :column="1" display-format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD HH:mm" :modal="false" auto-submit format="jYYYY/jMM/jDD HH:mm" :show="false" v-bind="field" v-model="componentField.modelValue" @select="setExecEvent($event, eventId)" />
                                </Field>
                            </div>
                            <div class="col-span-2 col-start-2">
                                <label class="form-label">نکته</label>
                                <input class="form-input mt-1" placeholder="یادداشت اختیاری..." />
                            </div>
                        </div>

                        <!-- نوار ابزار قیمت‌گذاری -->
                        <div class="mx-6 mb-3 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div class="text-center text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">🎛️ ابزار قیمت‌گذاری صندلی</div>
                            <div class="grid grid-cols-4 gap-3 items-center">
                                <!-- قیمت -->
                                <div class="col-span-2 flex items-center gap-2">
                                    <label class="form-label text-nowrap mb-0">قیمت (تومان):</label>
                                    <Field v-slot="{ field }" :name="`events[${eventId}].price`">
                                        <input
                                            type="number"
                                            :disabled="values.events?.[eventId]?.cleaner"
                                            class="form-input py-1 mt-0"
                                            v-bind="field"
                                            placeholder="مثال: 500000"
                                        />
                                    </Field>
                                </div>
                                <!-- پاک‌کن -->
                                <div class="col-span-1 flex items-center justify-center gap-2 select-none">
                                    <label class="form-label mb-0 text-nowrap">پاک‌کن:</label>
                                    <Field v-slot="{ field }" type="checkbox" :name="`events[${eventId}].cleaner`" :value="true" :unchecked-value="false">
                                        <span
                                            :class="{ 'strikethrough-v2': !field.checked }"
                                            class="text-2xl cursor-pointer"
                                            @click.prevent="() => { if (!field.checked) setFieldValue(`events[${eventId}].price`, null); setFieldValue(`events[${eventId}].cleaner`, !field.checked) }"
                                        >🧹</span>
                                        <input type="checkbox" v-bind="field" :value="true" class="hidden" />
                                    </Field>
                                </div>
                                <!-- قفل -->
                                <div class="col-span-1 flex items-center justify-center gap-2 select-none">
                                    <label class="form-label mb-0 text-nowrap">قفل اشاره‌گر:</label>
                                    <Field v-slot="{ field }" type="checkbox" :name="`events[${eventId}].lock`" :value="true" :unchecked-value="false">
                                        <span v-if="field.checked" class="text-xl cursor-pointer" @click.prevent="setFieldValue(`events[${eventId}].lock`, false)">🔒</span>
                                        <span v-else class="text-xl cursor-pointer" @click.prevent="setFieldValue(`events[${eventId}].lock`, true)">🔓</span>
                                        <input type="checkbox" v-bind="field" :value="true" class="hidden" />
                                    </Field>
                                </div>
                            </div>

                            <!-- دکمه‌های قیمت‌های تعریف‌شده -->
                            <div v-if="Object.keys(priceClassColor[eventId] ?? {}).length > 0" class="grid gap-2 mt-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-8">
                                <button
                                    v-for="price in Object.keys(priceClassColor[eventId] ?? {})"
                                    :key="`price-${price}`"
                                    type="button"
                                    :class="['flex items-center gap-2 justify-between px-2 py-1 rounded-md border text-xs font-bold transition-all', price == values.events?.[eventId]?.price ? 'ring-2 ring-offset-1 ring-indigo-500 border-indigo-400' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300']"
                                    @click.prevent="() => { setFieldValue(`events.${eventId}.cleaner`, false); setFieldValue(`events.${eventId}.price`, Number(price)) }"
                                >
                                    <div class="w-4 h-4 rounded-full flex-shrink-0" :style="{ backgroundColor: priceClassColor[eventId][price] }"></div>
                                    <span class="truncate">{{ Number(price).toLocaleString('fa-ir') }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- نقشه صندلی‌ها با ECharts -->
                        <div class="mx-6 p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">

                            <!-- تب‌های طبقات -->
                            <div class="tabs grid flex-end align-center tabs-boxed mb-3 !bg-gray-100 dark:bg-gray-700 !text-black dark:!text-white" role="tablist">
                                <template v-for="(floor, floorIdx) in getHallsServiceCall.data.value?.find((x) => x.id === filed.value.hallId)?.floorInfoDtos" :key="`tab-ev${eventId}-fl${floorIdx}`">
                                    <a
                                        :class="{ 'tab-active': getEventFloorTab(eventId) === floorIdx }"
                                        class="tab font-bold"
                                        role="tab"
                                        @click.prevent="setEventFloorTab(eventId, floorIdx)"
                                    >
                                        {{ floor.title }}
                                    </a>
                                </template>
                            </div>

                            <!-- پانل هر طبقه -->
                            <template v-for="(floor, floorIdx) in getHallsServiceCall.data.value?.find((x) => x.id === filed.value.hallId)?.floorInfoDtos" :key="`panel-ev${eventId}-fl${floorIdx}`">
                                <div :class="{ hidden: getEventFloorTab(eventId) !== floorIdx }">

                                    <!-- ظرف نقشه -->
                                    <div class="relative w-full h-[520px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">

                                        <!-- لودینگ -->
                                        <div v-if="isLoadingMap[`ev${eventId}_fl${floorIdx}`]" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
                                            <PrSpinner class="animate-spin text-4xl mb-2 text-indigo-500" />
                                            <span class="text-sm font-medium">در حال بارگذاری نقشه صندلی‌ها...</span>
                                        </div>

                                        <!-- ECharts -->
                                        <v-chart
                                            v-else-if="registeredMaps.has(`ev${eventId}_fl${floorIdx}`)"
                                            :ref="(el) => setChartRef(el, eventId, floorIdx)"
                                            class="w-full h-full"
                                            :option="getChartOption(eventId, floorIdx)"
                                            :init-options="{ renderer: 'svg' }"
                                            autoresize
                                            @click="(p) => handleChartClick(p, eventId, floorIdx)"
                                            @mouseover="(p) => handleChartMouseOver(p, eventId, floorIdx)"
                                        />

                                        <!-- پیام خالی -->
                                        <div v-else class="text-gray-400 dark:text-gray-500 text-sm flex flex-col items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                                            <span>در حال دریافت نقشه...</span>
                                        </div>

                                        <!-- کنترل زوم -->
                                        <div v-if="registeredMaps.has(`ev${eventId}_fl${floorIdx}`)" class="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                            <button type="button" class="zoom-btn" title="بزرگ‌نمایی" @click="zoomIn(eventId, floorIdx)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                            <button type="button" class="zoom-btn" title="بازنشانی نما" @click="resetZoom(eventId, floorIdx)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                            </button>
                                            <button type="button" class="zoom-btn" title="کوچک‌نمایی" @click="zoomOut(eventId, floorIdx)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
                                            </button>
                                        </div>

                                        <!-- راهنمای تعامل -->
                                        <div v-if="registeredMaps.has(`ev${eventId}_fl${floorIdx}`)" class="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm pointer-events-none">
                                            💡 کلیک = اعمال قیمت | جابجایی با کشیدن | زوم با اسکرول
                                        </div>
                                    </div>

                                    <!-- راهنمای رنگ‌ها -->
                                    <div v-if="registeredMaps.has(`ev${eventId}_fl${floorIdx}`)" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                                        <div class="font-bold flex items-center">راهنمای رنگ:</div>
                                        <div class="flex items-center gap-1">
                                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/20" :style="`background:${COLOR_FREE}`"></span>
                                            بدون قیمت (آزاد)
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/20" :style="`background:${COLOR_NO_SALE}`"></span>
                                            غیر قابل فروش
                                        </div>
                                        <div v-for="(color, price) in (priceClassColor[eventId] ?? {})" :key="`legend-${price}`" class="flex items-center gap-1">
                                            <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/20" :style="`background:${color}`"></span>
                                            {{ Number(price).toLocaleString('fa-ir') }} تومان
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>

                    <!-- افزودن رویداد جدید -->
                    <div class="my-4">
                        <div class="flex items-center gap-3">
                            <hr class="flex-grow border-t border-gray-300 dark:border-gray-600" />
                            <div class="flex items-center gap-2 px-2">
                                <vue-Select-Umd
                                    v-model="tempHallId"
                                    :options="halls ?? []"
                                    :reduce="(h) => h.value"
                                    label="label"
                                    class="style-chooser min-w-[200px]"
                                >
                                    <template #selected-option="{ label, parent }">
                                        <div style="display: flex; align-items: baseline; padding: 0">
                                            <strong class="text-sm"> {{ label }} </strong>
                                            <em class="mx-1 text-xs"> {{ parent }} </em>
                                        </div>
                                    </template>
                                    <template #option="{ label, parent }">
                                        <div class="text-right"><h3 style="margin: 0">{{ label }}</h3><em>{{ parent }}</em></div>
                                    </template>
                                    <!-- eslint-disable-next-line vue/no-unused-vars -->
                                    <template #no-options="{ search, searching, loading }">یک مکان برگزاری انتخاب شود</template>
                                </vue-Select-Umd>
                                <button class="btn h-fit text-white bg-green-600 hover:bg-green-700 rounded-lg w-fit text-nowrap px-4 py-2.5 self-center font-semibold transition" @click.prevent="addNewEvent">
                                    + رویداد جدید
                                </button>
                            </div>
                            <hr class="flex-grow border-t border-gray-300 dark:border-gray-600" />
                        </div>
                    </div>
                </div>

                <!-- دکمه ارسال -->
                <div class="col-span-2 col-start-4 mt-2">
                    <button v-if="!concertId" class="good-btn" type="submit" :disabled="isPending" :class="{ '!bg-green-200 cursor-wait': isPending }">
                        <span v-if="!isPending">ایجاد کنسرت</span>
                        <span v-else class="text-center"><v-icon animation="spin" fill="green" class="mx-auto" name="pr-spinner" scale="1.3" /></span>
                    </button>
                    <button v-else class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" type="submit" :disabled="isPending" :class="{ '!bg-orange-200 cursor-wait': isPending }">
                        <span v-if="!isPending">ویرایش کنسرت</span>
                        <span v-else class="text-center"><v-icon animation="spin" fill="orange" class="mx-auto" name="pr-spinner" scale="1.3" /></span>
                    </button>
                </div>
            </div>
        </form>

        <!-- اسپینر بارگذاری -->
        <div :class="getConceretServiceCall.isFetched || !getConceretServiceCall.isLoading ? 'hidden' : ''">
            <PrSpinner class="mx-auto mt-8 text-3xl animate-spin" />
        </div>
    </div>
</template>

<style scoped>
.style-chooser .vs__dropdown-menu li:nth-child(2n) {
    @apply bg-gray-200 text-black;
}
.vs__dropdown-menu li:nth-child(2n + 1) {
    @apply bg-gray-100 text-black;
}
.vs__dropdown-menu li:hover {
    @apply !text-gray-50 !bg-indigo-500 shadow-md;
}

.strikethrough-v2 {
    position: relative;
}
.strikethrough-v2:before {
    position: absolute;
    content: '';
    left: 0;
    top: 33%;
    right: 0;
    border-top: 6px solid;
    border-color: rgba(237, 16, 16, 0.6);
}

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

.form-label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.form-input {
    @apply py-2 border border-gray-300 dark:border-gray-600 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100;
}
.good-btn {
    @apply block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
}
.zoom-btn {
    @apply w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm;
}
</style>
