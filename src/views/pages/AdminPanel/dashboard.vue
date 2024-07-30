<script setup>
import { FaMoneyBillTrendUp } from '@kalimahapps/vue-icons/fa'
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
        <h2 class="text-lg leading-6 font-medium text-gray-900 mx-4 sm:mx-6 lg:mx-8">کنسرت ها</h2>
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
                            <ChevronLeftIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">معامله</th>
                                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مقدار</th>
                                    <th class="hidden px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">وضعیت</th>
                                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="transaction in transactions" :key="transaction.id" class="bg-white">
                                    <td class="max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div class="flex">
                                            <a :href="transaction.href" class="group inline-flex space-x-2 space-x-reverse truncate text-sm">
                                                <CashIcon class="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                <p class="text-gray-500 truncate group-hover:text-gray-900">
                                                    {{ transaction.name }}
                                                </p>
                                            </a>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                                        <span class="text-gray-900 font-medium">{{ transaction.amount }} </span>
                                        {{ transaction.currency }}
                                    </td>
                                    <td class="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-500 md:block">
                                        <span :class="[statusStyles[transaction.status], 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize']">
                                            {{ transaction.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                                        <time :datetime="transaction.datetime">{{ transaction.date }}</time>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- Pagination -->
                        <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
                            <div class="hidden sm:block">
                                <p class="text-sm text-gray-700">
                                    نمایش
                                    {{ ' ' }}
                                    <span class="font-medium">1</span>
                                    {{ ' ' }}
                                    تا
                                    {{ ' ' }}
                                    <span class="font-medium">10</span>
                                    {{ ' ' }}
                                    از
                                    {{ ' ' }}
                                    <span class="font-medium">20</span>
                                    {{ ' ' }}
                                    نتیجه
                                </p>
                            </div>
                            <div class="flex-1 flex justify-between sm:justify-end">
                                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> قبلی </a>
                                <a href="#" class="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> بعدی </a>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
