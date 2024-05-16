<template>
  <vee-form
      :validation-schema="schema"
      @submit="login"
      autocomplete="off"
  >



    <div class="mb-3 grid grid-cols-3">

      <label class="inline-block leading-9 text-sm text-center  text-gray-800 dark:text-gray-100">نام کاربری</label>

      <div class="col-span-2">
        <vee-field
            type="text"
            name="phone_number"
            class="block w-full py-0.5 px-3 text-gray-800 bg-white dark:bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="شماره تلفن"
        />
        <ErrorMessage class="text-red-600 text-sm" name="phone_number"/>
      </div>
    </div>

    <!-- Password -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block text-sm leading-9 text-center  text-gray-800 dark:text-gray-100" >رمز عبور </label>
      <div class="col-span-2">
        <vee-field
            type="password"
            name="password"
            class="block w-full py-0.5 px-3 text-gray-800 bg-white dark:bg-gray-600 dark:text-white border border-gray-400 transition duration-500 focus:outline-none focus:border-black rounded input-sm "
            placeholder="رمز عبور"
        />
        <ErrorMessage class="text-red-600 text-sm" name="password"/>
      </div>
    </div>

    <div class="mb-3 grid grid-cols-3 ">
<!--      <div class="col-span-1 py-2 me-1">-->
<!--        <button type="button" class="rtl:fa-font block w-full select-none rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"> <v-icon name="io-arrow-forward-outline" scale="0.75" /> برگشت</button>-->
<!--      </div>-->
      <div class="col-span-1 col-start-1"></div>

      <div class="col-span-1  py-2 ms-1">
        <button type="submit" class="rtl:fa-font h-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-green-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full">ورود</button>
      </div>
    </div>
  </vee-form>

</template>

<script setup>
import {ErrorMessage} from "vee-validate";

const schema = {
  phone_number: "required|",
  password: "required|min:9|max:100|excluded:password",
};




function login(values){
  console.log(values);
}
</script>