
<script setup>
import DataTable_V1 from '@/views/components/Globals/DataTables/DataTable_V1.vue'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { ref } from 'vue'
import { computed } from 'vue'

const pageIndex = ref(0);
const pageSize = ref(1);
const queryKey = computed(() => [{ url: '/api/Manager/GetAllDiscount', pageSize: pageSize.value, currentPage: pageIndex.value + 1 }]);
const GetAllDiscount = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url + '/' + queryKey[0].pageSize + '/' + queryKey[0].currentPage,
            method: 'GET',
            headers: {}
        }),
    refetchOnMount: true,
    enabled: true
});

const totalCount = computed(() => GetAllDiscount.data.value?.totalCount ?? 0);

const totalPage = computed(() => Math.ceil(totalCount.value / pageSize.value));

const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }

function action(step) {
    if (step > 0 && pageIndex.value + step >= totalPage.value) return

    if (step < 0 && pageIndex.value + step < 0) return

    pageIndex.value += step
}




</script>

<template>
    <template v-if="$route.name === 'Managediscount'">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="همه کنسرت‌ها" border-class=" border-black relative " type="middle" title-class="text-black" />
            </div>
        </div>

        <div class="w-full h-fit  overflow-hidden m-0">
            <div class="flex my-1 rtl:justify-end">
                <button class="btn btn-success btn-sm" @click.prevent="$router.push({ name: 'createDiscount' })">اضافه کردن</button>
            </div>
            <DataTable_V1
            class="!rounded-md overflow-hidden md:text-sm text-xs"
                :columns="[
                    {
                        title: '#',
                        key: 'id',
                        tdClass : 'md:table-cell hidden',
                        thClass : 'md:table-cell hidden',
                    },
                    {
                        title: 'عنوان',
                        key: 'title',
                        colSpan: 2
                    },
                    {
                        title: 'کد',
                        key: 'code',
                        tdClass : 'md:table-cell hidden',
                        thClass : 'md:table-cell hidden',
                    },
                    {
                        title: 'فعال؟ ',
                        key: 'Active'
                    },
                    {
                        title: 'درصد',
                        key: 'percentage',
                        tdClass : 'md:table-cell hidden',
                        thClass : 'md:table-cell hidden',
                    },

                    {
                        title: 'حداکثر',
                        key: 'maxDiscount',
                        tdClass :'text-wrap break-space'
                    },

                    {
                        title: 'انقضاء',
                        key: 'expirationDate',
                        tdClass :'text-wrap break-space'

                    },
                    {
                        title: '-',
                        key: 'options'
                    }
                ]"
                :data="GetAllDiscount.data.value?.data ? GetAllDiscount.data.value?.data : []"
                :tableClass="'min-w-full divide-y divide-gray-300 table-fixed'"
                :theadClass="''"
                :thead-t-r-class="''"
                :tbodyClass="'!bg-white divide-y divide-gray-200'"
                :thClass="'px-6 py-4 bg-gray-300 text-sm font-medium text-gray-900 uppercase text-center'"
                :tdClass="'max-w-0  px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'"
                :trClass="'odd:bg-white even:bg-gray-100'"
                :scrollBarHeight="'calc(100dvh - 300px)'"
            >
                <template #[`tbodyid`]="{ data }">{{ '-' }}</template>
                <template #[`tbodytitle`]="{ data }">{{ data.title }}</template>
                <template #[`tbodycode`]="{ data }">{{ data.code }}</template>
                <template #[`tbodyActive`]="{ data }">{{ data.isActive ? '✅' : '❌' }}</template>
                <template #[`tbodycategory`]="{ data }">{{ data.category }}</template>
                <template #[`tbodypercentage`]="{ data }">{{ data.percentage}}%</template>
                <template #[`tbodymaxDiscount`]="{ data }">{{ data.maxDiscount}}T</template>
                <template #[`tbodyexpirationDate`]="{ data }">{{ new Date(data.expirationDate).toLocaleString('fa-ir', dateFormat).split(',').reverse().join(' ') }}</template>
                <template #[`tbodyoptions`]="{ data }">
                    <div class="flex justify-around">
                        <div
                            @click.prevent="
                                () => {
                                    $router.push({
                                        name: 'editDiscount',
                                        params: { id: data.id }
                                    })
                                }
                            "
                        >
                            <v-icon name="hi-pencil" fill="black" class="hover:animate-pulse " />
                        </div>

                        <div
                            @click.prevent="
                                () => {
                                    selectedConcert = data.id
                                    toggleTermsModal()
                                }
                            "
                        >
                            <v-icon name="md-settings-outlined" fill="orange" class="hover:animate-spin" />
                        </div>
                    </div>
                </template>

                <template #[`pagination`]>
                    <div class="flex justify-center mt-2">
                        <div @click="action(5)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-0.5" v-tippy="{content:  '+5' }">
                            <v-icon name="bi-chevron-double-right" class="self-center" scale="1.2" />
                        </div>
                        <div @click="action(1)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-1" v-tippy="{content:'+1'}">
                            <v-icon class="self-center" name="bi-chevron-right" scale="1.2" />
                        </div>
                        <div class="mx-5 rounded-lg bg-gray-300 w-24 text-center align-middle">
                            <span class="leading-8">{{ pageIndex + 1 }} از {{ totalPage }}</span>
                        </div>
                        <div @click="action(-1)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-1" v-tippy="{content:'-1'}">
                            <v-icon class="self-center" name="bi-chevron-left" scale="1.2" />
                        </div>
                        <div @click="action(-5)" class="rounded-full bg-gray-300 w-8 h-8 flex justify-center mx-0.5" v-tippy="{content:'-5'}">
                            <v-icon class="self-center" name="bi-chevron-double-left" scale="1.2" />
                        </div>
                        <div class="mx-12 inline-block">
                            
                            <select class="form-input inline-block py-1" v-tippy="{content:'تعداد آیتم ها در هر صفحه'}" v-model="pageSize">
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>

                            </select>
                        </div>
                    </div>
                  
                </template>
            </DataTable_V1>
        </div>
    </template>
 
</template>
