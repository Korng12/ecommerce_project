<template>
    <div class="flex flex-col gap-32">
        <Header></Header>
        
        <main class="">
            <router-view></router-view>
        </main>
        <Footer></Footer>
    </div>
</template>
<script setup>
    import Header from '@/components/layout/Header.vue';
    import Footer from '@/components/layout/Footer.vue';
import { FolderTree } from 'lucide-vue-next';
</script>