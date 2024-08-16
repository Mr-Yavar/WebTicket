<style>
.tab-active {
    @apply bg-neutral text-white;
}
.ps{


    @apply md:h-[calc(100dvh_-_350px)] h-[calc(100dvh_-_500px)] 
}
</style>

<template>
    <modal :show="show" :on-close-fn="onCloseFn">
        <template #title>
            <h3 class="font-bold text-lg mb-4 rtl:text-right">قوانین و مقررات</h3>
        </template>
        <template #body>
            <PerfectScrollbar>
                <pre class="text-wrap text-right text-xs w-fit">
                    {{ getTOS.data.value?.values[0]?.value }}
                </pre>
            </perfectScrollbar>
         
        </template>
    </modal>
</template>

<script setup>
import { sendRequest } from '@/services/service';
import Modal from '@/views/components/Globals/modal/modal.vue'
import { useQuery } from '@tanstack/vue-query';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

defineProps({
    show: Boolean,
    onCloseFn: Function
})

const getTOS = useQuery({
    queryKey: ['/api/BaseInfo/GetParametersByKey/ToS'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0],
            method: 'GET'
        }),
    refetchOnMount: true,
    enabled: true
});
</script>
