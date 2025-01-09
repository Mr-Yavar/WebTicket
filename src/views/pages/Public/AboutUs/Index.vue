<template>
    <div class="font-bold text-center">درباره ما!</div>
    <div>
        <pre class="text-wrap">
            {{ GetAbountUs.data.value?.values[0]?.value }}
        </pre>
    </div>
</template>

<script setup>
import { BaseInfoQueryKeys, get_apiBaseInfoGetParametersByKey } from '@/api/BaseInfoService'
import { useQuery } from '@tanstack/vue-query'

const GetAbountUs = useQuery({
    queryKey: [BaseInfoQueryKeys.get_apiBaseInfoGetParametersByKey('AboutUs')],
    queryFn: () => get_apiBaseInfoGetParametersByKey('AboutUs'),
    refetchOnMount: true,
    enabled: true
})
</script>

<style></style>
