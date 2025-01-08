<style>
.tab-active {
    @apply bg-neutral text-white;
}
</style>

<template>
    <modal :show="show" :on-close-fn="onCloseFn">
        <template #title>
            <h3 class="font-bold text-lg mb-4 rtl:text-right"> اطلاعات کلی </h3>
        </template>
        <template #body>
            <form @submit.prevent="onSubmit">
                <div class="flex justify-between">
                    <div class="mx-1">
                        <label class="block text-right text-sm font-medium text-gray-700">تاریخ شروع </label>
                        <Field :name="`concert.startdate`" v-slot="{ field, componentField }">
                            <AB-Date-Picker mode="single" type="datetime" click-on="all" locale="fa" :column="1" :modal="false" auto-submit :show="false" v-bind="field" v-model="componentField.modelValue" :format="'jYYYY/jMM/jDD HH:mm'" :input-format="'YYYY-MM-jDD HH:mm'" />
                        </Field>
                    </div>
                 
                    <div lass="mx-1">
                        <label class="block text-right  text-sm font-medium text-gray-700">تاریخ پایان </label>
                        <Field :name="`concert.enddate`" v-slot="{ field, componentField }">
                            <AB-Date-Picker mode="single" type="datetime" click-on="all" locale="fa" :column="1" :modal="false" auto-submit :show="false" v-bind="field" v-model="componentField.modelValue" :format="'jYYYY/jMM/jDD HH:mm'" :input-format="'jYYYY/jMM/jDD HH:mm'" />
                        </Field>
                    </div>
                </div>

                <button class="btn btn-md btn-success mx-auto mt-4">ویرایش</button>
            </form>
        </template>
    </modal>
</template>

<script setup>
import { CRPlacesService } from '@/services/PlacesService'
import { sendRequest } from '@/services/service'
import dateHelper from '@/utils/dateHelper'
import Modal from '@/global/modal/modal.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import Swal from 'sweetalert2'
import { Field, useForm } from 'vee-validate'
import { computed } from 'vue'
import { watch } from 'vue'

const props = defineProps({
    show: Boolean,
    onCloseFn: Function,
    concertId: String
})
const { resetForm, defineField, handleSubmit } = useForm({})
// eslint-disable-next-line no-unused-vars
const concertStartDate = defineField('concert.startdate')
// eslint-disable-next-line no-unused-vars
const cocertEndDate = defineField('concert.enddate')
const isEnable = computed(() => !!props.concertId)
const queryKey = computed(() => ['/api/Manager/GetConcertInfo/', props.concertId])
const getConceretServiceCall = useQuery({
    queryKey: queryKey.value,
    queryFn: async () => {
        console.log(queryKey)
        const data = await sendRequest({
            url: queryKey.value.join(''),
            method: 'GET'
        })
        return data
    },
    enabled: isEnable
})

const dp = {
    numberingSystem: 'latn',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}
watch([getConceretServiceCall.data], () => {
    if (!getConceretServiceCall.data.value) false
    console.log(getConceretServiceCall.data.value, getConceretServiceCall.data.value.startDate.split('.')[0])
    resetForm({
        values: {
            concert: {
                startdate: new Date(getConceretServiceCall.data.value.startDate).toLocaleString('fa-ir', dp).replace(',', ''),
                enddate: new Date(getConceretServiceCall.data.value.endDate).toLocaleString('fa-ir', dp).replace(',', '')
            }
        }
    })
})

const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService,
    onError: (err) => {
        console.error(err)
        Swal.fire({
            text: 'ناموفق',
            icon: 'error',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
    }
})

const onSubmit = handleSubmit(async (data) => {
    const Data = {
        Concertid: props.concertId ?? null,
        Title: data.concert.title,
        PlaceId: data.concert.place,
        CategoryId: data.concert.category,
        Note: data.concert.description,
        PromoterId: data.concert.promoter,
        startDate: dateHelper.persianStringToISO(data.concert?.startdate),
        endDate: dateHelper.persianStringToISO(data.concert?.enddate)
    }
    const formData = new FormData()
    formData.append('Concert', JSON.stringify(Data))
    mutate(
        {
            url: '/api/Manager/UpdateConcertInfo?api-version=1.0',
            body: formData,
            method: 'PATCH'
        },
        {
            onSuccess: async () => {
                await Swal.fire({
                    text: 'با موفقیت بروز شد!',
                    icon: 'success',
                    showConfirmButton: false,
                    showCloseButton: true,
                    timer: 2000,
                    timerProgressBar: true,
                    showClass: { popup: 'direction-rtl vazir-font' }
                })
            }
        }
    )
})
</script>
