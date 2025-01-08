<template>
  <div class="sticky top-0">
    <div class="bg-white">
      <Splitter
        title="تراکنش‌های من"
        border-class="relative border-black "
        type="middle"
        title-class="text-black"
      />
    </div>
  </div>

  <div class="w-full m-0 overflow-hidden h-fit">
    <div class="px-4 mx-auto sm:px-6 lg:px-8">
      <div class="flex flex-col mt-2">
        <div
          class="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg"
        >
          <DataTable_V1
            class="!rounded-md overflow-hidden"
            :columns="[
              {
                title: 'مبلغ صورتحساب',
                key: 'amount',
                colSpan: 1,
              },
              {
                title: 'پرداختی',
                key: 'billamount',
              },
              {
                title: 'سرویس پرداخت',
                key: 'serviceType',
              },
              {
                title: 'زمان پرداخت',
                key: 'createdDate',
              },

              {
                title: 'وضعیت',
                key: 'status',
                tdClass: '',
              },
            ]"
            :data="GetUserTranscations.data.value?.data ?? []"
            :tableClass="'min-w-full divide-y divide-gray-500 table-fixed'"
            :theadClass="''"
            :thead-t-r-class="''"
            :tbodyClass="'!bg-white divide-y divide-gray-200'"
            :thClass="'px-6 py-4 bg-gray-300 text-sm font-medium text-gray-900 uppercase text-center'"
            :tdClass="'max-w-0  px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900'"
            :trClass="'odd:bg-white even:bg-gray-100'"
            :scrollBarHeight="'calc(100dvh - 300px)'"
          >
            <template #[`tbodyamount`]="{ data }">{{ data.amount }}</template>
            <template #[`tbodybillamount`]="{ data }">{{ data.billAmount }}</template>
            <template #[`tbodycreatedDate`]="{ data }">{{
              new Date(data.createdDate)
                .toLocaleString("fa-ir", dateFormat)
                .split(",")
                .reverse()
                .join(" ")
            }}</template>
            <template #[`tbodyserviceType`]="{ data }">{{
              payServicesTitle[data.serviceType]
            }}</template>
            <template #[`tbodystatus`]="{ data }">
              <div class="text-center !text-blue-900">
                <span
                  class="w-32 px-1 py-0 text-xs rounded-full cursor-help"
                  :class="{
                    'border-2 border-green-700 text-green-800 shadow-green-200 shadow-sm':
                      data.status === 'Verified',
                    'border-2 border-orange-700 text-orange-800 shadow-orange-200 shadow-sm':
                      data.status === 'InProgress',
                    'border-2 border-red-700 text-red-800 shadow-red-200 shadow-sm':
                      data.status === 'Refuted',
                  }"
                >
                  {{ PayStatusTitle[data.status] }}
                </span>
              </div>
            </template>

            <template #[`pagination`]>
              <nav
                class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                aria-label="Pagination"
              >
                <div class="hidden sm:block">
                  <p class="text-sm text-gray-700">
                    نمایش
                    {{ " " }}
                    <span class="font-medium">{{ pageIndex * pageSize + 1 }}</span>
                    {{ " " }}
                    تا
                    {{ " " }}
                    <span class="font-medium">{{ (pageIndex + 1) * pageSize }}</span>
                    {{ " " }}
                    از
                    {{ " " }}
                    <span class="font-medium">{{ totalCount }}</span>
                    {{ " " }}
                    نتیجه
                  </p>
                </div>
                <div class="flex justify-end flex-1 sm:justify-end">
                  <select
                    class="form-input inline-block w-fit mx-2.5 py-1"
                    v-tippy="{ content: 'تعداد آیتم ها در هر صفحه' }"
                    v-model="pageSize"
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                  <a
                    @click="action(-1)"
                    href="#"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    قبلی
                  </a>
                  <a
                    @click="action(1)"
                    href="#"
                    class="relative inline-flex items-center px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    بعدی
                  </a>
                </div>
              </nav>
            </template>
          </DataTable_V1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { payServicesTitle, PayStatusTitle } from "@/config/PayServices";
import { sendRequest } from "@/services/service";
import useUserStore from "@/stores/user";
import DataTable_V1 from "@/global/DataTables/DataTable_V1.vue";
import Splitter from "@/global/Splitter/Splitter.vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";

const pageIndex = ref(0);
const pageSize = ref(10);
const userStore = useUserStore();
const queryKey = computed(() => [
  {
    url: "/api/Account/AllPayments",
    pageSize: pageSize.value,
    currentPage: pageIndex.value + 1,
  },
]);
const GetUserTranscations = useQuery({
  queryKey: queryKey,
  queryFn: ({ queryKey }) =>
    sendRequest({
      url: queryKey[0].url + "/" + queryKey[0].pageSize + "/" + queryKey[0].currentPage,
      method: "GET",
      headers: {
        Authorization: "Bearer " + userStore.accessToken,
      },
    }),
  refetchOnMount: true,
  enabled: true,
});

const totalCount = computed(() => GetUserTranscations.data.value?.totalCount ?? 0);

const totalPage = computed(() => Math.ceil(totalCount.value / pageSize.value));

const dateFormat = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

function action(step) {
  if (step > 0 && pageIndex.value + step >= totalPage.value) return;

  if (step < 0 && pageIndex.value + step < 0) return;

  pageIndex.value += step;
}
</script>

<style></style>
