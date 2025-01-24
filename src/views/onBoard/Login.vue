<template>
    <div class="w-full h-screen">
        <div class="w-full h-full flex">
            <section class="w-full md:w-[50%] h-full">
                <div
                    class="max-w-[430px] mx-auto h-full pt-[64px] px-[24px] md:pt-0 flex flex-col gap-[48px] items-center md:justify-center">
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
                        <h2 class="text-white text-3xl font-medium">Welcome back</h2>
                        <p class="text-[#989898] text-sm font-normal text-center">Don't have an account?
                            <RouterLink to="/identity/signup" class="font-semibold">Create one</RouterLink>
                        </p>
                    </div>
                    <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                        <inputField v-model="fields.data.email" type="email" forInput="email" label=""
                            placeholder="Enter email address" :required="true" :error="fields.error.email"
                            class="w-full" />
                        <inputField v-model="fields.data.password" ref="passwordInput" type="password"
                            forInput="password" label="" placeholder="Enter password" :required="true"
                            :error="fields.error.password" class="w-full" />
                        <div v-if="fields.error.general" class="w-full">
                            <p class="w-full px-[4px] text-[#F34822] text-xs font-normal">{{ fields.error.general }}</p>
                        </div>
                        <buttonFl @click="actionLogin" type="primary" size="default" :hasIcon="false"
                            :loading="fields.loading" label="Continue" class="w-full" />
                        <div class="text-center h-[24px]">
                            <button @click="goForgotPassword" v-if="fields.data.email" type="button"
                                class="text-white text-sm font-medium underline">Forgot your password?</button>
                        </div>
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
    name: "Login",
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
                    userId: null,
                    email: "",
                    password: "",
                },
                error: {
                    email: null,
                    password: null,
                    general: null,
                    hidden: null
                },
                loading: false
            }
        }
    },
    methods: {
        async actionLogin() {
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
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: this.fields.data.email,
                    password: this.fields.data.password,
                })

                if (!error) {
                    // console.log(data);
                    this.auth.user = data.user;
                    this.auth.session = data.session;
                    this.auth.isAuthenticated = true;

                    // Clear inputs after login
                    this.fields.data.email = "";
                    this.fields.data.password = "";

                    // Clear errors after login
                    this.clearErrors();

                    // Push user to home after login
                    this.$router.push({ name: 'home' });
                } else {
                    if (error.code === "invalid_credentials") {
                        this.fields.error.general = "Credenziali non valide!";
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.fields.loading = false;
            }
        },
        async getEmail() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('user_email')
                    .eq('user_id', this.fields.data.userId)
                    .single()

                if (!error) {
                    // console.log(data);
                    this.fields.data.email = data?.user_email;
                }
            } catch (e) {
                console.error(e);
            }
        },
        async checkEmail() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_email', this.fields.data.email)
                    .single()

                if (!error) {
                    // console.log(data);

                    if (data.user_id) {
                        this.fields.data.userId = data.user_id;
                        this.fields.error.hidden = null;
                    } else {
                        this.fields.data.userId = null;
                        this.fields.error.hidden = "email_not_search";
                    }
                } else {
                    this.fields.data.userId = null;
                    this.fields.error.hidden = "email_not_search";
                }
            } catch (e) {
                console.error(e);
            }
        },

        debounce(func, delay) {
            // Funzione di debounce
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(func, delay);
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
        goForgotPassword() {
            this.fields.loading = true;

            if (!this.fields.data.email || !this.validateEmail(this.fields.data.email) || !this.fields.data.userId || this.fields.error.hidden === "email_not_search") {
                this.fields.error.email = "Inserisci un indirizzo email valido o esistente";
                this.fields.loading = false;
                return;
            }

            try {
                this.$router.push({ name: 'forgot-password', params: { id: this.fields.data?.userId } });
            } catch (e) {
                console.error(e);
            } finally {
                this.fields.loading = false;
            }
        }
    },
    watch: {
        '$route.params.id': {
            handler(value) {
                if (value) {
                    this.fields.data.userId = value;
                    this.getEmail();
                } else {
                    this.fields.data.userId = null;
                }
            },
            immediate: true,
            deep: true
        },
        'fields.data.email': {
            handler(value) {
                if (value) {
                    // Utilizza la funzione di debounce
                    this.debounce(() => this.checkEmail(), 500);
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style scoped></style>