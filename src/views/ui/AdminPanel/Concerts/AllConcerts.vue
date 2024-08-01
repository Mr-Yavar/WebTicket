<script setup>
import DataTable_V1 from '@/views/components/Globals/DataTables/DataTable_V1.vue'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { ref } from 'vue';
import { computed } from 'vue';
const pageIndex = ref(0);
const pageSize = ref(1);
import EditConcertModal from '@/views/components/Layouts/AdminLayout/Modal/EditConcertModal.vue';
const queryKey = computed(()=>([{ url: '/api/Manager/GetAllConcerts', pageSize: pageSize.value, currentPage: pageIndex.value+1 }]));
const getAllConcert = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url + '/' + queryKey[0].pageSize + '/' + queryKey[0].currentPage,
            method: 'GET',
            headers: {}
        }),
        refetchOnMount:true,
    enabled: true
})

const totalCount = computed (()=>getAllConcert.data.value?.totalCount ?? 0);

const totalPage = computed (()=>Math.ceil(totalCount.value / pageSize.value));

const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };

function action(step){


    if(step>0 && pageIndex.value+step >= totalPage.value)
    return;

    if(step<0 && pageIndex.value+step < 0)
    return;
    

    pageIndex.value += step;

}
const showTermsModal = ref(false)

function toggleTermsModal() {
    showTermsModal.value = !showTermsModal.value
}

const selectedConcert = ref("");

</script>

<template>
    <template v-if="$route.name === 'AllConcerts'">
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="همه کنسرت‌ها" border-class=" border-black relative " type="middle" title-class="text-black" />
            </div>
        </div>

        <div class="w-full h-fit !rounded-md overflow-hidden m-0">
            <div class="flex my-1 rtl:justify-end">
                <button class="btn btn-success btn-sm" @click.prevent="$router.push({ name: 'createConcert' })">اضافه کردن</button>
            </div>
            <DataTable_V1

                :columns="[
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
                        key: 'startDate'
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
                :data="getAllConcert.data.value?.concerts ? getAllConcert.data.value?.concerts : []"
                :tableClass="'table table-fixed w-full shadow-inner '"
                :theadClass="'!bg-[#2563eb] text-white antialised'"
                :tbodyClass="'shadow-inner'"
                :thClass="'text-center p-2'"
                :tdClass="'text-center p-1'"
                :trClass="'odd:!bg-[#e4e4e7] even:!bg-gary-100'"
                :theadTRClass="'!bg-info'"

            >
                <template #[`tbodyconcertid`]="{ data }">{{ '-' }}</template>
                <template #[`tbodytitle`]="{ data }">{{ data.title }}</template>
                <template #[`tbodycategory`]="{ data }">{{ data.category }}</template>
                <template #[`tbodystartDate`]="{ data }">{{ new Date(data.startDate).toLocaleString('fa-ir', dateFormat).split(',').reverse().join(' ') }}</template>
                <template #[`tbodyendDate`]="{ data }">{{ new Date(data.endDate).toLocaleString('fa-ir', dateFormat).split(',').reverse().join(' ') }}</template>
                <template #[`tbodyoptions`]="{ data }">
                    <div class="flex justify-around">
                        <button
                            class="btn btn-warning btn-sm"
                            @click.prevent="
                                () => {
                                    $router.push({
                                        name: 'EditConcert',
                                        params: { concertId: data.concertid }
                                    })
                                }
                            "
                        >
                            ویرایش
                        </button>

                        <button
                        class=""
                        @click.prevent="
                            () => {
                                selectedConcert = data.concertid;
                                toggleTermsModal();
                            }
                        "
                    >
                        ⚙️
                    </button>
                    </div>
                </template>


                <template #[`pagination`]>
                    <div class="flex justify-center">
                        <div @click="action(5)" class="text-xl">{{ '▶️' }}</div>
                        <div @click="action(1)" class="text-base self-center">{{ '▶️' }}</div>
                        <div class="mx-5">{{ pageIndex+1  }} از {{totalPage}}</div>
                        <div @click="action(-1)" class="text-base self-center">{{'◀️'}}</div>
                        <div @click="action(-5)" class="text-xl">{{'◀️'}}</div>

                    </div>
                </template>
            </DataTable_V1>
        </div>
    </template>
    <edit-concert-modal :concertId="selectedConcert" :show="showTermsModal" :on-close-fn="toggleTermsModal" />
</template>
