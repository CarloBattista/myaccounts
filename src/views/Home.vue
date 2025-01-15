<template>
    <navbar />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <buttonFl @click="store.modals.createVault.open = !store.modals.createVault.open" type="outline"
                    size="small" :hasIcon="false" label="Create vault" class="w-fit" />
                <div class="flex flex-col gap-[2px]">
                    <navItem @click="selectedVault(vault)" v-for="(vault, vaultIndex) in store.vaults.data"
                        :key="vaultIndex" :data="vault" :hasIcon="true" :label="vault.vaults?.name">
                        <template #icon>
                            <Vault size="20px" />
                        </template>
                    </navItem>
                </div>
            </div>
            <div class="w-full lg:min-w-[670px] lg:max-w-[670px] max-w-[unset] flex flex-col gap-[24px] lg:gap-0">
                <div class="relative w-[calc(100vw-20px*2)] block lg:hidden">
                    <div
                        class="w-[unset] flex gap-[24px] py-[4px] px-[20px] my-[-4px] mx-[calc(20px*-1)] overflow-x-auto scrollbar-none">
                        <buttonFl @click="store.modals.createVault.open = !store.modals.createVault.open" type="outline"
                            size="small" :hasIcon="false" label="Create vault" class="w-fit" />
                        <div @click="selectedVault(vault)" v-for="(vault, vaultIndex) in store.vaults.data"
                            :key="vaultIndex"
                            class="navItem flex gap-[8px] items-center text-base font-medium whitespace-nowrap cursor-pointer"
                            :class="{ 'selected-vault': store.selectedVault.data.vaults?.id === vault.vaults?.id }">
                            <Vault size="20px" />
                            <span>{{ vault.vaults?.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-[8px]">
                    <div v-if="!store.accounts.data || store.accounts.data.length === 0 && !store.accounts.loading"
                        class="w-full my-6 flex flex-col gap-3 items-center justify-center text-center text-balance text-[#989898] text-base font-normal">
                        <p v-if="false">There are no accounts in this vault</p>
                        <p>{{ $t('no_found_accounts') }}</p>
                        <buttonFl type="secondary" size="small" :hasIcon="false" label="Add account" />
                    </div>
                    <cardAccount v-if="!store.accounts.loading" v-for="(account, accountIndex) in store.accounts.data"
                        :key="accountIndex" :loading="false" :data="account" :index="accountIndex" />
                    <cardAccount v-else-if="store.accounts.loading" v-for="(account, accIndex) in 8" :key="accIndex"
                        :loading="true" :data="account" :index="accIndex" />
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL -->
    <Transition name="overlay-modal-fade">
        <div v-if="store.modals.createVault.open || store.modals.editVault.open" @click="closeModal"
            class="fixed z-[99999] top-0 left-0 w-full h-screen bg-black/80"></div>
    </Transition>
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.createVault.open" title="Create a new vault">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.createVault.data.name" type="text" forInput="name" label=""
                        placeholder="Name" :required="true" :error="store.modals.createVault.error.name" />
                    <div v-if="false" class="separator relative mt-6 flex gap-[12px] items-center justify-center">
                        <div class="separator-start"></div>
                        <span class="flex flex-none">Account section</span>
                        <div class="separator-end"></div>
                    </div>
                    <buttonFl @click="createVault" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.createVault.loading" label="Create vault" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.editVault.open" title="Edit vault">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.editVault.data.name" type="text" forInput="name" label=""
                        placeholder="Name" :required="true" :error="store.modals.editVault.error.name" />
                    <div v-if="false" class="separator relative mt-6 flex gap-[12px] items-center justify-center">
                        <div class="separator-start"></div>
                        <span class="flex flex-none">Account section</span>
                        <div class="separator-end"></div>
                    </div>
                    <buttonFl @click="createVault" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.editVault.loading" label="Create vault" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
</template>

<script>
import { supabase } from '../lib/supabase';
import { store } from '../data/store';
import { auth } from '../data/auth';

import navbar from '../components/nav/navbar.vue';
import navItem from '../components/nav/nav-item.vue';
import cardAccount from '../components/card/card-account.vue';
import buttonFl from '../components/button/button-fl.vue';
import modalCreate from '../components/modal/modal-create.vue';
import inputField from '../components/input/input-field.vue';

// ICONS
import { Vault } from 'lucide-vue-next';
import { data } from 'autoprefixer';

export default {
    name: "Home",
    components: {
        navbar,
        navItem,
        cardAccount,
        buttonFl,
        modalCreate,
        inputField,

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

            if (!this.auth.user && !this.auth.profile) {
                this.$router.push({ name: 'identity-login' });
                this.store.modals.createVault.loading = false;
                return this.store.modals.createVault.loading = false;
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
        },
        async createVault() {
            this.store.modals.createVault.loading = true;

            if (!this.store.modals.createVault.data.name) {
                this.store.modals.createVault.error.name = "The name is required.";
                this.store.modals.createVault.loading = false;
                return this.store.modals.createVault.loading = false;
            }

            if (!this.auth.user && !this.auth.profile) {
                this.$router.push({ name: 'identity-login' });
                this.store.modals.createVault.loading = false;
                return this.store.modals.createVault.loading = false;
            }

            const fieldData = this.store.modals.createVault.data;

            try {
                const { data, error } = await supabase
                    .from('vaults')
                    .insert({
                        name: fieldData.name,
                        username: fieldData.username,
                        email: fieldData.email,
                        password: fieldData.password,
                        description: fieldData.description
                    })
                    .select('id')

                if (!error) {
                    // console.log(data)
                    const vaultId = data[0].id;

                    await this.addVaultToProfile(vaultId);
                    await this.getVaults();

                    const newVault = this.store.vaults.data.find(vault => vault.vault_id === vaultId);

                    if (newVault) {
                        this.selectedVault(newVault);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        },
        async addVaultToProfile(vaultId) {
            if (!this.store.modals.createVault.data.name) {
                this.store.modals.createVault.error.name = "The name is required.";
                this.store.modals.createVault.loading = false;
            }

            try {
                const { data, error } = await supabase
                    .from('profile_vaults')
                    .insert({ profile_id: this.auth.PROFILE_AUTH_ID, vault_id: vaultId })
                    .select('vault_id')

                if (!error) {
                    // console.log(data);
                    const vaultIdCreated = data[0].vault_id;

                    this.store.selectedVault.vault_id = vaultIdCreated;
                    this.store.modals.createVault.open = false;
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.modals.createVault.loading = false;
            }
        },

        closeModal() {
            if (this.store.modals.createVault.open) {
                this.store.modals.createVault.open = false;
            }

            if (this.store.modals.editVault.open) {
                this.store.modals.editVault.open = false;
            }
        },
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
        'store.vaults.data': {
            handler(value) {
                if (!Array.isArray(value) || value.length === 0) {
                    return;
                }

                const selectedVaultId = localStorage.getItem('selected-vault');

                if (!selectedVaultId) {
                    this.selectedVault(value[0]);
                    return;
                }

                let parsedValue;
                try {
                    parsedValue = JSON.parse(selectedVaultId);
                } catch (e) {
                    this.selectedVault(value[0]);
                    return;
                }

                const vaultId = parsedValue?.vaults?.id;

                if (!vaultId) {
                    console.log("Formato non valido per il vault selezionato.");
                    this.selectedVault(value[0]);
                    return;
                }

                const exist = value.find(vault => vault.vault_id === vaultId);

                if (exist) {
                    console.log("Ho trovato il vault selezionato.");
                } else {
                    console.log("Vault selezionato non trovato, seleziono il primo disponibile.");
                    this.selectedVault(value[0]);
                }
            },
            deep: true
        }
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