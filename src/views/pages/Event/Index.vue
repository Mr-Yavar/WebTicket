<template>
   {{ step }}
    <div class="w-full px-8 py-4">
        <div class="relative flex items-center justify-between w-full">
            <div class="absolute rtl:right-0 left-0 top-2/4 h-0.5 w-full -translate-y-2/4 dark:bg-gray-600 bg-gray-300"></div>
            <div :class="{ 'w-0': step === 0, 'w-2/6': step === 1, 'w-4/6': step === 2, 'w-full': step === 3 }" class="absolute rtl:right-0 left-0 top-2/4 h-0.5 -translate-y-2/4 dark:bg-white bg-gray-900 transition-all duration-500"></div>
            <div :class="step >= 0 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300 dark:bg-gray-600 dark:text-white'" class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300 rounded-full place-items-center">1</div>
            <div :class="step >= 1 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'" class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300 rounded-full place-items-center">2</div>
            <div :class="step >= 2 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'" class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300 rounded-full place-items-center">3</div>
            <div :class="step >= 3 ? 'bg-gray-900 text-white dark:bg-gray-50 dark:text-black' : 'bg-gray-300  dark:bg-gray-600 dark:text-white'" class="relative z-10 grid w-10 h-10 font-bold transition-all duration-300 rounded-full place-items-center">4</div>
        </div>
        <div>
            <Splitter :title="stepTitles[step]" border-class="border-gray-500 border-dashed" class="my-3" titleClass="font-bold text-md text-gray-900 dark:text-white" type="middle" />
        </div>
        <router-view v-slot="{ Component }">
            <component :is="Component" :to-next="toNext" :to-previous="toPrevious">
           

            </component>
           
        </router-view>
        <!-- <transition>
            <keep-alive>
                <div v-if="step === 1">
                    <FirstStep :stepControls="{ nextFn: toNext, previousFn: toPrevious }" :concert="concert">
                        <template #controlSteps></template>
                    </FirstStep>
                </div>
                <div v-else-if="step === 2">
                    <SecondStep :stepControls="{ nextFn: toNext, previousFn: toPrevious }" :concert="concert">
                        <template #controlSteps>
                            <ControlSteps :to-next="toNext" :to-previous="toPrevious" />
                        </template>
                    </SecondStep>
                </div>
                <div v-else-if="step === 3">
                    <ThridStep :stepControls="{ nextFn: toNext, previousFn: toPrevious }" :concert="concert">
                        <template #controlSteps="ThridStepProps">
                            <ControlSteps :to-next="toNext" :to-previous="toPrevious">
                                <template #nextBtn>
                                    <button class="select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" @click.prevent="ThridStepProps.payingFn()">پرداخت</button>
                                </template>
                            </ControlSteps>
                        </template>
                    </ThridStep>
                </div>
                <div v-else-if="step === 4">
                    <FourthStep :stepControls="{ nextFn: toNext, previousFn: toPrevious }" :concert="concert" />
                </div>
            </keep-alive>
        </transition> -->
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'


import { useRoute, useRouter } from 'vue-router'

import Splitter from '@/views/components/Splitter/Splitter.vue'



// موقع رد شدن از اون مرحله اجرا بشه
// const NextActions = {
//     0: function ({ goNext }) {
//         try {
//             seatMapService.notifyUnLockTickets()
//         } catch (e) {}

//         TicketStore.removeAllTickets()

//         seatMapService.LeaveGroup()

//         if (!goNext) return true
//         else goNext()
//     },
//     1: function ({ goNext }) {
//         try {
//             seatMapService.notifyUnLockTickets()
//         } catch (e) {}

//         TicketStore.removeAllTickets()

//         if (TicketStore.selectedShowing.length === 0) {
//             Swal.fire({
//                 title: 'خطا جانم!',
//                 text: 'اینجا بدون انتخاب سانس چیکار میکنی؟',
//                 icon: 'info',
//                 showConfirmButton: false,
//                 showCloseButton: true,
//                 timer: 2000,
//                 timerProgressBar: true,
//                 showClass: { popup: 'direction-rtl vazir-font' }
//             })
//             return false
//         }

