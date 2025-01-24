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
                        <p class="text-[#989898] text-sm font-normal text-balance">
                            We sent a temporary login code to {{ fields.data?.email }} <br>
                            <RouterLink to="/identity/login" class="font-normal underline cursor-pointer">Not you?
                            </RouterLink>
                        </p>
                    </div>
                    <a href="https://mail.google.com/mail/" target="_blank">
                        <buttonFl type="outline" size="default" :hasIcon="true" :loading="fields.loading"
                            label="Open mail box">
                            <template #icon>
                                <Mail size="16" />
                            </template>
                        </buttonFl>
                    </a>
                    <RouterLink to="/identity/login" class="w-full">
                        <buttonFl type="outline" size="default" :hasIcon="false" :loading="fields.loading" label="Back"
                            class="w-full" />
                    </RouterLink>
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

// ICONS
import { Mail } from 'lucide-vue-next'

export default {
    name: "ForgotPassword",
    components: {
        backgroundLogos,
        inputField,
        buttonFl,

        // ICONS
        Mail
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
                    general: null
                },
                loading: false
            },
            codeInputs: Array(6).fill("")
        }
    },
    methods: {
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

                    this.sendCode();
                }
            } catch (e) {
                console.error(e);
            }
        },
        async sendCode() {
            try {
                const { data, error } = await supabase.auth.signInWithOtp({
                    email: this.fields.data.email,
                    options: {
                        emailRedirectTo: 'http://localhost:5173/'
                    }
                })

                if (!error) {
                    console.log(data)
                }
            } catch (e) {
                console.error(e);
            }
        },

        focusNext(index) {
            const input = this.$refs.inputs[index];
            const nextInput = this.$refs.inputs[index + 1];

            // Passa al prossimo input solo se il valore è stato inserito
            if (input.value.length === 1 && nextInput) {
                nextInput.focus();
            }
        },
        focusPrevious(index, event) {
            const input = this.$refs.inputs[index];
            const prevInput = this.$refs.inputs[index - 1];

            // Torna indietro solo se il valore è vuoto e si preme Backspace
            if (event.key === 'Backspace' && input.value === '' && prevInput) {
                prevInput.focus();
            }
        },
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
    }
}
</script>

<style scoped></style>