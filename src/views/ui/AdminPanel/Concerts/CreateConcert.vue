<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { PxZoomOut, PxZoomIn } from '@kalimahapps/vue-icons/px'
import { FlFilledZoomFit } from '@kalimahapps/vue-icons/fl'
import { Field, useFieldArray, useForm } from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { CRPlacesService, GetHallService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { computed, reactive, ref, useCssModule, watch } from 'vue'
import { FILE_PROVIDER } from '@/config/appConfig'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import vueSelectUmd from 'vue-select'
import { sendRequest, getFile } from '@/services/service'
import randomColor from 'randomcolor'
import tippy from 'tippy.js'
import Panzoom from '@panzoom/panzoom'

import dateHelper from '@/utils/dateHelper'

const dateOption = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}
const router = useRouter()
const route = useRoute()
// تنظمیات فرم
const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})
const [concertTitle] = defineField('concert.title')
const [concertDesc] = defineField('concert.description')
const cocertCardImage = defineField('concert.image')
const concertStartDate = defineField('concert.startdate')
const cocertEndDate = defineField('concert.enddate')
const cocertPosterImage = defineField('concert.poster')
const [concertCategory] = defineField('concert.category')
const [concertPlace] = defineField('concert.place')
const [concertPromoter] = defineField('concert.promoter')
const { push, remove, fields, replace } = useFieldArray('events')
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
//console.log(route.params.concertId)
const getConceretServiceCall = useQuery({
    queryKey: ['/api/Manager/GetConcertWithDetails/', concertId],
    queryFn: async ({ queryKey }) => {
        //console.log(queryKey)
        const data = await sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        })
        return data
    },
    enabled: !!concertId
})

const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    // console.log(dateHelper.dateToISO(data.concert.startdate))

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
            Items: [
                ...data.events.map((event) => {
                    return { ...event, StartSaleDate: dateHelper.persianStringToISO(event.StartSaleDate), EndSaleDate: dateHelper.persianStringToISO(event.EndSaleDate), ExecutionDate: dateHelper.persianStringToISO(event.ExecutionDate) }
                })
            ]
        }
    }

    const formData = new FormData()
    let offset = 0
    if (!!data.concert.image && data.concert.image?.length != 0) {
        formData.append('Files.Files[' + 0 + '].File', data.concert.image[0])
        formData.append('Files.Files[' + 0 + '].Key', 'img_url')
        offset++
    }

    if (!!data.concert.poster && data.concert.poster?.length != 0) {
        formData.append('Files.Files[' + offset + '].File', data.concert.poster[0])
        formData.append('Files.Files[' + offset + '].Key', 'poster')
        offset++
    }

    if (!formData.has('Files.Files[0].File')) formData.append('Files.Files', null)

    formData.append('Concert', JSON.stringify(Data))
    if (!concertId) {
        mutate(
            {
                url: '/api/Manager/CreateConcert?api-version=1.0',
                body: formData,
                method: 'POST'
            },
            {
                onSuccess: async (data) => {
                    await Swal.fire({
                        text: 'با موفقیت ایجاد شد!',
                        icon: 'success',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                    router.push({ name: 'ManageConcerts' })
                }
            }
        )
    } else {
        mutate(
            {
                url: '/api/Manager/UpdateConcert?api-version=1.0',
                body: formData,
                method: 'PATCH'
            },
            {
                onSuccess: async (data) => {
                    await Swal.fire({
                        text: 'با موفقیت بروز شد!',
                        icon: 'success',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                    router.push({ name: 'ManageConcerts' })
                }
            }
        )
    }
})

const styles = useCssModule('map')

// SVG مپ های لود شده داخل این قرار میگیره
const seatMaps = reactive({})
const getCategoryServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetCategories'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: true
})
const getPlacesServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetPlaces'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: true
})
const getPromotersServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetPromoters'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: true
})
const placeSelected = computed(() => !!concertPlace.value)
const getHallsServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetHallsAndFloorsByPlaceId?Id=', concertPlace],
    queryFn: ({ queryKey }) => {
        //console.log(queryKey)
        return sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        })
    },
    enabled: placeSelected
})

watch(concertPlace, () => {
    if (concertId) return
    if (fields.value.length !== 0) {
        for (let index = 0; index < fields.value.length + 1; index++) {
            remove(index)
            // console.log(remove(index))
        }
    }
    tempHallId.value = null
})

