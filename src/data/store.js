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
    },

    contextMenu: {
        open: false,
        x: 0,
        y: 0,
        data: null
    }
});