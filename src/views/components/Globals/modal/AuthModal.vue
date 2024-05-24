

<template>


  <modal :show="authModal.show" :on-close-fn="authModal.toggleMenu" >
    <template #title>
      <h3 class="font-bold text-lg mb-4 rtl:text-right">{{authModal.title}}</h3>
    </template>
    <template #body>
      <div role="tablist" class="tabs grid flex-end align-center tabs-boxed mb-2 !bg-gray-100 dark:bg-gray-600 !text-black dark:!text-white">
        <a role="tab" class="tab " :class="{'tab-active':tab==='signup'}" @click.prevent="tab='signup'">ثبت نام</a>
        <a role="tab" class="tab " :class="{'tab-active':tab==='signin'}" @click.prevent="tab='signin'">ورود</a>

      </div>
      <div class="formBody">
      <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <div class="p-1" v-if="tab==='signup'">
          <user-register-form/>
        </div>
        <div class="p-1" v-else-if="tab==='signin'">
          <user-login-form/>
        </div>
      </transition>
      </div>
    </template>
  </modal>
</template>

<script setup>
import {reactive, ref} from "vue";
import UserRegisterForm from "@/views/components/Globals/auth/user-register-form.vue";
import Modal from "@/views/components/Globals/modal/modal.vue";
import {useAuthModalStore} from "@/stores/componentStore/authModal.js"
import UserLoginForm from "@/views/components/Globals/auth/user-login-form.vue";

const authModal = useAuthModalStore();

const tab = ref("signin");

</script>

<style scoped>

  .tab-active {
    @apply dark:!text-white !text-white !bg-indigo-400;
  }

  .formBody{
    transition: all 0.2s;
  }
  .tab{
    @apply w-full ;
    position: relative;
    grid-row-start: 1;
    display: block;
    height: 2rem;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: .875rem;
    line-height: 1.25rem;
    line-height: 2;

    @apply bg-transparent rounded-lg
  }

  .tabs{
    @apply bg-gray-50 p-1 rounded-md shadow-inner
  }

</style>
