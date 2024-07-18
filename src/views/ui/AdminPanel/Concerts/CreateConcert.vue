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
import tippy from 'tippy.js'
import Panzoom from '@panzoom/panzoom'
const router = useRouter()
const route = useRoute()
const placeId = !route.params.id ? null : route.params.id
const hallId = !route.params.hallId ? null : route.params.hallId

const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})

const [concertTitle] = defineField('concert.title')
const [concertDesc] = defineField('concert.description')
const cocertCardImage = defineField('concert.image')
const cocertPosterImage = defineField('concert.poster')

const [concertCategory] = defineField('concert.catergory')
const [concertPlace] = defineField('concert.place')
const [concertPromoter] = defineField('concert.promoter')

const { push, remove, fields } = useFieldArray('events')
const eventFields = {
    id: null,
    hallId: null,
    startSaleDate: new Date(),
    endSaleDate: new Date(),
    executionDate: new Date(),
    Note: '',
    SeatsInfo: []
}
const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {
    console.log(data)

    const Data = {
        ...data.hall,
        Title: data.concert.title,
        PlaceId: placeId,
        Description: data.concert.description,
        lng: Number(data.concert.lng),
        lat: Number(data.concert.lat),
        FloorInfoDtos: [
            ...data.floors.map((x, index) => ({
                floorId: x?.floorId,
                Title: x.title,
                DisplayOrder: index,
                seatMap: x.seatMap,
                SeatsInfo: { ItemTitle: x.seatsInfo.itemTitle, Items: [...x.seatsInfo.items] }
            }))
        ]
    }
    console.log(Data)
    const formData = new FormData()
    let offset = 0
    if (!!data.concert.image && data.concert.image?.length != 0) {
        formData.append('Files.Files[' + 0 + '].File', data.concert.image[0])
        formData.append('Files.Files[' + 0 + '].Key', 'hall')
        offset++
    }
    Data.FloorInfoDtos.forEach((item, index) => {
        if (!item.seatMap) return
        formData.append('Files.Files[' + (index + offset) + '].File', item.seatMap)
        formData.append('Files.Files[' + (index + offset) + '].Key', index)

        delete item.seatMap
    })

    if (!formData.has('Files.Files[0].File')) formData.append('Files.Files', null)

    formData.append('Hall', JSON.stringify(Data))

    console.log(formData)

    if (!hallId) {
        mutate(
            {
                url: '/api/Place/CreateHall?api-version=1.0',
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
                    router.push({ name: 'managePlace', params: { id: placeId } })
                }
            }
        )
    } else {
        mutate(
            {
                url: '/api/Place/UpdateHall?api-version=1.0',
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
                    router.push({ name: 'managePlace', params: { id: placeId } })
                }
            }
        )
    }
})

const styles = useCssModule('map')

const seatMapErrors = reactive({})
const seatMapMessages = reactive({})
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
        console.log(queryKey)
        return sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        })
    },
    enabled: placeSelected
})

const getHallServiceCall = useQuery({
    queryKey: ['/api/Place/GetHallById', hallId],
    queryFn: () => GetHallService(hallId),
    enabled: !!hallId
})

watch(concertPlace, () => {
    if (fields.value.length !== 0) {
        for (let index = 0; index < fields.value.length + 1; index++) {
            remove(index)
            console.log(remove(index))
        }
    }
    tempHallId.value = null
})

