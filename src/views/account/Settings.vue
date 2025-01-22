<template>
    <navbar :inHeroPlatform="false" />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <div class="flex flex-col gap-[2px]">
                    <navItem route="account" data="" :hasIcon="true" label="Account">
                        <template #icon>
                            <User size="20px" />
                        </template>
                    </navItem>
                    <navItem route="plan-and-billing" data="" :hasIcon="true" label="Plan & Billing">
                        <template #icon>
                            <CreditCard size="20px" />
                        </template>
                    </navItem>
                    <navItem route="security" data="" :hasIcon="true" label="Security">
                        <template #icon>
                            <LockKeyhole size="20px" />
                        </template>
                    </navItem>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import navbar from '../../components/nav/navbar.vue';
import navItem from '../../components/nav/nav-item.vue';

// ICONS
import { User, CreditCard, LockKeyhole } from 'lucide-vue-next';

export default {
    name: "Settings",
    components: {
        navbar,
        navItem,

        // ICONS
        User,
        CreditCard,
        LockKeyhole
    },
    data() {
        return {
            store,
            auth,
        }
    },
    methods: {}
}
</script>

<style scoped></style>