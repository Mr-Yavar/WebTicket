<template>
    <div class="min-h-full">
        <TransitionRoot :show="sidebarOpen" as="template" class="direction-rtl vazir-font">
            <Dialog as="div" class="fixed inset-0 z-40 flex lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
                    <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </TransitionChild>
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="translate-x-full" enter-to="-translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="-translate-x-full" leave-to="translate-x-full">
                    <div class="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white">
                        <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                            <div class="absolute top-0 right-0 pt-2 -mr-12">
                                <button class="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" type="button" @click="sidebarOpen = false">
                                    <span class="sr-only">Close sidebar</span>
                                    <v-icon aria-hidden="true" class="w-6 h-6 text-white" fill="red" name="la-times-solid" />
                                </button>
                            </div>
                        </TransitionChild>
                        <SideBar />
                    </div>
                </TransitionChild>
                <div aria-hidden="true" class="flex-shrink-0 w-14">
                    <!-- Dummy element to force sidebar to shrink to fit close icon -->
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:shadow-lg">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <SideBar />
        </div>

        <div class="flex flex-col flex-1 mx-8 my-4 rounded lg:pr-64 lg:mx-8 lg:my-4">
            <div class="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 rounded-lg shadow lg:border-none">
                <button class="px-4 text-gray-400 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden" type="button" @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <v-icon aria-hidden="true" class="w-6 h-6" fill="black" flip="both" name="ri-menu-2-line" />
                </button>
                <!-- Search bar -->
                <div class="flex justify-between flex-1 px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                    <div class="flex flex-1">
                        <form action="#" class="flex w-full md:ml-0" method="GET">
                            <label class="sr-only" for="search-field">Search</label>
                            <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                                <div aria-hidden="true" class="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <v-icon aria-hidden="true" class="w-5 h-5" fill="black" name="fa-search" />
                                </div>
                                <input id="search-field" class="block w-full h-full py-2 pl-3 pr-8 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm" name="search-field" placeholder="جستجو" type="search" />
                            </div>
                        </form>
                    </div>
                    <div class="flex items-center mr-4 md:mr-6">
                        <button class="p-1 text-gray-400 bg-white rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type="button">
                            <span class="sr-only">View notifications</span>
                            <v-icon aria-hidden="true" class="w-6 h-6" name="co-bell" />
                        </button>

                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative mr-3">
                            <div>
                                <MenuButton class="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                                    <v-icon name="la-user-circle" class="scale-150" />
                                    <span class="hidden mr-3 text-sm font-medium text-gray-700 lg:block">{{ userStore.FullName }}</span>
                                    <v-icon aria-hidden="true" class="flex-shrink-0 hidden w-5 h-5 mr-1 text-gray-400 lg:block" fill="black" name="hi-chevron-down" />
                                </MenuButton>
                            </div>
                            <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                                <MenuItems class="absolute left-0 w-48 py-1 mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem  >
                                        <RouterLink :to="{name:'AdminpProfile'}" active-class="bg-gray-100" :class="['block px-4 py-2 text-sm text-gray-700']" >حساب کاربری</RouterLink>
                                    </MenuItem>
                                    <MenuItem >
                                        <router-link to="/logout"
                                        active-class="bg-gray-100" :class="['block px-4 py-2 text-sm text-gray-700']" >خروج</router-link>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mx-8 mt-8 lg:pr-64">
        <div class="max-h-[calc(100dvh-115px)] min-h-[calc(100dvh-120px)] overflow-y-scroll relative">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

import { Dialog, DialogOverlay, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, TransitionRoot } from '@headlessui/vue'
import SideBar from './components/component/SideBar.vue'
import useUserStore from '@/stores/user'

const sidebarOpen = ref(false)


const userStore = useUserStore()

</script>

<style>
/* width */
*::-webkit-scrollbar {
    width: 10px;
    display: inline;
}

/* Track */
*::-webkit-scrollbar-track {
    background: transparent;
    position: absolute;
    left: 100px;
}

/* Handle */
*::-webkit-scrollbar-thumb {
    background: #888;
    position: absolute;
    @apply rounded-md;
}

/* Handle on hover */
*::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
