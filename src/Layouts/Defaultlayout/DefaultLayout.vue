<template>
    <AppHeader />
    <div class="AppGap">
        <div class="AppContainer min-h-[calc(100vh-350px)]">
            <slot></slot>
        </div>
    </div>
    <AuthModal />
    <AppFooter />
</template>

<script setup>
import AppHeader from './components/Header/AppHeader.vue'
import AppFooter from './components/Footer/AppFooter.vue'
import AuthModal from '@/global/modal/AuthModal.vue'



</script>

<style scoped></style>
