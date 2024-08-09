<template>
    <div class="sticky top-0">
        <div class="bg-white">
            <Splitter title="اطلاعات" border-class=" border-black relative " type="middle" title-class="text-black" />
        </div>
    </div>

    <div class="grid grid-cols-3 gap-1">
        <div class="rounded-sm mx-2">
            <div class="text-center">پارامتر</div>
            <vueSelectUmd
                v-model="selectedItem"
                :options="[...parents]"
                :reduce="
                    (city) => {
                        return city.value
                    }
                "
                label="label"
                class="mt-1 py-1 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md style-chooser"
            >
                <template #selected-option="{ label }">
                    <div style="display: flex; align-items: baseline; padding: 0">
                        <strong class="text-sm"> {{ label }} </strong>
                    </div>
                </template>

                <template #option="{ label }">
                    <div class="text-right">
                        <h3 style="margin: 0">{{ label }}</h3>
                    </div>
                </template>
            </vueSelectUmd>
            <div class="my-2">
                <button class="btn btn-md btn-success" @click.prevent="handleSubmit(onSubmit)()">ثبت</button>
            </div>
        </div>
        <div class="col-span-2 rounded-md overflow-hidden mx-2">
            <form @submit.prevent="onSubmit">
                <div class="grid grid-cols-5 gap-2 bg-gray-400 py-2">
                    <div class="col-span-1 text-center">نوع داده</div>
                    <div class="col-span-4 text-center">داده</div>
                </div>
                <PerfectScrollbar>
                    <div v-show="fields.length == 0" class="text-center">
                    <p class="text-center my-52">مقدار وجود ندارد</p>
                    </div>
                    <template v-for="(filed, id) in fields" :key="'event' + id">
                        <div class="grid grid-cols-5 gap-2 odd:bg-gray-50 even:bg-gray-100 py-2">
                            <div class="col-span-1">
                                <Field :name="`dynparams[${id}].valueType`" v-slot="{ filed, componentField }">
                                    <vueSelectUmd
                                        :clearable="false"
                                        v-bind="componentField"
                                        :options="[
                                            { value: 0, label: 'فایل' },
                                            { value: 1, label: 'متن' }
                                        ]"
                                        :reduce="
                                            (city) => {
                                                return city.value
                                            }
                                        "
                                        label="label"
                                        class="mt-1 py-1 border-[1px] bg-white px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-900 rounded-md style-chooser"
                                    >
                                        <template #selected-option="{ label }">
                                            <div style="display: flex; align-items: baseline; padding: 0">
                                                <strong class="text-sm"> {{ label }} </strong>
                                            </div>
                                        </template>

                                        <template #option="{ label }">
                                            <div class="text-right">
                                                <h3 style="margin: 0">{{ label }}</h3>
                                            </div>
                                        </template>
                                    </vueSelectUmd>
                                </Field>
                            </div>
                            <div class="col-span-4 flex">
                                <Field :name="`dynparams[${id}].value`" v-slot="{ field, componentField }">
                                    <template v-if="values.dynparams?.[id]?.valueType == 0">
                                        <input
                                            class="mt-1 py-2 bg-white border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-900 rounded-md"
                                            type="file"
                                            @change="
                                                ($event) => {
                                                    setFieldValue('dynparams[' + id + '].file', $event.target.files)
                                                }
                                            "
                                        />
                                    </template>
                                    <template v-else>
                                        <textarea class="form-input" v-bind="field"></textarea>
                                    </template>
                                </Field>
                                <a class="self-center p-2" v-show="!!values['dynparams'][id]?.url" :href="FILE_PROVIDER2 + values.dynparams?.[id]?.url">💾</a>
                                <div
                                    @click.prevent="
                                        () => {
                                            delelteItem(id)
                                        }
                                    "
                                    class="self-center inline-block relative"
                                >
                                    <v-icon name="fa-trash-alt" class="m-0 absolute hover:animate-ping" fill="red" />
                                    <v-icon name="fa-trash-alt" class="m-0" fill="red" />
                                </div>
                            </div>
                        </div>
                    </template>
                </PerfectScrollbar>
                <div class="mx-auto w-fit mt-1">
                    <button
                        class="btn btn-sm bg-gray-600 hover:!shadow-md btn-block sticky bottom-0"
                        type="button"
                        @click.prevent="
                            () => {
                                if (!selectedItem) return
                                try {
                                    push(ItemFields)
                                } catch (e) {
                                    console.error(e)
                                }
                            }
                        "
                    >
                        <div>
                            <v-icon name="co-plus" fill="" />
                        </div>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import Splitter from '@/views/components/Splitter/Splitter.vue';
