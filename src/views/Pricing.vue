<template>
    <navbar :inHeroPlatform="false" />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            
        </div>
    </div>
</template>

<script>
import { auth } from '../data/auth';
import { store } from '../data/store';

import navbar from '../components/nav/navbar.vue';

export default {
    name: "Pricing",
    components: {
        navbar
    },
    data() {
        return {
            store,
            auth
        }
    },
}
</script>

<style scoped></style>