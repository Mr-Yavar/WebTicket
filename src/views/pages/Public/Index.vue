<template>
    <EventPartial :changeHandler="{ onCities, onCategories, onSearchText }">
        <template #Events>
            <div class="grid grid-cols-1 mt-4 xl:grid-cols-4 xl:gap-y-4 lg:grid-cols-3 md:grid-cols-2 gap-y-2" dir="rtl" v-if="GetAllConcertsServiceCall.isFetched.value && !GetAllConcertsServiceCall.isLoading.value">
                <CardItem v-for="item in Concerts ?? []" :concert="item" :key="item.concertId" />
            </div>
            <div class="grid grid-cols-1 mt-4 xl:grid-cols-4 xl:gap-y-4 lg:grid-cols-3 md:grid-cols-2 gap-y-2" dir="rtl" v-else>
                <SkeletonCardItem />
            </div>
        </template>
    </EventPartial>
</template>

<script setup>
import EventPartial from './components/EventPartial.vue'
import CardItem from '@/views/pages/Public/components/CardItem.vue'
import { useQuery } from '@tanstack/vue-query'

import { computed } from 'vue'
import SkeletonCardItem from '@/views/pages/Public/components/SkeletonCardItem.vue'

import { ref } from 'vue'
import { ConcertsQueryKeys, get_apiConcertsGetAllConcerts } from '@/api/ConcertsService'

const cities = ref([])
const categories = ref([])
const searchText = ref('')

function onCities(value) {
    cities.value = value
}

function onCategories(value) {
    categories.value = value
}

function onSearchText(value) {
    searchText.value = value
}

const queryKey = computed(() => [ConcertsQueryKeys.get_apiConcertsGetAllConcerts(cities.value.join(','), categories.value.join(','), searchText)])
const GetAllConcertsServiceCall = useQuery({
    queryKey: queryKey,
    queryFn: () => get_apiConcertsGetAllConcerts(cities.value.join(','), categories.value.join(','), searchText),

    enabled: true
})

const Concerts = computed(() => GetAllConcertsServiceCall.data.value?.concerts)
</script>

<style scoped></style>
