
<template>
    <template v-if="$route.name === 'MyReservations'">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="رزروهای من" border-class=" border-black relative " type="middle" title-class="text-black" />
            </div>
        </div>

        <div class="w-full h-fit  overflow-hidden m-0">
            <div class="mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col mt-2">
                    <div class="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                        <DataTable_V1
                            class="!rounded-md overflow-hidden"
                            :columns="[
                                {
                                    title: 'عنوان کنسرت',
                                    key: 'title',
                                    colSpan: 2
                                },
                                {
                                    title: 'محل برگزاری',
                                    key: 'place.name'
                                },

                                {
                                    title: 'زمان رزرو',
                                    key: 'reservationDate'
                                },

                                {
                                    title: 'مبلغ پرداختی',
                                    key: 'billAmount'
                                },
                                {
                                    title: 'تعداد بلیت ',
                                    key: 'ticketCount'
                                },
                                {
                                    title: '-',
                                    key: 'options',
                                    tdClass:'text-info '
                                }
                            ]"
                            :data="GetUserReservation.data.value?.data ?? []"
                            :tableClass="'min-w-full divide-y divide-gray-500 table-fixed'"
                            :theadClass="''"
                            :thead-t-r-class="''"
                            :tbodyClass="'!bg-white divide-y divide-gray-200'"
                            :thClass="'px-6 py-4 bg-gray-300 text-sm font-medium text-gray-900 uppercase text-center'"
                            :tdClass="'max-w-0  px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'"
                            :trClass="'odd:bg-white even:bg-gray-100'"
                            :scrollBarHeight="'calc(100dvh - 300px)'"
                        >
                    
                            <template #[`tbodytitle`]="{ data }">{{ data.concertInfo.title }}</template>
                            <template #[`tbodyplace.name`]="{ data }">{{ data.place.name }}</template>
                            <template #[`tbodyreservationDate`]="{ data }">{{ new Date(data.reservationDate).toLocaleString('fa-ir', dateFormat).split(',').reverse().join(' ') }}</template>
                            
                             <template #[`tbodybillAmount`]="{ data }">{{ data.transaction.billAmount }}</template>
                             <template #[`tbodyticketCount`]="{ data }">{{ data.ticketCount}}</template>
                            <template #[`tbodyoptions`]="{ data }"><div class="text-center !text-blue-900"><span class="!text-info hover:border-b-2 hover:border-gray-700 cursor-pointer" @click.prevent="()=>{
                            $router.push({
                                name :'MyReservationTicket',
                                params :{
                                    reservationId : Guid({}).fromFullToCompressed(data.reservationId)
                                }
                            })
                            }">مشاهده بلیت‌ها</span></div></template>

                            <template #[`pagination`]>
                                <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
                                    <div class="hidden sm:block">
                                        <p class="text-sm text-gray-700">
                                            نمایش
                                            {{ ' ' }}
                                            <span class="font-medium">{{ pageIndex * pageSize + 1 }}</span>
                                            {{ ' ' }}
                                            تا
                                            {{ ' ' }}
                                            <span class="font-medium">{{ (pageIndex + 1) * pageSize }}</span>
                                            {{ ' ' }}
                                            از
                                            {{ ' ' }}
                                            <span class="font-medium">{{ totalCount }}</span>
                                            {{ ' ' }}
                                            نتیجه
                                        </p>
                                    </div>
                                    <div class="flex-1 flex justify-between sm:justify-end">
                                        <select class="form-input inline-block w-fit mx-2.5 py-1" v-tippy="{ content: 'تعداد آیتم ها در هر صفحه' }" v-model="pageSize">
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                        </select>
                                        <a @click="action(-1)" href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> قبلی </a>
                                        <a @click="action(1)" href="#" class="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> بعدی </a>
                                    </div>
                                </nav>
                            </template>
                        </DataTable_V1>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <router-view/>
    </template>
</template>

<script setup>
import DataTable_V1 from '@/views/components/Globals/DataTables/DataTable_V1.vue';

import { sendRequest } from '@/services/service'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue';
import { ref } from 'vue';
import useUserStore from '@/stores/user';
import Splitter from '@/views/components/Splitter/Splitter.vue';
import { Guid } from '@/config/helper';
const pageIndex = ref(0);
const pageSize = ref(10);
const userStore = useUserStore();
const queryKey = computed(() => [{ url: '/api/Account/MyReservation', pageSize: pageSize.value, currentPage: pageIndex.value + 1 }])
const GetUserReservation = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url + '/' + queryKey[0].pageSize + '/' + queryKey[0].currentPage,
            method: 'GET',
            headers: {
                'Authorization'  : "Bearer "+userStore.accessToken
            }
        }),
    refetchOnMount: true,
    enabled: true
})

const totalCount = computed(() => GetUserReservation.data.value?.totalCount ?? 0)

const totalPage = computed(() => Math.ceil(totalCount.value / pageSize.value))

const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }

function action(step) {
    if (step > 0 && pageIndex.value + step >= totalPage.value) return

    if (step < 0 && pageIndex.value + step < 0) return

    pageIndex.value += step
}


</script>

<style>

</style>