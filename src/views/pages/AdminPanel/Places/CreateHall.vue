<script setup>
import { Field, useFieldArray, useForm } from 'vee-validate'
import Splitter from '@/global/Splitter/Splitter.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { CRPlacesService, GetHallService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import { HuTimesCircle } from '@kalimahapps/vue-icons/hu'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'

// کتابخانه Vue-ECharts و ماژول‌های مورد نیاز Apache ECharts
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { MapChart } from 'echarts/charts'

// ثبت ماژول‌های ECharts
use([SVGRenderer, CanvasRenderer, GeoComponent, TooltipComponent, MapChart])

import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { FILE_PROVIDER2 } from '@/config/appConfig'
import { v4 } from 'uuid'

const router = useRouter()
const route = useRoute()

const placeId = !route.params.id ? null : route.params.id
const hallId = !route.params.hallId ? null : route.params.hallId

// ─── رنگ‌های استاندارد صندلی (دقیقاً بر اساس SecondStep) ─────────────────────
const COLORS = {
    free: '#178d17',          // صندلی شناخته‌شده / آزاد (سبز)
    recognized: '#178d17',
    selected: '#33b7db',      // صندلی انتخاب‌شده (آبی)
    waiting: '#f6b93b',       // صندلی تکراری / در انتظار (زرد/نارنجی)
    duplicate: '#f6b93b',
    reserved: '#e55039',      // صندلی ناشناخته / خطا / رزرو (قرمز)
    notRecognized: '#e55039',
    notForSale: '#0e0e0e'     // غیر قابل خرید (مشکی)
}

// ─── ECharts Map Registry per floor ──────────────────────────────────────────
const registeredMaps = ref(new Map()) // key: idx → mapName
const chartRefs = ref({})             // key: idx → chart instance
const floorMapData = ref({})          // key: idx → { recognized: [], notRecognized: [], error, message }
const isLoadingMap = ref({})          // key: idx → boolean

const getHallServiceCall = useQuery({
    queryKey: ['/api/Place/GetHallById', hallId],
    queryFn: () => GetHallService(hallId),
    enabled: !!hallId
})

const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})

const [hallTitle] = defineField('hall.title')
const [hallDesc] = defineField('hall.description')
const hallImage = defineField('hall.image')
const [hallLat] = defineField('hall.lat')
const { push, remove, fields } = useFieldArray('floors')
const [hallLng] = defineField('hall.lng')
const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService
})

const tab = ref(null)

function changeTab(newTab) {
    tab.value = newTab
}

// انتخاب خودکار تب اول هنگام وجود طبقات
watch(
    () => fields.value.length,
    (len) => {
        if (len > 0 && (tab.value === null || tab.value >= len)) {
            tab.value = 0
        }
    },
    { immediate: true }
)

