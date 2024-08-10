<script setup>
import { useForm } from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { CRPlacesService, GetPlaceService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref, watch, watchEffect } from 'vue'
import Cities from '@/assets/data/city.json'
const router = useRouter()
const route = useRoute()
import Vselect from 'vue-select'

import { computed } from 'vue'
import dateHelper from '@/utils/dateHelper'
import { sendRequest } from '@/services/service'
import { GetAllConcertService } from '@/services/ConcertsService'



const discountId = !route.params.id ? null : route.params.id
const getDiscountServiceCall = useQuery({
    queryKey: ['/api/Manager/GetDiscountById/', discountId],
    queryFn: ({queryKey}) =>   sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: !!discountId
})
const { resetForm, defineField, handleSubmit, setFieldValue,values } = useForm({
    initialValues: {
        discount: getDiscountServiceCall.data?.value
    }
});

const dp = {
    numberingSystem: 'latn',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}

const [dTitle] = defineField('discount.title')
const [dPercentage] = defineField('discount.percentage')
const [dMaxDiscount] = defineField('discount.maxDiscount')
const [dExpirationDate] = defineField('discount.expirationDate')
const [dIsActive] = defineField('discount.isActive')
const [dObjectId] = defineField('discount.objectId')
const [dDiscountType] = defineField('discount.discountType')
const [dCode] = defineField('discount.code')

watch(getDiscountServiceCall.data,()=>{

if(!getDiscountServiceCall.data?.value)
return;
resetForm({
    values:{discount : {
        ...getDiscountServiceCall.data?.value,
        expirationDate : getDiscountServiceCall.data?.value.expirationDate.replace("T"," ").replace("Z"," ")
    }}
});
console.log(new Date(getDiscountServiceCall.data?.value.expirationDate).toLocaleString('fa-ir', dp).replace(',', ''));
});

const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const formDate = {
        id: discountId ?? null,
        expirationDate: dateHelper.persianStringToISO(data.discount.expirationDate),
        title: data.discount.title,
        code:data.discount.code,
        isActive: data.discount.isActive,
        objectId: data.discount.objectId ?? null,
        discountType: data.discount.discountType,
        maxDiscount: data.discount.maxDiscount,
        percentage: data.discount.percentage
    }

    if (!discountId) {
        mutate(
            {
                url: '/api/Manager/AddDiscount?api-version=1.0',
                body: JSON.stringify(formDate),
                method: 'POST',
                headers:{
                    "Content-Type" : "application/json"
                }
            },
            {
                onSuccess: async (data) => {
                    await Swal.fire({
                        text: 'با موفقیت ایجاد شد!',
                        icon: 'success',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                    router.push({ name: 'Managediscount' })
                }
            }
        )
    } else {
        mutate(
            {
                url: '/api/Manager/UpdateDiscount?api-version=1.0',
                body: JSON.stringify(formDate),
                method: 'PUT',
                 headers:{
                    "Content-Type" : "application/json"
                }
            },
            {
                onSuccess: async (data) => {
                    await Swal.fire({
                        text: 'با موفقیت بروز شد!',
                        icon: 'success',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                    router.push({ name: 'Managediscount' })
                }
            }
        )
    }
})

const getPlacesServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetPlaces'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: true
})
const GetAllConcertsServiceCall = useQuery({
    queryKey: ['api/Concerts/GetAllConcerts', new Date()],
    queryFn: GetAllConcertService,

    enabled: true
})

const getPromotersServiceCall = useQuery({
    queryKey: ['/api/BaseInfo/GetPromoters'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET'
        }),
    enabled: true
})

const TypeOptions = ref([
    {
        label: 'بدون شرط',
        value: -1
    },
    {
        label: 'کنسرت',
        value: 0
    },
    {
        label: 'برگزار کننده',
        value: 1
    },
    {
        label: 'شهر',
        value: 2
    },
    {
        label: 'مکان برگزاری',
        value: 3
    }
])

const restrictOptions = computed(() => ({
    '-1': [{ label: null, value: null }],
    0: [...(GetAllConcertsServiceCall.data.value?.concerts.map((x) => ({ label: x.title, value: x.concertid })) ?? [])],
    1: [...(getPromotersServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id })) ?? [])],
    2: [...Cities],
    3: [...(getPlacesServiceCall.data.value?.map((x) => ({ label: x.title, value: x.id })) ?? [])]
}))

