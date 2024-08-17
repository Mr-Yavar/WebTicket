<template>
    <!-- component -->
    
        <div class="hidden md:flex flex-row justify-between shadow-md border rounded-md ">
            <div class="flex flex-col items-center justify-between lg:w-1/6 w-1/4  bg-white ltr:border-r-2 rtl:border-l-2 border-gray-500 border-dashed ltr:rounded-l-md rtl:rounded-r-md">
                <div class="flex-col">
                   
                    <vue-qrcode :value="Guid({}).fromFullToCompressed(ticket.reservationId)" :options="{ width: 150,margin:2 }" class="qrcode"></vue-qrcode>
                    <p class="mb-2 text-xs italic font-light text-gray-500 text-center">اینجا را اسکن کنید!</p>
                    
                </div>
                <div class="text-left">
                    <p class="pb-2 text-xs italic"></p>
                
                </div>
            </div>
            <div class="relative flex flex-col lg:w-5/6 w-3/4 ">
                <!-- <div class="bg-gray-400 h-[100px]"></div> -->
                <div class=" p-1">
                    <div class="flex flex-row px-0 py-2 text-xs font-bold text-red-800 bg-white rounded-md">
                        <p class="mr-1 font-normal text-gray-500"> عنوان رویداد :</p>
                        <p class="font-semibold text-red-800"> {{ticket.concert.title}} </p>
                    </div>
                </div>
                <div class="absolute self-end mr-1 mt-1">
                </div>
                <div class="absolute bottom-0 flex flex-col w-full bg-white">
                    <div class="flex flex-row text-gray-800 opacity-100">
                        <table class="h-full">
                            <tr>
                                <td class="p-2 h-full">
                                    <div class="flex flex-col">
                                        <div class="flex flex-col">
                                            <p class="mb-1 text-xs text-gray-500">شروع رویداد :</p>
                                            <p class="text-xs font-semibold text-red-800">{{dateToFormat(execDate)}}</p>
                                        </div>
                                        <div class="hidden md:flex flex-col mt-1">
                                            <p class="mb-1 text-xs text-gray-500">پایان رویداد :</p>
                                            <p class="text-xs font-semibold text-red-800">{{dateToFormat(execDate_90MIn)}}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-2 h-full">
                                    <div class="flex flex-col ml-4">
                                        <div class="hidden md:flex flex-col">
                                            <p class="mb-1 text-xs text-gray-500">آدرس :</p>
                                            <p class="text-xs font-semibold text-red-800">{{address}} | {{ticket.hall}}</p>
                                        </div>
                                        <div class="flex flex-col mt-1">
                                            <p class="mb-1 text-xs text-gray-500">مشخات :</p>
                                            <p class="text-xs font-semibold text-red-800">{{name}}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-2 h-full">
                                    <div class="flex flex-col ml-4 items-start">
                                        <div class="flex flex-col ">
                                            <p class="mb-1 text-xs text-gray-500">به نام :</p>
                                            <p class="text-xs font-semibold text-red-800">{{ticket.OwnerName}}</p>
                                        </div>
                                    </div>
                                    <div class="flex flex-col ml-4 items-start">
                                        <div class="flex flex-col ">
                                            <p class="mb-1 text-xs text-gray-500">اعتبار :</p>
                                            <p class="text-xs font-semibold text-red-800">   تا پایان رویداد</p>
                                        </div>
                                    </div>
                                 
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="md:hidden flex flex-col bg-white border rounded-md shadow-md w-fit mx-auto">
            <div class="py-0 px-4 flex-col flex text-center">
                <vue-qrcode value="Hello, World!" :options="{ width: 150, }" class="qrcode"></vue-qrcode>
                <p class="font-bold text-lg lg:text-3xl hidden">اینجا را اسکن کنید!</p>
            </div>
            <hr class="border-dashed border-2 border-gray-400" />
            <div class="pt-1 px-4 flex flex-col text-sm lg:text-2xl">
                <p class="self-start font-bold text-gray-500">عنوان  :</p>
                <div class="flex text-sm justify-between my-2 lg:text-xl">
                    <p class="font-bold text-red-800"> {{ticket.concert.title}} </p>
                </div>
            </div>
            <div class="py-0 px-4 flex flex-col text-sm lg:text-2xl">
                <p class="self-start font-bold text-gray-500">مشخصات رزرو:</p>
                <div class="flex text-sm justify-between my-2 lg:text-xl">
                    <p class="font-bold text-red-800">{{name}}</p>
                </div>
            </div>
       
            <div class="py-0 px-4 flex flex-col text-sm lg:text-2xl">
                <p class="self-start font-bold text-gray-500">زمان شروع :</p>
                <div class="flex text-sm justify-between my-2 lg:text-xl">
                    <p class="font-bold text-red-800">{{dateToFormat(execDate)}}</p>
                </div>
            </div>
            <div class="py-0 px-4 flex flex-col text-sm lg:text-2xl">
                <p class="self-start font-bold text-gray-500">زمان پایان :</p>
                <div class="flex text-sm lg:text-xl justify-between my-2">
                    <p class="font-bold text-red-800">{{dateToFormat(execDate_90MIn)}}</p>
                </div>
            </div>
            <div class="py-0 px-4 flex flex-col text-sm lg:text-2xl">
                <p class="self-start font-bold text-gray-500">آدرس :</p>
                <div class="flex text-sm lg:text-xl justify-between my-2">
                 
                    <p class="font-bold text-red-800">{{address}} | {{ticket.hall}}</p>
                </div>
            </div>
            <hr class="border-gray-400" />
        </div>
  
</template>

<script setup>
import { Guid } from '@/config/helper';
import { computed } from 'vue';

const props = defineProps({
    ticket:Object
});

const dateOption = {
    year : "numeric",
    weekday:"long",
    month : "long",
    day : "numeric",
    hour : "2-digit",
    minute : "2-digit",
    hour12 : false
}

const execDate = computed(()=> new Date(props.ticket.event.executionDate));

const execDate_90MIn = computed(()=> new Date(execDate.value*1+(90*60*1000)) );
function dateToFormat(date){
    let text = date.toLocaleString('fa-ir',dateOption);
    const [year,month,day,weekday,saat,time] = text.replace(",","").split(' ');

    return `${weekday} ${day}م ${month} ${year} ${saat} ${time} `
}
const name =  computed(()=>`طبقه ${props.ticket.floor} -ردیف ${props.ticket.row} -صندلی ${props.ticket.column}`);
const address =  computed(()=>props.ticket.place.address);


</script>

<style scoped>
.qrcode{
    margin:0 auto;
}
</style>
