import { reactive } from "vue";

export const auth = reactive({
    user: null,
    session: null,
    profile: null,
    isAuthenticated: false,

    PROFILE_AUTH_ID: null,
    PROFILE_COMPLETE: true,

    devices: {
        data: [],
        error: null,
        loading: false
    },

    deviceInfo: {
        city: "",
        country: "",
        country_code: "",
        time_zone: "",
        ip_address: "",
        model: "",
        name: "",
        os: "",
        os_version: "",
        type: "",
        status: "",
        user_agent: ""
    },

    lang: "en",
});