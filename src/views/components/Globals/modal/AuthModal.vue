<style>
.tab-active {
  @apply bg-neutral text-white;
}
</style>

<template>


  <modal :show="authModal.show" :on-close-fn="authModal.toggleMenu" >
    <template #title>
      <h3 class="font-bold text-lg mb-4 rtl:text-right">سلام! کدومـــش؟</h3>
    </template>
    <template #body>
      <div role="tablist" class="tabs tabs-boxed mb-2">
        <a role="tab" class="tab " :class="{'tab-active':tab==='signup'}" @click.prevent="tab='signup'">ثبت نام</a>
        <a role="tab" class="tab " :class="{'tab-active':tab==='signin'}" @click.prevent="tab='signin'">ورود</a>

      </div>
      <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <div class="p-1" v-if="tab==='signup'">
          <user-register-form/>
        </div>
        <div class="p-1" v-else-if="tab==='signin'">
          <user-register-form/>
        </div>
      </transition>
    </template>
  </modal>
</template>

<script setup>
import {reactive, ref} from "vue";
import UserRegisterForm from "@/views/ui/Home/user-register-form.vue";
import Modal from "@/views/components/Globals/modal/modal.vue";
import {useAuthModalStore} from "@/stores/componentStore/authModal.js"

const authModal = useAuthModalStore();

const tab = ref("signin");

</script>
