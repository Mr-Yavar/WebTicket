<template>
    <vee-form :validation-schema="schema" autocomplete="off" @submit="login">
        <div class="grid grid-cols-3 mb-3">
            <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">نام کاربری</label>

            <div class="col-span-2">
                <vee-field class="block w-full py-0.5 px-3 text-gray-800 bg-white dark:bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" name="userName" placeholder="نام کاربری" type="text" />
                <ErrorMessage class="text-red-600 text-sm block rtl:!text-right text-left" name="userName" />
            </div>
        </div>

        <!-- Password -->
        <div class="grid grid-cols-3 mb-3">
            <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">رمز عبور </label>
            <div class="col-span-2">
                <vee-field class="block w-full py-0.5 px-3 text-gray-800 bg-white dark:bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm" name="password" placeholder="رمز عبور" type="password" />
                <ErrorMessage class="text-red-600 text-sm block rtl:!text-right text-left" name="password" />
            </div>
        </div>

        <div class="grid grid-cols-3 mb-3">
            <!--      <div class="col-span-1 py-2 me-1">-->
            <!--        <button type="button" class="rtl:fa-font block w-full select-none rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"> <v-icon name="io-arrow-forward-outline" scale="0.75" /> برگشت</button>-->
            <!--      </div>-->
            <div class="col-span-1 col-start-1"></div>

            <div class="col-span-1 py-2 ms-1">
                <button :class="{ hidden: form_in_progress }" :disabled="form_in_progress" class="rtl:fa-font h-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-green-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full" type="submit">ورود</button>
                <div v-if="form_in_progress" class="!text-center">
                    <v-icon animation="spin" fill="green" name="pr-spinner" scale="1.3" />
                </div>
            </div>
        </div>
    </vee-form>
</template>

<script setup>
import { ErrorMessage } from 'vee-validate'
import { useMutation } from '@tanstack/vue-query'
import { loginService } from '@/services/AuthenticationService.js'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useAuthModalStore } from '@/stores/componentStore/authModal.js'
import useUserStore from '@/stores/user.js'
import { sweetAlertAuthConfigure } from '@/config/alertConfigure.js'
import { AuthenticationQueryKeys, post_apiauthenticationlogin } from '@/api/AuthenticationService'

const authModal = useAuthModalStore();
const userStore = useUserStore();
const schema = {
    userName: 'required',
    password: 'required'
}

const possibleErrors = {
    'Failed to fetch': '!خطا در اتصال به سرور'
}

const loginServiceCall = useMutation({
    mutationKey: AuthenticationQueryKeys.post_apiauthenticationlogin,
    mutationFn: post_apiauthenticationlogin,
    onMutate: () => {
        form_in_progress.value = true
    },
    onSuccess: async (data) => {

        await userStore.GetAuthenticated(data)

        form_in_progress.value = false
        // await Swal.fire({
        //   title: "موفقیت آمیز",
        //   icon: "success",
        //   width: '26em',
        //   html: "خوش آمدید!",
        //   timer: 1500,
        //   timerProgressBar: true,
        //   customClass: {
        //     title: "text-xl vazir-font",
        //     container: "text-sm vazir-font"
        //   },
        //
        // });

        await authModal.toggleMenu()

        if (authModal.onLoginSuccssed !== null) await authModal.onLoginSuccssed()
    },
    onError: (error) => {
        console.log(error.message)
        form_in_progress.value = false
        let message = '!خطای غیر منتظره'
        if (possibleErrors[error.message] !== undefined) message = possibleErrors[error.message]

        Swal.fire({
            title: 'خطا',
            icon: 'error',
            html: message,
            ...sweetAlertAuthConfigure
        });
    }
})

const form_in_progress = ref(false)

async function login(values) {
    console.log(values)
    loginServiceCall.mutate(values)
}
</script>