function showSeatMap(seatMap_url, floorSeats, key, idx, EventId) {
    if (document.querySelector('#event_' + EventId + '_' + key + '_' + idx + ' svg')) return
    //idx floorIndex
    // EventId EventIndex
    var reader = new FileReader()
    reader.onload = function (e) {
        var svgData = e.target.result
        var parser = new DOMParser()
        var tempDoc = parser.parseFromString(svgData, 'image/svg+xml')
        //'events[' + EventId + ']SeatsInfo['+idx+']'
        const pValue = values?.events[EventId]?.SeatsInfo?.[idx] ?? []
        const AllSeats = [...(floorSeats.filter((x) => !pValue.find((y) => x.floorSeatId == y.floorSeatId)) ?? []), ...pValue]

        let CriticalIds = []
        tempDoc.querySelector('svg').classList.add('w-full', 'mx-auto')
        tempDoc.querySelectorAll('defs').forEach((def) => {
            def.querySelectorAll('[id]').forEach((item) => CriticalIds.push(item.id))
        })

        CriticalIds.forEach((tagId) => {
            let newId = tagId + '_' + EventId + '_' + +idx
            tempDoc.querySelector('svg').innerHTML = tempDoc.querySelector('svg').innerHTML.replaceAll('id="' + tagId + '"', 'id="' + newId + '"')
            tempDoc.querySelector('svg').innerHTML = tempDoc.querySelector('svg').innerHTML.replaceAll('#' + tagId, '#' + newId)
        })

        AllSeats.forEach((seat, index) => {
            let seatElem = tempDoc.querySelector(`*[id="${seat.name}"]`)
            if (!seatElem) return

            if (!seat.isReserved) seatElem?.setAttribute('tid', seat.floorSeatId)
            seatElem?.setAttribute('tIndex', index)
            seatElem?.setAttribute('eventIndex', EventId)
            seatElem?.setAttribute('floorIndex', idx)

            if (seat.price > 0) {
                if (!priceClassColor[EventId]) priceClassColor[EventId] = {}

                if (!priceClassColor[EventId][seat.price])
                    priceClassColor[EventId][`${seat.price}`] = randomColor({
                        luminosity: 'bright',
                        format: 'rgb'
                    })

                seatElem.classList.remove(...Object.values(styles))
                seatElem.style.fill = priceClassColor[EventId][seat.price]
            } else seatElem?.classList?.add(styles['recongnized'])
        })

        seatMaps['event_' + EventId + '_' + key + '_' + idx] = tempDoc.querySelector('svg')?.outerHTML ?? ''

        try {
            panZoomInit(document.querySelector('#event_' + EventId + '_' + key + '_' + idx), idx)
        } catch (err) {
            //console.log(err)
        }

        setFieldValue('events[' + EventId + ']SeatsInfo[' + idx + ']', [...AllSeats])
    }

    getFile({
        baseUrl: FILE_PROVIDER,
        url: '?fileName=' + seatMap_url,
        method: 'GET'
    }).then((file) => {
        reader.readAsText(file)
    })
    return null
}
function panZoomInit(map, index) {
    if (!map || !document.getElementById(map.id)) return

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
}
function setupTippy(map) {
    if (!map || !document.getElementById(map.id)) return

    if (!document.getElementById(map.id).querySelector('svg')) return

    if (map.getAttribute('setupTippy')) return
    map.setAttribute('setupTippy', 'true')

    map.querySelectorAll(`*[id^="f"][tid]`).forEach((item) => {
        tippy(item, {
            onTrigger(instance, event) {
                if (!event.target.getAttribute('eventIndex')) setTicket(event, Number(event.target.getAttribute('eventIndex')))

                const [floor, row, column] = event.target.id.replace('f', '').replace('r', '').replace('c', '').split('_');
                const listPrice =priceClassColor[Number(event.target.getAttribute('eventIndex'))];
                const price = Object.keys(listPrice).find((key) => listPrice[key] === event.target.style.fill) ?? 'تعیین نشده'

                instance.setContent(`<div class="direction-rtl vazir-font text-right">
        <p>طبقه : ${floor}</p>
        <p>ردیف : ${row}</p>
        <p>ستون :${column}</p>
    <p style="background:${event.target.style.fill}">قیمت : ${price} تومان</p>
</div>`)
            },
            allowHTML:true
        })
    })
}

