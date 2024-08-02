<script setup>
defineProps({
    toPrevious: Function,
    toNext: Function
})
</script>

<template>
    <div class="flex justify-between mt-16">
        <slot :orgClickFn="toPrevious" name="previousBtn">
            <button class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" @click="toPrevious">مرحله قبل</button>
        </slot>

        <slot :orgClickFn="toNext" name="nextBtn">
            <button class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" @click="toNext">مرحله بعد</button>
        </slot>
    </div>
</template>

<style scoped></style>
