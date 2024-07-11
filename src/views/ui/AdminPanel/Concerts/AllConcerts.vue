<script setup>
import DataTable_V1 from '@/views/components/Globals/DataTables/DataTable_V1.vue'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'

const getAllConcert = useQuery({
  queryKey: [{ url: '/api/Manager/GetAllConcerts', pageSize: 1, currentPage: 1 }],
  queryFn: ({ queryKey }) =>
    sendRequest({
      url: queryKey[0].url + '/' + queryKey[0].pageSize + '/' + queryKey[0].currentPage,
      method: 'GET',
      headers: {}
    }),
  enabled: true
})

const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
</script>

<template>
  <div class="sticky top-0 z-10">
    <div class="bg-white">
      <Splitter title="همه کنسرت‌ها" border-class=" border-black relative " type="middle" title-class="text-black" />
    </div>
  </div>

  <div class="w-full sticky top-20">
    <DataTable_V1 :columns="[
      {
        title: '#',
        key: 'concertid'
      },
      {
        title: 'عنوان',
        key: 'title',
        colSpan: 2
      },
      {
        title: 'دسته بندی',
        key: 'category'
      },

      {
        title: 'زمان شروع',
        key: 'startDate',

      },

      {
        title: 'زمان پایان',
        key: 'endDate'
      },
      {
        title: '-',
        key: 'options'
      }
    ]"
      :data="getAllConcert.data.value?.concerts ? [...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts, ...getAllConcert.data.value?.concerts] : []"
      :tableClass="'table table-fixed w-full'" :theadClass="'!bg-green-400 text-white antialised'" :tbodyClass="''"
      :thClass="'text-center p-2'" :tdClass="'text-center p-1'" :trClass="'odd:!bg-gray-200 even:!bg-gary-100'"
      :theadTRClass="'!bg-info'">

      <template #[`tbodyconcertid`]="{ data }">{{ '-' }}</template>
      <template #[`tbodytitle`]="{ data }">{{ data.title }}</template>
      <template #[`tbodycategory`]="{ data }">{{ data.category }}</template>
      <template #[`tbodystartDate`]="{ data }">{{ new Date(data.startDate).toLocaleString('fa-ir',
        dateFormat).split(",").reverse().join(" ") }}</template>
      <template #[`tbodyendDate`]="{ data }">{{ new Date(data.endDate).toLocaleString('fa-ir',
        dateFormat).split(",").reverse().join(" ") }}</template>
      <template #[`tbodyoptions`]="{ data }">
        <div class="flex justify-around"><button class="btn btn-success btn-sm">اضافه کردن</button><button
            class="btn btn-warning btn-sm">ویرایش</button></div>
      </template>


    </DataTable_V1>
  </div>
</template>
