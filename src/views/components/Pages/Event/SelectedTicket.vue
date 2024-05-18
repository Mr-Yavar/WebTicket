<template>
  <div>
    <div class="cardWrap md:!text-base sm:!text-sm !text-xs">
      <div class="card cardLeft relative">
        <div class="absolute top-0.5 text-center text-white block w-full md:!text-lg !text-base"><span class="font-extrabold">کنسرت ماکان بند</span>
        </div>
        <div class="h-full w-full grid grid-cols-2 items-end gap-0">
          <div class="text-center block  text-black"><span class="font-bold ">طبقه :</span> {{floor}}</div>

          <div class="text-center block  text-black"><span class="font-bold ">ردیف :</span>{{row}} </div>

          <div class="text-center block  text-black"><span class="font-bold ">صندلی :</span> {{column}}</div>

          <div class="text-center block  text-black"><span class="font-bold ">قیمت :</span>{{20000}}</div>
        </div>
      </div>
      <div class="card  cardRight relative ">
        <div class="absolute md:bottom-5 bottom-3  text-center text-white block w-full">
          <span @click.prevent="handleDelete" v-if="hasDelete">
            <v-icon name="io-trash-outline" scale="1.2" fill="#ffdd44" />
            </span>
          <span class="text-gray-900 dark:text-gray-100" v-else>
            {{index}}
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
  seatInfo : String,
  hasDelete : {
    type : Boolean,
    default : true
  },
  index : Number
});

console.log(props.seatInfo.id);
const floor = props.seatInfo.floor;
const row =props.seatInfo.row;
const column = props.seatInfo.column;

const price = props.seatInfo.price;
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