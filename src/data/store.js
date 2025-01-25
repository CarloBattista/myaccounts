import { reactive } from "vue";

export const store = reactive({
    vaults: {
        data: [],
        error: null,
        loading: false
    },
    accounts: {
        data: [],
        error: null,
        loading: false
    },
    selectedVault: {
        data: {},
        vault_id: null,
        error: null,
        loading: false
    },

    modals: {
        // VAULT
        createVault: {
            open: false,
            data: {
                name: null,
            },
            error: {
                name: null,
            },
            loading: false
        },
        editVault: {
            open: false,
            data: {
                id: null,
                name: null,
            },
            error: {
                name: null,
            },
            loading: false
        },
        deleteVault: {
            open: false,
            data: {},
            error: null,
            loading: false
        },

        // ACCOUNT
        createAccount: {
            open: false,
            data: {
                vault_id: null,
                vault_name_selected: null,
                name: null,
                username: null,
                email: null,
                password: null,
                description: null,
                website_url: null,
                account_image: null
            },
            error: {
                vault_id: null,
                name: null,
                username: null,
                email: null,
                password: null,
                description: null,
                website_url: null
            },
            fields: {
                name: true,
                username: false,
                email: true,
                password: false,
                description: false,
                website_url: false
            },
            loading: false
        },
        editAccount: {
            open: false,
            data: {
                vault_id: null,
                vault_name_selected: null,
                id: null,
                name: null,
                username: null,
                email: null,
                password: null,
                description: null,
                website_url: null,
                account_image: null
            },
            error: {
                name: null,
                username: null,
                email: null,
                password: null,
                description: null,
                website_url: null
            },
            fields: {
                name: false,
                username: false,
                email: false,
                password: false,
                description: false,
                website_url: false
            },
            loading: false
        },
        deleteAccount: {
            open: false,
            data: {},
            error: null,
            loading: false
        },

        selectedAccount: {
            open: false,
            data: {},
            error: null,
            loading: false
        },

        // PROFILE
        completeProfile: {
            open: false,
            data: {
                first_name: null,
                last_name: null,
            },
            error: {
                first_name: null,
                last_name: null,
            },
            loading: false
        },

        account_image: null
    },

    contextMenu: {
        type: null,
        open: false,
        x: 0,
        y: 0,
        data: null
    },

    toast: {
        open: false,
        type: "success",
        hasIcon: true,
        message: null,
        error: null,
        loading: false
    }
});