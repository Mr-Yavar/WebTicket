<script setup>
import { FaMoneyBillTrendUp } from '@kalimahapps/vue-icons/fa'
import DataTable_V1 from '@/views/components/Globals/DataTables/DataTable_V1.vue'
import { ByChevronLeft } from '@kalimahapps/vue-icons/by';
import { computed, ref } from 'vue'
import { sendRequest } from '@/services/service'
import { useQuery } from '@tanstack/vue-query'
const pageIndex = ref(0)
const pageSize = ref(10)
const queryKey = computed(() => [{ url: '/api/Manager/GetAllActiveConcerts', pageSize: pageSize.value, currentPage: pageIndex.value + 1 }])
const getAllConcert = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url + '/' + queryKey[0].pageSize + '/' + queryKey[0].currentPage,
            method: 'GET',
            headers: {}
        }),
    refetchOnMount: true,
    enabled: true
})

const totalCount = computed(() => getAllConcert.data.value?.totalCount ?? 0)

const totalPage = computed(() => Math.ceil(totalCount.value / pageSize.value))

const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }

function action(step) {
    if (step > 0 && pageIndex.value + step >= totalPage.value) return

    if (step < 0 && pageIndex.value + step < 0) return

    pageIndex.value += step
}
</script>

<template>
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-lg leading-6 font-medium text-gray-900">پیشخوان</h2>
        <div class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Cards -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="w-0 flex-1">
                            <dl class="space-y-2">
                                <dt class="text-sm font-medium text-gray-500 truncate">درآمد کل</dt>
                                <dd>
                                    <div class="text-xl font-medium text-gray-900">30,659.450</div>
                                </dd>
                                <dd>
                                    <div class="text-xs font-medium text-gray-500">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-green-500"> %2.1+ </span>
                                        از هفته گذشته تاکنون
                                    </div>
                                </dd>
                            </dl>
                        </div>
                        <div class="self-start h-12 w-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaMoneyBillTrendUp class="text-green-900" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="w-0 flex-1">
                            <dl class="space-y-2">
                                <dt class="text-sm font-medium text-gray-500 truncate">درآمد امروز</dt>
                                <dd>
                                    <div class="text-xl font-medium text-gray-900">500,000</div>
                                </dd>
                                <dd>
                                    <div class="text-xs font-medium text-gray-500">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded font-medium text-red-500"> &1.2 - </span>
                                        از دیروز تاکنون
                                    </div>
                                </dd>
                            </dl>
                        </div>
                        <div class="self-start h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <v-icon name="la-file-invoice-dollar-solid" class="h-6 w-6 text-amber-400" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="w-0 flex-1">
                            <dl class="space-y-2">
                                <dt class="text-sm font-medium text-gray-500 truncate">تعداد بلیتهای فروخته شده</dt>
                                <dd>
                                    <div class="text-xl font-medium text-gray-900">264,000</div>
                                </dd>
                                <dd>
                                    <div class="text-xs font-medium text-gray-500">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-green-500"> %2.1+ </span>
                                        از دیروز تاکنون
                                    </div>
                                </dd>
                            </dl>
                        </div>
                        <div class="self-start h-12 w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <v-icon name="io-ticket-outline" class="h-6 w-6 text-red-400" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mx-auto mt-3">
        <h2 class="text-lg leading-6 font-medium text-gray-900 mx-4 sm:mx-6 lg:mx-8">کنسرت های فعال</h2>
        <!-- Activity list (smallest breakpoint only) -->
        <div class="shadow sm:hidden mx-4">
            <ul role="list" class="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
                <li v-for="transaction in transactions" :key="transaction.id">
                    <a :href="transaction.href" class="block px-4 py-4 bg-white hover:bg-gray-50">
                        <span class="flex items-center space-x-4 space-x-reverse">
                            <span class="flex-1 flex space-x-2 space-x-reverse truncate">
                                <CashIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                <span class="flex flex-col text-gray-500 text-sm truncate">
                                    <span class="truncate">{{ transaction.name }}</span>
                                    <span
                                        ><span class="text-gray-900 font-medium">{{ transaction.amount }}</span> {{ transaction.currency }}</span
                                    >
                                    <time :datetime="transaction.datetime">{{ transaction.date }}</time>
                                </span>
                            </span>
                            <ByChevronLeft class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </a>
                </li>
            </ul>

            <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200" aria-label="Pagination">
                <div class="flex-1 flex justify-between">
                    <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"> قبلی </a>
                    <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"> بعدی </a>
                </div>
            </nav>
        </div>

        <!-- Activity table (small breakpoint and up) -->
        <div class="hidden sm:block">
            <div class="mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col mt-2">
                    <div class="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                        <DataTable_V1
                            class="!rounded-md overflow-hidden"
                            :columns="[
                              
                                {
                                    title: 'عنوان',
                                    key: 'title',
                                    colSpan: 2
                                },
                                {
                                    title: 'برگزار کننده ',
                                    key: 'promoter.title'
                                },
                                {
                                    title: 'محل برگزاری',
                                    key: 'place.name'
                                },

                                {
                                    title: 'دسته بندی',
                                    key: 'category',
                                    thClass : 'md:table-cell hidden',
                                    tdClass : 'md:table-cell hidden',
                                },
                                {
                                    title: 'کل بلیت ها',
                                    key: 'Allticket'
                                },
                                {
                                    title: 'رزرو شده',
                                    key: 'ReservedTciket',

                                },
                                {
                                    title: 'زمان شروع',
                                    key: 'startDate',
                                     tdClass :'text-wrap break-space md:table-cell hidden',
                                     thClass : 'md:table-cell hidden',
                                },

                                {
                                    title: 'زمان پایان',
                                    key: 'endDate',
                                     tdClass :'text-wrap break-space md:table-cell hidden',
                                     thClass : 'md:table-cell hidden',
                                }
                            ]"
                            :data="getAllConcert.data.value?.data ?? []"
                            :tableClass="'min-w-full divide-y divide-gray-300 table-fixed'"
                            :theadClass="''"
                            :thead-t-r-class="''"
                            :tbodyClass="'!bg-white divide-y divide-gray-200'"
                            :thClass="'px-6 py-4 bg-gray-300 text-sm font-medium text-gray-900 uppercase text-center'"
                            :tdClass="'max-w-0  px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'"
                            :trClass="'odd:bg-white even:bg-gray-100'"
                            :scrollBarHeight="'calc(100dvh - 500px)'"
                        >
                          
                            <template #[`tbodytitle`]="{ data }">{{ data.title }}</template>
                            <template #[`tbodypromoter.title`]="{ data }">{{ data.promoter.title }}</template>
                            <template #[`tbodyplace.name`]="{ data }">{{ data.place.name }}</template>
                            <template #[`tbodycategory`]="{ data }">{{ data.category }}</template>

                            <template #[`tbodyAllticket`]="{ data }">{{ data.ticketCount }}</template>
                            <template #[`tbodyReservedTciket`]="{ data }">{{ data.reservedTicketCount }}</template>

                            <template #[`tbodystartDate`]="{ data }">{{ new Date(data.startDate).toLocaleString('fa-ir', dateFormat).split(',').reverse().join(' ') }}</template>
                            <template #[`tbodyendDate`]="{ data }">{{ new Date(data.endDate).toLocaleString('fa-ir', dateFormat).split(',').reverse().join(' ') }}</template>

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
                                    <div class="flex-1 flex justify-end sm:justify-end">
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
    </div>
</template>

<style scoped></style>
