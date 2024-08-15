<template>
    <div class="sticky top-0 mb-6">
        <div class="bg-white">
            <Splitter title="ویرایش اطلاعات کاربر" border-class=" border-black relative " type="middle" title-class="text-black" />
        </div>
        <div class="my-2 mx-1 flex flex-row-reverse ">
            <button @click="$router.push({ name: 'manageallusers' })" class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><CiCircleChevLeft class="scale-125 font-bold" /></button>


        </div>
    </div>
    <div class="grid grid-cols-3">
        <div class="cols-span-1 col-start-2">
            <vee-form :validation-schema="schema1" @submit="updateProfile" autocomplete="off" :aria-autocomplete="'off'" :initialValues="formValues" :key="formValues">
                <!-- Name -->
                <div class="mb-3 grid grid-cols-3">
                    <label class="inline-block text-xs md:text-sm leading-9 text-center text-gray-800 dark:text-gray-100">نام </label>
                    <div class="col-span-2">
                        <vee-field type="text" name="firstName" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 dark:border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="نام" />
                        <ErrorMessage class="text-red-600 text-xs md:text-sm" name="firstName" />
                    </div>
                </div>
                <!-- Family name -->
                <div class="mb-3 grid grid-cols-3">
                    <label class="inline-block text-xs md:text-sm leading-9 text-center text-gray-800 dark:text-gray-100">نام خانوادگی </label>
                    <div class="col-span-2">
                        <vee-field type="text" name="lastName" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="نام خانوادگی" />
                        <ErrorMessage class="text-red-600 text-xs md:text-sm" name="lastName" />
                    </div>
                </div>
                <!-- Family name -->
                <div class="mb-3 grid grid-cols-3">
                    <label class="inline-block col-span-1 leading-9 text-xs md:text-sm text-center text-gray-800 dark:text-gray-100">نام کاربری</label>

                    <div class="col-span-2">
                        <vee-field type="text" name="userName" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="نام کاربری" />
                        <ErrorMessage class="text-red-600 text-xs md:text-sm" name="userName" />
                    </div>
                </div>

                <!-- Phone number -->
                <div class="mb-3 grid grid-cols-3">
                    <label class="inline-block text-xs md:text-sm leading-9 text-center text-gray-800 dark:text-gray-100">شماره همراه </label>
                    <div class="col-span-2">
                        <vee-field type="text" name="phoneNumber" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="شماره همراه" />
                        <ErrorMessage class="text-red-600 text-xs md:text-sm" name="phoneNumber" />
                    </div>
                </div>

                <!-- Password -->
                <div class="mb-3 grid grid-cols-3">
                    <label class="inline-block text-xs md:text-sm leading-9 text-center text-gray-800 dark:text-gray-100">رمز جدید </label>
                    <div class="col-span-2">
                        <vee-field type="password" name="password" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="رمز عبور" />
                        <ErrorMessage class="text-red-600 text-xs md:text-sm" name="password" />
                    </div>
                </div>

                <div class="mb-3 grid grid-cols-3">
                    <!--      <div class="col-span-1 py-2 me-1">-->
                    <!--        <button type="button" class="rtl:fa-font block w-full select-none rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"> <v-icon name="io-arrow-forward-outline" scale="0.75" /> برگشت</button>-->
                    <!--      </div>-->
                    <div class="col-span-1 col-start-1"></div>

                    <div class="col-span-1 col-start-2 py-2 mx-auto">
                        <button :disabled="form_in_progress" type="submit" :class="{ hidden: form_in_progress }" class="rtl:fa-font h-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-orange-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full">بروزرسانی</button>
                        <div v-if="form_in_progress" class="!text-center">
                            <v-icon fill="orange" scale="1.3" name="pr-spinner" animation="spin" />
                        </div>
                    </div>
                </div>
            </vee-form>
        </div>
    </div>
</template>

<script setup>
import { sendRequest } from '@/services/service'
import useUserStore from '@/stores/user'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import { ErrorMessage } from 'vee-validate'
import { useMutation } from '@tanstack/vue-query'

import { ref } from 'vue'
import Swal from 'sweetalert2'

import { sweetAlertAuthConfigure } from '@/config/alertConfigure.js'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()
const queryKey = computed(() => [{ url: '/api/Admin/GetUser/' + route.params.id }])
const GetUserProfile = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + userStore.accessToken
            }
        }),
    refetchOnMount: true,
    enabled: true
})

const schema1 = {
    firstName: 'required|min:3|max:100|persian_text',
    lastName: 'required|min:3|max:100|persian_text',
    userName: 'required|min:3|max:100',
    phoneNumber: 'required|phone_number',
    password: 'required|min:9|max:100|excluded:password'
}

const formValues = computed(() => GetUserProfile.data.value)

const possibleErrors = {
    DuplicateUserName: '!کاربری با این نام کاربری وجود دارد',
    DuplicatePhoneNumber: '!کاربری با این شماره موبایل وجود دارد',
    PasswordMismatch: '!رمز عبور را اشتباه وارد کرده‌اید'
}

const registerServiceCall = useMutation({
    mutationKey: 'registerService',
    mutationFn: sendRequest
})

const form_in_progress = ref(false)

async function updateProfile(values) {
    values.id = route.params.id

    registerServiceCall.mutate(
        {
            url: '/api/Admin/UpdateUser',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userStore.accessToken
            },
            method: 'PUT'
        },
        {
            onMutate: () => {
                form_in_progress.value = true
            },
            onSuccess: async (e) => {
                form_in_progress.value = false

                
                await Swal.fire({
                    title: 'موفقیت آمیز',
                    ...sweetAlertAuthConfigure,
                    html: '!عملیات با موفقیت انجام شد'
                })
            },
            onError: (e) => {
                //possibleErrors

           
                form_in_progress.value = false
                Swal.fire({
                
                    icon: 'error',
                    html: "خطایی رخ داد!",
                    ...sweetAlertAuthConfigure
                })
            }
        }
    )
}
</script>

<style></style>
