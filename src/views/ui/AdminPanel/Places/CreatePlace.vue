<script setup>
import { useForm } from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { CRPlacesService, GetPlaceService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const route = useRoute()

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
  if (!!placeId) resetForm({ values: { place: { ...getPlaceServiceCall.data?.value } } })
  else resetForm({ values: {} })
})

const [placeTile] = defineField('place.title')
const [placeDesc] = defineField('place.description')
const [placeCity] = defineField('place.city')
const [placeAddress] = defineField('place.address')
const { mutate } = useMutation({
  mutationKey: ['CU/Places'],
  mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {
  if (!placeId) {
    mutate(
      {
        url: '/api/Place/CreatePlace?api-version=1.0',
        body: JSON.stringify({
          title: data.place.title,
          address: data.place.address,
          description: data.place.description,
          city:data.place.city
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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
        body: JSON.stringify({
          id: data.place.id,
          title: data.place.title,
          address: data.place.address,
          description: data.place.description
        }),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
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
          <input type="text" v-model="placeCity" id="place-name" placeholder=" تهران " class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div class="col-span-4 col-start-2">
          <label for="place-name" class="block text-sm font-medium text-gray-700">نشانی</label>
          <input type="text" v-model="placeAddress" id="place-name" placeholder="تهران،بلوار ... " class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div class="col-span-4 col-start-2">
          <label for="place-name" class="block text-sm font-medium text-gray-700">نام</label>
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
