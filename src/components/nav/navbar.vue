<template>
    <div class="sticky z-[500] top-0 left-0 w-full h-[52px] lg:h-[72px] px-[20px] lg:px-[32px] rounded-b-[16px] flex items-center justify-between bg-[#111]">
        <div class="flex items-center justify-start">
            <RouterLink to="/" class="h-[18px] lg:h-[24px]">
                <svg class="h-full w-auto" viewBox="0 0 43 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.200195 0.399902H6.2002V24.3999H0.200195V0.399902Z" fill="white" />
                    <path d="M12.2002 0.399902H18.2002V24.3999H12.2002V0.399902Z" fill="white" />
                    <path d="M24.2002 0.399902H30.2002V24.3999H24.2002V0.399902Z" fill="white" />
                    <path d="M42.2002 24.3999H36.2002V6.3999L39.2002 9.3999L42.2002 6.3999V24.3999Z" fill="white" />
                </svg>
            </RouterLink>
        </div>
        <div class="flex items-center justify-center"></div>
        <div class="flex gap-[10px] items-center justify-end">
            <buttonFl v-if="inHeroPlatform && store.vaults.data.length >= 1" @click="store.modals.createAccount.open = !store.modals.createAccount.open" type="primary" size="small" :hasIcon="false" :label="$t('add_account')" />
            <RouterLink to="/pricing">
                <buttonFl v-if="!auth.profile?.is_subscribed" type="secondary" size="small" :hasIcon="false" :label="$t('get_pro')" />
            </RouterLink>
            <avatar size="small" :hasInputFile="false" :hasProfileMenu="true" />
        </div>
    </div>
</template>

<script>
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import avatar from '../avatar/avatar.vue';
import buttonFl from '../button/button-fl.vue';

export default {
    name: "navbar",
    components: {
        avatar,
        buttonFl
    },
    props: {
        inHeroPlatform: Boolean
    },
    data() {
        return {
            auth,
            store
        }
    }
}
</script>

<style scoped></style>