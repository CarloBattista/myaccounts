<template>
    <navbar :inHeroPlatform="false" />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <div class="flex flex-col gap-[2px]">
                    <RouterLink to="/settings/account">
                        <navItem data="" :hasIcon="true" label="Account" class="not-vault">
                            <template #icon>
                                <User size="20px" />
                            </template>
                        </navItem>
                    </RouterLink>
                    <RouterLink to="/settings/plan-and-billing">
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
                </div>
            </div>
            <div class="w-full lg:min-w-[670px] lg:max-w-[670px] max-w-[unset] flex flex-col gap-[24px] lg:gap-0">
                <div class="relative w-[calc(100vw-20px*2)]"></div>
                <div class="w-[unset] flex gap-[24px] py-[4px] px-[20px] my-[-4px] mx-[calc(20px*-1)] overflow-x-auto scrollbar-none">
                </div>
                <div class="w-full flex flex-col gap-[48px]">
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
</template>

<script>
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import navbar from '../../components/nav/navbar.vue';
import navItem from '../../components/nav/nav-item.vue';
import avatar from '../../components/avatar/avatar.vue';
import dropdown from '../../components/dropdown/dropdown.vue';

// ICONS
import { Check } from 'lucide-vue-next';

export default {
    name: "Account",
    components: {
        navbar,
        navItem,
        avatar,
        dropdown,

        // ICONS
        Check
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