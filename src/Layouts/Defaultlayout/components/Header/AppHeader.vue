<template>
    <header class="!mt-0 rtl:fa-font">
        <nav class="text-white bg-white border shadow-md AppContainer rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
            <div class="flex items-center justify-between text-blue-gray-900">
                <a class="block antialiased leading-relaxed text-inherit mr-4 cursor-pointer py-1.5 font-bold text-2xl" href="#">
                    <v-icon animation="wrench" fill="red" name="io-ticket-sharp" scale="1.5" speed="slow" />
                    تـیـکــتــیوم</a
                >
                <div class="flex items-center gap-4">
                    <div class="hidden mr-4 lg:block">
                        <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                            <li class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 hover:border-b-2">
                                <router-link :to="{ name: 'home' }" active-class="active" class="flex items-center">صفحه اصلی</router-link>
                            </li>

                            <li class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 hover:border-b-2">
                                <router-link :to="{ name: 'about' }" active-class="active" class="flex items-center" href="#">درباره ما</router-link>
                            </li>
                            <li v-if="userStore.isAuthenticated && userStore.roles.includes('Admin')" class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 hover:border-b-2">
                                <router-link :to="{ name: 'adminPanel' }" active-class="active" class="flex items-center" href="#">مدیریت </router-link>
                            </li>
                            <li v-if="userStore.isAuthenticated" class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                <Dropdown @visible-change="change">
                                    <!-- trigger element -->
                                    <template #trigger>
                                        <button class="w-fit select-none rounded-lg border border-gray-900 py-2 px-1 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                            <a class="flex items-center justify-between" href="#">
                                                <div class="mx-1">
                                                    <v-icon name="la-user-circle" />
                                                </div>
                                                <div class="w-full mx-1">{{ userStore.FullName }}</div>
                                            </a>
                                        </button>
                                    </template>

                                    <DropdownContent>
                                    <!-- contents display in dropdown -->
                                    <div>
                                        <div class="px-2 py-2 w-fit vazir-font direction-rtl">
                                            <div class="my-1">
                                                <div @click.prevent="$router.push({name:'profile'})"> 
                                                 
                                                    <span class="block px-2 py-1 text-sm rounded-full hover:bg-gray-50">پروفایل</span>
                                                </div>
                                            </div>
                                            <div class="my-1">
                                                <div @click.prevent="$router.push({name:'MyReservations'})"> 
                                                 
                                                    <span class="block px-2 py-1 text-sm rounded-full hover:bg-gray-50">رزروهای من</span>
                                                </div>
                                            </div>
                                            <div class="my-1">
                                                <div @click.prevent="$router.push({name:'MyPayments'})">
                                                    <span class="block px-2 py-1 text-sm rounded-full hover:bg-gray-50">تراکنش‌های من</span>
                                                </div>
                                            </div>
                                            <div class="my-1">
                                                <div class="my-1 border-[1px] border-gray-400 rounded-2xl"></div>
                                                <router-link to="/logout">
                                                    <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-4 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] hidden lg:inline-block" title="خدافظی؟؟؟" type="button">
                                                        <span>خروج از حساب</span>
                                                    </button>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownContent>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                    <div class="flex items-center gap-x-1">
                        <template v-if="!userStore.isAuthenticated">
                            <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-4 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] hidden lg:inline-block" type="button" @click.prevent="authModal.toggleMenu()">
                                <span>ثبت نام / ورود</span>
                            </button>
                        </template>
                    </div>
                    <button class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none max-w-[40px] max-h-[40px] rounded-lg text-xs ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden" type="button">
                        <span class="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" @click.prevent="toggleMenu()">
                            <svg v-if="!showMenu" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <svg v-if="showMenu" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </span>
                    </button>
                </div>
            </div>
            <transition name="fade">
                <div v-if="showMenu" class="block w-full overflow-hidden basis-full lg:hidden" style="">
                    <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                        <li class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 hover:border-b-2">
                            <router-link :to="{ name: 'home' }" active-class="active" class="flex items-center" href="#">صفحه اصلی</router-link>
                        </li>
                        <li class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 hover:border-b-2">
                            <router-link :to="{ name: 'about' }" active-class="active" class="flex items-center" href="#">درباره ما</router-link>
                        </li>
                        <li v-if="userStore.isAuthenticated && userStore.roles.includes('Admin')" class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 hover:border-b-2">
                            <router-link :to="{ name: 'adminPanel' }" active-class="active" class="flex items-center" href="#"> مدیریت </router-link>
                        </li>
                        <li v-if="userStore.isAuthenticated" class="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            <Dropdown @visible-change="change" :fullWidth="true">
                                <!-- trigger element -->
                                <template #trigger>
                                    <button class="select-none rounded-lg border border-gray-900 py-2 px-1 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none block w-full" type="button">
                                        <a class="flex items-center justify-between" href="#">
                                            <div class="mx-1">
                                                <v-icon name="la-user-circle" />
                                            </div>
                                            <div class="w-full mx-1">{{ userStore.FullName }}</div>
                                        </a>
                                    </button>
                                </template>

                                <!-- contents display in dropdown -->
                                <div>
                                    <div class="px-2 py-2 w-fit vazir-font direction-rtl">
                                        <div class="my-1">
                                            <div @click.prevent="$router.push({name:'profile'})"> 
                                             
                                                <span class="block px-2 py-1 text-sm rounded-full hover:bg-gray-50">پروفایل</span>
                                            </div>
                                        </div>
                                        <div class="my-1">
                                            <div @click.prevent="$router.push({name:'MyReservations'})"> 
                                             
                                                <span class="block px-2 py-1 text-sm rounded-full hover:bg-gray-50">رزروهای من</span>
                                            </div>
                                        </div>
                                        <div class="my-1">
                                            <div @click.prevent="$router.push({name:'MyPayments'})">
                                                <span class="block px-2 py-1 text-sm rounded-full hover:bg-gray-50">تراکنش‌های من</span>
                                            </div>
                                        </div>
                                        <div class="my-1">
                                            <div class="my-1 border-[1px] border-gray-400 rounded-2xl"></div>
                                            <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] block w-full" title="خدافظی؟؟؟" type="button" @click.prevent="userStore.logOut()">
                                                <span>خروج از حساب</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dropdown>
                        </li>
                    </ul>
                    <div class="flex items-center gap-x-1">
                        <template v-if="!userStore.isAuthenticated">
                            <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] block w-full" type="button" @click.prevent="authModal.toggleMenu()">
                                <span>ثبت نام / ورود</span>
                            </button>
                        </template>
                    </div>
                </div>
            </transition>
        </nav>
    </header>
</template>
<script setup>
import {Dropdown,DropdownContent} from 'v-dropdown'
import { ref } from 'vue'
import { useAuthModalStore } from '@/stores/componentStore/authModal.js'
import useUserStore from '@/stores/user.js'

const authModal = useAuthModalStore()
const userStore = useUserStore()

const showMenu = ref(false)

function toggleMenu() {
    showMenu.value = !showMenu.value
}

function change(val) {
    console.log(val)
}
</script>
<style>
.fade-enter-from {
    height: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: height 0.5s ease;
}

.fade-leave-from {
    height: 196px;
}

.fade-enter-to {
    height: 196px;
}

.fade-enter-from,
.fade-leave-to {
    height: 0;
}

.active {
    @apply border-b-2;
}
</style>
