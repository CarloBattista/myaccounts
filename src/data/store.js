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
    }
});