<script setup>
import Select from '@/views/components/Select/Select.vue'
import SearchBox from '@/views/components/Select/SearchBox.vue'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import CardItem from '@/views/components/Pages/Home/CardItem.vue'
import Carousel from '@/views/components/Slider/Carousel.vue'
import Vselect from 'vue-select'
import Cities from '@/assets/data/city.json'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { computed } from 'vue'
import { ref } from 'vue'
import SkeletonCardItem from '@/views/components/Pages/Home/SkeletonCardItem.vue'

const getCategoryServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetCategories'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: true
})
const categories = computed(() => getCategoryServiceCall.data.value?.filter((x) => x.parentId != null)?.map((x) => ({ label: x.title, value: x.id, parent: getCategoryServiceCall.data.value.find((y) => y.id === x.parentId)?.title })))

const selectedCities = ref([])
const selectedCategory = ref([])
const searchText = ref('')
</script>

<template>
    <Carousel />

    <div class="AppGap">
        <div class="AppContainer">
            <Splitter title="برنامه ها" type="middle" border-class="border-gray-500 border-dashed" titleClass="font-bold text-xl" />

            <div class="block">
                <div class="lg:flex lg:justify-center items-center">
                    <div class="grid grid-cols-2 lg:w-[50%] w-full">
                        <div class="mx-2">
                            <p class="rtl:fa-font flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700">
                                <v-icon name="si-openstreetmap" />
                                شهرها...
                            </p>
                            <Vselect
                                multiple
                                v-model="selectedCities"
                                :options="Cities"
                                :reduce="
                                    (city) => {
                                        return city.value
                                    }
                                "
                                label="label"
                                class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
                            >
                                <template #selected-option="{ label }">
                                    <div style="display: flex; align-items: baseline; padding: 0">
                                        <strong class="text-sm"> {{ label }} </strong>
                                    </div>
                                </template>

                                <template #option="{ label }">
                                    <div class="text-right">
                                        <h3 style="margin: 0">{{ label }}</h3>
                                    </div>
                                </template>
                            </Vselect>
                        </div>
                        <div class="mx-2">
                            <p class="rtl:fa-font flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700">
                                <v-icon name="md-category-outlined" />
                                نوع اجرا ...
                            </p>
                            <Vselect
                                multiple
                                :options="categories"
                                v-model="selectedCategory"
                                :reduce="
                                    (cat) => {
                                        return cat.value
                                    }
                                "
                                label="label"
                                class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
                            >
                                <template #selected-option="{ label, parent }">
                                    <div style="display: flex; align-items: baseline; padding: 0">
                                        <strong class="text-sm"> {{ label }} </strong>
                                        <em class="mx-1 text-xs"> {{ parent }} </em>
                                    </div>
                                </template>

                                <template #option="{ label, parent }">
                                    <div class="text-right">
                                        <h3 style="margin: 0">{{ label }}</h3>
                                        <em>{{ parent }}</em>
                                    </div>
                                </template>
                            </Vselect>
                        </div>
                    </div>
                    <div class="inline-step h-20 lg:inline-block hidden"></div>
                    <div class="lg:w-[50%] w-full">
                        <SearchBox v-model="searchText" />
                    </div>
                </div>
            </div>

            <slot name="Events" :selectedCategories="selectedCategory" :selectedCities="selectedCities" :searchText="searchText"> </slot>
        </div>
    </div>
</template>

<style scoped></style>
