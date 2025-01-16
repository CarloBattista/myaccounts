<template>
    <div @click="toggleProfileMenu" ref="profileMenu" class="relative">
        <div class="avatar-dot relative aspect-square rounded-full flex items-center justify-center bg-[#2E2E2E] text-white"
            :class="'avatar-' + size, { 'cursor-pointer': hasInputFile || hasProfileMenu }">
            <span class="name-initial w-full flex items-center justify-center text-center font-semibold uppercase">{{
                auth.profile?.first_name ? auth.profile?.first_name?.charAt(0) : auth.user?.email?.charAt(0) }}</span>
        </div>
        <Transition name="fade">
            <div v-if="hasProfileMenu && profileMenuIsOpen"
                class="profileMenu-container absolute z-[999] top-[calc(100%+20px)] right-0 w-[240px] min-h-[200px] rounded-[20px] shadow-lg">
                <section class="w-full p-[8px]">
                    <div class="w-full pt-[8px] px-[10px] flex flex-col gap-[10px]">
                        <div class="flex flex-col">
                            <h2 class="text-white text-base font-medium">{{ auth.profile?.first_name }} {{
                                auth.profile?.last_name }}</h2>
                            <h3 class="text-[#989898] text-sm font-normal">{{ auth.user?.email }}</h3>
                        </div>
                        <buttonFl type="tertiary" :disabled="false" :loading="false" label="Set up profile"
                            class="h-[36px] text-sm" />
                        <buttonFl v-if="!auth.profile?.is_subscribed" type="secondary" :disabled="false" :loading="false" label="Get pro"
                            class="h-[36px] text-sm" />
                    </div>
                </section>
                <div class="w-full h-[1px] mt-[8px] bg-white/10"></div>
                <section class="w-full p-[8px]">
                    <div
                        class="w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center text-sm font-medium bg-transparent hover:bg-white/10 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            class="text-[#989898] w-[20px] h-[20px]" data-sentry-element="svg"
                            data-sentry-component="SettingsIcon" data-sentry-source-file="SettingsIcon.tsx">
                            <title>settings icon</title>
                            <path
                                d="M10.001 1L10 5M10.001 19V15M19 10.0015H15M1 10.0015H5M16.3652 3.63772L13.5029 6.5M3.63772 16.3652L6.50294 13.5M16.3652 16.3652L13.5 13.5M3.63772 3.63772L6.5 6.5"
                                stroke="currentColor" stroke-width="2" stroke-miterlimit="10"
                                vector-effect="non-scaling-stroke" data-sentry-element="path"
                                data-sentry-source-file="SettingsIcon.tsx"></path>
                            <circle cx="10" cy="10" r="5" stroke="currentColor" stroke-width="2"
                                vector-effect="non-scaling-stroke" data-sentry-element="circle"
                                data-sentry-source-file="SettingsIcon.tsx"></circle>
                        </svg>
                        <span>Settings</span>
                    </div>
                </section>
                <div class="w-full h-[1px] bg-white/10"></div>
                <section class="w-full p-[8px]">
                    <div @click="actionLogout"
                        class="w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center text-sm font-medium bg-transparent hover:bg-white/10 cursor-pointer">
                        <span>Log out</span>
                    </div>
                </section>
                <div class="w-full h-[1px] bg-white/10"></div>
                <section class="w-full p-[8px]">
                    <div class="w-full h-[36px] px-[8px] flex items-center justify-between">
                        <div class="flex gap-[8px] items-center justify-start">
                            <a href="#" target="_blank"
                                class="text-xs font-medium pb-[2px] border-transparent border-b border-solid cursor-pointer text-[#989898] hover:text-white hover:border-white transition-colors duration-150">Privacy</a>
                            <a href="#" target="_blank"
                                class="text-xs font-medium pb-[2px] border-transparent border-b border-solid cursor-pointer text-[#989898] hover:text-white hover:border-white transition-colors duration-150">Terms</a>
                            <a href="#" target="_blank"
                                class="text-xs font-medium pb-[2px] border-transparent border-b border-solid cursor-pointer text-[#989898] hover:text-white hover:border-white transition-colors duration-150">Copyright</a>
                        </div>
                        <div class="flex items-center justify-end"></div>
                    </div>
                </section>
            </div>
        </Transition>
    </div>
</template>

<script>
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import buttonFl from '../button/button-fl.vue';

export default {
    name: "avatar",
    components: {
        buttonFl
    },
    props: {
        size: String,
        hasInputFile: Boolean,
        hasProfileMenu: Boolean,
    },
    data() {
        return {
            auth,
            store,

            profileMenuIsOpen: false,
        }
    },
    methods: {
        async actionLogout() {
            try {
                const { error } = await supabase.auth.signOut()

                if (!error) {
                    this.auth.user = null;
                    this.auth.session = null;
                    this.auth.profile = null;
                    this.auth.isAuthenticated = false;
                    this.auth.PROFILE_AUTH_ID = null;

                    localStorage.removeItem('selected-vault');

                    this.$router.push({ name: 'identity-login' });
                }
            } catch (e) {
                console.error(e);
            }
        },

        toggleProfileMenu() {
            this.profileMenuIsOpen = !this.profileMenuIsOpen;
        },
        handleClickOutside(event) {
            const profileMenu = this.$refs.profileMenu;

            if (this.profileMenuIsOpen && profileMenu && !profileMenu.contains(event.target)) {
                this.profileMenuIsOpen = false;
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeMount() {
        document.removeEventListener("click", this.handleClickOutside);
    }
}
</script>

<style scoped>
.avatar-dot.avatar-small {
    font-size: 1rem;
    /* 16px */
    line-height: 1.5rem;
    /* 24px */
    height: 36px;
}

.avatar-dot.avatar-large {
    font-size: 1.125rem;
    /* 18px */
    line-height: 1.75rem;
    /* 28px */
    height: 72px;
}

.avatar-dot.avatar-extra-large {
    font-size: 1.5rem;
    /* 24px */
    line-height: 2rem;
    /* 32px */
    height: 96px;
}

.avatar-dot.avatar-big {
    font-size: 1.875rem;
    /* 30px */
    line-height: 2.25rem;
    /* 36px */
    height: 120px;
}

.profileMenu-container {
    background-color: rgba(38, 38, 38, .9);
    backdrop-filter: blur(24px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>