const tempHallId = ref(null)
const categories = computed(() => getCategoryServiceCall.data.value?.filter((x) => x.parentId != null)?.map((x) => ({ label: x.title, value: x.id, parent: getCategoryServiceCall.data.value.find((y) => y.id === x.parentId)?.title })))
const places = computed(() => getPlacesServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.city })))
const promoters = computed(() => getPromotersServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.categoryName })))
const halls = computed(() => getHallsServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: places.value.find((y) => y.value === x.placeId)?.title })))

async function setTicket(event, eventId) {
    if (event.ctrlKey) return

    const regex = /f[0-9]{1,3}_r[0-9]{1,3}_c[0-9]{1,9}/gm
    if (event.target.id.match(regex) === null) return

    if (!event.target.getAttribute('tid')) return

    let index = event.target.getAttribute('tindex')
    let floorIndex = event.target.getAttribute('floorindex')

    if (values.events[`${eventId}`].lock && values.events[`${eventId}`].price) {
        if (!priceClassColor[eventId]) priceClassColor[eventId] = {}

        if (!priceClassColor[eventId][values.events[`${eventId}`].price])
            priceClassColor[eventId][`${values.events[`${eventId}`].price}`] = await randomColor({
                luminosity: 'bright',
                format: 'rgb'
            })

        //const floorSeatId =await  event.target.getAttribute('tid')
        //let index = await values.events[`${eventId}`].SeatsInfo.Items.findIndex((item) =>{ return  item.floorSeatId === floorSeatId; })
        console.log(floorIndex)

        await setFieldValue('events[' + eventId + '].SeatsInfo[' + floorIndex + '][' + index + '].price', values.events[`${eventId}`].price)
        event.target.classList.remove(...Object.values(styles))
        event.target.style.fill = priceClassColor[eventId][values.events[`${eventId}`].price]
    }
    if (values.events[`${eventId}`].cleaner) {
        // const floorSeatId =await event.target.getAttribute('tid')

        event.target.classList.remove(...Object.values(styles))
        event.target.classList.add(styles['recongnized'])
        event.target.style.fill = 'unset'
        //let index = await values.events[`${eventId}`].SeatsInfo.Items.findIndex((item) => item.floorSeatId === floorSeatId)

        await setFieldValue('events[' + eventId + '].SeatsInfo[' + floorIndex + '][' + index + '].price', 0)
    }
}

// به ازای هر رویداد در یک آبجکت به ازای هر قیمت رنگی رندوم ذخیره میشود
const priceClassColor = reactive({})

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

function setExecEvent(e, eventId) {}

watch([getConceretServiceCall.data], async () => {
    //JSON.parse(JSON.stringify(getConceretServiceCall.data.value),toCamelCase));
    setFieldValue('concert.place', getConceretServiceCall.data.value.placeId)

    resetForm({
        values: {
            concert: {
                title: getConceretServiceCall.data.value.title,
                description: getConceretServiceCall.data.value.description,
                startdate: new Date(getConceretServiceCall.data.value.startDate),
                enddate: new Date(getConceretServiceCall.data.value.endDate),
                category: getConceretServiceCall.data.value.categoryId,
                place: getConceretServiceCall.data.value.placeId,
                promoter: getConceretServiceCall.data.value.promoterId
            },
            events: [
                ...getConceretServiceCall.data.value.events.items.map((event) => {
                    let sDate = event.startSaleDate.replace('T', ' ')
                    let eDate = event.endSaleDate.replace('T', ' ')
                    let exDate = event.executionDate.replace('T', ' ')
                    return {
                        EventId: event.eventId,
                        hallId: event.hallId,
                        StartSaleDate: sDate,
                        EndSaleDate: eDate,
                        ExecutionDate: exDate,
                        Note: '',
                        SeatsInfo: {
                            ...event.seatsInfo
                        },
                        lock: false,
                        price: 0,
                        cleaner: false
                    }
                })
            ]
        }
    })
})

function addNewEvent() {
    priceClassColor[fields.length === 0 ? fields.length : fields.length - 1] = {}
    push({ ...eventFields, hallId: tempHallId.value })
    tempHallId.value = null
}
</script>

