<template>
    <div class="flex items-center rtl:fa-font" :class="class">
        <template v-if="type.toLowerCase() === 'middle'">
            <div class="flex-1 border-t-2" :class="borderClass === '' ? 'border-black' : borderClass"></div>
            <span class="px-3 text-black dark:text-white" :class="titleClass">{{ title }}</span>
            <div class="flex-1 border-t-2" :class="borderClass === '' ? 'border-black' : borderClass"></div>
        </template>

        <template v-if="type.toLowerCase() === 'right'">
            <span class="px-3 text-black dark:text-white" :class="titleClass">{{ title }}</span>
            <div class="flex-1 border-t-2" :class="borderClass === '' ? 'border-black' : borderClass"></div>
            <div class="flex-1 border-t-2" :class="borderClass === '' ? 'border-black' : borderClass"></div>
        </template>
        <template v-if="type.toLowerCase() === 'left'">
            <div class="flex-1 border-t-2" :class="borderClass === '' ? 'border-black' : borderClass"></div>
            <div class="flex-1 border-t-2" :class="borderClass === '' ? 'border-black' : borderClass"></div>
            <span class="px-3 text-black dark:text-white" :class="titleClass">{{ title }}</span>
        </template>
    </div>
</template>
<script>


export default {
    name: 'Splitter',
    props: {
        title: {
            type: String
        },
        type: {
            type: String
        },
        borderClass: {
            type: String
        },
        titleClass: {
            type: String
        },
        class: {
            type: String
        }
    }
};


</script>
<style></style>
