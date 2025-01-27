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
                            <h2 class="text-white text-3xl font-medium">{{ $t('manage_devices') }}</h2>
                        </div>
                        <div class="w-full">
                            <banner :hasIcon="true" :hasActions="false" :message="$t('section_currently_unavailable')">
                                <template #icon>
                                    <LockKeyhole size="20" />
                                </template>
                            </banner>
                        </div>
                        <div v-if="false" class="w-full grid grid-cols-1 md:grid-cols-2">
                            <div v-for="(device, deviceIndex) in auth.devices.data" :key="deviceIndex"
                                class="w-full min-h-[150px] rounded-[24px] p-[12px] bg-[#2E2E2E]">
                                <div class="w-full flex gap-[12px] items-center justify-start">
                                    <div class="relative h-[32px] aspect-square flex items-center justify-center">
                                        <LaptopMinimal v-if="device.devices?.type === 'Desktop'" size="24" />
                                        <Smartphone v-if="device.devices?.type === 'Phone'" size="24" />
                                        <Tablet v-if="device.devices?.type === 'Tablet'" size="24" />
                                    </div>
                                    <span class="text-white text-xl font-medium">{{ device.devices?.type }} - {{
                                        device.devices?.name }}</span>
                                </div>
                                <div class="w-full py-[12px] flex flex-col gap-[6px]">
                                    <div class="w-full flex gap-[8px] items-center text-[#989898] text-sm">
                                        <div class="h-[20px] aspect-square flex items-center justify-center">
                                            <Clock size="16" />
                                        </div>
                                        <span>{{ formatDate(device.devices?.updated_at) }}</span>
                                    </div>
                                    <div class="w-full flex gap-[8px] items-center text-[#989898] text-sm">
                                        <div class="h-[20px] aspect-square flex items-center justify-center">
                                            <MapPin size="16" />
                                        </div>
                                        <span>{{ device.devices?.country === "IT" ? "Italia" : device.devices?.country
                                            }}</span>
                                    </div>
                                </div>
                                <div class="w-full mt-[24px]">
                                    <buttonFl @click="exitDevice(device)" type="outline" size="default" :hasIcon="false" :label="$t('exit')"
                                        class="w-full" />
                                </div>
                            </div>
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

import dayjs from 'dayjs';
import 'dayjs/locale/it';

import navbar from '../../components/nav/navbar.vue';
import navItem from '../../components/nav/nav-item.vue';
import buttonFl from '../../components/button/button-fl.vue';
import banner from '../../components/banner/banner.vue';

// ICONS
import { Check, User, CreditCard, LockKeyhole, Laptop, LaptopMinimal, Smartphone, Tablet, Clock, MapPin } from 'lucide-vue-next';

export default {
    name: "Devices",
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
        Laptop,
        LaptopMinimal,
        Smartphone,
        Tablet,
        Clock,
        MapPin
    },
    data() {
        return {
            store,
            auth,
        }
    },
    methods: {
        async getDevices() {
            return;

            if (!this.auth.PROFILE_AUTH_ID) {
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profile_devices')
                    .select('profile_id, device_id, devices(*)')
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)

                if (!error) {
                    // console.log(data)
                    this.auth.devices.data = data;
                }
            } catch (e) {
                console.error(e);
            }
        },

        formatDate(dateString) {
            const locale = localStorage.getItem('locale');

            if (locale) {
                dayjs.locale(locale);
            }

            return dayjs(dateString).format('DD MMM YYYY · HH:mm');
        },
    },
    watch: {
        'auth.PROFILE_AUTH_ID': {
            handler(value) {
                this.getDevices();
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style scoped></style>