import vueSelectUmd from 'vue-select';
import { ref, watch } from 'vue';
import { computed } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { sendRequest } from '@/services/service';
import { Field, useFieldArray, useForm } from 'vee-validate';
import { FILE_PROVIDER2 } from '@/config/appConfig';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useRouter } from 'vue-router';
import { CRPlacesService } from '@/services/PlacesService';
import Swal from 'sweetalert2';

import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';

const selectedItem = ref('');
const queryKey = computed(() => [{ url: '/api/DynamicParameters/GetAllParameters' }]);
const GetAllParents = useQuery({
    queryKey: queryKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0].url,
            method: 'GET',
            headers: {}
        }),
    refetchOnMount: true,
    enabled: true
});
const { mutate } = useMutation({
    mutationKey: ['CU/Places'],
    mutationFn: CRPlacesService,
    onError: (err) => {
        console.error(err)
        Swal.fire({
            text: 'ناموفق',
            icon: 'error',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2000,
            timerProgressBar: true,
            showClass: { popup: 'direction-rtl vazir-font' }
        })
    }
})
const parents = computed(() => GetAllParents.data.value?.map((x) => ({ label: x.title, value: x.id })) ?? [])

const GetChildrenbyParentIdKey = computed(() => ['/api/DynamicParameters/GetChildrenbyParentId/', selectedItem.value])
const GetAllChildernEnable = computed(() => !!selectedItem.value)
const GetAllChildern = useQuery({
    queryKey: GetChildrenbyParentIdKey,
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey.join(''),
            method: 'GET',
            headers: {}
        }),
    refetchOnMount: true,
    enabled: GetAllChildernEnable
});

const router = useRouter();
const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})
const { push, remove, fields, replace } = useFieldArray('dynparams')
const _ = defineField('garbage')

const ItemFields = {
    valueType: 0,
    value: '',
    title: '',
    file: null
}

function delelteItem(id) {
    if (values.dynparams[`${id}`].id) setFieldValue('garbage', !values.garbage ? [values.dynparams[id].id] : [...values.garbage, values.dynparams[id].id])

    remove(id)
}

watch(selectedItem, () => {
    if (!selectedItem.value)
        resetForm({
            values: {
                dynparams: [],
                garbage: []
            }
        })
})

watch(GetAllChildern.data, () => {
    if (!GetAllChildern.data.value) {
        for (let index = 0; index < fields.length; index++) {
            remove(index)
        }
    } else {
        let items = GetAllChildern.data.value.values.map((x) => ({ ...x, file: null, url: x.valueType == 0 ? x.value : null }))

        resetForm({
            values: {
                dynparams: items,
                garbage: []
            }
        })
    }
});

const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const formData = new FormData();
    let offset = 0;
    const innerValues = [];
    for (let index = 0; index < data.dynparams.length; index++) {
        let item = data.dynparams[index];
        if(item.valueType==0){
            if(item.file && item.file.length!=0){
                const {file,...rest} = item;
               
                rest.value = uuidv5(Math.random().toString(), uuidv4());
                formData.append('Files.Files[' + offset + '].File', file[0]);
                formData.append('Files.Files[' + offset + '].Key', rest.value);
                innerValues.push(rest);
                offset++;
            }
        }else{
            const {file,...rest} = item;
            innerValues.push(rest);
        }
        
    }
    

    const Data = {
        parentId : selectedItem.value,
        Id : selectedItem.value,
        values: [
            ...innerValues
        ],
        garbage : [...data.garbage]
    };
    
 
   
    if (offset === 0) formData.append('Files.Files', null)

    formData.append('DynParam', JSON.stringify(Data))

 

   
        mutate(
            {
                url: '/api/DynamicParameters/ManipulateParameter?api-version=1.0',
                body: formData,
                method: 'POST'
            },
            {
                onSuccess: async (data) => {
                    await Swal.fire({
                        text: 'تغییرات با موفقیت اعمال شد',
                        icon: 'success',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                   
                }
            }
        )
    
})

</script>

<style scoped>
.ps {
    height: calc(100dvh - 250px);
    @apply bg-gray-100 shadow-inner rounded-b-md;
    position: relative;
}
</style>
