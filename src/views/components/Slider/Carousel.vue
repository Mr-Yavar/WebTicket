<template>
    <swiper
        dir="rtl"
        :scrollbar="{
            hide: true
        }"
        :modules="modules"
        class="mySwiper"
    >
        <swiper-slide><img src="/assets/images/carousel1.jpeg" /></swiper-slide>
        <swiper-slide><img src="/assets/images/carousel2.jpeg" /></swiper-slide>
        <swiper-slide><img src="/assets/images/carousel3.jpeg" /></swiper-slide>
    </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/scrollbar'

// import required modules
import { Scrollbar } from 'swiper/modules'

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    setup() {
        return {
            modules: [Scrollbar]
        }
    }
}
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
