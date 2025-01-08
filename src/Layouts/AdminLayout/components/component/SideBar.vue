<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>



<template>
    <div class=" flex items-center px-4">
        <div class="text-center text-xl w-full py-4">مدیریت</div>
    </div>
    <nav class="mt-5 flex-shrink-0 h-full divide-y divide-blue-800 overflow-y-auto" aria-label="Sidebar">
        <div class="px-2 space-y-1">
            <RouterLink active-class="active" :to="{ name: 'AdminDashboard' }" replace class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="io-grid-outline" class="ml-4 flex-shrink-0 h-6 w-6 group-[.active]:!text-white" fill="white" />
                داشبورد
            </RouterLink>
            <!-- <div class="mx-auto w-full max-w-md rounded-md">
                <Disclosure v-slot="{ open }">
                    <DisclosureButton class="w-full justify-start rounded-md text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium">
                        <v-icon name="hi-table" class="ml-4 flex-shrink-0 h-7 w-6 text-gray-900" aria-hidden="true" />
                        <span>جدول ها</span>
                        <v-icon name="bi-chevron-left" :class="open ? '-rotate-90 transform' : ''" class="h-5 w-5 text-blue-500 mr-auto" />
                    </DisclosureButton>
                    <DisclosurePanel class="p-2 space-y-2 text-sm text-gray-900">
                        <RouterLink to="/tables/plain" class="text-gray-900 hover:bg-gray-100 flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> جدول ساده </RouterLink>
                        <RouterLink to="/tables/avatar" class="text-gray-900 hover:bg-gray-100 flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> جدول پیشرفته </RouterLink>
                    </DisclosurePanel>
                </Disclosure>
            </div> -->
            <RouterLink :to="{ name: 'AllPlaces' }" active-class="active" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="md-locationon-outlined" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                مکانهای برگزاری
            </RouterLink>
            <!-- <div class="mx-auto w-full max-w-md rounded-md bg-white">
                <Disclosure v-slot="{ open }">
                    <DisclosureButton class="w-full justify-start rounded-md text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium">
                        <v-icon name="md-dashboard-outlined" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900" aria-hidden="true" />
                        <span>کامپوننت ها</span>
                        <v-icon name="HiChevronLeft" :class="open ? '-rotate-90 transform' : ''" class="h-5 w-5 text-blue-500 mr-auto" />
                    </DisclosureButton>

                    <DisclosurePanel class="pt-4 pb-2 space-y-1 text-sm text-gray-900">
                        <RouterLink to="/components/buttons" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> دکمه ها </RouterLink>
                        <RouterLink to="/components/cards" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> کارت ها </RouterLink>
                        <RouterLink to="/components/alerts" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> هشدار ها </RouterLink>
                        <RouterLink to="/components/modals" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> مودال ها </RouterLink>
                        <RouterLink to="/components/badges" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> نشان ها </RouterLink>
                    </DisclosurePanel>
                </Disclosure>
            </div> -->
            <RouterLink :to="{ name: 'ManageConcerts' }" active-class="active" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="bi-calendar-week" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                کنسرت‌ها
            </RouterLink>
            <RouterLink :to="{ name: 'ManagePromoters' }" active-class="active" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="pr-users" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                برگزارکنندگان
            </RouterLink>
            <RouterLink :to="{ name: 'ManageStaticData' }" active-class="active" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="ri-pages-line" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                تنظیمات صفحات
            </RouterLink>
            <RouterLink :to="{ name: 'ManageUsers' }" active-class="active" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="la-users-cog-solid" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                کاربران
            </RouterLink>
            <RouterLink :to="{ name: 'discount' }" active-class="active" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md">
                <v-icon name="md-discount-outlined" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                کد ‌های تخفیف
            </RouterLink>
            <!-- <div class="mx-auto w-full max-w-md rounded-md bg-white">
                <Disclosure v-slot="{ open }">
                    <DisclosureButton class="w-full justify-start rounded-md text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium">
                        <v-icon name="io-documents-outline" class="ml-4 flex-shrink-0 h-6 w-6 text-gray-900" aria-hidden="true" />
                        <span>صفحه ها</span>
                        <v-icon name="bi-chevron-left" :class="open ? '-rotate-90 transform' : ''" class="h-5 w-5 text-blue-500 mr-auto" />
                    </DisclosureButton>
                    <DisclosurePanel class="pt-4 pb-2 text-sm text-gray-900">
                        <RouterLink to="/404/simple" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> 404 </RouterLink>
                        <RouterLink to="/auth/login" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> ورود </RouterLink>
                        <RouterLink to="/auth/register" class="text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"> ثبت نام </RouterLink>
                    </DisclosurePanel>
                </Disclosure>
            </div> -->
        </div>
        <div class="mt-6 pt-6">
            <div class="px-2 space-y-1">
                <RouterLink v-for="item in [{name :'صفحه اصلی برنامه' ,to:{name:'home'} , icon :'io-home-outline' }]" :key="item.name" :to="item.to" class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-900 hover:bg-gray-100">
                    <v-icon :name="item.icon" class="ml-4 h-6 w-6 text-gray-900 group-[.active]:text-white" aria-hidden="true" />
                    {{ item.name }}
                </RouterLink>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.active {
    @apply bg-gradient-to-l from-blue-600 to-blue-300 text-white;
}

.active svg {
    @apply text-white;
}
</style>
