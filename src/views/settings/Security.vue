<template>
    <navbar :logo="true" :firstAction="false" :secondAction="false" :profile="true"
        :authenticated="auth.isAuthenticated" />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <div class="flex flex-col gap-[2px]">
                    <RouterLink to="/settings/account">
                        <navItem data="" :hasIcon="true" label="Account" class="not-vault">
                            <template #icon>
                                <User size="20px" />
                            </template>
                        </navItem>
                    </RouterLink>
                    <RouterLink v-if="false" to="/settings/plan-and-billing">
                        <navItem data="" :hasIcon="true" :label="$t('plan_and_billing')" class="not-vault">
                            <template #icon>
                                <CreditCard size="20px" />
                            </template>
                        </navItem>
                    </RouterLink>
                    <RouterLink to="/settings/security">
                        <navItem data="" :hasIcon="true" :label="$t('security')" class="not-vault">
                            <template #icon>
                                <LockKeyhole size="20px" />
                            </template>
                        </navItem>
                    </RouterLink>
                    <RouterLink to="/settings/devices">
                        <navItem data="" :hasIcon="true" :label="$t('devices')" class="not-vault">
                            <template #icon>
                                <Laptop size="20px" />
                            </template>
                        </navItem>
                    </RouterLink>
                </div>
            </div>
            <div class="w-full lg:min-w-[670px] lg:max-w-[670px] max-w-[unset] flex flex-col gap-[24px] lg:gap-0">
                <div class="relative w-[calc(100vw-20px*2)] block lg:hidden">
                    <div class="w-[unset] flex gap-[24px] py-[4px] px-[20px] my-[-4px] mx-[calc(20px*-1)] overflow-x-auto scrollbar-none">
                        <RouterLink to="/settings/account" class="navItem-Inl">Account</RouterLink>
                        <RouterLink to="/settings/security" class="navItem-Inl">{{ $t('security') }}</RouterLink>
                        <RouterLink to="/settings/devices" class="navItem-Inl">{{ $t('devices') }}</RouterLink>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-[48px]">
                    <section class="w-full flex flex-col gap-[24px]">
                        <div class="w-full">
                            <h2 class="text-white text-3xl font-medium">{{ $t('security') }}</h2>
                        </div>
                        <div class="w-full">
                            <banner :hasIcon="true" :hasActions="false" :message="$t('section_currently_unavailable')">
                                <template #icon>
                                    <LockKeyhole size="20" />
                                </template>
                            </banner>
                        </div>
                    </section>
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
import buttonFl from '../../components/button/button-fl.vue';
import banner from '../../components/banner/banner.vue'

// ICONS
import { Check, User, CreditCard, LockKeyhole, Laptop } from 'lucide-vue-next';

export default {
    name: "Security",
    components: {
        navbar,
        navItem,
        buttonFl,
        banner,

        // ICONS
        Check,
        User,
        CreditCard,
        LockKeyhole,
        Laptop
    },
    data() {
        return {
            store,
            auth,
        }
    },
}
</script>

<style scoped></style>