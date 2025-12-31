<script setup>
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
import adminView from './views/adminView.vue';
import LandingPage from './views/LandingPage.vue';
</script>

<template>
  <router-view></router-view>
<LandingPage/>
</template>
