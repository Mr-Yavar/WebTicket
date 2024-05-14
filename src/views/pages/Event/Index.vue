<template>
  <div class="w-full px-8 py-4">

    <div class="relative flex items-center justify-between w-full">
      <div class="absolute rtl:right-0 left-0 top-2/4 h-0.5 w-full -translate-y-2/4 dark:bg-gray-600 bg-gray-300"></div>
      <div :class="{'w-0' : step===1 , 'w-2/6' : step===2,'w-4/6' : step===3, 'w-full':step===4}"
           class="absolute rtl:right-0 left-0 top-2/4 h-0.5 -translate-y-2/4 dark:bg-white bg-gray-900 transition-all duration-500"
      ></div>
      <div :class="step>=1 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300 dark:bg-gray-600 dark:text-white'"
           class="relative z-10 grid w-10 h-10 font-bold  transition-all duration-300  rounded-full place-items-center"
      >
        1
      </div>
      <div :class="step>=2 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'"
           class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300  rounded-full place-items-center"
      >
        2
      </div>
      <div :class="step>=3 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'"
           class="relative z-10 grid w-10 h-10 font-bold  transition-all duration-300  rounded-full place-items-center"
      >
        3
      </div>
      <div :class="step>=4 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'"
           class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300  rounded-full place-items-center"
      >
        4
      </div>
    </div>
    <div>
      <Splitter :title="stepTitles[step-1]" border-class="border-gray-500 border-dashed" class="my-3" titleClass="font-bold text-md text-gray-900 dark:text-white" type="middle"/>
    </div>

    <transition>
      <FirstStep v-if="step===1" :stepControls="{nextFn:toNext,previousFn:toPrevious}">

        <template #controlSteps></template>

      </FirstStep>
      <SecondStep v-else-if="step===2" :stepControls="{nextFn:toNext,previousFn:toPrevious}">
        <template #controlSteps>
          <ControlSteps :to-next="toNext" :to-previous="toPrevious"/>
        </template>

      </SecondStep>
      <ThridStep v-else-if="step===3" :stepControls="{nextFn:toNext,previousFn:toPrevious}">
        <template #controlSteps="ThridStepProps">
          <ControlSteps :to-next="toNext" :to-previous="toPrevious">
            <template #nextBtn>
              <button class="select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" @click.prevent="ThridStepProps.payingFn()">پرداخت</button>
            </template>

          </ControlSteps>
        </template>
      </ThridStep>
      <FourthStep v-else-if="step===4" :stepControls="{nextFn:toNext,previousFn:toPrevious}"/>
    </transition>


  </div>


</template>

<script setup>
import {ref} from "vue";
import Splitter from "@/views/components/Splitter/Splitter.vue";
import FirstStep from "@/views/ui/Event/FirstStep.vue";
import SecondStep from "@/views/ui/Event/SecondStep.vue";
import ThridStep from "@/views/ui/Event/ThridStep.vue";
import FourthStep from "@/views/ui/Event/FourthStep.vue";
import useTicketStore from "@/stores/Ticket.js";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";
import {useAuthModalStore} from "@/stores/componentStore/authModal.js";
import ControlSteps from "@/views/ui/Event/controlSteps.vue";

const step = ref(1);
const stepTitles = [
  "گام اول : انتخاب سانس",
  "گام دوم : انتخاب صندلی",
  "گام سوم : رزرو",
  "گام چهارم : دریافت بلیت",
]


async function toNext() {

  if (await NextActions[step.value]())
    step.value++;
}

async function toPrevious() {
  if (await BackActions[step.value]())
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

    if (TicketStore.selectedShowing.length === 0) {
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


    if (TicketStore.Tickets.length === 0) {
      Swal.fire({
        title: 'خطا جانم!',
        text: 'حداقل یدونه بلیت انتخاب کن!',
        icon: 'info',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 2000,
        timerProgressBar: true,
        showClass: {popup: "direction-rtl vazir-font"},

      });
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
  2: async function () {

    if (TicketStore.Tickets.length !== 0) {
      const {isConfirmed} = await Swal.fire({
        title: 'سوال',
        html: 'با برگشتن به مرحله قبل بلیت های انتخاب شده حذف میشن!' +
            '<br/>' +
            'از این عمل مطمئن هستی؟',
        icon: 'info',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "مطمئنم",
        cancelButtonText: "لغو",
        customClass: {
          actions: "flex justify-around w-full flex-row-reverse"
        },
        showClass: {popup: "direction-rtl vazir-font "},

      });

      if (!isConfirmed)
        return false;
    }
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

