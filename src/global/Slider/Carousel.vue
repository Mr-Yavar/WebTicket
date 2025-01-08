<template>
    <swiper
        dir="rtl"
        :scrollbar="{
            hide: true
        }"
        :modules="[Scrollbar, Autoplay]"
        watch-slides-progress
        :space-between="1"
        :autoplay="{
            delay: 3000,
            reverseDirection: true,

            pauseOnMouseEnter: true
        }"
        class="mySwiper"
    >
        <swiper-slide v-for="value in (GetSlider.data.value?.values.filter(x=>x.valueType==0) ?? [])" :key="value.id"><img :src="FILE_PROVIDER2 + value.value" /></swiper-slide>
    </swiper>
</template>
<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/scrollbar'
import 'swiper/css/autoplay'

// import required modules
import { Scrollbar, Autoplay } from 'swiper/modules'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { FILE_PROVIDER2 } from '@/config/appConfig'
const GetSlider = useQuery({
    queryKey: ['/api/BaseInfo/GetParametersByKey/HomeSlider'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0],
            method: 'GET'
        }),
    refetchOnMount: true,
    enabled: true
})
</script>

<style scoped>
.swiper {
    @apply w-full h-[400px] rounded-xl bg-gray-200;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
}

.swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.swiper-scrollbar {
    @apply !bg-white;
}

.swiper-scrollbar-drag {
    @apply !bg-black;
}
</style>
