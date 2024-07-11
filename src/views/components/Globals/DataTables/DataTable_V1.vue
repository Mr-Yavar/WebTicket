<template>

  <table :class="tableClass + ' sticky top-6 ' + ''">
    <thead :class="theadClass">
      <tr :class="theadTRClass">
        <th v-for="item in columns" :key="'th' + item.key" :class="thClass"
          :colspan="(!item.colSpan) ? 1 : item.colSpan">
          <slot :name="'thead' + item.key">{{ item.title }}</slot>
        </th>
      </tr>
    </thead>
  </table>
  <div class="max-h-[500px] min-h-[500px] overflow-y-scroll">
    <table :class="tableClass">
      <tbody :class="tbodyClass">
        <tr v-for="(row, index) in data" :key="'row' + index" :class="trClass">
          <td v-for="item in columns" :key="'tbody' + item.id + Math.random()" :class="tdClass"
            :colspan="(!item.colSpan) ? 1 : item.colSpan">
            <slot :name="'tbody' + item.key" :data="row">{{ row[item.key] }}{{ index }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
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
  theadTRClass: String
})
</script>

<style></style>
