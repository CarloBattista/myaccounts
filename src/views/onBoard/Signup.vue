<template>
    <div class="w-full h-screen">
        <div class="w-full h-full flex">
            <section class="w-full h-full">
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
                    <h2 class="text-white text-3xl font-medium">Create your free account</h2>
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
                        <p class="mt-[38px] text-[#989898] text-sm font-normal text-center">Already have an account?
                            <RouterLink to="/identity/login" class="font-semibold">Log in</RouterLink>
                        </p>
                    </form>
                </div>
            </section>
            <section class="w-full h-full hidden md:block bg-red-600"></section>
        </div>
    </div>
</template>

<script>
import { supabase } from "../../lib/supabase";
import { auth } from "../../data/auth";

import inputField from '../../components/input/input-field.vue';
import buttonFl from "../../components/button/button-fl.vue";

export default {
    name: "Signup",
    components: {
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

                if (!error) {
                    // console.log(data)
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