function showSeatMap(seatMap_url, floorSeats, key, idx) {
  
    
    var reader = new FileReader()
    reader.onload = function (e) {
        var svgData = e.target.result
        var parser = new DOMParser()
        var tempDoc = parser.parseFromString(svgData, 'image/svg+xml')

        let CriticalIds = []
        tempDoc.querySelector('svg').classList.add('w-full', 'mx-auto')
        tempDoc.querySelectorAll('defs').forEach((def) => {
            def.querySelectorAll('[id]').forEach((item) => CriticalIds.push(item.id))
        })

        CriticalIds.forEach((tagId) => {
            let newId = tagId + '_' + idx
            tempDoc.querySelector('svg').innerHTML = tempDoc.querySelector('svg').innerHTML.replaceAll('id="' + tagId + '"', 'id="' + newId + '"')
            tempDoc.querySelector('svg').innerHTML = tempDoc.querySelector('svg').innerHTML.replaceAll('#' + tagId, '#' + newId)
        })

        floorSeats.forEach((seat) => {
            let seatElem = tempDoc.querySelector(`*[id="${seat.name}"]`)
            seatElem?.setAttribute('tid', seat.floorSeatId)
            seatElem?.classList?.add(styles['recongnized'])
        })

        document.querySelector('#' + key + '_' + idx).innerHTML = tempDoc.querySelector('svg')?.outerHTML ?? ''
        console.log(document);
        try{
        panZoomInit(document.querySelector('#' + key + '_' + idx), idx);
        }catch(err){
                console.log(err);
        }
        setupTippy(document.querySelector('#' + key + '_' + idx));
        setFieldValue(key + '.' + idx + '.seatsInfo.items', floorSeats)
    }

    getFile({
        baseUrl: FILE_PROVIDER,
        url: '?fileName=' + seatMap_url,
        method: 'GET'
    }).then((file) => {
        reader.readAsText(file)
    });
    return "monted";
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
function setupTippy(map){
    if(!map || !document.getElementById(map.id))
    return;

    if (map.getAttribute('setupTippy')) return
    map.setAttribute('setupTippy', 'true')

    map.querySelectorAll(`*[id^="f"]`).forEach((item) => {
      
        tippy(item, {
          
            onTrigger(instance, event) {
                console.log(item);
                instance.setContent(`محتواها`)
            }
        })
    })
}
watch([getHallServiceCall.data, getHallServiceCall.dataUpdatedAt], async () => {
    if (!getHallServiceCall.data.value && !hallId && !getHallServiceCall.isFetched) return
    const data = getHallServiceCall.data.value
    const formData = {
        hall: {
            title: data?.title,
            id: data.id,
            lat: data.lat,
            lng: data.lng,
            description: data.description
        },
        floors: [...data.floorInfoDtos]
    }

    await resetForm({ values: formData })

    formData.floors.forEach((floor, index) => {
        fetch(FILE_PROVIDER + '?fileName=' + floor.seatMap_url, {
            method: 'GET'
        })
            .then((res) => {
                return res.blob()
            })
            .then((res) => {
                return res
            })
            .then((data) => {
                ;(async function () {
                    console.log(data)
                })()

                showSeatMap([data], 'floors', index)
            })
            .catch((e) => {
                console.error(e)
            })
    })
})
const tempHallId = ref(null)
const categories = computed(() => getCategoryServiceCall.data.value?.filter((x) => x.parentId != null)?.map((x) => ({ label: x.title, value: x.id, parent: getCategoryServiceCall.data.value.find((y) => y.id === x.parentId)?.title })))
const places = computed(() => getPlacesServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.city })))
const promoters = computed(() => getPromotersServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.categoryName })))
const halls = computed(() => getHallsServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: places.value.find((y) => y.value === x.placeId)?.title })))
</script>

