<template>
    <EventPartial :changeHandler="{onCities,onCategories,onSearchText}">
        <template #Events>
            <div class="grid grid-cols-1 mt-4 xl:grid-cols-4 xl:gap-y-4 lg:grid-cols-3 md:grid-cols-2 gap-y-2" dir="rtl" v-if="GetAllConcertsServiceCall.isFetched.value && !GetAllConcertsServiceCall.isLoading.value">
                <CardItem v-for="item in (Concerts ?? [])" :concert="item" :key="item.concertId" />
            </div>
            <div class="grid grid-cols-1 mt-4 xl:grid-cols-4 xl:gap-y-4 lg:grid-cols-3 md:grid-cols-2 gap-y-2" dir="rtl" v-else>
                <SkeletonCardItem />
            </div>
        </template>
    </EventPartial>
</template>

<script setup>
import EventPartial from '@/views/ui/Home/EventPartial.vue'
import CardItem from '@/views/components/Pages/Home/CardItem.vue'
import { useQuery } from '@tanstack/vue-query'

import { computed } from 'vue'
import SkeletonCardItem from '@/views/components/Pages/Home/SkeletonCardItem.vue'
import { sendRequest } from '@/services/service'
import { ref } from 'vue'

const cities = ref([]);
const categories = ref([]);
const searchText = ref("");

function onCities(value){
    cities.value = value;
}

function onCategories(value){
    categories.value = value;
}

function onSearchText(value){
    console.log(value);
    searchText.value = value;
}

const queryKey = computed(()=>['/api/Concerts/GetAllConcerts',{CityId :cities.value.join(","),categories:categories.value.join(","),searchText   }]);
const GetAllConcertsServiceCall = useQuery({
    queryKey: queryKey,
    queryFn: ({queryKey,signal})=>{
        let params = queryKey[1];
        return sendRequest({
            url : queryKey[0] + "?" + [(params.CityId !== "" ? `CityIds=${params.CityId}` : null),(params.categories !== "" ? `CategoryIds=${params.categories}` : null),(params.searchText !== "" ? `searchTxt=${params.searchText}` : null)  ].filter(x=>!!x).join("&")
            ,signal
        });
    },

    enabled: true
})

const Concerts = computed(() => GetAllConcertsServiceCall.data.value?.concerts)
</script>

<style scoped></style>
