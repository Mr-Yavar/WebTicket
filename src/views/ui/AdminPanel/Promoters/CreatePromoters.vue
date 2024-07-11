<script setup>
import { useForm } from 'vee-validate'
import Splitter from '@/views/components/Splitter/Splitter.vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { CiCircleChevLeft } from '@kalimahapps/vue-icons/ci'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { sendRequest } from '@/services/service'
import vueSelectUmd from 'vue-select'

const router = useRouter()
const route = useRoute()

const prmoterId = !route.params.id ? null : route.params.id

const getPromoterServiceCall = useQuery({
  queryKey: ['/api/Promoters/GetPromoter/', prmoterId],
  queryFn: ({ queryKey }) => sendRequest({
    url: queryKey.join(""),
    method: "GET"
  }),
  enabled: !!prmoterId
})
const getCategoryServiceCall = useQuery({
  queryKey: ['/api/BaseInfo/GetCategories'],
  queryFn: ({ queryKey }) => sendRequest({
    url: queryKey.join(""),
    method: "GET"
  }),
  enabled: true
})

const { resetForm, defineField, handleSubmit } = useForm({
  initialValues: {
    promoter: getPromoterServiceCall.data?.value
  }
})

watch([getPromoterServiceCall.data], () => {
  if (prmoterId) resetForm({ values: { promoter: { ...getPromoterServiceCall.data?.value } } })
  else resetForm({ values: {} })
})

const [pTitle] = defineField('promoter.title')
const [pDesc] = defineField('promoter.description')
const [pCategory] = defineField('promoter.categoryId')
const pImage = defineField('promoter.image')


const categories = computed(() => getCategoryServiceCall.data.value?.filter(x => x.parentId != null)?.map(x => ({ label: x.title, value: x.id, parent: getCategoryServiceCall.data.value.find(y => y.id === x.parentId)?.title })));

const { mutate } = useMutation({
  mutationKey: ['CU/promoters'],
  mutationFn: (value) =>
    sendRequest(value)
});
const queryClient = useQueryClient();

const onSubmit = handleSubmit(async (data) => {

  const form = new FormData();
  
  form.append("Promoter", JSON.stringify({
    Id :prmoterId ?? null,
    Title: data.promoter.title,
    Description: data.promoter.description,
    CategoryId: data.promoter.categoryId 
  }));
  
  if (!!data.promoter.image && data.promoter.image.length === 1) {
 
    form.append("File.File", data.promoter.image[0]);
  } else {
    form.append("File.File", undefined);
  }
  form.append("File.key", "promoter");

  if (!prmoterId) {
    mutate(
      {
        url: '/api/Promoters/CreatePromoter?api-version=1.0',
        body: form,
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
            showClass: { popup: 'direction-rtl vazir-font' }
          })
          router.push({ name: 'AllPromoters' })
        }
      }
    )
  } else {
    mutate(
      {
        url: '/api/Promoters/UpdatePromoter?api-version=1.0',
        body: form,
        method: 'PUT',
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
            showClass: { popup: 'direction-rtl vazir-font !text-black'}
          })
          queryClient.invalidateQueries({queryKey:["/api/Promoters/GetAllPromoters"]});
          router.push({ name: 'AllPromoters' })
        }
      }
    )
  }
})
</script>

<template>
  <div>
    <div class="sticky top-0">
      <div class="bg-white">
        <Splitter title="برگزارکننده جدید" border-class=" border-black " type="middle" title-class="text-black" />
      </div>
      <div class="my-2 mx-1 flex flex-row-reverse">
        <button @click="router.push({ name: 'AllPromoters' })"
          class="items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <CiCircleChevLeft class="scale-125 font-bold" />
        </button>
      </div>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-6 gap-2">
        <div class="col-span-2 col-start-2">
          <label for="place-name" class="block text-sm font-medium text-gray-700">نام</label>
          <input type="text" v-model="pTitle" id="place-name" placeholder="برج میلاد"
            class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div class="col-span-2 col-start-4">
          <label for="place-name" class="block text-sm font-medium text-gray-700">تصویر</label>

          <input
            class="mt-1 py-1.5 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            type="file" @change="($event) => {
                pImage[0].value = $event.target.files
              }
              " />
        </div>
        <div class="col-span-2 col-start-2">
          <label for="place-name" class="block text-sm font-medium text-gray-700">دسته بندی</label>
          <vue-Select-Umd v-model="pCategory" :options="categories" :reduce="category => {console.log(category); return category.value;}" label="label"
            class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            <template #selected-option="{ label, parent }">
              <div style="display: flex; align-items: baseline">
                <strong class="text-base"> {{ label }} </strong>
                <em class="mx-1 text-sm"> {{ parent }} </em>
              </div>
            </template>

            <template #option="{ label, parent }">
              <div class="text-right">
                <h3 style="margin: 0">{{ label }}</h3>
                <em>{{ parent }}</em>

              </div>
            </template>
          </vue-Select-Umd>
        </div>
        <div class="col-span-4 col-start-2">
          <label for="place-name" class="block text-sm font-medium text-gray-700">توضیحات</label>
          <textarea type="text" v-model="pDesc" id="place-name" placeholder="درمورد مکان برگزاری و سالن های آن"
            class="mt-1 py-2 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
        </div>
        <div class="col-span-2 col-start-3">
          <button v-if="!prmoterId" type="submit"
            class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">ایجاد</button>
          <button v-else type="submit"
            class="block mx-auto items-center px-4 py-2 w-fit border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">ویرایش</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
