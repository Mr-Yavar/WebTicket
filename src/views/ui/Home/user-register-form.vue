<template>
  <vee-form
      :validation-schema="schema"
      @submit="register"
  >
    <!-- Name -->
    <div class="mb-3 grid grid-cols-3">

      <label class="inline-block text-sm leading-9 text-center">نام </label>
      <div class="col-span-2">
        <vee-field
            type="text"
            name="first_name"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"
            placeholder="نام"
        />
        <ErrorMessage class="text-red-600 text-sm" name="first_name"/>
      </div>
    </div>
    <!-- Family name -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block  text-sm leading-9 text-center">نام خانوادگی </label>
      <div class="col-span-2">
        <vee-field
            type="text"
            name="last_name"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"
            placeholder="نام خانوادگی"
        />
        <ErrorMessage class="text-red-600 text-sm" name="last_name"/>
      </div>
    </div>
    <!-- Family name -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block text-sm leading-9 text-center">جنسیت</label>
      <div class="col-span-2">
        <vee-field
            as="select"
            name="gender"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"

        >
          <option value="" disabled selected>--جنسیت--</option>
          <option value="men">مرد</option>
          <option value="women">زن</option>
        </vee-field>
        <ErrorMessage class="text-red-600 text-sm" name="gender"/>
      </div>
    </div>
    <!-- Family name -->
    <div class="mb-3 grid grid-cols-3">

      <label class="inline-block leading-9 text-sm text-center">نام کاربری</label>

      <div class="col-span-2">
        <vee-field
            type="text"
            name="username"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"
            placeholder="نام کاربری"
        />
        <ErrorMessage class="text-red-600 text-sm" name="username"/>
      </div>
    </div>
    <!-- Phone number -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block text-sm leading-9 text-center">شماره همراه </label>
      <div class="col-span-2">
        <vee-field
            type="text"
            name="phone_number"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"
            placeholder="شماره همراه"
        />
        <ErrorMessage class="text-red-600 text-sm" name="phone_number"/>
      </div>
    </div>
    <!-- Password -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block text-sm leading-9 text-center">رمز عبور </label>
      <div class="col-span-2">
        <vee-field
            type="password"
            name="password"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"
            placeholder="رمز عبور"
        />
        <ErrorMessage class="text-red-600 text-sm" name="password"/>
      </div>
    </div>
    <!-- confirm_password -->
    <div class="mb-3 grid grid-cols-3">
      <label class="inline-block  text-sm leading-9 text-center">تکرار </label>
      <div class="col-span-2">
        <vee-field
            type="password"
            name="confirm_password"
            class="block w-full py-0.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded input-sm input-bordered"
            placeholder="تکرار رمز عبور"
        />
        <ErrorMessage class="text-red-600 text-sm" name="confirm_password"/>

      </div>
    </div>
    <div class="mb-3 grid grid-cols-3 ">
      <div class="col-span-1 py-2 me-1">
        <button type="button" class="rtl:fa-font block w-full select-none rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"> <v-icon name="io-arrow-forward-outline" scale="0.75" /> برگشت</button>
      </div>
      <div class="col-span-1"></div>

      <div class="col-span-1 py-2 ms-1">
        <button type="submit" class="rtl:fa-font h-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-green-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full">ثبت نام</button>
      </div>
    </div>
  </vee-form>

</template>

<script setup>
import {ErrorMessage} from "vee-validate";

const schema = {
  first_name: "required|min:3|max:100|persian_text",
  last_name: "required|min:3|max:100|persian_text",
  username: "required|min:3|max:100",
  email: "required|min:3|max:100|email",
  gender: "required",
  phone_number: "required|min:10|max:11",
  password: "required|min:9|max:100|excluded:password",
  confirm_password: "passwords_mismatch:@password"
};

function register(values){
  console.log(values);
}
</script>