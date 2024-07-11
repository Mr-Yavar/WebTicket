<template>
  <div class="min-h-full">
    <TransitionRoot :show="sidebarOpen" as="template" class="direction-rtl vazir-font">
      <Dialog
          as="div"
          class="fixed inset-0 flex z-40 lg:hidden"
          @close="sidebarOpen = false"

      >
        <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75"/>
        </TransitionChild>
        <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="translate-x-full"
            enter-to="-translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="-translate-x-full"
            leave-to="translate-x-full"
        >
          <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
            <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button
                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    type="button"
                    @click="sidebarOpen = false"
                >
                  <span class="sr-only">Close sidebar</span>
                  <v-icon aria-hidden="true" class="h-6 w-6 text-white" fill="red" name="la-times-solid"/>
                </button>
              </div>
            </TransitionChild>
            <SideBar/>
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
      <SideBar/>
    </div>

    <div class="lg:pr-64 lg:mx-8 lg:my-4 mx-8 my-4 rounded flex flex-col flex-1">
      <div
          class="relative z-10 flex-shrink-0 flex h-16 bg-white rounded-lg shadow border-b border-gray-200 lg:border-none"
      >
        <button
            class="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            type="button"
            @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <v-icon aria-hidden="true" class="h-6 w-6" fill="black" flip="both" name="ri-menu-2-line"/>
        </button>
        <!-- Search bar -->
        <div
            class="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8"
        >
          <div class="flex-1 flex">
            <form action="#" class="w-full flex md:ml-0" method="GET">
              <label class="sr-only" for="search-field">Search</label>
              <div
                  class="relative w-full text-gray-400 focus-within:text-gray-600"
              >
                <div
                    aria-hidden="true"
                    class="absolute inset-y-0 right-0 flex items-center pointer-events-none"
                >
                  <v-icon aria-hidden="true" class="h-5 w-5" fill="black" name="fa-search"/>
                </div>
                <input
                    id="search-field"
                    class="block w-full h-full pr-8 pl-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                    name="search-field"
                    placeholder="جستجو"
                    type="search"
                />
              </div>
            </form>
          </div>
          <div class="mr-4 flex items-center md:mr-6">
            <button
                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                type="button"
            >
              <span class="sr-only">View notifications</span>
              <v-icon aria-hidden="true" class="h-6 w-6" name="co-bell"/>
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="mr-3 relative">
              <div>
                <MenuButton
                    class="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50"
                >
                  <img alt="" class="h-8 w-8 rounded-full" src="/avatar.jpg"/>
                  <span
                      class="hidden mr-3 text-gray-700 text-sm font-medium lg:block"
                  ><span class="sr-only">Open user menu for </span>لیندزی
                    والتون</span
                  >
                  <v-icon aria-hidden="true" class="hidden flex-shrink-0 mr-1 h-5 w-5 text-gray-400 lg:block"
                          fill="black"
                          name="hi-chevron-down"
                  />
                </MenuButton>
              </div>
              <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                    class="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <a
                        :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                        href="#"
                    >حساب کاربری</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                        :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                        href="/settings"
                    >تنظیمات</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                        :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                        href="#"
                    >خروج</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="lg:pr-64 mt-8 mx-8 ">

    

    <div class="max-h-[calc(100dvh-115px)] min-h-[calc(100dvh-120px)] overflow-y-scroll relative">
      <slot></slot>
    </div>
  </div>


</template>

<script setup>
import {ref} from 'vue';

import {
  Dialog,
  DialogOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import SideBar from "@/views/components/Layouts/AdminLayout/component/SideBar.vue";
import {useRoute} from "vue-router";


const sidebarOpen = ref(false);

const route = useRoute();

console.log(route.matched);
</script>

<style >

/* width */
*::-webkit-scrollbar {
  width: 10px;
  display: inline;

 
}

/* Track */
*::-webkit-scrollbar-track {
  background: transparent;
  position: absolute;
  left : 100px;
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