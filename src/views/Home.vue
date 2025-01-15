<template>
    <navbar />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <buttonFl type="outline" size="small" :hasIcon="false" label="Create vault" class="w-fit" />
                <div class="flex flex-col gap-[2px]">
                    <navItem @click="selectedVault(vault)" v-for="(vault, vaultIndex) in store.vaults.data" :key="vaultIndex" :data="vault" :hasIcon="true"
                        :label="vault.vaults?.name">
                        <template #icon>
                            <Vault size="20px" />
                        </template>
                    </navItem>
                </div>
            </div>
            <div class="w-full lg:min-w-[670px] lg:max-w-[670px] max-w-[unset] flex flex-col gap-[24px] lg:gap-0">
                <div class="relative w-[calc(100vw-20px*2)] block lg:hidden">
                    <div class="w-[unset] flex gap-[24px] py-[4px] px-[20px] my-[-4px] mx-[calc(20px*-1)] overflow-x-auto scrollbar-none">
                        <div @click="selectedVault(vault)" v-for="(vault, vaultIndex) in store.vaults.data" :key="vaultIndex" class="navItem flex gap-[8px] items-center text-base font-medium whitespace-nowrap cursor-pointer" :class="{ 'selected-vault': store.selectedVault.data.vaults?.id === vault.vaults?.id }">
                            <Vault size="20px" />
                            <span>{{ vault.vaults?.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-[8px]">
                    <div v-if="!store.accounts.data || store.accounts.data.length === 0 && !store.accounts.loading" class="w-full my-6 flex flex-col gap-3 items-center justify-center text-center text-balance text-[#989898] text-base font-normal">
                        <p>There are no accounts in this vault</p>
                        <buttonFl type="secondary" size="small" :hasIcon="false" label="Add account" />
                    </div>
                    <cardAccount v-if="!store.accounts.loading" v-for="(account, accountIndex) in store.accounts.data" :key="accountIndex" :loading="false" :data="account" :index="accountIndex" />
                    <cardAccount v-else-if="store.accounts.loading" v-for="(account, accIndex) in 8" :key="accIndex" :loading="true" :data="account" :index="accIndex" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { supabase } from '../lib/supabase';
import { store } from '../data/store';
import { auth } from '../data/auth';

import navbar from '../components/nav/navbar.vue';
import navItem from '../components/nav/nav-item.vue';
import cardAccount from '../components/card/card-account.vue';
import buttonFl from '../components/button/button-fl.vue';

// ICONS
import { Vault } from 'lucide-vue-next';

export default {
    name: "Home",
    components: {
        navbar,
        navItem,
        cardAccount,
        buttonFl,

        // ICONS
        Vault
    },
    data() {
        return {
            store,
            auth
        }
    },
    methods: {
        async getVaults() {
            this.store.vaults.loading = true;

            try {
                const { data, error } = await supabase
                    .from('profile_vaults')
                    .select('profile_id, vault_id, vaults(*)')
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)

                if (!error) {
                    // console.log(data);
                    this.store.vaults.data = data;

                    this.getSelctedVault();
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.vaults.loading = false;
            }
        },
        async getAccountsFromVault() {
            this.store.accounts.loading = true;

            const vaultId = this.store.selectedVault.vault_id;

            try {
                const { data, error } = await supabase
                    .from('vault_accounts')
                    .select('account_id, vault_id, accounts(*)')
                    .eq('vault_id', vaultId)

                if (!error) {
                    // console.log(data);
                    this.store.accounts.data = data;
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.accounts.loading = false;
            }
        },
        async selectedVault(vault) {
            this.store.selectedVault.loading = true;

            const vaultId = vault.vault_id;

            if (!vaultId) {
                return false;
            }

            try {
                const { data, error } = await supabase
                    .from('profile_vaults')
                    .select('profile_id, vault_id, vaults(*)')
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)
                    .eq('vault_id', vaultId)

                if (!error) {
                    // console.log(data);
                    this.store.selectedVault.data = data[0];
                    this.store.selectedVault.vault_id = vaultId;

                    localStorage.setItem('selected-vault', JSON.stringify(data[0]))
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.selectedVault.loading = false;
            }
        },
        async getSelctedVault() {
            this.store.selectedVault.loading = true;

            const selectedVaultId = localStorage.getItem('selected-vault');
            const parsedValue = JSON.parse(selectedVaultId);
            const vaultId = parsedValue.vaults.id;

            if (!parsedValue) {
                return false;
            }

            try {
                const { data, error } = await supabase
                    .from('profile_vaults')
                    .select('profile_id, vault_id, vaults(*)')
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)
                    .eq('vault_id', vaultId)

                if (!error) {
                    // console.log(data);

                    this.store.selectedVault.data = data[0];
                    this.store.selectedVault.vault_id = vaultId;
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.selectedVault.loading = false;
            }
        }
    },
    watch: {
        'auth.profile': {
            handler(value) {
                if (value) {
                    this.getVaults();
                }
            },
            deep: true
        },
        'store.selectedVault.vault_id': {
            handler(value) {
                this.getAccountsFromVault();
            },
            deep: true
        },
    }
}
</script>

<style scoped>
.navItem {
    color: #8c8c8c;
    padding: 4px 0;
    border-bottom: 2px solid transparent;
}

.navItem:not(.selected-vault):hover {
    color: #fff;
}

.navItem.selected-vault {
    color: #fff;
    border-color: #fff;
}
</style>