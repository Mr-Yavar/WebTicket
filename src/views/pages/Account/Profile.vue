<template>
    <div class="sticky top-0 mb-6">
        <div class="bg-white">
            <Splitter title="پروفایل" border-class=" border-black relative " type="middle" title-class="text-black" />
        </div>
    </div>
    <div class="grid grid-cols-2">
        <vee-form :validation-schema="schema1" @submit="updateProfile" autocomplete="off" :initialValues="formValues" :key="formValues" v-slot="{ values }">
            <!-- Name -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">نام </label>
                <div class="col-span-2">
                    <vee-field type="text" name="firstName" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 dark:border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="نام" />
                    <ErrorMessage class="text-red-600 text-sm" name="firstName" />
                </div>
            </div>
            <!-- Family name -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">نام خانوادگی </label>
                <div class="col-span-2">
                    <vee-field type="text" name="lastName" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="نام خانوادگی" />
                    <ErrorMessage class="text-red-600 text-sm" name="lastName" />
                </div>
            </div>
            <!-- Family name -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block col-span-1 leading-9 text-sm text-center text-gray-800 dark:text-gray-100">نام کاربری</label>

                <div class="col-span-2">
                    <vee-field type="text" name="userName" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="نام کاربری" />
                    <ErrorMessage class="text-red-600 text-sm" name="userName" />
                </div>
            </div>
            <!-- Family name -->
            <!--    <div class="mb-3 grid grid-cols-3">-->
            <!--      <label class="inline-block text-sm leading-9 text-center  text-gray-800 dark:text-gray-100">جنسیت</label>-->
            <!--      <div class="col-span-2">-->
            <!--        <vee-field-->
            <!--            as="select"-->
            <!--            name="gender"-->
            <!--            class="block w-full py-0.5 px-3 text-gray-800 bg-white dark:bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "-->

            <!--        >-->
            <!--          <option value="" disabled selected>&#45;&#45;جنسیت&#45;&#45;</option>-->
            <!--          <option value="men">مرد</option>-->
            <!--          <option value="women">زن</option>-->
            <!--        </vee-field>-->
            <!--        <ErrorMessage class="text-red-600 text-sm" name="gender"/>-->
            <!--      </div>-->
            <!--    </div>-->

            <!-- Phone number -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">شماره همراه </label>
                <div class="col-span-2">
                    <vee-field type="text" name="phoneNumber" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="شماره همراه" />
                    <ErrorMessage class="text-red-600 text-sm" name="phoneNumber" />
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

        <vee-form :validation-schema="schema2" @submit="updatePassword" autocomplete="off" v-slot="{ values }">
            <!-- Password -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">رمز فعلی </label>
                <div class="col-span-2">
                    <vee-field type="password" name="currentPassword" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="رمز فعلی" />
                    <ErrorMessage class="text-red-600 text-sm" name="currentPassword" />
                </div>
            </div>

            <!-- Password -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">رمز جدید </label>
                <div class="col-span-2">
                    <vee-field type="password" name="password" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="رمز عبور" />
                    <ErrorMessage class="text-red-600 text-sm" name="password" />
                </div>
            </div>
            <!-- confirm_password -->
            <div class="mb-3 grid grid-cols-3">
                <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">تکرار </label>
                <div class="col-span-2">
                    <vee-field type="password" name="confirm_password" class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" placeholder="تکرار رمز عبور" />
                    <ErrorMessage class="text-red-600 text-sm" name="confirm_password" />
                </div>
            </div>
            <div class="mb-3 grid grid-cols-3">
                <!--      <div class="col-span-1 py-2 me-1">-->
                <!--        <button type="button" class="rtl:fa-font block w-full select-none rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"> <v-icon name="io-arrow-forward-outline" scale="0.75" /> برگشت</button>-->
                <!--      </div>-->
                <div class="col-span-1 col-start-1"></div>

                <div class="col-span-1 col-start-2 py-2 mx-auto">
                    <button :disabled="form_password_in_progress" type="submit" :class="{ hidden: form_password_in_progress }" class="rtl:fa-font h-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-orange-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full">بروزرسانی</button>
                    <div v-if="form_password_in_progress" class="!text-center">
                        <v-icon fill="orange" scale="1.3" name="pr-spinner" animation="spin" />
                    </div>
                </div>
            </div>
        </vee-form>
    </div>
