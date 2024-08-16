<template>
    <div :class="{ hidden: $route.name !== 'manageallusers' }">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="همه کنسرت‌ها" border-class=" border-black relative " type="middle" title-class="text-black" />
            </div>
        </div>

        <div class="w-full h-fit overflow-hidden m-0">
           
            <div class="grid grid-cols-4 gap-2 my-1">
                <div>
                    <input class="form-input" v-model="fullname" placeholder="جستجوی نام..." />
                </div>
                <div>
                    <button class="btn btn-md btn-info" @click.prevent="name = fullname">اعمال</button>
                </div>
            </div>

            <DataTable_V1
                class="!rounded-md overflow-hidden md:text-sm text-xs"
                :columns="[
                  
                    {
                        title: 'نام و نام خانوادگی',
                        key: 'title',
                        colSpan: 2
                    },
                    {
                        title: 'نام کاربری',
                        key: 'userName',
                        tdClass: 'md:table-cell hidden',
                        thClass: 'md:table-cell hidden'
                    },
                    {
                        title: 'شماره همراه ',
                        key: 'phoneNumber'
                    },

                    {
                        title: '-',
                        key: 'options'
                    }
                ]"
                :data="GetUsers.data.value?.data ? GetUsers.data.value?.data : []"
                :tableClass="'min-w-full divide-y divide-gray-300 table-fixed'"
                :theadClass="''"
                :thead-t-r-class="''"
                :tbodyClass="'!bg-white divide-y divide-gray-200'"
                :thClass="'px-6 py-4 bg-gray-300 text-sm font-medium text-gray-900 uppercase text-center'"
                :tdClass="'max-w-0  px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'"
                :trClass="'odd:bg-white even:bg-gray-100'"
                :scrollBarHeight="'calc(100dvh - 350px)'"
            >
                
                <template #[`tbodytitle`]="{ data }">{{ data.firstName + ' ' + data.lastName }}</template>
                <template #[`tbodyuserName`]="{ data }">{{ data.userName }}</template>
                <template #[`tbodyphoneNumber`]="{ data }">{{ data.phoneNumber }}</template>
                <template #[`tbodyoptions`]="{ data }">
                    <div class="flex justify-around">
                        <div
                            @click.prevent="
                                () => {
                                    $router.push({
                                        name: 'editUser',
                                        params: { id: data.id }
                                    })
                                }
                            "
                            v-tippy="{ content: 'بروزرسانی اطلاعات' }"
                        >
                            <v-icon name="hi-pencil" fill="black" class="hover:animate-pulse" />
                        </div>
                        <div
                            v-tippy="{ content: 'مشاهده رزروها ' }"
                            @click.prevent="
                                $router.push({
                                    name: 'UserReservations',
                                    params: { id: data.id }
                                })
                            "
                        >
                            <v-icon name="md-receiptlong-sharp" fill="green" class="" />
                        </div>
                        <div
                            v-tippy="{ content: 'مشاهده پرداخت ها ' }"
                            @click.prevent="
                                $router.push({
                                    name: 'UserPayments',
                                    params: { id: data.id }
                                })
                            "
                        >
                            <v-icon name="md-receipt-outlined" fill="green" class="" />
                        </div>
                    </div>
                </template>

                <template #[`pagination`]>
                    <div class="flex justify-center mt-2">
                        <div @click="action(5)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-0.5" v-tippy="{ content: '+5' }">
                            <v-icon name="bi-chevron-double-right" class="self-center" scale="1.2" />
                        </div>
                        <div @click="action(1)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-1" v-tippy="{ content: '+1' }">
                            <v-icon class="self-center" name="bi-chevron-right" scale="1.2" />
                        </div>
                        <div class="mx-5 rounded-lg bg-gray-300 w-24 text-center align-middle">
                            <span class="leading-8">{{ pageIndex + 1 }} از {{ totalPage }}</span>
                        </div>
                        <div @click="action(-1)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-1" v-tippy="{ content: '-1' }">
                            <v-icon class="self-center" name="bi-chevron-left" scale="1.2" />
                        </div>
                        <div @click="action(-5)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-0.5" v-tippy="{ content: '-5' }">
                            <v-icon class="self-center" name="bi-chevron-double-left" scale="1.2" />
                        </div>
                        <div class="mx-12 inline-block">
                            <select class="form-input inline-block py-1" v-tippy="{ content: 'تعداد آیتم ها در هر صفحه' }" v-model="pageSize">
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                    </div>
                </template>
            </DataTable_V1>
        </div>
    </div>
    <template v-if="$route.name !== 'manageallusers'">
        <RouterView />
    </template>
</template>

<script setup>
import DataTable_V1 from '@/views/components/Globals/DataTables/DataTable_V1.vue'

import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { ref } from 'vue'
import { computed } from 'vue'
import { RouterView } from 'vue-router'
const fullname = ref('')
const name = ref('')
const pageIndex = ref(0)
const pageSize = ref(10)
const queryKey = computed(() => [{ url: '/api/Admin/GetUsers', pageSize: pageSize.value, currentPage: pageIndex.value + 1, fullname: name.value }])
const GetUsers = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url + '/' + queryKey[0].pageSize + '/' + queryKey[0].currentPage + (queryKey[0].fullname !== '' ? '?name=' + queryKey[0].fullname : ''),
            method: 'GET',
            headers: {}
        }),
    refetchOnMount: true,
    enabled: true
})

const totalCount = computed(() => GetUsers.data.value?.totalCount ?? 0)

const totalPage = computed(() => Math.ceil(totalCount.value / pageSize.value))


function action(step) {
    if (step > 0 && pageIndex.value + step >= totalPage.value) return

    if (step < 0 && pageIndex.value + step < 0) return

    pageIndex.value += step
}
</script>
