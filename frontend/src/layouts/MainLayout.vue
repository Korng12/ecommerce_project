<template>
    <div class="main-layout">
        <Header />
        <main>
            <router-view />
        </main>
        <Footer />
    </div>
</template>
<script setup>
    import { ref } from 'vue';
    import Header from '@/components/layout/Header.vue';
    import Footer from '@/components/layout/Footer.vue';
    import router from '@/router';
</script>