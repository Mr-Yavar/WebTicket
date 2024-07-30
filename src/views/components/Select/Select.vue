<script>
export default {
    name: 'Select',
    props: {
        parentClass: {
            type: String
        },
        textBefore: {
            type: String
        }
    }
}
</script>

<template>
    <div class="relative h-10 w-80 min-w-[10em] block mx-auto mt-2 sm:mt-0" :class="parentClass">
        <div class="flex justify-between">
            <div class="rtl:fa-font w-full whitespace-pre px-1 leading-10 text-center">{{ textBefore }}</div>
            <select class="!text-black py-3 px-4 pe-9 block w-full border-2 border-black rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <option selected>Open this select menu</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
            </select>
        </div>
    </div>
</template>

<style scoped></style>
