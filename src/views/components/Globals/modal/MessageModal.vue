<script setup>
import Modal from '@/views/components/Globals/modal/modal.vue'
import { computed } from 'vue'

const props = defineProps({
    show: Boolean,
    onCloseFn: Function,
    type: String,
    message: String
})

const title = computed(() => {
    switch (type.toLowerCase()) {
        case 'error':
            return 'خطا!'
        case 'info':
            return 'دانستنی!'
        case 'warning':
            return 'هشدار!'
        case 'success':
            return 'موفق!'
        default:
            return '-'
    }
})

const titleIcon = computed(() => {
    switch (type.toLowerCase()) {
        case 'error':
            return 'خطا!'
        case 'info':
            return 'دانستنی!'
        case 'warning':
            return 'هشدار!'
        case 'success':
            return 'موفق!'
        default:
            return '-'
    }
})
</script>

<template>
    <modal :show="show" :on-close-fn="onCloseFn">
        <template #title>
            <h3 class="font-bold text-lg mb-4 rtl:text-right">{{ title }}</h3>
        </template>
        <template #body>
            <template v-html="message"></template>
        </template>
    </modal>
</template>

<style scoped></style>
