<template>
    <div class="font-bold text-center">درباره ما!</div>
    <div>
        <pre class="text-wrap">
            {{ GetAbountUs.data.value?.values[0]?.value }}
        </pre>
    </div>
</template>

<script setup>
import { sendRequest } from '@/services/service';
import { useQuery } from '@tanstack/vue-query';


const GetAbountUs = useQuery({
    queryKey: ['/api/BaseInfo/GetParametersByKey/AboutUs'],
    queryFn: ({ queryKey }) =>
        sendRequest({
            url: queryKey[0],
            method: 'GET'
        }),
    refetchOnMount: true,
    enabled: true
});
</script>

<style></style>