watch([dDiscountType], () => {
    dObjectId.value = restrictOptions.value[dDiscountType.value][0].value
})
</script>

<template>
    <div>
        {{ values }}
        <div class="sticky top-0">
            <div class="bg-white">
                <Splitter title="ایجاد یک کد تخفیف" border-class=" border-black " type="middle" title-class="text-black" />
            </div>
            <div class="my-2 mx-1 flex flex-row-reverse">
                <button @click="router.push({ name: 'Managediscount' })" class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><CiCircleChevLeft class="scale-125 font-bold" /></button>
            </div>
        </div>

        <form @submit.prevent="onSubmit">
            <div class="grid grid-cols-6 gap-2">
                <div class="col-span-2 col-start-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">نام</label>
                    <input type="text" v-model="dTitle" id="place-name" placeholder="عنوان" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div class="col-span-2 col-start-4">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">نوع</label>
                    <Vselect
                        v-model="dDiscountType"
                        :options="TypeOptions"
                        :reduce="
                            (c) => {
                                return c.value
                            }
                        "
                        :clearable="false"
                        :value="TypeOptions[0].value"
                        label="label"
                        class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
                    >
                        <template #selected-option="{ label }">
                            <div style="display: flex; align-items: baseline; padding: 0">
                                <strong class="text-sm"> {{ label }} </strong>
                            </div>
                        </template>

                        <template #option="{ label }">
                            <div class="text-right">
                                <h3 style="margin: 0">{{ label }}</h3>
                            </div>
                        </template>
                    </Vselect>
                </div>
                <div class="col-span-2 col-start-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">کد</label>
                    <input type="text" v-model="dCode" id="place-name" placeholder="کد تخفیف" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div class="col-start-4 col-span-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">محدود کننده:</label>
                    <Vselect
                        v-model="dObjectId"
                        :options="restrictOptions[dDiscountType]"
                        :reduce="
                            (c) => {
                                return c.value
                            }
                        "
                        :clearable="false"
                        :disabled="dDiscountType == -1"
                        label="label"
                        class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
                    >
                        <template #selected-option="{ label }">
                            <div style="display: flex; align-items: baseline; padding: 0">
                                <strong class="text-sm"> {{ label }} </strong>
                            </div>
                        </template>

                        <template #option="{ label }">
                            <div class="text-right">
                                <h3 style="margin: 0">{{ label }}</h3>
                            </div>
                        </template>
                    </Vselect>
                </div>
                <div class="col-span-2 col-start-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">درصد تخفیف</label>
                    <input type="number" min="0" max="100" step="0.01" v-model="dPercentage" id="place-name" placeholder="% تخفیف" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div class="col-start-4 col-span-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">ارزش تخفیف</label>

                    <input type="number" min="0" v-model="dMaxDiscount" id="place-name" placeholder="(به تومان)" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div class="col-start-2 col-span-2">
                    <label for="place-name" class="block text-sm font-medium text-gray-700">تاریخ انقضاء </label>
                    
                    <AB-Date-Picker mode="single" type="datetime" click-on="all" format="jYYYY/jMM/jDD HH:mm" inputFormat="jYYYY/jMM/jDD HH:mm" locale="fa" :column="1" :modal="false" auto-submit :show="false" display-format="jYYYY/jMM/jDD HH:mm" v-model="dExpirationDate"/>
                </div>
                <div class="col-span-2 col-start-4 flex items-end justify-end place-items-center">
            
                    <div class="inline-flex  self-center flex-row mt-7">
                        <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="ripple-on">
                            فعال ؟ 
                          </label>
                        <label class="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor="ripple-on"
                          data-ripple-dark="true">
                          <input id="ripple-on" v-model="dIsActive" type="checkbox"
                            class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-6 before:w-6 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10" />
                          <span
                            class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                              stroke="currentColor" stroke-width="1">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </span>
                        </label>
                        
                      </div>
                </div>
               


                <div class="col-span-2 col-start-3">
                    <button v-if="!discountId" type="submit" class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">ایجاد</button>
                    <button v-else type="submit" class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">ویرایش</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
