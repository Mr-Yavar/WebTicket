<template>
    <template v-if="$route.name === 'MyReservations'">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="رزروهای من" border-class="relative border-black " type="middle" title-class="text-black" />
            </div>
        </div>

        <div class="w-full m-0 overflow-hidden h-fit">
            <div class="px-4 mx-auto sm:px-6 lg:px-8">
                <div class="flex flex-col mt-2">
                    <div class="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
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
                                    tdClass: 'text-info '
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
                            <template #[`tbodyticketCount`]="{ data }">{{ data.ticketCount }}</template>
                            <template #[`tbodyoptions`]="{ data }">
                                <div class="text-center !text-blue-900">
                                    <span
                                        class="!text-info hover:border-b-2 hover:border-gray-700 cursor-pointer"
                                        @click.prevent="
                                            () => {
                                                $router.push({
                                                    name: 'MyReservationTicket',
                                                    params: {
                                                        reservationId: Guid({}).fromFullToCompressed(data.reservationId)
                                                    }
                                                })
                                            }
                                        "
                                    >
                                        مشاهده بلیت‌ها
                                    </span>
                                </div>
                            </template>

                            <template #[`pagination`]>
                                <nav class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6" aria-label="Pagination">
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
                                    <div class="flex justify-end flex-1 sm:justify-end">
                                        <select class="form-input inline-block w-fit mx-2.5 py-1" v-tippy="{ content: 'تعداد آیتم ها در هر صفحه' }" v-model="pageSize">
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                        </select>
                                        <a @click="action(-1)" href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"> قبلی </a>
                                        <a @click="action(1)" href="#" class="relative inline-flex items-center px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"> بعدی </a>
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
        <router-view />
    </template>
</template>

<script setup>
import DataTable_V1 from '@/global/DataTables/DataTable_V1.vue'

import { AccountQueryKeys, get_apiAccountMyReservation } from '@/api/AccountService'
import { Guid } from '@/config/helper'
import Splitter from '@/global/Splitter/Splitter.vue'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
const pageIndex = ref(0)
const pageSize = ref(10)

const queryKey = computed(() => [AccountQueryKeys.get_apiAccountMyReservation(pageSize.value, pageIndex.value + 1)])
const GetUserReservation = useQuery({
    queryKey: queryKey,
    queryFn: () => get_apiAccountMyReservation(pageSize.value, pageIndex.value + 1),
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

<style></style>