// ─── پردازش SVG، پاکسازی استایل‌ها و ثبت در ECharts ──────────────────────────
async function processSvgAndRegisterMap(svgText, idx) {
    isLoadingMap.value = { ...isLoadingMap.value, [idx]: true }

    try {
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')

        // جایگزینی idهای بحرانی (defs) با uuid تا بین تب‌ها تداخل ایجاد نشود
        let criticalIds = []
        svgDoc.querySelectorAll('defs').forEach((def) => {
            def.querySelectorAll('[id]').forEach((item) => criticalIds.push(item.id))
        })
        criticalIds.forEach((tagId) => {
            const newId = v4().replaceAll('-', '_')
            const svg = svgDoc.querySelector('svg')
            if (svg) {
                svg.innerHTML = svg.innerHTML
                    .replaceAll(`id="${tagId}"`, `id="${newId}"`)
                    .replaceAll(`#${tagId}`, `#${newId}`)
            }
        })

        // حذف تمام تگ‌ها و اتریبیوت‌های title از SVG تا تولتیپ پیش‌فرض مرورگر روی صندلی‌ها باز نشود
        svgDoc.querySelectorAll('title').forEach((el) => el.remove())
        svgDoc.querySelectorAll('[title]').forEach((el) => el.removeAttribute('title'))

        // پاکسازی fillهای تعریف شده در تگ‌های <style> داخلی SVG تا استایل ECharts لغو نشود
        svgDoc.querySelectorAll('style').forEach((styleEl) => {
            let text = styleEl.textContent || ''
            text = text.replace(/(\.seat[^{]*\{[^}]*?)fill\s*:[^;]+;/gi, '$1fill: inherit;')
            styleEl.textContent = text
        })

        // شناسایی صندلی‌ها صرفاً بر اساس attribute id
        const recognized = []
        const notRecognized = []
        const existingItems = values.floors?.[idx]?.seatsInfo?.items ?? []
        const seenNames = new Set()

        // استخراج کلیه المان‌های دارای id
        const seatElements = svgDoc.querySelectorAll(`*[id]`)

        seatElements.forEach((el) => {
            const id = el.getAttribute('id')
            if (!id) return

            const isSeatFormat = /^f\d+[-_]r\d+[-_]c\d+/i.test(id)
            if (isSeatFormat) {
                // ست کردن name صرفاً جهت رجیستر شدن منطقه در ECharts GeoSVG
                el.setAttribute('name', id)
                el.removeAttribute('fill')
                if (el.style) {
                    el.style.removeProperty('fill')
                }

                const isFloorMatch = id.startsWith('f' + idx)
                const colPart = id.split('_')[2]?.replace('c', '')
                const isColValid = !isNaN(Number(colPart))

                if (isFloorMatch && isColValid) {
                    const isDuplicate = seenNames.has(id) || existingItems.some((x) => (x.name || x.Name) === id)
                    seenNames.add(id)

                    if (isDuplicate) {
                        recognized.push({ name: id, isDuplicate: true })
                    } else {
                        recognized.push({ name: id, isDuplicate: false })
                    }
                } else {
                    notRecognized.push({ name: id })
                }
            } else {
                el.removeAttribute('name')
            }
        })

        const processedSvg = new XMLSerializer().serializeToString(svgDoc)

        // نام‌گذاری یکتای نقشه بر اساس طبقه و زمان
        const mapName = `admin_hall_floor_${idx}_${Date.now()}`
        echarts.registerMap(mapName, { svg: processedSvg })

        // ذخیره اطلاعات پردازش‌شده برای نمایش در جدول، آمار و ECharts
        floorMapData.value = {
            ...floorMapData.value,
            [idx]: {
                mapName,
                recognized,
                notRecognized,
                error: notRecognized.length > 0 ? 'صندلی‌های قرمز رنگ، شناخته نشده‌اند — لطفاً تصحیح کنید' : null,
                message: buildMessage(recognized)
            }
        }

        registeredMaps.value = new Map(registeredMaps.value.set(idx, mapName))

        // ذخیره آیتم‌های صندلی در فرم Vee-Validate
        const seats = recognized.map((s) => ({ Name: s.name, name: s.name }))
        setFieldValue(`floors.${idx}.seatsInfo.items`, seats)
    } catch (err) {
        console.error('خطا در پردازش SVG:', err)
        floorMapData.value = {
            ...floorMapData.value,
            [idx]: { mapName: null, recognized: [], notRecognized: [], error: 'خطا در پردازش فایل SVG', message: null }
        }
    } finally {
        isLoadingMap.value = { ...isLoadingMap.value, [idx]: false }
    }
}

function buildMessage(recognized) {
    // ساخت خلاصه‌ای از ردیف/ستون برای نمایش
    return recognized.reduce((acc, s) => {
        const parts = s.name.replace('f', '').replace('r', '').replace('c', '').split('_').map(Number)
        const [, row, col] = parts
        if (!acc[row]) acc[row] = []
        acc[row].push(col)
        return acc
    }, {})
}

// ─── هندلر تغییر فایل SVG ────────────────────────────────────────────────────
function handleSeatMapChange(files, idx) {
    if (!files || !files[0]) return
    const reader = new FileReader()
    reader.onload = (e) => processSvgAndRegisterMap(e.target.result, idx)
    reader.readAsText(files[0])
}

// ─── گزینه‌های جامع ECharts برای هر طبقه بر اساس SecondStep ────────────────────
function getChartOption(idx) {
    const data = floorMapData.value[idx]
    if (!data?.mapName) return {}

    const regions = []

    // ۱. صندلی‌های شناخته‌شده → سبز رنگ (#178d17) یا زرد تکراری (#f6b93b)
    data.recognized.forEach((s) => {
        const color = s.isDuplicate ? COLORS.duplicate : COLORS.recognized
        regions.push({
            name: s.name,
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
                    shadowColor: 'rgba(0,0,0,0.4)'
                }
            },
            select: {
                label: {
                    show: false
                }
            }
        })
    })

    // ۲. صندلی‌های ناشناخته/خطا → قرمز رنگ (#e55039)
    data.notRecognized.forEach((s) => {
        regions.push({
            name: s.name,
            label: {
                show: false
            },
            itemStyle: {
                areaColor: COLORS.notRecognized,
                color: COLORS.notRecognized,
                borderColor: '#1e293b',
                borderWidth: 0.8
            },
            emphasis: {
                label: {
                    show: false
                },
                itemStyle: {
                    areaColor: COLORS.notRecognized,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    shadowBlur: 8,
                    shadowColor: 'rgba(0,0,0,0.4)'
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
        textStyle: {
            color: '#f8fafc',
            fontFamily: 'Vazir, Tahoma, sans-serif',
            fontSize: 12
        },
        extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); border-radius: 10px; direction: rtl; text-align: right; z-index: 9999;',
        formatter: (params) => {
            const p = Array.isArray(params) ? params[0] : params
            const seatName = p?.name
            if (!seatName) return ''

            const match = seatName.match(/f(\d+)[-_]r(\d+)[-_]c(\d+)/i)
            if (!match) return ''

            const floorNum = match[1]
            const row = match[2]
            const col = match[3]

            const recItem = data.recognized.find((s) => s.name === seatName)
            const isRecognized = !!recItem
            const isDuplicate = recItem?.isDuplicate

            let statusColor = COLORS.notRecognized
            let statusLabel = 'ناشناخته (نیاز به تصحیح)'

            if (isRecognized) {
                if (isDuplicate) {
                    statusColor = COLORS.duplicate
                    statusLabel = 'صندلی تکراری'
                } else {
                    statusColor = COLORS.recognized
                    statusLabel = 'شناخته شده (مجاز)'
                }
            }

            return `
                <div style="direction: rtl; text-align: right; line-height: 1.8;">
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                        اطلاعات صندلی
                    </div>
                    <div><strong>طبقه:</strong> ${floorNum}</div>
                    <div><strong>ردیف:</strong> ${row} | <strong>ستون:</strong> ${col}</div>
                    <div style="margin-top: 3px;">
                        <strong>وضعیت:</strong>
                        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${statusColor}; margin-right:4px;"></span>
                        <span style="color:${statusColor}; font-weight:bold;">${statusLabel}</span>
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
            scaleLimit: { min: 0.5, max: 8 },
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
                itemStyle: {
                    borderColor: '#ffffff',
                    borderWidth: 2
                }
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

// ─── کنترل‌های زوم نقشه (دقیقاً مطابق SecondStep) ──────────────────────────
function zoomIn(idx) {
    const chart = chartRefs.value[idx]
    if (!chart) return
    const w = typeof chart.getWidth === 'function' ? chart.getWidth() : 600
    const h = typeof chart.getHeight === 'function' ? chart.getHeight() : 400
    chart.dispatchAction({
        type: 'geoRoam',
        componentType: 'geo',
        geoIndex: 0,
        zoom: 1.3,
        originX: w / 2,
        originY: h / 2
    })
}

function zoomOut(idx) {
    const chart = chartRefs.value[idx]
    if (!chart) return
    const w = typeof chart.getWidth === 'function' ? chart.getWidth() : 600
    const h = typeof chart.getHeight === 'function' ? chart.getHeight() : 400
    chart.dispatchAction({
        type: 'geoRoam',
        componentType: 'geo',
        geoIndex: 0,
        zoom: 0.77,
        originX: w / 2,
        originY: h / 2
    })
}

function resetZoom(idx) {
    const chart = chartRefs.value[idx]
    if (!chart) return
    chart.setOption({
        geo: {
            zoom: 1,
            center: undefined
        }
    })
}

function handleChartMouseOver(params, idx) {
    if (params?.name && /^f\d+_r\d+_c\d+/.test(params.name)) {
        try {
            const chart = chartRefs.value[idx]
            const zr = chart?.getZr?.()
            if (zr) zr.setCursor('pointer')
        } catch {}
    }
}

function handleChartMouseOut(idx) {
    try {
        const chart = chartRefs.value[idx]
        const zr = chart?.getZr?.()
        if (zr) zr.setCursor('default')
    } catch {}
}

function setChartRef(el, idx) {
    if (el) chartRefs.value[idx] = el
}

// ─── ارسال فرم ───────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (data) => {
    const Data = {
        ...data.hall,
        Title: data.hall.title,
        PlaceId: placeId,
        Description: data.hall.description,
        lng: Number(data.hall.lng),
        lat: Number(data.hall.lat),
        FloorInfoDtos: [
            ...data.floors.map((x, index) => ({
                floorId: x?.floorId,
                Title: x.title,
                DisplayOrder: index,
                seatMap: x.seatMap,
                SeatsInfo: { ItemTitle: x.seatsInfo?.itemTitle ?? 'Seats', Items: [...(x.seatsInfo?.items ?? [])] }
            }))
        ]
    }

    const formData = new FormData()
    let offset = 0
    if (!!data.hall.image && data.hall.image?.length !== 0) {
        formData.append('Files.Files[' + offset + '].File', data.hall.image[0])
        formData.append('Files.Files[' + offset + '].Key', 'hall')
        offset++
    }

    Data.FloorInfoDtos.forEach((item, index) => {
        if (!item.seatMap) return
        formData.append('Files.Files[' + offset + '].File', item.seatMap)
        formData.append('Files.Files[' + offset + '].Key', index)
        offset++
        delete item.seatMap
    })

    if (offset === 0) formData.append('Files.Files', null)
    formData.append('Hall', JSON.stringify(Data))

    if (!hallId) {
        mutate(
            { url: '/api/Place/CreateHall?api-version=1.0', body: formData, method: 'POST' },
            {
                onSuccess: async () => {
                    await Swal.fire({ text: 'با موفقیت ایجاد شد!', icon: 'success', showConfirmButton: false, showCloseButton: true, timer: 2000, timerProgressBar: true, showClass: { popup: 'direction-rtl vazir-font' } })
                    router.push({ name: 'managePlace', params: { id: placeId } })
                }
            }
        )
    } else {
        mutate(
            { url: '/api/Place/UpdateHall?api-version=1.0', body: formData, method: 'PATCH' },
            {
                onSuccess: async () => {
                    await Swal.fire({ text: 'با موفقیت بروز شد!', icon: 'success', showConfirmButton: false, showCloseButton: true, timer: 2000, timerProgressBar: true, showClass: { popup: 'direction-rtl vazir-font' } })
                    router.push({ name: 'managePlace', params: { id: placeId } })
                }
            }
        )
    }
})

// ─── بارگذاری داده‌های ویرایش ─────────────────────────────────────────────────
watch([getHallServiceCall.data, getHallServiceCall.dataUpdatedAt], async () => {
    if (!getHallServiceCall.data.value && !hallId && !getHallServiceCall.isFetched) return
    const data = getHallServiceCall.data.value
    const formData = {
        hall: { title: data?.title, id: data?.id, lat: data?.lat, lng: data?.lng, description: data?.description },
        floors: [...(data?.floorInfoDtos ?? [])]
    }

    await resetForm({ values: formData })

    formData.floors.forEach((floor, index) => {
        fetch(FILE_PROVIDER2 + floor.seatMap_url, { method: 'GET' })
            .then((res) => res.text())
            .then((svgText) => processSvgAndRegisterMap(svgText, index))
            .catch((e) => console.error('خطا در بارگذاری نقشه طبقه:', e))
    })
})

// آمار خلاصه برای هر طبقه
const floorStats = computed(() => {
    const stats = {}
    Object.entries(floorMapData.value).forEach(([idx, data]) => {
        const recognizedList = data.recognized ?? []
        stats[idx] = {
            recognized: recognizedList.filter((x) => !x.isDuplicate).length,
            duplicates: recognizedList.filter((x) => x.isDuplicate).length,
            notRecognized: data.notRecognized?.length ?? 0
        }
    })
    return stats
})
</script>

<template>
    <div>
        <!-- سربرگ چسبنده -->
        <div class="sticky top-0 z-50">
            <div class="bg-white dark:bg-gray-900 shadow-sm">
                <Splitter
                    v-if="!hallId"
                    border-class="border-black"
                    title="ایجاد یک سالن برگزاری"
                    title-class="text-black"
                    type="middle"
                />
                <Splitter
                    v-else
                    border-class="border-black"
                    title="ویرایش یک سالن برگزاری"
                    title-class="text-black"
                    type="middle"
                />
            </div>
            <div class="my-2 mx-1 flex flex-row-reverse">
                <button
                    class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="router.push({ name: 'managePlace', params: { id: placeId } })"
                >
                    <CiCircleChevLeft class="scale-125 font-bold" />
                </button>
            </div>
        </div>

        <!-- فرم اصلی -->
        <form
            :class="!getHallServiceCall.isFetched && getHallServiceCall.isLoading ? 'hidden' : ''"
            @submit.prevent="onSubmit"
        >
            <div class="grid grid-cols-8 gap-2 p-2">
                <!-- نام سالن -->
                <div class="col-span-2 col-start-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">نام سالن</label>
                    <input
                        v-model="hallTitle"
                        class="form-input mt-1"
                        type="text"
                        placeholder="نام سالن را وارد کنید"
                    />
                </div>

                <!-- شرح -->
                <div class="col-span-4 col-start-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">شرح</label>
                    <textarea
                        v-model="hallDesc"
                        class="form-input mt-1"
                        rows="2"
                        placeholder="توضیحات سالن..."
                    ></textarea>
                </div>

                <!-- تصویر سالن -->
                <div class="col-span-2 col-start-6">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">تصویر سالن</label>
                    <input
                        class="form-input mt-1"
                        type="file"
                        accept="image/*"
                        @change="($event) => { hallImage[0].value = $event.target.files }"
                    />
                </div>

                <!-- بخش طبقات و نقشه صندلی‌ها -->
                <div class="col-span-full">
                    <div class="p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">

                        <!-- تب‌های طبقات -->
                        <div
                            class="tabs grid flex-end align-center tabs-boxed mb-3 !bg-gray-100 dark:bg-gray-700 !text-black dark:!text-white"
                            role="tablist"
                        >
                            <template v-for="(field, idx) in fields" :key="`tab-${field.key}`">
                                <a
                                    :class="{ 'tab-active': tab === idx }"
                                    class="tab font-bold"
                                    role="tab"
                                    @click.prevent="changeTab(idx)"
                                >
                                    <div class="flex justify-center items-center gap-1">
                                        <span class="px-2">
                                            {{ values.floors[idx]?.title === '' ? 'بدون نام' : (values.floors[idx]?.title || `طبقه ${idx + 1}`) }}
                                        </span>
                                        <HuTimesCircle
                                            v-if="!hallId"
                                            class="text-red-400 hover:text-red-600 text-lg transition"
                                            @click.prevent.stop="() => { if (tab === idx) tab = -1; remove(idx); }"
                                        />
                                    </div>
                                </a>
                            </template>
                            <!-- دکمه افزودن طبقه -->
                            <a
                                class="tab !bg-green-100 dark:!bg-green-900/40 !text-green-700 dark:!text-green-300 hover:!bg-green-200 font-bold"
                                role="tab"
                                @click.prevent="() => { push({ title: '', id: '', seatMap: '', displayOrder: fields.length, seatsInfo: { itemTitle: 'Seats', items: [] } }); changeTab(fields.length - 1) }"
                            >
                                + طبقه
                            </a>
                        </div>

                        <!-- محتوای هر طبقه -->
                        <template v-for="(field, idx) in fields" :key="`content-${field.key}`">
                            <div :class="{ hidden: tab !== idx }" class="p-2">

                                <!-- فیلدهای اطلاعات طبقه -->
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام طبقه</label>
                                        <Field
                                            :name="`floors[${idx}].title`"
                                            class="form-input"
                                            rules="required"
                                            type="text"
                                            placeholder="مثال: طبقه اول"
                                        />
                                        <Field :name="`floors[${idx}].displayOrder`" class="hidden" rules="" type="hidden" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">فایل نقشه صندلی (SVG)</label>
                                        <Field
                                            :name="`floors[${idx}].seatMap`"
                                            class="form-input"
                                            type="file"
                                            accept=".svg"
                                            @change="(e) => handleSeatMapChange(e.target.files, idx)"
                                        />
                                    </div>
                                    <!-- آمار صندلی‌ها -->
                                    <div v-if="floorMapData[idx]" class="flex items-end gap-3">
                                        <div class="text-sm flex flex-wrap gap-4">
                                            <span class="flex items-center gap-1">
                                                <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30" :style="`background:${COLORS.recognized}`"></span>
                                                <span class="text-gray-700 dark:text-gray-300">شناخته‌شده:</span>
                                                <strong class="text-green-600 dark:text-green-400">{{ floorStats[idx]?.recognized ?? 0 }}</strong>
                                            </span>
                                            <span v-if="floorStats[idx]?.duplicates > 0" class="flex items-center gap-1">
                                                <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30" :style="`background:${COLORS.duplicate}`"></span>
                                                <span class="text-gray-700 dark:text-gray-300">تکراری:</span>
                                                <strong class="text-amber-600 dark:text-amber-400">{{ floorStats[idx]?.duplicates }}</strong>
                                            </span>
                                            <span v-if="floorStats[idx]?.notRecognized > 0" class="flex items-center gap-1">
                                                <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30" :style="`background:${COLORS.notRecognized}`"></span>
                                                <span class="text-gray-700 dark:text-gray-300">ناشناخته:</span>
                                                <strong class="text-red-600 dark:text-red-400">{{ floorStats[idx]?.notRecognized }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- نقشه ECharts -->
                                <div class="relative w-full h-[520px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">

                                    <!-- حالت بارگذاری -->
                                    <div v-if="isLoadingMap[idx]" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
                                        <PrSpinner class="animate-spin text-4xl mb-2 text-indigo-500" />
                                        <span class="text-sm font-medium">در حال پردازش نقشه صندلی‌ها...</span>
                                    </div>

                                    <!-- نقشه ECharts -->
                                    <v-chart
                                        v-else-if="registeredMaps.has(idx)"
                                        :ref="(el) => setChartRef(el, idx)"
                                        class="w-full h-full"
                                        :option="getChartOption(idx)"
                                        :init-options="{ renderer: 'svg' }"
                                        autoresize
                                        @mouseover="(p) => handleChartMouseOver(p, idx)"
                                        @mouseout="() => handleChartMouseOut(idx)"
                                    />

                                    <!-- پیام خالی -->
                                    <div v-else class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                        </svg>
                                        <span class="text-sm">فایل SVG نقشه صندلی‌ها را آپلود کنید</span>
                                    </div>

                                    <!-- نوار کنترل زوم -->
                                    <div
                                        v-if="registeredMaps.has(idx)"
                                        class="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <button
                                            type="button"
                                            class="zoom-btn"
                                            title="بزرگ‌نمایی"
                                            @click="zoomIn(idx)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            class="zoom-btn"
                                            title="بازنشانی نما"
                                            @click="resetZoom(idx)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            class="zoom-btn"
                                            title="کوچک‌نمایی"
                                            @click="zoomOut(idx)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- راهنمای تعامل -->
                                    <div
                                        v-if="registeredMaps.has(idx)"
                                        class="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm pointer-events-none"
                                    >
                                        💡 جابجایی با کشیدن ماوس | زوم با اسکرول ماوس
                                    </div>
                                </div>

                                <!-- راهنمای رنگ‌بندی صندلی‌ها -->
                                <div
                                    v-if="registeredMaps.has(idx)"
                                    class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300"
                                >
                                    <div class="font-bold flex items-center">راهنمای رنگ‌ها:</div>
                                    <div class="flex items-center gap-1">
                                        <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30" :style="`background:${COLORS.recognized}`"></span>
                                        صندلی شناخته‌شده (مجاز)
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30" :style="`background:${COLORS.notRecognized}`"></span>
                                        صندلی ناشناخته (خطا)
                                    </div>
                                    <div v-if="floorStats[idx]?.duplicates > 0" class="flex items-center gap-1">
                                        <span class="w-3.5 h-3.5 rounded-sm inline-block border border-black/30" :style="`background:${COLORS.duplicate}`"></span>
                                        صندلی تکراری
                                    </div>
                                </div>

                                <!-- پیام خطای نقشه -->
                                <div v-if="floorMapData[idx]?.error" class="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm text-center font-medium">
                                    ⚠️ {{ floorMapData[idx].error }}
                                </div>
                            </div>
                        </template>

                        <!-- پیام خالی بودن طبقات -->
                        <div v-if="fields.length === 0" class="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">
                            هیچ طبقه‌ای تعریف نشده. از دکمه «+ طبقه» استفاده کنید.
                        </div>
                    </div>
                </div>

                <!-- دکمه ارسال فرم -->
                <div class="col-span-2 col-start-4 mt-2">
                    <button v-if="!hallId" class="good-btn" type="submit">ایجاد سالن</button>
                    <button
                        v-else
                        class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        type="submit"
                    >
                        ویرایش سالن
                    </button>
                </div>
            </div>
        </form>

        <!-- اسپینر بارگذاری -->
        <div :class="getHallServiceCall.isFetched || !getHallServiceCall.isLoading ? 'hidden' : ''">
            <PrSpinner class="animate-spin mx-auto text-3xl mt-8" />
        </div>
    </div>
</template>

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

.form-input {
    @apply mt-1 py-2 border border-gray-300 dark:border-gray-600 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100;
}

.good-btn {
    @apply block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
}

.zoom-btn {
    @apply w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm;
}
</style>
