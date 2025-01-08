<template>
    <div>
        <div class="cardWrap md:!text-base !text-sm">
            <div class="relative card cardLeft">
                <span class="absolute top-[-2%] left-[-4%] py-0.5 px-1 mx-1 rounded-full bg-red-900 text-white text-xs" v-show="event.isEnded">خاتمه یافت</span>
                <div class="absolute top-2.5 text-center text-white block w-full md:!text-lg !text-base"><span class="font-extrabold">کنسرت {{ concertTitle }} </span></div>
                <div class="flex flex-col items-center justify-end h-full">
                    <span class="block text-center text-black"
                        ><span class="font-bold">ساعت : </span
                        >{{
                            executionDate.toLocaleTimeString('fa-ir', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })
                        }}</span
                    >
                    <div class="p-0 md:p-1"></div>
                    <span class="block text-center" v-if="!event.isEnded &&  startSaleDate.valueOf() < (new Date()).valueOf()">
                        <div class="relative inline-flex">
                            <button @click="handleClick" class="select-none rounded-lg bg-blue-gray-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">خرید بلیت</button>

                            <span class="absolute w-[12px] h-[12px] rounded-full py-1 px-1 text-xl font-medium content-[''] leading-2 grid place-items-center top-[-5%] left-[-2%] bg-green-400 text-white"></span>
                            <span class="absolute w-[12px] h-[12px] rounded-full py-1 px-1 text-xl font-medium content-[''] leading-2 grid place-items-center top-[-5%] left-[-2%] bg-green-300 text-white animate-ping"></span>
                        </div>
                    </span>
                    <span class="block text-center" v-else-if="event.isEnded">
                        <div class="relative inline-flex">
                            <button class="select-none rounded-lg bg-gray-50 dark:bg-gray-700 text-red-400 border-[2px] border-red-400 py-2 px-6 text-center align-middle font-sans text-sm font-bold shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">خاتمه یافته</button>
                        </div>
                    </span>

                    <span class="block text-center" v-else>
                        <vue-countdown :time="expirationTimeOut" v-slot="{ days,hours,minutes, seconds }">
                                    {{ seconds.toString().padStart(2, '0') }}″    {{ minutes.toString().padStart(2, '0') }}′  {{ days }}d    {{ hours }}h     
                             </vue-countdown>

                    </span>
                </div>
            </div>
            <div class="relative card cardRight">
                <div class="absolute block w-full text-center text-white top-3">
                    {{ executionDate.toLocaleDateString('fa-ir', { weekday: 'long' }) }}
                </div>
                <div class="flex flex-col justify-end h-full text-black">
                    <span class="block text-center">{{ executionDate.toLocaleDateString('fa-ir', { day: '2-digit' }) }}</span>
                    <span class="block text-center">{{ executionDate.toLocaleDateString('fa-ir', { month: 'long' }) }}</span>
                    <span class="block text-center">{{ executionDate.toLocaleDateString('fa-ir', { year: 'numeric' }) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import VueCountdown from '@chenfengyuan/vue-countdown'
import { computed } from 'vue'

const props = defineProps({
    handleClick: Function,
    event: Object,
    concertTitle: String
})

const executionDate = computed(() => new Date(props.event.executionDate))
const startSaleDate = computed(() => new Date(props.event.startSaleDate));
const expirationTimeOut = computed(()=> new Date(props.event.startSaleDate) -  new Date() );
</script>

<style scoped>
.cardWrap {
    @apply mx-auto my-auto;
}

.card {
    @apply h-[8em] float-left relative pt-[1em] pb-[0.40em];
    background: linear-gradient(to bottom, rgba(38, 37, 37, 0.95) 0%, rgba(38, 37, 37, 0.95) 35%, #dcdcdc 35%, #dcdcdc 100%);
}

.cardLeft {
    @apply w-3/4 rounded-tl-lg rounded-bl-lg;
}

.cardRight {
    @apply w-1/4 rounded-tr-lg rounded-br-lg border-l-[0.18em] border-l-white border-dashed before:top-[-0.4em] after:bottom-[-0.4em];
}

.cardRight:before,
.cardRight:after {
    @apply content-[""] absolute block w-[0.9em] h-[0.9em] left-[-0.5em] rounded-[50%] bg-white dark:!bg-transparent;
}
</style>
