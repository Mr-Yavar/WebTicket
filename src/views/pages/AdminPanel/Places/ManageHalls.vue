<script setup>
import { CRPlacesService, GetHallsService } from '@/services/PlacesService'
import Splitter from '@/global/Splitter/Splitter.vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import HallCard from './components/HallCard.vue'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import Swal from 'sweetalert2'
const route = useRoute()

const placeId = !route.params.id ? null : route.params.id
const queryClient = useQueryClient()

const getHallServiceCall = useQuery({
    queryKey: ['/api/Place/GetHallsByPlaceId'],
    queryFn: () => GetHallsService(placeId),
    refetchOnWindowFocus:true,
    refetchOnMount:true,
    enabled: true
})

///استفاده از کش در صورتی که در جای دیگر از سرویس گرفته می‌شود
const places = useQuery({
    queryKey: ['api/place/GetAllPlaces', 'cache'],
    queryFn: async () => {
        const res = await queryClient.getQueryData(['api/place/GetAllPlaces'])
        if (!res) throw new Error()
        return res
    },
    enabled: true
})

const router = useRouter()

const { mutate } = useMutation({
    mutationKey: ['CU/Hall'],
    mutationFn: CRPlacesService
})

function handleToggleHall(id) {
    mutate(
        {
            url: '/api/Place/ToggleHall/' + id,
            method: 'GET'
        },
        {
            onSuccess: async () => {
                await Swal.fire({
                    text: 'وضعیت آیتم مورد نظر تغییر یافت!',
                    icon: 'success',
                    showConfirmButton: false,
                    showCloseButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    width: 'fit-content',
                    showClass: { popup: 'direction-rtl vazir-font' }
                })
                getHallServiceCall.refetch()
            }
        }
    )
}
</script>

<template>
    <template v-if="$route.name === 'managePlace'">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter :title="` سالنهای مکان برگزاری ▷` + places.data.value?.find((x) => x.id === placeId)?.title + '◁'" border-class="border-black " type="middle" title-class="text-black" />
            </div>
            <div class="flex flex-row-reverse mx-1 my-2">
                <button @click="$router.push({ name: 'AllPlaces' })" class="items-center px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm w-fit hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <CiCircleChevLeft class="font-bold scale-125" />
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
            <hall-card :toggleHall="handleToggleHall" v-for="hall in getHallServiceCall.data.value" :place="places.data.value?.find((x) => x.id === placeId) ?? {}" :key="hall.id" :hall="hall" />

            <div class="self-center">
                <div class="h-32 mx-auto w-fit">
                    <button @click="router.push({ name: 'createHall' })" type="button" class="relative top-[53%] block items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </template>
    <router-view />
</template>

<style scoped></style>