<template>
    <div>
        <div class="sticky top-0 z-40 h-fit">
            <div class="">
                <div class="w-full">
                    <div class="h-fit">
                        <div class="w-full !bg-white">
                            <Splitter v-if="!concertId" border-class="border-black " title="کنسرت جدید" title-class="text-black" type="middle" />
                            <Splitter v-else border-class="border-black " title="ویرایش یک سالن برگزاری" title-class="text-black" type="middle" />
                        </div>
                    </div>
                    <div class="flex flex-row-reverse mx-1 my-2">
                        <button class="items-center px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm w-fit hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="router.push({ name: 'AllConcerts' })">
                            <CiCircleChevLeft class="font-bold scale-125" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <form @submit.prevent="onSubmit" :class="!getConceretServiceCall.isFetched && getConceretServiceCall.isLoading ? 'hidden' : ''">
            <div class="grid grid-cols-8 gap-2">
                <div class="col-span-2 col-start-2">
                    <label class="block text-sm font-medium text-gray-700">نام</label>
                    <input v-model="concertTitle" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="text" />
                </div>
                <div class="col-span-2 col-start-4">
                    <label class="block text-sm font-medium text-gray-700" for="place-name">تصویر برای کارت </label>
                    <input
                        class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type="file"
                        @change="
                            ($event) => {
                                cocertCardImage[0].value = $event.target.files
                            }
                        "
                    />
                </div>
                <div class="col-span-2 col-start-6">
                    <label class="block text-sm font-medium text-gray-700" for="place-name">تصویر برای پوستر </label>
                    <input
                        class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type="file"
                        @change="
                            ($event) => {
                                cocertPosterImage[0].value = $event.target.files
                            }
                        "
                    />
                </div>
                <div class="col-span-2 col-start-2">
                    <label class="block text-sm font-medium text-gray-700">محل برگزاری</label>
                    <vue-Select-Umd
                        v-model="concertPlace"
                        :options="places"
                        :reduce="
                            (place) => {
                                return place.value
                            }
                        "
                        label="label"
                        class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
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
                    <label class="block text-sm font-medium text-gray-700">برگزار کننده</label>
                    <vue-Select-Umd
                        v-model="concertPromoter"
                        :options="promoters"
                        :reduce="
                            (place) => {
                                return place.value
                            }
                        "
                        label="label"
                        class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
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
                <div class="col-span-2 col-start-6">
                    <label class="block text-sm font-medium text-gray-700">دسته بندی</label>
                    <vue-Select-Umd
                        v-model="concertCategory"
                        :options="categories"
                        :reduce="
                            (cat) => {
                                return cat.value
                            }
                        "
                        label="label"
                        class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
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
                <div class="col-span-full">
                    <div class="grid grid-cols-8">
                        <div class="col-span-full"></div>

                        <template v-for="(filed, id) in fields" :key="'event' + id">
                            <div class="my-2 col-span-full">
                                <div class="flex items-center">
                                    <hr class="flex-grow border-t border-gray-300" />
                                    <span class="px-3 text-gray-900">
                                        <span
                                            @click.prevent="
                                                () => {
                                                    if (!filed.value.EventId) remove(id)
                                                }
                                            "
                                            class="relative inline p-1 text-base text-red-500 rounded-full hover:animate-pulse"
                                            :class="{ hidden: !!filed.value.EventId }"
                                            >❌</span
                                        >
                                        <span :class="{ hidden: !filed.value.EventId }">🚯</span> رویداد شماره {{ id + 1 }}
                                    </span>

                                    <hr class="flex-grow border-t border-gray-300" />
                                </div>
                            </div>
                            <div class="col-span-2 col-start-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ شروع فروش</label>
                                <Field :name="`events[${id}].StartSaleDate`" v-slot="{ field, componentField }">
                                    <AB-Date-Picker mode="single" type="datetime" click-on="all" format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD HH:mm" locale="fa" :column="1" :modal="false" auto-submit :show="false" display-format="jYYYY/jMM/jDD HH:mm" v-bind="field" v-model="componentField.modelValue" @select="setStartSaleEvent($event, id)" />
                                </Field>
                            </div>
                            <div class="col-span-2 col-start-4">
                                <label class="block text-sm font-medium text-gray-700">تاریخ پایان فروش</label>
                                <Field :name="`events[${id}].EndSaleDate`" v-slot="{ field, componentField }">
                                    <AB-Date-Picker mode="single" type="datetime" click-on="all" locale="fa" :column="1" display-format="jYYYY/jMM/jDD HH:mm" format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD  HH:mm" :modal="false" auto-submit :show="false" v-bind="field" v-model="componentField.modelValue" @select="setEndSaleEvent($event, id)" />
                                </Field>
                            </div>
                            <div class="col-span-2 col-start-6">
                                <label class="block text-sm font-medium text-gray-700">تاریخ اجرا</label>
                                <Field :name="`events[${id}].ExecutionDate`" v-slot="{ field, componentField }">
                                    <AB-Date-Picker mode="single" type="datetime" click-on="all" locale="fa" :column="1" display-format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD HH:mm" :modal="false" auto-submit format="jYYYY/jMM/jDD HH:mm" :show="false" v-bind="field" v-model="componentField.modelValue" @select="setExecEvent($event, id)" />
                                </Field>
                            </div>
                            <div class="col-span-2 col-start-2 mt-1">
                                <label class="block text-sm font-medium text-gray-700">نکته</label>
                                <input class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div class="col-span-2 col-start-6 mt-1">
                                <label class="block text-sm font-medium text-gray-700">سالن برگزاری</label>
                                <div class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    <span>{{ halls?.find((x) => x.value === filed.value.hallId)?.label }}</span>
                                </div>
                            </div>

                            <div class="col-span-6 col-start-2 mt-2">
                                <div class="text-right"><span class="border-b-2 border-gray-200">تعیین بلیت‌های رویداد</span></div>
                                <div class="relative grid grid-cols-4 p-2 mx-6 my-2 border-2 border-gray-300 rounded-md">
                                    <span class="block text-center bg-gray-200 rounded-md col-span-full">ابزار</span>
                                    <div class="flex justify-around col-span-2 mt-1">
                                        <label class="block text-xs font-medium leading-10 text-gray-700 w-fit text-nowrap">قیمت :</label>
                                        <Field v-slot="{ field }" :name="`events[${id}].price`">
                                            <input type="number" :disabled="values.events[id].cleaner" class="py-0.5 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" v-bind="field" />
                                        </Field>
                                    </div>
                                    <div class="flex items-center justify-around col-span-1 px-4 mt-1 select-none">
                                        <label class="block text-xs font-medium text-gray-700 text-nowrap">پاک کن:</label>
                                        <Field v-slot="{ field, value }" type="checkbox" :name="`events[${id}].cleaner`" :value="true" :unchecked-value="false">
                                            <span
                                                :class="{ 'strikethrough-v2': !field.checked }"
                                                @click.prevent="
                                                    () => {
                                                        if (!field.checked) setFieldValue(`events[${id}].price`, null)

                                                        setFieldValue(`events[${id}].cleaner`, !field.checked)
                                                    }
                                                "
                                                class="text-[1.5em] cursor-pointer"
                                                >🧹</span
                                            >

                                            <input type="checkbox" v-bind="field" :value="true" class="hidden w-4 h-4 mt-1 accent accent-blue-gray-800" />
                                        </Field>
                                    </div>
                                    <div class="flex items-center justify-around col-span-1 px-4 mt-1 select-none">
                                        <label class="block text-xs font-medium text-gray-700 text-nowrap">قفل اشاره گر:</label>
                                        <Field v-slot="{ field, value }" type="checkbox" :name="`events[${id}].lock`" :value="true" :unchecked-value="false">
                                            <span v-if="field.checked" @click.prevent="setFieldValue(`events[${id}].lock`, false)" class="text-xl cursor-pointer">🔒</span>
                                            <span v-else @click.prevent="setFieldValue(`events[${id}].lock`, true)" class="text-xl cursor-pointer">🔓</span>
                                            <input type="checkbox" v-bind="field" :value="true" class="hidden w-4 h-4 mt-1 accent accent-blue-gray-800" />
                                        </Field>
                                    </div>
                                    <div class="grid gap-1 my-2 sm:grid-cols-2 md:grid-cols-4 col-span-full xl:grid-cols-8">
                                        <button
                                            v-for="(price, key) in Object.keys(priceClassColor[id] ?? {})"
                                            :key="'price' + price"
                                            class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1 px-2 rounded-md border border-gray-900 text-gray-900 focus:ring focus:ring-gray-300 active:opacity-[0.85] flex items-center gap-3 justify-between"
                                            :class="{ 'ring ring-gray-500 ring-1': price == values.events[id].price }"
                                            @click.prevent="
                                                () => {
                                                    setFieldValue(`events.${id}.cleaner`, false)
                                                    setFieldValue(`events.${id}.price`, Number(price))
                                                }
                                            "
                                            type="button"
                                        >
                                            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: priceClassColor[id][price] }"></div>
                                            <div>{{ price }}</div>
                                        </button>
                                    </div>
                                </div>
                                <div class="w-full rounded-md shadow-inner bg-gray-50 sm:px-0">
                                    <TabGroup :default-index="0">
                                        <TabList class="flex !justify-between rounded-xl bg-blue-900/20 p-1">
                                            <Tab v-for="(floor, idx) in getHallsServiceCall.data.value?.find((x) => x.id == filed.value.hallId).floorInfoDtos" as="template" :key="floor.title + idx" v-slot="{ selected }">
                                                <button :class="['w-full rounded-lg py-2.5 text-sm font-medium leading-5', selected ? 'dark:!text-white !text-white !bg-indigo-400 shadow' : 'text-gray-900 hover:bg-indigo-200 hover:text-black']">
                                                    {{ floor.title }}
                                                </button>
                                            </Tab>
                                        </TabList>

                                        <TabPanels class="mt-2">
                                            <TabPanel :unmount="false" v-for="(floor, idx) in getHallsServiceCall.data.value?.find((x) => x.id == filed.value.hallId).floorInfoDtos" :key="'eventMap' + id + idx" :class="[' rounded-md p-3 max-h-[500px] min-h-[500px] overflow-auto']">
                                                <div :id="'mapElm' + idx">
                                                    <div :id="`event_${id}_floor_${idx}`" class="!cursor-crosshair" @click.prevent="() => {}" :ref="(el) => setupTippy(el)" v-html="seatMaps[`event_${id}_floor_${idx}`] ?? ''"></div>
                                                    <div class="flex justify-center">
                                                        <div>
                                                            <button type="button" class="text-base bg-green-300 btn btn-sm btnZoomIn">
                                                                <PxZoomIn />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button type="button" class="text-base bg-green-300 btn btn-sm btnZoomReset">
                                                                <FlFilledZoomFit />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button type="button" class="text-base bg-green-300 btn btn-sm btnZoomOut">
                                                                <PxZoomOut />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </TabPanels>
                                    </TabGroup>
                                    <!-- I load image by pure js-->
                                    <template v-for="(floor, idx) in getHallsServiceCall.data.value?.find((x) => x.id == filed.value.hallId).floorInfoDtos">
                                        {{ showSeatMap(floor.seatMap_url, floor.seatsInfo.items, 'floor', idx, id) }}
                                    </template>
                                </div>
                            </div>
                        </template>
                        <div class="my-2 col-span-full">
                            <div class="flex items-center">
                                <hr class="flex-grow border-t border-gray-300" />
                                <span class="px-3 text-gray-500 flex w-fit grid grid-cols-3 w-[300px] gap-1">
                                    <div class="col-span-2">
                                        <vue-Select-Umd v-model="tempHallId" :options="halls ?? []" :reduce="(h) => h.value" label="label" class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser">
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
                                            <!-- eslint-disable-next-line vue/no-unused-vars  -->
                                            <template #no-options="{ search, searching, loading }"> یک مکان برگزاری انتخاب شود </template>
                                        </vue-Select-Umd>
                                    </div>

                                    <button class="btn h-fit text-gray-50 bg-green-600 rounded-lg w-fit text-nowrap py-2.5 self-center" @click.prevent="addNewEvent">+ رویداد جدید</button>
                                </span>

                                <hr class="flex-grow border-t border-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-2 col-start-4">
                    <button v-if="!concertId" class="good-btn" type="submit">ایجاد</button>
                    <button v-else class="items-center block px-4 py-2 mx-auto text-white bg-orange-600 border border-transparent rounded-md shadow-sm w-fit hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" type="submit">ویرایش</button>
                </div>
            </div>
        </form>
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
    @apply !text-gray-50 !bg-info shadow-md;
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

    @apply w-full bg-transparent rounded-lg mx-2;
}

.tab-active {
    @apply dark:!text-white !text-white !bg-indigo-400;
}

.tabs {
    @apply bg-gray-50 p-1 rounded-md shadow-inner;
}

.form-input {
    @apply mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md;
}

.good-btn {
    @apply block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
}
</style>

<style module="map">
.recongnized {
    fill: greenyellow !important;
}

.not-recongnized {
    fill: red !important;
}
</style>
