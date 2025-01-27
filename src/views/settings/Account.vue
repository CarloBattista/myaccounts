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
                    <div
                        class="w-[unset] flex gap-[24px] py-[4px] px-[20px] my-[-4px] mx-[calc(20px*-1)] overflow-x-auto scrollbar-none">
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
                            <p class="text-[#989898] text-xs font-medium">{{ auth.user?.new_email ? auth.user?.new_email : auth.user?.email }}</p>
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
                    <section class="w-full flex flex-col gap-[16px]">
                        <h2 class="text-white text-xl font-medium">{{ $t('personal_details') }}</h2>
                        <div class="w-full flex flex-col">
                            <div class="w-full py-[14px] flex gap-[16px] items-start justify-between border-b border-solid border-white/20 last:border-transparent"
                                :class="{ 'h-[70px] md:h-[72px]': !dataField.data.full_name.open, 'h-[unset] md:h-[unset]': dataField.data.full_name.open }">
                                <div class="flex flex-col gap-[24px] grow">
                                    <div class="w-full">
                                        <h2 class="text-white text-base font-medium truncate">{{
                                            dataField.data.full_name.open ?
                                                'Edit name' : 'Name' }}</h2>
                                        <h3 v-if="!dataField.data.full_name.open"
                                            class="text-[#989898] text-sm font-normal truncate">{{
                                                auth.profile?.first_name }} {{
                                                auth.profile?.last_name }}</h3>
                                        <h3 v-else class="text-[#989898] text-sm font-normal truncate">This will be
                                            visible on your
                                            profile and for your other team members if you’re in a team</h3>
                                    </div>
                                    <div v-if="dataField.data.full_name.open" class="w-full grow">
                                        <form @submit.prevent class="w-full flex flex-col gap-[24px]">
                                            <div class="w-full flex gap-[16px] items-start">
                                                <inputField v-model="dataField.data.full_name.data.first_name"
                                                    type="text" forInput="firstName" label="First name" placeholder=""
                                                    :required="true" :error="dataField.data.full_name.error.first_name"
                                                    class="w-full" />
                                                <inputField v-model="dataField.data.full_name.data.last_name"
                                                    type="text" forInput="lastName" label="Last name" placeholder=""
                                                    :required="true" :error="dataField.data.full_name.error.last_name"
                                                    class="w-full" />
                                            </div>
                                            <buttonFl @click="actionUpdateName" type="primary" size="default"
                                                :hasIcon="false" :loading="dataField.data.full_name.loading"
                                                :label="$t('save')" class="w-fit" />
                                        </form>
                                    </div>
                                </div>
                                <button @click="dataField.data.full_name.open = !dataField.data.full_name.open"
                                    class="text-white text-sm font-medium hover:underline cursor-pointer">{{
                                        dataField.data.full_name.open ? 'Cancel' : 'Edit' }}</button>
                            </div>
                            <div class="w-full py-[14px] flex gap-[16px] items-start justify-between border-b border-solid border-white/20 last:border-transparent"
                                :class="{ 'h-[70px] md:h-[72px]': !dataField.data.email.open, 'h-[unset] md:h-[unset]': dataField.data.email.open }">
                                <div class="flex flex-col gap-[24px] grow">
                                    <div class="w-full">
                                        <h2 class="text-white text-base font-medium truncate">{{ dataField.data.email.open ? 'Edit email address' : 'Email address' }}</h2>
                                        <h3 v-if="!dataField.data.email.open"
                                            class="text-[#989898] text-sm font-normal truncate">{{ auth.user?.new_email ? auth.user?.new_email : auth.user?.email }}</h3>
                                        <h3 v-else class="text-[#989898] text-sm font-normal truncate">This will be used
                                            for logging
                                            in and account recovery.
                                        </h3>
                                    </div>
                                    <div v-if="dataField.data.email.open" class="w-full grow">
                                        <form @submit.prevent class="w-full flex flex-col gap-[24px]">
                                            <inputField v-model="dataField.data.email.data.email" type="email"
                                                forInput="firstName" label="Email address" placeholder=""
                                                :required="true" :error="dataField.data.email.error.email" />
                                            <buttonFl @click="actionUpdateEmail" type="primary" size="default"
                                                :hasIcon="false" :loading="dataField.data.full_name.loading"
                                                :label="$t('save')" class="w-fit" />
                                        </form>
                                    </div>
                                </div>
                                <button @click="dataField.data.email.open = !dataField.data.email.open"
                                    class="text-white text-sm font-medium hover:underline cursor-pointer">{{
                                        dataField.data.email.open ? 'Cancel' : 'Edit' }}</button>
                            </div>
                            <div class="w-full py-[14px] flex gap-[16px] items-start justify-between border-b border-solid border-white/20 last:border-transparent"
                                :class="{ 'h-[70px] md:h-[72px]': !dataField.data.password.open, 'h-[unset] md:h-[unset]': dataField.data.password.open }">
                                <div class="flex flex-col gap-[24px] grow">
                                    <div class="w-full">
                                        <h2 class="text-white text-base font-medium truncate">{{
                                            dataField.data.password.open ?
                                            'Edit password' : 'Password' }}</h2>
                                        <h3 v-if="!dataField.data.password.open"
                                            class="text-[#989898] text-sm font-normal truncate">••••••••••••</h3>
                                        <h3 v-else class="text-[#989898] text-sm font-normal truncate">Password needs to
                                            be 8
                                            characters and contain at least one alphabet and one number.</h3>
                                    </div>
                                    <div v-if="dataField.data.password.open" class="w-full grow">
                                        <form @submit.prevent class="w-full flex flex-col gap-[24px]">
                                            <div class="w-full flex gap-[16px] items-start">
                                                <inputField v-model="dataField.data.password.data.password" type="password"
                                                    forInput="password" label="New password"
                                                    placeholder="Enter password" :required="true"
                                                    :error="dataField.data.password.error.password" class="w-full" />
                                                <inputField v-model="dataField.data.password.data.confirm_password"
                                                    type="password" forInput="confirmPassword" label="Repeat password"
                                                    placeholder="Repeat password" :required="true"
                                                    :error="dataField.data.password.error.confirm_password"
                                                    class="w-full" />
                                            </div>
                                            <buttonFl @click="actionUpdatePassword" type="primary" size="default" :hasIcon="false"
                                                :loading="dataField.data.password.loading" :label="$t('save')"
                                                class="w-fit" />
                                        </form>
                                    </div>
                                </div>
                                <button @click="dataField.data.password.open = !dataField.data.password.open"
                                    class="text-white text-sm font-medium hover:underline cursor-pointer">{{
                                        dataField.data.email.open ? 'Cancel' : 'Edit' }}</button>
                            </div>
                        </div>
                    </section>
                    <section class="w-full pb-[48px] flex flex-col gap-[16px]">
                        <h2 class="text-white text-xl font-medium">{{ $t('manage_account') }}</h2>
                        <div class="w-full flex flex-col">
                            <div
                                class="w-full h-[70px] md:h-[72px] py-[14px] flex gap-[16px] items-start justify-between border-b border-solid border-white/20 last:border-transparent">
                                <div class="flex flex-col gap-[24px] grow">
                                    <div class="w-full">
                                        <h2 class="text-white text-base font-medium truncate">{{ $t('delete_account') }}</h2>
                                        <h3 class="text-[#989898] text-sm font-normal truncate">{{ $t('description_delete_account') }}</h3>
                                    </div>
                                </div>
                                <button @click="auth.deleteAccount.open = !auth.deleteAccount.open"
                                    class="text-[#F34822] text-sm font-medium hover:underline cursor-pointer">Delete</button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>

    <!-- OVERLAY -->
    <Transition name="overlay-modal-fade">
        <div v-if="auth.deleteAccount.open" @click="auth.deleteAccount.open = false" class="fixed z-[99999] top-0 left-0 w-full h-screen bg-black/80"></div>
    </Transition>

    <!-- MODAL DELETE ACCOUNT -->
    <Transition name="modal-fade">
        <modalDelete v-if="auth.deleteAccount.open" :head="$t('you_sure')" :paragraph="$t('alert_deleting_account')">
            <template #footer>
                <buttonFl @click="auth.deleteAccount.open = false" type="outline" size="default" :hasIcon="false" :loading="false" :label="$t('cancel')" class="w-full" />
                <buttonFl type="outline" size="default" :hasIcon="false" :loading="false" :label="$t('delete_account')" class="w-full danger" />
            </template>
        </modalDelete>
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
import inputField from '../../components/input/input-field.vue';
import modalDelete from '../../components/modal/modal-delete.vue'

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
        inputField,
        modalDelete,

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

            dataField: {
                data: {
                    full_name: {
                        open: false,
                        data: {
                            first_name: null,
                            last_name: null
                        },
                        oldData: {
                            first_name: null,
                            last_name: null
                        },
                        error: {
                            first_name: null,
                            last_name: null
                        },
                        loading: false,
                    },
                    email: {
                        open: false,
                        data: {
                            email: null
                        },
                        oldData: {
                            email: null
                        },
                        error: {
                            email: null
                        },
                        loading: false,
                    },
                    password: {
                        open: false,
                        data: {
                            password: null,
                            confirm_password: null
                        },
                        error: {
                            password: null,
                            confirm_password: null
                        },
                        loading: false,
                    },
                },
                loading: false
            }
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
        async actionUpdateName() {
            const dataField = this.dataField.data.full_name.data;

            this.dataField.data.full_name.loading = true;

            if (this.dataField.data.full_name.oldData.first_name === dataField.first_name && this.dataField.data.full_name.oldData.last_name === dataField.last_name) {
                this.dataField.data.full_name.loading = false;
                this.dataField.data.full_name.open = false;
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ first_name: dataField.first_name, last_name: dataField.last_name })
                    .eq('id', this.auth.PROFILE_AUTH_ID)

                if (!error) {
                    // console.log(data);

                    this.$emit('profile-updated');

                    this.store.toast.open = true;
                    this.store.toast.message = "Your name has been updated.";

                    this.dataField.data.full_name.open = false;
                }
            } catch (e) {
                console.error(e);
                this.dataField.data.full_name.open = false;
            } finally {
                this.dataField.data.full_name.loading = false;
            }
        },
        async actionUpdateEmail() {
            const dataField = this.dataField.data.email.data;

            this.dataField.data.email.loading = true;

            if (this.dataField.data.email.oldData.email === dataField.email) {
                this.dataField.data.email.loading = false;
                this.dataField.data.email.open = false;
                return;
            }

            try {
                const { data, error } = await supabase.auth.updateUser({
                    email: dataField.email
                })

                if (!error) {
                    // console.log(data);

                    this.$emit('profile-updated');

                    this.store.toast.open = true;
                    this.store.toast.message = "Your email has been updated.";

                    this.dataField.data.email.open = false;
                }
            } catch (e) {
                console.error(e);
                this.dataField.data.email.open = false;
            } finally {
                this.dataField.data.email.loading = false;
            }
        },
        async actionUpdatePassword() {
            const dataField = this.dataField.data.password.data;

            this.dataField.data.password.error.password = null;
            this.dataField.data.password.error.confirm_password = null;

            this.dataField.data.password.loading = true;

            if (!dataField.password && !dataField.confirm_password) {
                this.dataField.data.password.loading = false;
                this.dataField.data.password.error.password = "Password and password confirmation are required";
                return;
            }

            if (dataField.password !== dataField.confirm_password) {
                this.dataField.data.password.loading = false;
                this.dataField.data.password.error.password = "Passwords are different";
                return;
            }

            const passwordError = this.validatePassword(dataField.password);

            if (passwordError) {
                this.dataField.data.password.error.password = passwordError;
                this.dataField.data.password.loading = false;
                return;
            }

            try {
                const { data, error } = await supabase.auth.updateUser({
                    password: dataField.password
                })

                if (!error) {
                    // console.log(data);

                    this.$emit('profile-updated');

                    this.store.toast.open = true;
                    this.store.toast.message = "Your password has been updated.";

                    this.dataField.data.password.open = false;
                }
            } catch (e) {
                console.error(e);
                this.dataField.data.password.open = false;
            } finally {
                this.dataField.data.password.loading = false;
            }
        },

        validatePassword(password) {
            const minLength = 8;
            const hasLetter = /[a-zA-Z]/.test(password);
            const hasNumber = /\d/.test(password);

            if (password.length < minLength) {
                return "Password must be at least 8 characters long.";
            }
            if (!hasLetter) {
                return "Password must contain at least one letter.";
            }
            if (!hasNumber) {
                return "Password must contain at least one number.";
            }
            return null;
        },
    },
    watch: {
        'auth.lang': {
            handler(value) {
                this.handleLang();
            },
            deep: true
        },
        'auth.profile': {
            handler(value) {
                if (value?.first_name && value?.last_name) {
                    this.dataField.data.full_name.data.first_name = value?.first_name;
                    this.dataField.data.full_name.data.last_name = value?.last_name;

                    this.dataField.data.full_name.oldData.first_name = value?.first_name;
                    this.dataField.data.full_name.oldData.last_name = value?.last_name;
                }
            },
            immediate: true,
            deep: true
        },
        'auth.user': {
            handler(value) {
                this.dataField.data.email.data.email = null;
                this.dataField.data.email.oldData.email = null;

                if (value?.new_email) {
                    this.dataField.data.email.data.email = value?.new_email;

                    this.dataField.data.email.oldData.email = value?.new_email;
                }
            },
            immediate: true,
            deep: true
        },
    }
}
</script>

<style scoped></style>