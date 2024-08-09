<template>
    <div class="sticky top-0">
        <div class="bg-white">
            <Splitter title="اطلاعات" border-class=" border-black relative " type="middle" title-class="text-black" />
        </div>
    </div>

    <div class="grid grid-cols-3 gap-1">
        <div class="rounded-sm">
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
            <div class="my-2 ">
                <button class="btn btn-md btn-success" @click.prevent="handleSubmit(v=>console.log(v))()">ثبت</button>
            </div>
        </div>
        <div class="col-span-2 rounded-sm">
            <form @submit.prevent="(v)=>console.log(v)">
                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1 text-center">نوع داده</div>
                    <div class="col-span-2 text-center">داده</div>
                </div>
                <template v-for="(filed, id) in fields" :key="'event' + id">
                    <div class="grid grid-cols-3 gap-2">
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
                            </Field>
                        </div>
                        <div class="col-span-2 flex">
                            <Field :name="`dynparams[${id}].value`" v-slot="{ field, componentField }">
                                <template v-if="values.dynparams?.[id]?.valueType == 0">
                                    <input
                                        class="mt-1 py-1.5 border-[1px] px-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                            <a v-show="!!values['dynparams'][id]?.url" :href="FILE_PROVIDER2+values.dynparams?.[id]?.url">💾</a>
                            <button v-show="!!values.dynparams?.[id]?.id" @click.prevent="()=>{}" class="btn btn-sm btn-danger">del</button>
                        </div>
                    </div>
                </template>
            </form>
            <div class="mx-auto w-fit">
                <button
                    class="btn btn-sm btn-info btn-block"
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
                    +
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Splitter from '@/views/components/Splitter/Splitter.vue'
import vueSelectUmd from 'vue-select'
import { ref, watch } from 'vue'
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { sendRequest } from '@/services/service'
import { Field, useFieldArray, useForm } from 'vee-validate'
import { FILE_PROVIDER2 } from '@/config/appConfig'

const selectedItem = ref('')

const queryKey = computed(() => [{ url: '/api/DynamicParameters/GetAllParameters' }])
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
const { resetForm, defineField, handleSubmit, values, setFieldValue } = useForm({})
const { push, remove, fields, replace } = useFieldArray('dynparams')
const ItemFields = {
    valueType: 0,
    value: '',
    title: '',
    file: null
};
watch(GetAllChildern.data, () => {
    if (!GetAllChildern.data.value) {
        for (let index = 0; index < fields.length; index++) {
            remove(index)
        }
    } else {
        let items = GetAllChildern.data.value.values.map((x) => ({ ...x,file:null,url: (x.valueType==0) ? x.value : null}));

        resetForm({
            values: {
                dynparams: items
            }
        })
    }
})
</script>

<style></style>