//         seatMapService.JoinGroup(TicketStore.selectedShowing)

//         if (!goNext) return true
//         else goNext()
//     },
//     2: async function ({ context, goNext }) {
//         if (!userStore.isAuthenticated) {
//             AuthModalStore.setTitle('برای ادامه حساب کاربری لازمه!')
//             AuthModalStore.toggleMenu()

//             return false
//         }

//         if (TicketStore.selectedShowing.length === 0) {
//             Swal.fire({
//                 title: 'خطا جانم!',
//                 text: 'اینجا بدون انتخاب سانس چیکار میکنی؟',
//                 icon: 'info',
//                 showConfirmButton: false,
//                 showCloseButton: true,
//                 timer: 2000,
//                 timerProgressBar: true,
//                 showClass: { popup: 'direction-rtl vazir-font' }
//             })
//             return false
//         }

//         if (TicketStore.Tickets.length === 0) {
//             Swal.fire({
//                 title: 'خطا جانم!',
//                 text: 'حداقل یدونه بلیت انتخاب کن!',
//                 icon: 'info',
//                 showConfirmButton: false,
//                 showCloseButton: true,
//                 timer: 2000,
//                 timerProgressBar: true,
//                 showClass: { popup: 'direction-rtl vazir-font' }
//             })
//             return false
//         }

//         await seatMapService.LeaveGroup()

//         try {
//             await seatMapService.notifyLockTickets()
//         } catch (e) {
//             return false
//         }

//         if (!goNext) return true
//         else goNext()
//     },
//     3: function ({ goNext }) {
//         TicketStore.initialize()

//         if (TicketStore.selectedShowing.length === 0) return false

//         if (!userStore.isAuthenticated) return false

//         if (TicketStore.Tickets.length === 0) return false

//         if (!goNext) return true
//         else goNext()
//     },
//     4: ({ goNext }) => (!goNext ? true : goNext())
// }

// // موقع برگشت از اون مرحله اجرا بشه
// const BackActions = {
//     1: function () {
//         TicketStore.setSelectedShowing('')
//         return true
//     },
//     2: async function () {
//         if (TicketStore.Tickets.length !== 0) {
//             const { isConfirmed } = await Swal.fire({
//                 title: 'سوال',
//                 html: 'با برگشتن به مرحله قبل بلیت های انتخاب شده حذف میشن!' + '<br/>' + 'از این عمل مطمئن هستی؟',
//                 icon: 'info',
//                 showConfirmButton: true,
//                 showCancelButton: true,
//                 showCloseButton: true,
//                 confirmButtonText: 'مطمئنم',
//                 cancelButtonText: 'لغو',
//                 customClass: {
//                     actions: 'flex justify-around w-full flex-row-reverse'
//                 },
//                 showClass: { popup: 'direction-rtl vazir-font ' }
//             })

//             if (!isConfirmed) {
//                 await seatMapService.LeaveGroup()
//                 return false
//             }
//         }
//         TicketStore.removeAllTickets()
//         return true
//     },
//     3: async function () {
//         try {
//             await seatMapService.notifyUnLockTickets()
//         } catch (e) {
//             return false
//         }

//         return true
//     },
//     4: function () {
//         return true
//     }
// }

// const seatMapService = useSeatMapStore()
// const TicketStore = useTicketStore()
// const userStore = useUserStore()
// const AuthModalStore = useAuthModalStore()

const route = useRoute()

const step = computed(()=>Number(route.name.replace("event","")));

const stepTitles = ['گام اول : انتخاب سانس', 'گام دوم : انتخاب صندلی', 'گام سوم : رزرو', 'گام چهارم : دریافت بلیت']
const router = useRouter()

async function toNext() {

        await router.push({
            name: 'event'+(step.value + 1),
            params: {
                ...route.params,
             
            }
        });
    
   
}

async function toPrevious() {
  
        await router.push({
            name:  'event'+(step.value -1),
            params: {
                ...route.params,
         
            }
        });
       
}
</script>

<style scoped></style>
