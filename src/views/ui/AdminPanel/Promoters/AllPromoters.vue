<script setup>
import { ClAddPlus } from '@kalimahapps/vue-icons/cl'
import PromoterCard from '@/views/components/Layouts/AdminLayout/Cards/PromoterCard.vue'
import { PrSpinner } from '@kalimahapps/vue-icons/pr'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
const router = useRouter()
import { useQuery } from '@tanstack/vue-query'

import Splitter from '@/views/components/Splitter/Splitter.vue'
import Swal from 'sweetalert2'
import { sendRequest } from '@/services/service'
import { watch } from 'vue'

const GetAllPromoterServiceCall = useQuery({
    queryKey: ['/api/Promoters/GetAllPromoters'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0],
            method: 'GET',
            headers: {}
        }),

    enabled: true
})
const { mutate } = useMutation({
    mutationKey: ['CU/Promoters'],
    mutationFn: (value) => {
        sendRequest({
            url: value.url,
            method: value.method,
            headers: {},
            body: value.body ?? undefined
        })
    }
})

function handleTogglePromoter(id) {
    mutate(
        {
            url: '/api/Promoters/TogglePromoter/' + id,
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
                GetAllPromoterServiceCall.refetch()
            }
        }
    )
}
</script>

<template>
    <template v-if="$route.name === 'AllPromoters'">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="برگزار کنندگان" border-class=" border-black relative " type="middle" title-class="text-black" />
            </div>
            <div class="grid grid-cols-6 gap-1 my-3">
                <div>
                    <button @click="router.push({ name: 'createPromoter' })" class="inline-flex items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span>
                            <ClAddPlus class="inline text-lg" /> </span
                        ><span> ایجاد</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
            <template v-if="!GetAllPromoterServiceCall.isLoading.value && !!GetAllPromoterServiceCall.data.value">
                <promoter-card v-for="item in GetAllPromoterServiceCall.data.value" :promoter="item" :key="item.id" :togglePromoter="handleTogglePromoter" />

                <div class="self-center">
                    <div class="w-fit mx-auto h-32">
                        <button @click="router.push({ name: 'createPromoter' })" type="button" class="relative top-[53%] block items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-6 w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="w-full mt-4 text-center mx-auto"></div>
                <PrSpinner class="animate-spin block w-full mx-auto text-3xl mt-8" />
            </template>
        </div>
    </template>
    <router-view></router-view>
</template>

<style scoped></style>