<template>
    <div>
        <div class="sticky top-0" style="z-index: 1000">
            <div class="!bg-white h-fit">
                <Splitter v-if="!hallId" border-class=" border-black " title="کنسرت جدید" title-class="text-black" type="middle" />
                <Splitter v-else border-class=" border-black " title="ویرایش یک سالن برگزاری" title-class="text-black" type="middle" />
            </div>
            <div class="my-2 mx-1 flex flex-row-reverse">
                <button class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="router.push({ name: 'AllConcerts' })">
                    <CiCircleChevLeft class="scale-125 font-bold" />
                </button>
            </div>
        </div>

        <form @submit.prevent="onSubmit" :class="!getHallServiceCall.isFetched && getHallServiceCall.isLoading ? 'hidden' : ''">
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
                                hallImage[0].value = $event.target.files
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
                                hallImage[0].value = $event.target.files
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
                        <div class="col-start-2 col-span-2">
                            <DateTimePicker />
                        </div>

                        <div class="col-span-full"></div>
                        <template v-for="(filed, id) in fields" :key="'event' + id">
                            <div class="col-span-full my-2">
                                <div class="flex items-center">
                                    <hr class="flex-grow border-t border-gray-300" />
                                    <span class="px-3 text-gray-900"> <span @click.prevent="remove(id)" class="text-red-500 hover:animate-pulse text-base rounded-full p-1 inline">🗑️</span> رویداد شماره {{ id + 1 }} </span>

                                    <hr class="flex-grow border-t border-gray-300" />
                                </div>
                            </div>
                            <div class="col-start-2 col-span-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ شروع فروش</label>
                                <Field :name="`events[${id}].startSaleDate`" v-slot="{ field }">
                                    <DateTimePicker v-bind="field" />
                                </Field>
                            </div>
                            <div class="col-start-4 col-span-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ پایان فروش</label>
                                <Field :name="`events[${id}].endSaleDate`" v-slot="{ field }">
                                    <DateTimePicker v-bind="field" />
                                </Field>
                            </div>
                            <div class="col-start-6 col-span-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ اجرا</label>
                                <Field :name="`events[${id}].executionDate`" v-slot="{ field }">
                                    <DateTimePicker v-bind="field" />
                                </Field>
                            </div>
                            <div class="col-start-2 col-span-2 mt-1">
                                <label class="block text-sm font-medium text-gray-700">نکته</label>
                                <input class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div class="col-start-6 col-span-2 mt-1">
                                <label class="block text-sm font-medium text-gray-700">سالن برگزاری</label>
                                <div class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    <span>{{ halls.find((x) => x.value === filed.value.hallId)?.label }}</span>
                                </div>
                            </div>
                            <div class="col-start-2 col-span-6 mt-1">
                                <div class="text-center">طبقات</div>
                                <div class="w-full bg-gray-50 shadow-inner sm:px-0 rounded-md">
                                    <TabGroup :default-index="0">
                                        <TabList class="flex !justify-between rounded-xl bg-blue-900/20 p-1" >
                                            <Tab v-for="(floor, idx) in getHallsServiceCall.data.value.find((x) => x.id == filed.value.hallId).floorInfoDtos" as="template" :key="floor.title + idx" v-slot="{ selected }">
                                                <button :class="['w-full rounded-lg py-2.5 text-sm font-medium leading-5', selected ? 'dark:!text-white !text-white !bg-indigo-400 shadow' : 'text-gray-900 hover:bg-indigo-200 hover:text-black']">
                                                    {{ floor.title }}
                                                </button>
                                            </Tab>
                                        </TabList>

                                        <TabPanels class="mt-2">

                                                <TabPanel :unmount="false"  v-for="(floor, idx) in getHallsServiceCall.data.value.find((x) => x.id == filed.value.hallId).floorInfoDtos" :key="'eventMap'+id+idx"  :class="[' rounded-md p-3 max-h-[500px] min-h-[500px] overflow-auto']">
                                                <div :id="'mapElm' + idx">
                                                    <div :id="`floor_${idx}`" @click.prevent="(()=>{})"></div>
                                                    <div class="flex justify-center">
                                                        <div>
                                                            <button type="button" class="btn btn-sm bg-green-300 btnZoomIn text-base"><PxZoomIn /></button>
                                                        </div>
                                                        <div>
                                                            <button type="button" class="btn btn-sm bg-green-300 btnZoomReset text-base"><FlFilledZoomFit /></button>
                                                        </div>
                                                        <div>
                                                            <button type="button" class="btn btn-sm bg-green-300 btnZoomOut text-base"><PxZoomOut /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                              
                                            </TabPanel>

                                          
                                       
                                        </TabPanels>
                                    </TabGroup>
                                    <!-- I load image by pure js-->
                                   <template v-for="(floor, idx) in getHallsServiceCall.data.value.find((x) => x.id == filed.value.hallId).floorInfoDtos">
                                        {{ showSeatMap(floor.seatMap_url, floor.seatsInfo.items, 'floor', idx) }}
                                   </template>
                                </div>
                            </div>
                        </template>
                        <div class="col-span-full my-2">
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

                                    <button
                                        class="btn h-fit text-gray-50 bg-green-600 rounded-lg w-fit text-nowrap py-2.5 self-center"
                                        @click.prevent="
                                            () => {
                                                push({ ...eventFields, hallId: tempHallId })
                                                tempHallId = null
                                            }
                                        "
                                    >
                                        + رویداد جدید
                                    </button>
                                </span>

                                <hr class="flex-grow border-t border-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-2 col-start-4">
                    <button v-if="!hallId" class="good-btn" type="submit">ایجاد</button>
                    <button v-else class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" type="submit">ویرایش</button>
                </div>
            </div>
        </form>
        <div :class="getHallServiceCall.isFetched || !getHallServiceCall.isLoading ? 'hidden' : ''">
            <PrSpinner class="animate-spin mx-auto text-3xl mt-8" />
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
</style>
<style scoped>
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
