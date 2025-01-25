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
                    <banner v-if="!auth.PROFILE_COMPLETE"
                        @click="store.modals.completeProfile.open = !store.modals.completeProfile.open" :hasIcon="true"
                        :hasActions="true" message="Your profile is not complete.">
                        <template #icon>
                            <LockKeyhole size="20" />
                        </template>
                        <template #actions>
                            <buttonFl type="primary" size="small" :hasIcon="false" label="Complete Now" />
                        </template>
                    </banner>
                    <section class="w-full flex flex-col gap-[24px]">
                        <avatar size="big" :hasInputFile="true" :hasProfileMenu="false" />
                        <div class="flex flex-col gap-[4px]">
                            <h2 class="text-white text-3xl font-medium truncate">{{ auth.profile?.first_name }} {{
                                auth.profile?.last_name }}</h2>
                            <p class="text-[#989898] text-xs font-medium">{{ auth.user?.email }}</p>
                        </div>
                    </section>
                    <section>
                        <dropdown :label="$t('select_language')" :selected="getLang" :error="null">
                            <template #inner>
                                <div @click="auth.lang = 'en'"
                                    class="w-full h-[36px] rounded-[10px] flex items-center bg-transparent hover:bg-white/10 cursor-pointer"
                                    :class="{ 'bg-white/20': auth.lang === 'en' }">
                                    <div class="h-full aspect-square flex items-center justify-center">
                                        <Check v-if="auth.lang === 'en'" size="20" />
                                    </div>
                                    <span>English</span>
                                </div>
                                <div @click="auth.lang = 'it'"
                                    class="w-full h-[36px] rounded-[10px] flex items-center bg-transparent hover:bg-white/10 cursor-pointer"
                                    :class="{ 'bg-white/20': auth.lang === 'it' }">
                                    <div class="h-full aspect-square flex items-center justify-center">
                                        <Check v-if="auth.lang === 'it'" size="20" />
                                    </div>
                                    <span>Italiano</span>
                                </div>
                            </template>
                        </dropdown>
                    </section>
                </div>
            </div>
        </div>
    </div>

    <!-- OVERLAY -->
    <Transition name="overlay-modal-fade">
        <div v-if="store.modals.completeProfile.open && !this.auth.PROFILE_COMPLETE" @click="store.modals.completeProfile.open = false"
            class="fixed z-[99999] top-0 left-0 w-full h-screen bg-black/80"></div>
    </Transition>

    <!-- MODAL PROFILE -->
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.completeProfile.open && !this.auth.PROFILE_COMPLETE" :title="$t('head_create_new_account')">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.completeProfile.data.first_name" type="text" forInput="firstName"
                        label="" placeholder="First name" :required="true"
                        :error="store.modals.completeProfile.error.first_name" />
                    <inputField v-model="store.modals.completeProfile.data.last_name" type="text" forInput="lastName"
                        label="" placeholder="Last name" :required="true"
                        :error="store.modals.completeProfile.error.last_name" />
                    <buttonFl @click="completeProfile" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.completeProfile.loading" :label="$t('save')" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
</template>

<script>
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import navbar from '../../components/nav/navbar.vue';
import navItem from '../../components/nav/nav-item.vue';
import avatar from '../../components/avatar/avatar.vue';
import dropdown from '../../components/dropdown/dropdown.vue';
import buttonFl from '../../components/button/button-fl.vue';
import banner from '../../components/banner/banner.vue';
import modalCreate from '../../components/modal/modal-create.vue';
import inputField from '../../components/input/input-field.vue';

// ICONS
import { Check, User, CreditCard, LockKeyhole, Laptop } from 'lucide-vue-next';

export default {
    name: "Account",
    components: {
        navbar,
        navItem,
        avatar,
        dropdown,
        buttonFl,
        banner,
        modalCreate,
        inputField,

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
    computed: {
        getLang() {
            if (this.auth.lang === 'en') {
                return "Inglese"
            } else if (this.auth.lang === 'it') {
                return "Italiano"
            }
        }
    },
    methods: {
        async handleLang() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ lang: auth.lang })
                    .eq('id', this.auth.PROFILE_AUTH_ID)

                if (!error) {
                    // console.log(data);

                    this.$i18n.locale = auth.lang;
                    this.store.toast.open = true;
                    this.store.toast.message = this.$t('change_language');
                }
            } catch (e) {
                console.error(e);
            }
        },
        async completeProfile() {
            this.store.modals.completeProfile.loading = true;

            const fieldData = this.store.modals.completeProfile.data;

            if (this.auth.PROFILE_COMPLETE) {
                this.store.modals.completeProfile.open = false;
                this.store.modals.completeProfile.loading = false;
                return;
            }

            if (!fieldData.first_name || !fieldData.last_name) {
                this.store.modals.completeProfile.error.first_name = "Il nome è obbligatorio.";
                this.store.modals.completeProfile.error.last_name = "Il cognome è obbligatorio.";
                this.store.modals.completeProfile.loading = false;
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ first_name: fieldData?.first_name, last_name: fieldData?.last_name })
                    .eq('id', this.auth.PROFILE_AUTH_ID)

                if (!error) {
                    // console.log(data);

                    this.$emit("profile-completed");
                    this.store.modals.completeProfile.open = false;
                    this.store.modals.completeProfile.data.first_name = null;
                    this.store.modals.completeProfile.data.last_name = null;
                    this.store.modals.completeProfile.error.first_name = null;
                    this.store.modals.completeProfile.error.last_name = null;
                }
            } catch (e) {
                console.error(e);
                this.store.modals.completeProfile.open = false;
            } finally {
                this.store.modals.completeProfile.loading = false;
            }
        }
    },
    watch: {
        'auth.lang': {
            handler(value) {
                this.handleLang();
            },
            deep: true
        },
    }
}
</script>

<style scoped></style>