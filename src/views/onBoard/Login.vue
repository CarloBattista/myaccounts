<template>
    <form @submit.prevent class="flex flex-col gap-2">
        <input v-model="fields.data.email" type="email" placeholder="Email" required class="bg-white text-black">
        <input v-model="fields.data.password" type="password" placeholder="Password" required class="bg-white text-black">
        <button @click="actionLogin" type="submit">Login</button>
    </form>
</template>

<script>
import { supabase } from "../../lib/supabase";
import { auth } from "../../data/auth";

export default {
    name: "Login",
    data() {
        return {
            auth,

            fields: {
                data: {
                    email: "carlitobatti@gmail.com",
                    password: "carlo1234",
                },
                error: null,
                loading: false
            }
        }
    },
    methods: {
        async actionLogin() {
            this.fields.loading = true;

            try {
                const { data, session, error } = await supabase.auth.signInWithPassword({
                    email: this.fields.data.email,
                    password: this.fields.data.password,
                })

                if (!error) {
                    // console.log(data);
                    this.auth.user = data.user;
                    this.auth.session = data.session;
                    this.auth.isAuthenticated = true;
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.fields.loading = false;
            }
        }
    }
}
</script>

<style scoped></style>