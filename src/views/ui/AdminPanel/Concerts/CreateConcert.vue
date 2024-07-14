<script setup>
import { useFieldArray, useForm } from 'vee-validate'
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
import { sendRequest } from '@/services/service'
const router = useRouter()
const route = useRoute()
import DatePicker from 'vue3-persian-datetime-picker'
const placeId = !route.params.id ? null : route.params.id
const hallId = !route.params.hallId ? null : route.params.hallId

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
const getHallsServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetHallsByPlaceId?Id='],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: false
})
//
const getHallServiceCall = useQuery({
    queryKey: ['/api/Place/GetHallById', hallId],
    queryFn: () => GetHallService(hallId),
    enabled: !!hallId
})

const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})

const [concertTitle] = defineField('concert.title')
const [concertDesc] = defineField('concert.description')
const cocertCardImage = defineField('concert.image')
const cocertPosterImage = defineField('concert.poster')

const [concertCategory] = defineField('concert.catergory')
const [concertPlace] = defineField('concert.place')
const [concertPromoter] = defineField('concert.promoter')

const { push, remove, fields} = useFieldArray('events')
const eventFields = {
    id : null,
    hallId : null,
    startSaleDate : new Date(),
    endSaleDate : new Date(),
    executionDate : new Date(),
    Note : "",
    SeatsInfo : [] 
};
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
function showSeatMap(files, key, idx) {
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

        let seats = []
        let intersects = []
        tempDoc?.querySelectorAll(`*[id^="f"][id*="_"][id*="r"][id*="c"]`).forEach((item) => {
            if (item.id.startsWith('f' + idx) && !isNaN(Number(item.id.split('_')[2].replace('c', '')))) {
                item.classList.add(styles['recongnized'])

                if (values.floors[idx].seatsInfo.items.find((x) => x.name === item.id)) intersects.push(item.id)
                else seats.push({ Name: item.id })
            } else {
                item.classList.add(styles['not-recongnized'])
                seatMapErrors[idx] = 'صندلی‌های قرمز رنگ، شناخته نشده اند لطفا تصحیح کنید'
            }
        })

        console.log(intersects)

        seatMapMessages[idx] = seats.reduce((acc, val) => {
            let temp = val
                .replace('f', '')
                .replace('r', '')
                .replace('c', '')
                .split('_')
                .map((x) => Number(x))

            if (!acc[temp[0]]) acc[temp[0]] = {}

            if (!acc[temp[0]][temp[1]]) acc[temp[0]][temp[1]] = []

            acc[temp[0]][temp[1]].push(temp[2])

            return acc
        }, {})

        document.querySelector('#' + key + '_' + idx).innerHTML = tempDoc.querySelector('svg')?.outerHTML ?? ''
        setFieldValue(key + '.' + idx + '.seatsInfo.items', seats)

        //Do whatever you want with pathTags
    }
    reader.readAsText(files[0])
}

function handleSeatMapOnTab(newIds) {
    console.log(newIds)
    newIds.forEach((newIdx) => {
        console.log('#floors_' + newIdx + ' svg', document.querySelector('#floors_' + newIdx + ' svg'))
        if (!document.querySelector('#floors_' + newIdx + ' svg')) {
            seatMapErrors[newIdx] = 'نقشه نامعتبر است!'
            return
        }
        document
            .querySelector('#floors_' + newIdx)
            ?.querySelectorAll(`*[id^="f"][id*="_"][id*="r"][id*="c"]`)
            .forEach((item) => {
                if (!item.id.startsWith('f' + newIdx) && isNaN(Number(item.id.split('_')[2].replace('c', '')))) {
                    item.classList.add(styles['not-recongnized'])
                    seatMapErrors[newIdx] = 'صندلی‌های قرمز رنگ، شناخته نشده اند لطفا تصحیح کنید'
                }
            })
    })

    console.log(seatMapErrors)
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

const categories = computed(() => getCategoryServiceCall.data.value?.filter((x) => x.parentId != null)?.map((x) => ({ label: x.title, value: x.id, parent: getCategoryServiceCall.data.value.find((y) => y.id === x.parentId)?.title })))
const places = computed(() => getPlacesServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.city })))
const promoters = computed(() => getPromotersServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id, parent: x.categoryName })))
//getCategoryServiceCall
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
                        <template v-for="(filed,id) in fields" :key="'event'+id">
                                <div class="col-span-full my-2">
                                    <div class="flex items-center"> 
                                        <hr class="flex-grow border-t border-gray-300"> 
                                        <span class="px-3 text-gray-900"> 
                                   <span class="text-red-500 hover:animate-pulse text-base rounded-full p-1 inline">🗑️</span>     رویداد شماره   {{id+1}}
                                        </span> 
                                        
                                        <hr class="flex-grow border-t border-gray-300"> 
                                    </div>
                                </div>
                            <div class="col-start-2 col-span-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ شروع فروش</label>
                                <DateTimePicker />
                            </div>
                            <div class="col-start-4 col-span-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ پایان فروش</label>
                                <DateTimePicker />
                            </div>
                            <div class="col-start-6 col-span-2">
                                <label class="block text-sm font-medium text-gray-700">تاریخ اجرا</label>
                                <DateTimePicker />
                            </div>
                            <div class="col-start-2 col-span-2 mt-1">
                                <label class="block text-sm font-medium text-gray-700">نکته</label>
                                <input class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>
                            <div class="col-start-6 col-span-2 mt-1">
                                <label class="block text-sm font-medium text-gray-700">سالن برگزاری</label>
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
                        </template>
                        <div class="col-span-full my-2">
                           
                            <div class="flex items-center"> 
                                <hr class="flex-grow border-t border-gray-300"> 
                                <span class="px-3 text-gray-500"> 
                                   <button class="btn btn-sm text-gray-50 bg-green-600 rounded-lg" @click.prevent="push({...eventFields})">+ رویداد جدید</button> 
                                </span> 
                                
                                <hr class="flex-grow border-t border-gray-300"> 
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

<style>
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