</template>

<script setup>
import { sendRequest } from '@/services/service'
import useUserStore from '@/stores/user'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { ErrorMessage } from 'vee-validate'
import { useMutation } from '@tanstack/vue-query'
import { registerService } from '@/services/AuthenticationService.js'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useAuthModalStore } from '@/stores/componentStore/authModal.js'
import { sweetAlertAuthConfigure } from '@/config/alertConfigure.js'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { current } from '@material-tailwind/html/theme/base/colors'
import { method } from 'lodash'

const userStore = useUserStore()
const queryKey = computed(() => [{ url: '/api/Account/GetProfile' }])
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

const dataIdentityToken = computed(() => [
    '/api/authentication/refresh',
    {
        accessToken: userStore.accessToken,
        refreshToken: userStore.refreshToken,
        user: null
    }
])
const GetNewIdentity = useQuery({
    queryKey: dataIdentityToken,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0],
            method: 'POST',
            body: JSON.stringify(queryKey[1]),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userStore.accessToken
            }
        }),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
    enabled: false
})

const authModal = useAuthModalStore()

const schema1 = {
    firstName: 'required|min:3|max:100|persian_text',
    lastName: 'required|min:3|max:100|persian_text',
    userName: 'required|min:3|max:100',
    phoneNumber: 'required|phone_number'
}
const schema2 = {
    currentPassword: 'required',
    password: 'required|min:9|max:100|excluded:password',
    confirm_password: 'passwords_mismatch:@password'
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
const form_password_in_progress = ref(false)
async function updateProfile(values) {
    console.log(values)
    registerServiceCall.mutate(
        {
            url: '/api/Account/UpdateProfile',
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

                await GetNewIdentity.refetch()
                userStore.GetAuthenticated(GetNewIdentity.data.value)
                await Swal.fire({
                    title: 'موفقیت آمیز',
                    ...sweetAlertAuthConfigure,
                    html: '!عملیات با موفقیت انجام شد'
                })
            },
            onError: (e) => {
                //possibleErrors

                let messges = JSON.parse(e.message)

                let Error = Object.keys(messges)
                    .map((item) => possibleErrors[item])
                    .join('<br/>')
                Error = Error === '' ? 'خطا!' : Error
                form_in_progress.value = false
                Swal.fire({
                    title: 'خطا',
                    icon: 'error',
                    html: Error,
                    ...sweetAlertAuthConfigure
                })
            }
        }
    )
}

async function updatePassword(values) {
  
    registerServiceCall.mutate(
        {
            url: '/api/Account/UpdatePassword',
            body: JSON.stringify({
                password: values.password,
                currentPassword: values.currentPassword
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userStore.accessToken
            },
            method: 'PUT'
        },
        {
            onMutate: () => {
                form_password_in_progress.value = true
            },
            onSuccess: async (e) => {
                
                form_password_in_progress.value = false
                await Swal.fire({
                    title: 'موفقیت آمیز',
                    ...sweetAlertAuthConfigure,
                    html: '!عملیات با موفقیت انجام شد'
                })
            },
            onError: (e) => {
                //possibleErrors

                let messges = JSON.parse(e.message)
          
                let Error = messges.map((item) => possibleErrors[item.code]).join('<br/>')
                Error = Error === '' ? 'خطا!' : Error
                form_password_in_progress.value = false
                Swal.fire({
                    title: 'خطا',
                    icon: 'error',
                    html: Error,
                    ...sweetAlertAuthConfigure
                })
            }
        }
    )
}
</script>

<style></style>
