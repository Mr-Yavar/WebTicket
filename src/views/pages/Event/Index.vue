<template>
  <div class="w-full px-8 py-4">

    <div class="relative flex items-center justify-between w-full">
      <div class="absolute rtl:right-0 left-0 top-2/4 h-0.5 w-full -translate-y-2/4 dark:bg-gray-600 bg-gray-300"></div>
      <div class="absolute rtl:right-0 left-0 top-2/4 h-0.5 -translate-y-2/4 dark:bg-white bg-gray-900 transition-all duration-500"
           :class="{'w-0' : step===1 , 'w-2/6' : step===2,'w-4/6' : step===3, 'w-full':step===4}"
      ></div>
      <div class="relative z-10 grid w-10 h-10 font-bold  transition-all duration-300  rounded-full place-items-center"
           :class="step>=1 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300 dark:bg-gray-600 dark:text-white'"
      >
        1
      </div>
      <div class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300  rounded-full place-items-center"
           :class="step>=2 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'"
      >
        2
      </div>
      <div class="relative z-10 grid w-10 h-10 font-bold  transition-all duration-300  rounded-full place-items-center"
           :class="step>=3 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'"
      >
        3
      </div>
      <div class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300  rounded-full place-items-center"
           :class="step>=4 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'"
      >
        4
      </div>
    </div>
    <div>
      <Splitter :title="stepTitles[step-1]" type="middle" border-class="border-gray-500 border-dashed" titleClass="font-bold text-md text-gray-900 dark:text-white" class="my-3"/>
    </div>

    <transition>
      <FirstStep v-if="step===1" :stepControls="{nextFn:toNext,previousFn:toPrevious}"/>
      <SecondStep v-else-if="step===2" :stepControls="{nextFn:toNext,previousFn:toPrevious}"/>
      <ThridStep v-else-if="step===3" :stepControls="{nextFn:toNext,previousFn:toPrevious}"/>
      <FourthStep v-else-if="step===4" :stepControls="{nextFn:toNext,previousFn:toPrevious}"/>
    </transition>


    <div class="flex justify-between mt-16" v-if="step!==1">
      <button
          class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button" @click="toPrevious">
        مرحله قبل
      </button>
      <button
          class="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button" @click="toNext">
        مرحله بعد
      </button>
    </div>
  </div>


</template>

<script setup>
import {computed, ref} from "vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import FirstStep from "@/views/ui/Event/FirstStep.vue";
import SecondStep from "@/views/ui/Event/SecondStep.vue";
import ThridStep from "@/views/ui/Event/ThridStep.vue";
import FourthStep from "@/views/ui/Event/FourthStep.vue";
import useTicketStore from "@/stores/Ticket.js";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";
import {useAuthModalStore} from "@/stores/componentStore/authModal.js";

const step = ref(1);
const stepTitles = [
  "گام اول : انتخاب سانس",
  "گام دوم : انتخاب صندلی",
  "گام سوم : رزرو",
  "گام چهارم : دریافت بلیت",
]


function toNext() {

  if (NextActions[step.value]())
    step.value++;
}

function toPrevious() {
  if (BackActions[step.value]())
    step.value--;
}


// موقع رد شدن از اون مرحله اجرا بشه
const NextActions = {
  1: function () {

    if (TicketStore.selectedShowing.length !== 0)
      return true;

    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    return false;

  },
  2: function () {
    if (!userStore.isAuthenticated) {
      AuthModalStore.setTitle("برای ادامه حساب کاربری لازمه!");
      AuthModalStore.toggleMenu();

        return false;
    }

      if (TicketStore.selectedShowing.length === 0){
        Swal.fire({
          title: 'خطا جانم!',
          text: 'اینجا بدون انتخاب سانس چیکار میکنی؟',
          icon: 'info',
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2000,
          timerProgressBar: true,
          showClass: {popup: "direction-rtl vazir-font"},

        });
        return false;
      }


        if (TicketStore.Tickets.length === 0){
          return false;
        }


          return true;


  },
  3: () => userStore.isAuthenticated,
  4: () => true
};

// موقع برگشت از اون مرحله اجرا بشه
const BackActions = {
  1: function () {
    TicketStore.setSelectedShowing("");
    return true;
  },
  2: function () {
    TicketStore.removeAllTickets();
    return true;
  },
  3: function () {
    return true;
  },
  4: function () {
    return true;
  }
};

const TicketStore = useTicketStore();
const userStore = useUserStore();
const AuthModalStore = useAuthModalStore();
</script>

<style scoped>


</style>

