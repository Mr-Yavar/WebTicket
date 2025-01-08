<script setup>

import SearchBox from '@/global/Select/SearchBox.vue'
import Splitter from '@/global/Splitter/Splitter.vue'

import Carousel from '@/global/Slider/Carousel.vue'
import Vselect from 'vue-select'
import Cities from '@/assets/data/city.json'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { computed, watch } from 'vue'
import { ref } from 'vue'


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

const selectedCities = ref([]);
const selectedCategory = ref([]);
const searchText = ref('');

const props = defineProps({
    changeHandler : Object
});

watch(selectedCities,()=>{

})

watch(selectedCategory,()=>{

})

watch(searchText,()=>{
   
    
})

function submit(){
    console.log(111);
    props.changeHandler.onCities(selectedCities.value);
    props.changeHandler.onCategories(selectedCategory.value);
    props.changeHandler.onSearchText(searchText.value);
}

</script>

<template>
    <Carousel />

    <div class="AppGap">
        <div class="AppContainer">
            <Splitter title="برنامه ها" type="middle" border-class="border-gray-500 border-dashed" titleClass="font-bold text-xl" />
            
            <div class="block">
                <div class="items-center lg:flex lg:justify-center">
                    <div class="grid grid-cols-2 lg:w-[50%] w-full">
                        <div class="mx-2">
                            <p class="flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700 rtl:fa-font">
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
                            <p class="flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700 rtl:fa-font">
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
                    <div class="hidden h-20 inline-step lg:inline-block"></div>
                    <div class="lg:w-[50%] w-full grid grid-cols-6 gap-3">
                        <div class="col-span-5 ">
                        <SearchBox v-model="searchText" :submiter="submit" />
                    </div>
                    <div class="">
                        <button type="button" @click.prevent="submit" class="btn btn-ms shadow-sm hover:!shadow-lg block mx-auto lg:my-0 my-3  py-1.5 bg-gray-500 border-gray-400 text-gray-200 "><v-icon name="fa-search"  aria-hidden="true"></v-icon></button>
                    </div>
                    </div>
                </div>
            </div>
       
            <slot name="Events"> </slot>
        </div>
    </div>
</template>

<style scoped></style>
