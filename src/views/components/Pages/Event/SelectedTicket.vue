<template>
  <div>
    <div class="cardWrap">
      <div class="card cardLeft relative">
        <div class="absolute top-0.5 text-center text-white block w-full"><span class="font-extrabold text-lg">کنسرت ماکان بند</span>
        </div>
        <div class="h-full w-full grid grid-cols-2 items-end gap-0">
          <div class="text-center block  text-black"><span class="font-bold ">طبقه :</span> {{floor}}</div>

          <div class="text-center block  text-black"><span class="font-bold ">ردیف :</span>{{row}} </div>

          <div class="text-center block  text-black"><span class="font-bold ">صندلی :</span> {{column}}</div>

          <div class="text-center block  text-black"><span class="font-bold ">قیمت :</span>{{20000}}</div>
        </div>
      </div>
      <div class="card  cardRight relative ">
        <div class="absolute bottom-5 text-center text-white block w-full">
          <span @click.prevent="handleDelete(seatInfo)">
            <v-icon name="io-trash-outline" scale="1.2" fill="#ffdd44" />
            </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {computed,defineProps} from "vue";

const props = defineProps({
  handleDelete: Function,
  seatInfo : String
});


const floor = computed(()=> " -"+ props.seatInfo.split('_')[0].replace("f","") +"- " )
const row = computed(()=> " -"+ props.seatInfo.split('_')[1].replace("r","") +"- " )
const column = computed(()=> " -"+ props.seatInfo.split('_')[2].replace("c","") +"- " )
</script>

<style scoped>
.cardWrap {
  @apply mx-auto my-auto
}

.card {
  @apply h-[5em] float-left relative pt-[1em] pb-[0.40em];
  background: linear-gradient(to bottom, rgba(38, 37, 37, 0.95) 0%, rgba(38, 37, 37, 0.95) 35%, #dcdcdc 35%, #dcdcdc 100%);
}

.cardLeft {
  @apply w-3/4 rounded-tl-lg rounded-bl-lg pb-0 pt-6  ;

}

.cardRight {
  @apply w-1/4 rounded-tr-lg rounded-br-lg border-l-[0.18em] border-l-white border-dashed before:top-[-0.4em] after:bottom-[-0.4em] ;

}

.cardRight:before,
.cardRight:after {
  @apply content-[""] absolute block w-[0.9em] h-[0.9em] left-[-0.5em] rounded-[50%] bg-white dark:!bg-transparent;

}

</style>