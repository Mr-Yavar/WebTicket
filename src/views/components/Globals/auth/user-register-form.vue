<template>
  <vee-form
      :validation-schema="schema"
      @submit="register"
      autocomplete="off"
  >
    <!-- Name -->
    <div class="mb-3 grid grid-cols-3">

      <label class="inline-block text-sm leading-9 text-center text-gray-800 dark:text-gray-100">نام </label>
      <div class="col-span-2">
        <vee-field
            type="text"
            name="firstName"
            class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 dark:border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="نام"
        />
        <ErrorMessage class="text-red-600 text-sm" name="firstName"/>
      </div>
    </div>
    <!-- Family name -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block  text-sm leading-9 text-center  text-gray-800 dark:text-gray-100">نام خانوادگی </label>
      <div class="col-span-2">
        <vee-field
            type="text"
            name="lastName"
            class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="نام خانوادگی"
        />
        <ErrorMessage class="text-red-600 text-sm" name="lastName"/>
      </div>
    </div>
    <!-- Family name -->
    <div class="mb-3 grid grid-cols-3">

      <label class="inline-block leading-9 text-sm text-center  text-gray-800 dark:text-gray-100">نام کاربری</label>

      <div class="col-span-2">
        <vee-field
            type="text"
            name="userName"
            class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="نام کاربری"
        />
        <ErrorMessage class="text-red-600 text-sm" name="userName"/>
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
      <label class="inline-block text-sm leading-9 text-center  text-gray-800 dark:text-gray-100">شماره همراه </label>
      <div class="col-span-2">
        <vee-field
            type="text"
            name="phoneNumber"
            class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="شماره همراه"
        />
        <ErrorMessage class="text-red-600 text-sm" name="phoneNumber"/>
      </div>
    </div>
    <!-- Password -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block text-sm leading-9 text-center  text-gray-800 dark:text-gray-100" >رمز عبور </label>
      <div class="col-span-2">
        <vee-field
            type="password"
            name="password"
            class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="رمز عبور"
        />
        <ErrorMessage class="text-red-600 text-sm" name="password"/>
      </div>
    </div>
    <!-- confirm_password -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block  text-sm leading-9 text-center  text-gray-800 dark:text-gray-100">تکرار </label>
      <div class="col-span-2">
        <vee-field
            type="password"
            name="confirm_password"
            class="block w-full py-0.5 px-3 text-gray-800 !bg-white dark:!bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="تکرار رمز عبور"
        />
        <ErrorMessage class="text-red-600 text-sm" name="confirm_password"/>

      </div>
    </div>
    <div class="mb-3 grid grid-cols-3 ">
<!--      <div class="col-span-1 py-2 me-1">-->
<!--        <button type="button" class="rtl:fa-font block w-full select-none rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"> <v-icon name="io-arrow-forward-outline" scale="0.75" /> برگشت</button>-->
<!--      </div>-->
      <div class="col-span-1 col-start-1"></div>

      <div class="col-span-1 py-2 ms-1">
        <button
            :disabled="form_in_progress"
            type="submit" :class="{'hidden' : form_in_progress}"  class="rtl:fa-font h-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-green-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full">ثبت نام</button>
            <div v-if="form_in_progress" class="!text-center "><v-icon fill="green" scale="1.3" name="pr-spinner" animation="spin" /></div>
      </div>
    </div>
  </vee-form>

</template>

<script setup>
import {ErrorMessage} from "vee-validate";
import {useMutation} from "@tanstack/vue-query";
import {registerService} from "@/service/AuthenticationService.js";
import sweatalert2 from "sweetalert2";
import {ref} from "vue";
import Swal from "sweetalert2";

const schema = {
  firstName: "required|min:3|max:100|persian_text",
  lastName: "required|min:3|max:100|persian_text",
  userName: "required|min:3|max:100",
  // email: "required|min:3|max:100|email",
  phoneNumber: "required|phone_number",
  password: "required|min:9|max:100|excluded:password",
  confirm_password: "passwords_mismatch:@password"
};

const registerServiceCall = useMutation({
  mutationKey : "registerService",
  mutationFn : registerService,
  onMutate:()=>{
    form_in_progress.value = true;
  },
  onSuccess:()=>{
    form_in_progress.value = false;
    Swal.fire({
      title : "موفقیت آمیز",
      icon:"success",
      width : '26em',
      html : "!عملیات ثبت نام با موفقیت انجام شد",
      customClass:{
        title : "text-xl vazir-font",
        container : "text-sm vazir-font"
      },

    });
  }
});


const form_in_progress = ref(false);

async function register(values){
  console.log(values);
  registerServiceCall.mutate(values);
}
</script>

<style scoped>
/* Change the white to any color */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  @apply !bg-white dark:!bg-gray-600
}
</style>