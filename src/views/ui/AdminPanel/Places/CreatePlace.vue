<script setup>
import { useForm } from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { CRPlacesService, GetPlaceService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'
import Cities from '@/assets/data/city.json'
const router = useRouter()
const route = useRoute()
import Vselect from "vue-select";
const placeId = !route.params.id ? null : route.params.id

const getPlaceServiceCall = useQuery({
    queryKey: ['api/place/GetPlaceService', route.params.id],
    queryFn: () => GetPlaceService(route.params.id),
    enabled: !!route.params.id
})

const { resetForm, defineField, handleSubmit } = useForm({
    initialValues: {
        place: getPlaceServiceCall.data?.value
    }
})

watch([getPlaceServiceCall.data], () => {
    if (placeId) resetForm({ values: { place: { ...getPlaceServiceCall.data?.value } } })
    else resetForm({ values: {} })
})

const [placeTile] = defineField('place.title')
const [placeDesc] = defineField('place.description')
const [placeCity] = defineField('place.city')
const [placeAddress] = defineField('place.address')
const [placeLat] = defineField('place.lat')
const placeImage = defineField('place.image')
const [placeLng] = defineField('place.lng')

const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {
    const form = new FormData()
    console.log(data)

    form.append(
        'Place',
        JSON.stringify({
            Id: placeId ?? undefined,
            Title: data.place.title,
            Address: data.place.address,
            Description: data.place.description,
            City: data.place.city,
            lat: Number(data.place.lat),
            lng: Number(data.place.lng)
        })
    )

    if (data.place.image && data.place.image.length === 1) {
        form.append('Files.File', data.place.image[0])
    } else {
        form.append('Files.File', undefined)
    }
    form.append('Files.key', 'place')

    if (!placeId) {
        mutate(
            {
                url: '/api/Place/CreatePlace?api-version=1.0',
                body: form,
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
                    router.push({ name: 'AllPlaces' })
                }
            }
        )
    } else {
        mutate(
            {
                url: '/api/Place/UpdatePlace?api-version=1.0',
                body: form,
                method: 'PUT'
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
                    router.push({ name: 'AllPlaces' })
                }
            }
        )
    }
})
</script>

<template>
    <div>
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="ایجاد یک مکان برگزاری" border-class=" border-black " type="middle" title-class="text-black" />
            </div>
            <div class="my-2 mx-1 flex flex-row-reverse">
                <button @click="router.push({ name: 'AllPlaces' })" class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><CiCircleChevLeft class="scale-125 font-bold" /></button>
            </div>
        </div>

        <form @submit.prevent="onSubmit">
            <div class="grid grid-cols-6 gap-2">
                <div class="col-span-2 col-start-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">نام</label>
                    <input type="text" v-model="placeTile" id="place-name" placeholder="برج میلاد" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div class="col-span-2 col-start-4">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">شهر</label>
                    <Vselect
                        v-model="placeCity"
                        :options="Cities.map((x) => ({ value: x, label: x }))"
                        :reduce="
                            (city) => {
                                return city.value
                            }
                        "
                        label="label"
                        class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
                    >
                        <template #selected-option="{ label }">
                            <div style="display: flex; align-items: baseline; padding: 0">
                                <strong class="text-sm"> {{ label }} </strong>
                            </div>
                        </template>

                        <template #option="{ label }">
                            <div class="text-right">
                                <h3 style="margin: 0">{{ label }}</h3>
                            </div>
                        </template>
                    </Vselect>
                </div>
                <div class="col-span-4 col-start-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">نشانی</label>
                    <input type="text" v-model="placeAddress" id="place-name" placeholder="تهران،بلوار ... " class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div class="col-span-2 col-start-2">
                    <label class="block text-sm font-medium text-gray-700">lat</label>
                    <input v-model="placeLat" class="appearance-none mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="number" />
                </div>
                <div class="col-span-2 col-start-4">
                    <label class="block text-sm font-medium text-gray-700">lng</label>
                    <input v-model="placeLng" class="appearance-none mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="number" />
                </div>
                <div class="col-span-2 col-start-2">
                    <label class="block text-sm font-medium text-gray-700" for="place-name">تصویر مکان برگزاری</label>
                    <input
                        class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type="file"
                        @change="
                            ($event) => {
                                placeImage[0].value = $event.target.files
                            }
                        "
                    />
                </div>
                <div class="col-span-4 col-start-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">توضیح</label>
                    <textarea type="text" v-model="placeDesc" id="place-name" placeholder="درمورد مکان برگزاری و سالن های آن" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                </div>
                <div class="col-span-2 col-start-3">
                    <button v-if="!placeId" type="submit" class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">ایجاد</button>
                    <button v-else type="submit" class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">ویرایش</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
