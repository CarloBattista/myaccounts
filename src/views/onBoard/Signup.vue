<template>
    <div class="w-full h-screen">
        <div class="w-full h-full flex">
            <section class="w-full md:w-[50%] h-full">
                <div
                    class="max-w-[430px] mx-auto h-full pt-[64px] px-[24px] md:pt-0 flex flex-col gap-[48px] items-center md:justify-center text-center">
                    <div class="h-[24px]">
                        <svg class="h-full w-auto" viewBox="0 0 43 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.200195 0.399902H6.2002V24.3999H0.200195V0.399902Z" fill="white" />
                            <path d="M12.2002 0.399902H18.2002V24.3999H12.2002V0.399902Z" fill="white" />
                            <path d="M24.2002 0.399902H30.2002V24.3999H24.2002V0.399902Z" fill="white" />
                            <path d="M42.2002 24.3999H36.2002V6.3999L39.2002 9.3999L42.2002 6.3999V24.3999Z"
                                fill="white" />
                        </svg>
                    </div>
                    <div class="flex flex-col gap-[12px] text-center">
                        <h2 class="text-white text-3xl font-medium">Create your free account</h2>
                        <p class="text-[#989898] text-sm font-normal text-center">Already have an account?
                            <RouterLink to="/identity/login" class="font-semibold">Log in</RouterLink>
                        </p>
                    </div>
                    <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                        <inputField v-model="fields.data.email" type="email" forInput="email" label=""
                            placeholder="Enter email address" :required="true" :error="fields.error.email"
                            class="w-full" />
                        <inputField v-model="fields.data.password" type="password" forInput="password" label=""
                            placeholder="Enter password" :required="true" :error="fields.error.password"
                            class="w-full" />
                        <div v-if="fields.error.general" class="w-full">
                            <p class="w-full px-[4px] text-[#F34822] text-xs font-normal">{{ fields.error.general }}</p>
                        </div>
                        <buttonFl @click="actionSignup" type="primary" size="default" :hasIcon="false"
                            :loading="fields.loading" label="Continue" class="w-full" />
                    </form>
                </div>
            </section>
            <section class="w-[50%] h-full hidden md:block">
                <backgroundLogos />
            </section>
        </div>
    </div>
</template>

<script>
import { supabase } from "../../lib/supabase";
import { auth } from "../../data/auth";

import backgroundLogos from "../../components/global/background-logos.vue";
import inputField from '../../components/input/input-field.vue';
import buttonFl from "../../components/button/button-fl.vue";

export default {
    name: "Signup",
    components: {
        backgroundLogos,
        inputField,
        buttonFl
    },
    data() {
        return {
            auth,

            fields: {
                data: {
                    email: "",
                    password: "",
                },
                error: {
                    email: null,
                    password: null,
                    general: null
                },
                loading: false
            }
        }
    },
    methods: {
        async actionSignup() {
            this.fields.loading = true;

            this.clearErrors();

            if (!this.validateEmail(this.fields.data.email)) {
                this.fields.error.email = "Inserisci un indirizzo email valido";
                this.fields.loading = false;
                return;
            }

            if (!this.fields.data.password) {
                this.fields.error.password = "La password è obbligatoria";
                this.fields.loading = false;
                return;
            }

            try {
                const { data, error } = await supabase.auth.signUp({
                    email: this.fields.data.email,
                    password: this.fields.data.password,
                })

                if (!error) {
                    // console.log(data);

                    const userId = data.user.id;
                    const userEmail = data.user.email;

                    // Clear inputs after login
                    this.fields.data.email = "";
                    this.fields.data.password = "";

                    // Clear errors after login
                    this.clearErrors();
                    await this.createProfile(userId, userEmail);

                    // Push user to login after signup
                    this.$router.push({ name: 'identity-login', params: { id: userId } });
                } else {
                    if (error.code === "email_address_invalid") {
                        this.fields.error.email = "Indirizzo email non valide!";
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.fields.loading = false;
            }
        },
        async createProfile(userId, userEmail) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .insert({ user_id: userId, is_freezed: false, is_subscribed: false, lang: "en", user_email: userEmail })
                    .select('id')

                if (!error) {
                    // console.log(data)
                    const profileId = data[0].id;

                    this.addDeviceInfo(profileId);
                }
            } catch (e) {
                console.error(e);
            }
        },
        async addDeviceInfo(profileId) {
            try {
                const { data, error } = await supabase
                    .from('devices')
                    .insert({
                        city: this.auth.deviceInfo?.city,
                        country: this.auth.deviceInfo?.country,
                        country_code: this.auth.deviceInfo?.country_code,
                        time_zone: this.auth.deviceInfo?.time_zone,
                        ip_address: this.auth.deviceInfo?.ip_address,
                        model: this.auth.deviceInfo?.model,
                        name: this.auth.deviceInfo?.name,
                        os: this.auth.deviceInfo?.os,
                        os_version: this.auth.deviceInfo?.os_version,
                        type: this.auth.deviceInfo?.type,
                        status: this.auth.deviceInfo?.status,
                        user_agent: this.auth.deviceInfo?.user_agent,
                    })
                    .select('id')

                if (!error) {
                    // console.log(data)
                    const deviceId = data[0].id;

                    await this.addDeviceToProfile(profileId, deviceId);
                }
            } catch (e) {
                console.error(e);
            }
        },
        async addDeviceToProfile(profileId, deviceId) {
            try {
                const { data, error } = await supabase
                    .from('profile_devices')
                    .insert({
                        profile_id: profileId,
                        device_id: deviceId,
                    })
                    .select('id')

                if (!error) {
                    // console.log(data);
                }
            } catch (e) {
                console.error(e);
            }
        },

        clearErrors() {
            this.fields.error.email = null;
            this.fields.error.password = null;
            this.fields.error.general = null;
        },
        validateEmail(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        },
    }
}
</script>

<style scoped></style>