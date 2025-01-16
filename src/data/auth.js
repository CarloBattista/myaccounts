import { reactive } from "vue";

export const auth = reactive({
    user: null,
    session: null,
    profile: null,
    isAuthenticated: false,

    PROFILE_AUTH_ID: null,

    lang: "en",
});