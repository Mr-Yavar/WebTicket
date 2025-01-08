<template>
   <div :class="$attrs.class" :style="'--scrol-ps-height :' + scrollBarHeight">
    <table :class="tableClass + ' ' + ''">
        <thead :class="theadClass">
            <tr :class="theadTRClass">
                <th v-for="item in columns" :key="'th' + item.key" :class="thClass+' '+ (item.thClass ?? '')" :colspan="!item.colSpan ? 1 : item.colSpan">
                    <slot :name="'thead' + item.key">{{ item.title }}</slot>
                </th>
            </tr>
        </thead>
    </table>
    <PerfectScrollbar  >
        <table :class="tableClass">
            <tbody :class="tbodyClass">
                <tr v-for="(row, index) in data" :key="'row' + index" :class="trClass">
                    <td v-for="item in columns" :key="'tbody' + item.id + Math.random()" :class="tdClass +' '+ (item.tdClass ?? '')" :colspan="!item.colSpan ? 1 : item.colSpan">
                        <slot :name="'tbody' + item.key" :data="row">{{ row[item.key] }}{{ index }}</slot>
                    </td>
                </tr>
            </tbody>
            
        </table>
    </PerfectScrollbar>
    <div :class="' sticky bottom-0 ' + ''">
        <slot name="pagination" ></slot>
    </div>
</div>
</template>

<script setup>

import { PerfectScrollbar  } from 'vue3-perfect-scrollbar';


defineProps({
    columns: Object,
    data: Array,
    tableClass: String,
    theadClass: String,
    tbodyClass: String,
    thClass: String,
    trClass: String,
    tdClass: String,
    theadTRClass: String,
    pageSizes : Array,
    scrollBarHeight :String
});





</script>

<style scoped>
@import 'vue3-perfect-scrollbar/style.css';
.ps{
    height: var(--scrol-ps-height);
}
</style>
