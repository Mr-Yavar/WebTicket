<template>
    <div>    
        <table :class="tableClass + ' sticky top-6 z-10'">
      <thead :class="theadClass">
        <tr :class="theadTRClass">
          <th v-for="item in columns" :key="'th' + item.key" :class="thClass" :colspan="(!item.colSpan) ? 1 : item.colSpan">
            <slot :name="'thead' + item.key">{{ item.title }}</slot>
          </th>
        </tr>
      </thead>
    </table>
    <Scrollbar :options="{wheelSpeed:0.1,}" class=" z-0">
      <table :class="tableClass">
        <tbody :class="tbodyClass">
          <tr v-for="(row, index) in data" :key="'row' + index" :class="trClass" >
            <td v-for="item in columns" :key="'tbody' + item.id + Math.random()" :class="tdClass" :colspan="(!item.colSpan) ? 1 : item.colSpan">
              <slot :name="'tbody' + item.key" :data="row">{{ row[item.key] }}{{ index }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </Scrollbar>
</div>

</template>

<script setup>
defineProps({
  columns: Object,
  data: Array,
  tableClass: String,
  theadClass: String,
  tbodyClass: String,
  thClass: String,
  trClass: String,
  tdClass: String,
  theadTRClass : String
})
</script>

<style></style>
