<template>
    <div class="sticky top-0">
        <div class="bg-white">
            <Splitter title="اطلاعات" border-class=" border-black relative " type="middle" title-class="text-black" />
        </div>
    </div>

    <div class="grid grid-cols-3">
        <div class="rounded-sm ">
            <vueSelectUmd
                               
                                v-model="selectedItem"
                                :options="[{value:'1',label:'1'}]"
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
                            </vueSelectUmd>
        </div>
        <div class="col-span-2 rounded-sm "></div>
    </div>



</template>

<script setup>
import Splitter from '@/views/components/Splitter/Splitter.vue';
import vueSelectUmd from 'vue-select';
import {ref} from 'vue';

const selectedItem = ref('');
</script>

<style>

</style>