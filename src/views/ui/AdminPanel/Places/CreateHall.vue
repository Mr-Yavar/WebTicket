<script setup>
import {Field, useFieldArray, useForm} from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import {useMutation, useQuery} from '@tanstack/vue-query'
import {CRPlacesService, GetHallService} from '@/services/PlacesService.js'
import {CiCircleChevLeft} from '@kalimahapps/vue-icons/ci'
import {HuTimesCircle} from '@kalimahapps/vue-icons/hu'

import Swal from 'sweetalert2'
import {useRoute, useRouter} from 'vue-router'
import {reactive, ref, useCssModule, watch} from 'vue'
import { FILE_PROVIDER } from '@/config/appConfig'
import {PrSpinner} from "@kalimahapps/vue-icons/pr";
const router = useRouter()
const route = useRoute()

const placeId = !route.params.id ? null : route.params.id
const hallId = !route.params.hallId ? null : route.params.hallId;

const getHallServiceCall = useQuery({
  queryKey: ['/api/Place/GetHallById', hallId],
  queryFn: () => GetHallService(hallId),
  enabled: !!hallId
})

const {resetForm, defineField, handleSubmit, values, setFieldValue} = useForm({
 
})


const [hallTitle] = defineField('hall.title')
const [hallDesc] = defineField('hall.description')
const hallImage = defineField('hall.image')
const [hallLat] = defineField('hall.lat')
const { push, remove, fields} = useFieldArray('floors')
const [hallLng] = defineField('hall.lng')
const {mutate} = useMutation({
  mutationKey: ['CU/Places'],
  mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {

console.log(data);
  

  const Data = {
    ...data.hall,
    Title: data.hall.title,
    PlaceId: placeId,
    Description: data.hall.description,
    lng: Number(data.hall.lng),
    lat: Number(data.hall.lat),
    FloorInfoDtos: [
      ...data.floors.map((x,index)=>({
        floorId : x?.floorId,
        Title : x.title,
        DisplayOrder:index,
        seatMap : x.seatMap,
        SeatsInfo : {ItemTitle:x.seatsInfo.itemTitle,Items:[...x.seatsInfo.items]}
      })),
      

    ]
  };
  console.log(Data);
  const formData = new FormData();
  let offset = 0;
    if(!!data.hall.image && data.hall.image?.length!=0 ){
  formData.append("Files.Files["+0+"].File", data.hall.image[0] );
  formData.append("Files.Files["+0+"].Key","hall");
  offset++;
  }
  Data.FloorInfoDtos.forEach((item,index)=>{
   if(!item.seatMap)
   return;
    formData.append("Files.Files["+(index+offset)+"].File",item.seatMap);
    formData.append("Files.Files["+(index+offset)+"].Key",index);

    delete item.seatMap ;
  });

  if(!formData.has("Files.Files[0].File"))
  formData.append("Files.Files",null);


formData.append("Hall",JSON.stringify(Data))

  console.log(formData);
 
  if (!hallId) {
    mutate(
        {
          url: '/api/Place/CreateHall?api-version=1.0',
          body: formData,
          method: 'POST',
      
        },
        {
          onSuccess: async (data) => {
            await Swal.fire({
              text: 'با موفقیت ایجاد شد!',
              icon: 'success',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 2000,
              timerProgressBar: true,
              showClass: {popup: 'direction-rtl vazir-font'}
            })
            router.push({name: 'managePlace', params: {id: placeId}})
          }
        }
    )
  } else {
    mutate(
        {
          url: '/api/Place/UpdateHall?api-version=1.0',
          body:  formData,
          method: 'PATCH'
        },
        {
          onSuccess: async (data) => {
            await Swal.fire({
              text: 'با موفقیت بروز شد!',
              icon: 'success',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 2000,
              timerProgressBar: true,
              showClass: {popup: 'direction-rtl vazir-font'}
            })
            router.push({name: 'managePlace', params: {id: placeId}})
          }
        }
    )
  }
})

const styles = useCssModule('map')
const tab = ref(null)

function changeTab(newTab) {
  tab.value = newTab
}

const seatMapErrors = reactive({})
const seatMapMessages = reactive({});
function showSeatMap(files, key, idx) {
  var reader = new FileReader()
  reader.onload = function (e) {
    var svgData = e.target.result
    var parser = new DOMParser()
    var tempDoc = parser.parseFromString(svgData, 'image/svg+xml')

    let CriticalIds = []
    tempDoc.querySelector('svg').classList.add('w-full', 'mx-auto')
    tempDoc.querySelectorAll('defs').forEach((def) => {
      def.querySelectorAll('[id]').forEach((item) => CriticalIds.push(item.id))
    })

    CriticalIds.forEach((tagId) => {
      let newId = tagId + '_' + idx
      tempDoc.querySelector('svg').innerHTML = tempDoc.querySelector('svg').innerHTML.replaceAll('id="' + tagId + '"', 'id="' + newId + '"')
      tempDoc.querySelector('svg').innerHTML = tempDoc.querySelector('svg').innerHTML.replaceAll('#' + tagId, '#' + newId)
    })

    let seats = [];
    let intersects = [];
    tempDoc?.querySelectorAll(`*[id^="f"][id*="_"][id*="r"][id*="c"]`).forEach((item) => {
      if (item.id.startsWith('f' + (idx)) && !isNaN(Number(item.id.split('_')[2].replace('c', '')))) {
        item.classList.add(styles['recongnized'])
        

        if(values.floors[idx].seatsInfo.items.find(x=>x.name === item.id))
          intersects.push(item.id); 
        else
          seats.push({Name: item.id});

      } else {
        item.classList.add(styles['not-recongnized'])
        seatMapErrors[idx] = 'صندلی‌های قرمز رنگ، شناخته نشده اند لطفا تصحیح کنید'
      }
    });

    console.log(intersects);

    seatMapMessages[idx] = seats.reduce((acc,val)=>{
    
      let temp = val.Name?.replace("f","").replace("r","").replace("c","").split("_").map(x=>Number(x));

      if(!acc[temp[0]])
        acc[temp[0] ] ={};

        if(!acc[temp[0]][temp[1]])
        acc[temp[0]][temp[1]] =[];

        acc[temp[0]][temp[1]].push(temp[2]);

      return acc;
    },{});

    document.querySelector('#' + key + '_' + idx).innerHTML = tempDoc.querySelector('svg')?.outerHTML ?? ""
    setFieldValue(key + '.' + idx + '.seatsInfo.items', seats)

    //Do whatever you want with pathTags
  }
  reader.readAsText(files[0])
}

function handleSeatMapOnTab(newIds) {
  console.log(newIds);
  newIds.forEach(newIdx => {
  console.log('#floors_' + newIdx + " svg",document.querySelector('#floors_' + newIdx + " svg"));
    if (!document.querySelector('#floors_' + newIdx + " svg")) {
      seatMapErrors[newIdx] = 'نقشه نامعتبر است!';
      return;
    }
    document.querySelector('#floors_' + newIdx)?.querySelectorAll(`*[id^="f"][id*="_"][id*="r"][id*="c"]`).forEach((item) => {
      if (!item.id.startsWith('f' + (newIdx)) && isNaN(Number(item.id.split('_')[2].replace('c', '')))) {
        item.classList.add(styles['not-recongnized'])
        seatMapErrors[newIdx] = 'صندلی‌های قرمز رنگ، شناخته نشده اند لطفا تصحیح کنید';
      }
    });
  });

  console.log(seatMapErrors);
}
watch([getHallServiceCall.data,getHallServiceCall.dataUpdatedAt],async ()=>{
  if(!getHallServiceCall.data.value && !hallId && !getHallServiceCall.isFetched)
  return;
 const data = getHallServiceCall.data.value;
const formData = {
  hall :{
    title : data?.title,
    id:data.id,
    lat : data.lat,
    lng : data.lng,
    description :data.description,
  
  },
  floors:[...data.floorInfoDtos]
};
 
  await resetForm({values:formData});
 
    formData.floors.forEach((floor,index)=>{
      fetch(FILE_PROVIDER+"?fileName="+floor.seatMap_url,{
        method : "GET"
      }).then((res)=>{
        return res.blob();
      }).then((res)=>{
        
       return res;
      
      }).then((data)=>{

          (async function(){
            console.log(data);
          })();

       showSeatMap([data],"floors",index);
      }).catch(e=>{
        console.error(e);
      });
      
    
  
  });
 
});
</script>

<template>
  <div>
    <div class="sticky top-0" style="z-index:1000;">
      <div class="!bg-white h-fit">
        <Splitter v-if="!hallId" border-class=" border-black " title="ایجاد یک سالن برگزاری" title-class="text-black" type="middle"/>
        <Splitter v-else border-class=" border-black " title="ویرایش یک سالن برگزاری" title-class="text-black" type="middle"/>

      </div>
      <div class="my-2 mx-1 flex flex-row-reverse">
        <button class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="router.push({ name: 'managePlace', params: { id: placeId } })">
          <CiCircleChevLeft class="scale-125 font-bold"/>
        </button>
      </div>
    </div>


 
    <form @submit.prevent="onSubmit" :class="!getHallServiceCall.isFetched && getHallServiceCall.isLoading ? 'hidden'  :''" >
      <div class="grid grid-cols-8 gap-2">
        <div class="col-span-2 col-start-2">
          <label class="block text-sm font-medium text-gray-700">نام</label>
          <input v-model="hallTitle" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="text"/>
        </div>

        <div class="col-span-4 col-start-2">
          <label class="block text-sm font-medium text-gray-700">شرح</label>
          <textarea v-model="hallDesc" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="text"></textarea>
        </div>
        <div class="col-span-2 col-start-6">
          <label class="block text-sm font-medium text-gray-700" for="place-name">نام طبقه</label>
          <input
              class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              type="file"
              @change="
              ($event) => {
                hallImage[0].value = $event.target.files
              }
            "
          />
        </div>

        <div class="col-span-full">
          <div class="p-2 rounded-2xl">
            <div class="tabs grid flex-end align-center tabs-boxed mb-2 !bg-gray-100 dark:bg-gray-600 !text-black dark:!text-white" role="tablist">
              <template v-for="(field, idx) in fields" :key="`tab` + field.key">
                <a :class="{ 'tab-active': tab === idx }" class="tab" role="tab" @click.prevent="changeTab(idx)">
                  <div class="flex justify-around items-center">
                   
                    <!-- <div class="bg-gray-900 text-white rounded-full text-base"><LaArrowRightSolid/></div> -->
                  <div class="flex justify-center items-center">
                    <span class="px-4">{{values.floors[idx].title === '' ? 'بدون نام' : values.floors[idx].title }}</span>
                    <HuTimesCircle
                        class="text-red-500 tab-active:text-red-900 text-lg"
                        @click.prevent="
                        () => {
                          if (tab === idx) {
                            tab = -1;
                          }
                          remove(idx);
                          handleSeatMapOnTab(Object.keys(values.floors));
                        }
                      "
                    />
                  </div>
                  <!-- <div class="bg-gray-900 text-white rounded-full text-base"><LaArrowLeftSolid/></div> -->
                  </div>
                </a>
              </template>
              <a class="tab !bg-green-200" role="tab" @click.prevent="push({ title: '', id: '', seatMap: '',displayOrder:fields.length, seatsInfo: {itemTitle:'Seats', items: [] } })">
                +طبقه </a>
            </div>
            <div class="body">
              <template v-for="(field, idx) in fields" :key="`tabcontent` + field.key">
                <div :class="{ hidden: tab !== idx, 'grid grid-cols-4 gap-4 ': true }" class="p-1">
                  <div>
                    <Field :name="`floors[${idx}].title`" class="form-input" rules="required" type="text"/>
                    <Field :name="`floors[${idx}].displayOrder`" class="form-input" rules="" type="hidden"/>
                  </div>
                  <div>
                    <Field :name="`floors[${idx}].seatMap`" class="form-input" type="file" @change="showSeatMap($event.target.files, 'floors', idx)"/>
                  </div>
                  <div class="col-span-full">
                    <div :id="'floors_' + idx" class="m-3 border-2 border-gray-200 h-[500px] seapMap"></div>
                    <div class="text-center text-red-500">{{ seatMapErrors[idx] }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="col-span-2 col-start-4">
          <button v-if="!hallId" class="good-btn" type="submit">ایجاد</button>
          <button v-else class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" type="submit">
            ویرایش
          </button>
        </div>
      </div>
    </form>
    <div :class="getHallServiceCall.isFetched || !getHallServiceCall.isLoading ? 'hidden'  :''">
      <PrSpinner class="animate-spin mx-auto text-3xl mt-8 " />
    </div>
  </div>
</template>

<style scoped>
.tab {
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
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 2;

  @apply w-full bg-transparent rounded-lg mx-2;
}

.tab-active {
  @apply dark:!text-white !text-white !bg-indigo-400;
}

.tabs {
  @apply bg-gray-50 p-1 rounded-md shadow-inner;
}

.form-input {
  @apply mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md;
}

.good-btn {
  @apply block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
}
</style>

<style module="map">
.recongnized {
  fill: greenyellow !important;
}

.not-recongnized {
  fill: red !important;
}
</style>
