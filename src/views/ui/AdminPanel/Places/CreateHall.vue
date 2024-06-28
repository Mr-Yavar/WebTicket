<script setup>
import { useForm, useFieldArray, Field } from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { CRPlacesService, GetHallService } from '@/services/PlacesService.js'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import { HuTimesCircle } from '@kalimahapps/vue-icons/hu'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { reactive } from 'vue'
import { ref, useCssModule } from 'vue'

const router = useRouter()
const route = useRoute()

const placeId = !route.params.id ? null : route.params.id
const hallId = !route.params.hallId ? null : route.params.hallId

const getHallServiceCall = useQuery({
  queryKey: ['/api/Place/GetHallById', hallId],
  queryFn: () => GetHallService(hallId),
  enabled: !!hallId
})

const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({
  initialValues: {
    place: GetHallService.data?.value
  }
})

const floors = reactive([])

const [hallTitle] = defineField('hall.title')
const [hallDesc] = defineField('hall.description')
const hallImage = defineField('hall.image')
const [hallLat] = defineField('hall.lat')
const { update, push, swap, replace, remove, fields } = useFieldArray('floors')
const [hallLng] = defineField('hall.lng')
console.log(defineField('hall.tttt')[0])
const { mutate } = useMutation({
  mutationKey: ['CU/Places'],
  mutationFn: CRPlacesService
})

const onSubmit = handleSubmit(async (data) => {
  const formData = {
    title: data.hall.title,
    placeId: placeId,
    description: data.hall.description,
    lng: data.hall.lng,
    lat: data.hall.lat,
    floorInfoDtos: [
      ...data.floors

    ]
  };
console.log(formData);
  return
  if (!placeId) {
    mutate(
      {
        url: '/api/Place/CreatePlace?api-version=1.0',
        body: JSON.stringify({
          title: data.place.title,
          address: data.place.address,
          description: data.place.description
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      {
        onSuccess: async (data) => {
          await Swal.fire({
            text: 'با موقفیت ایجاد شد!',
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
          })
          router.push({ name: 'managePlace', params: { id: placeId } })
        }
      }
    )
  } else {
    mutate(
      {
        url: '/api/Place/UpdatePlace?api-version=1.0',
        body: JSON.stringify({
          id: data.place.id,
          title: data.place.title,
          address: data.place.address,
          description: data.place.description
        }),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      {
        onSuccess: async (data) => {
          await Swal.fire({
            text: 'با موقفیت بروز شد!',
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
          })
          router.push({ name: 'managePlace', params: { id: placeId } })
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

    let seats = []
    tempDoc?.querySelectorAll(`*[id^="f"][id*="_"][id*="r"][id*="c"]`).forEach((item) => {
      if (item.id.startsWith('f' + (idx + 1)) && !isNaN(Number(item.id.split('_')[2].replace('c', '')))) {
        item.classList.add(styles['recongnized'])
        seats.push({ name: item.id })
      } else {
        item.classList.add(styles['not-recongnized'])
        seatMapErrors[idx] = 'صندلی‌های قرمز رنگ، شناخته نشده اند لطفا تصحیح کنید'
      }
    })

    document.querySelector('#' + key + '_' + idx).innerHTML = tempDoc.querySelector('svg').outerHTML
    setFieldValue(key + '.' + idx + '.seatsInfo.items', seats)

    //Do whatever you want with pathTags
  }
  reader.readAsText(files[0])
}
</script>

<template>
  <div>
    <Splitter title="ایجاد یک مکان برگزاری" border-class=" border-black " type="middle" title-class="text-black" />
    <div class="my-2 mx-1 flex flex-row-reverse">
      <button @click="router.push({ name: 'managePlace', params: { id: placeId } })" class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <CiCircleChevLeft class="scale-125 font-bold" />
      </button>
    </div>
    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-8 gap-2">
        <div class="col-span-2 col-start-2">
          <label class="block text-sm font-medium text-gray-700">نام</label>
          <input type="text" v-model="hallTitle" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div class="col-span-2 col-start-4">
          <label class="block text-sm font-medium text-gray-700">lat</label>
          <input type="text" v-model="hallLat" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div class="col-span-2 col-start-6">
          <label class="block text-sm font-medium text-gray-700">lng</label>
          <input type="text" v-model="hallLng" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div class="col-span-4 col-start-2">
          <label class="block text-sm font-medium text-gray-700">نام</label>
          <textarea type="text" v-model="hallDesc" class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
        </div>
        <div class="col-span-2 col-start-6">
          <label for="place-name" class="block text-sm font-medium text-gray-700">نام</label>
          <input
            type="file"
            @change="
              ($event) => {
                hallImage[0].value = $event.target.files
              }
            "
            class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div class="col-span-full">
          <div class="p-2 rounded-2xl">
            <div class="tabs grid flex-end align-center tabs-boxed mb-2 !bg-gray-100 dark:bg-gray-600 !text-black dark:!text-white" role="tablist">
              <template v-for="(field, idx) in fields" :key="`tab` + field.key">
                <a :class="{ 'tab-active': tab === idx }" class="tab" role="tab" @click.prevent="changeTab(idx)">
                  <div class="flex justify-center items-center">
                    <span class="px-4">{{ values.floors[idx].title == '' ? 'بدون نام' : values.floors[idx].title }}</span>
                    <HuTimesCircle
                      class="text-red-500 tab-active:text-red-900 text-lg"
                      @click.prevent="
                        () => {
                          if (tab === idx) {
                            tab = -1
                          }
                          remove(idx)
                        }
                      "
                    />
                  </div>
                </a>
              </template>
              <a class="tab !bg-green-200" role="tab" @click.prevent="push({ title: '', id: '', seatMap: '',displayOrder:fields.length, seatsInfo: {itemTitle:'Seats', items: [] } })"> +طبقه </a>
            </div>
            <div class="body">
              <template v-for="(field, idx) in fields" :key="`tabcontent` + field.key">
                <div :class="{ hidden: tab !== idx, 'grid grid-cols-4 gap-4 ': true }" class="p-1">
                  <div>
                    <Field rules="required" :name="`floors[${idx}].title`" class="form-input" type="text" />
                    <Field rules="" :name="`floors[${idx}].displayOrder`"  class="form-input" type="hidden" />
                  </div>
                  <div>
                    <Field :name="`floors[${idx}].seatMap`" class="form-input" type="file" @change="showSeatMap($event.target.files, 'floors', idx)" />
                  </div>
                  <div class="col-span-full">
                    <div class="m-3 border-2 border-gray-200 h-[500px] seapMap" :id="'floors_' + idx"></div>
                    <div class="text-center text-red-500">{{ seatMapErrors[idx] }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="col-span-2 col-start-4">
          <button v-if="!hallId" type="submit" class="good-btn">ایجاد</button>
          <button v-else type="submit" class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">ویرایش</button>
        </div>
      </div>
    </form>
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

  @apply w-full bg-transparent rounded-lg;
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
