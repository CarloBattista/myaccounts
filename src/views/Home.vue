<template>
    <navbar />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <buttonFl @click="store.modals.createVault.open = !store.modals.createVault.open" type="outline"
                    size="small" :hasIcon="false" label="Create vault" class="w-fit" />
                <div class="flex flex-col gap-[2px]">
                    <navItem @click="selectedVault(vault)"
                        @contextmenu.prevent="showContextMenu($event, vault, 'vault')"
                        v-for="(vault, vaultIndex) in store.vaults.data" :key="vaultIndex" :data="vault" :hasIcon="true"
                        :label="vault.vaults?.name">
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
                        <div @click="selectedVault(vault)"
                            @contextmenu.prevent="showContextMenu($event, vault, 'vault')"
                            v-for="(vault, vaultIndex) in store.vaults.data" :key="vaultIndex"
                            class="navItem flex gap-[8px] items-center text-base font-medium whitespace-nowrap cursor-pointer"
                            :class="{ 'selected-vault': store.selectedVault.data.vaults?.id === vault.vaults?.id }">
                            <Vault size="20px" />
                            <span>{{ vault.vaults?.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-[8px]">
                    <div v-if="!store.accounts.data || store.accounts.data.length === 0 && !store.accounts.loading && store.vaults.data.length >= 1"
                        class="w-full my-6 flex flex-col gap-3 items-center justify-center text-center text-balance text-[#989898] text-base font-normal">
                        <p>{{ $t('no_found_accounts') }}</p>
                        <buttonFl @click="store.modals.createAccount.open = !store.modals.createAccount.open"
                            type="secondary" size="small" :hasIcon="false" label="Add account" />
                    </div>
                    <div v-else-if="!store.vaults.data || store.vaults.data.length === 0 && !store.vaults.loading"
                        class="w-full my-6 flex flex-col gap-3 items-center justify-center text-center text-balance text-[#989898] text-base font-normal">
                        <p>Non ci sono vault in questo profilo</p>
                    </div>
                    <cardAccount v-if="!store.accounts.loading"
                        @contextmenu.prevent="showContextMenu($event, account, 'account')"
                        v-for="(account, accountIndex) in store.accounts.data" :key="accountIndex" :loading="false"
                        :data="account" :index="accountIndex" />
                    <cardAccount v-else-if="store.accounts.loading" v-for="(account, accIndex) in 8" :key="accIndex"
                        :loading="true" :data="account" :index="accIndex" />
                </div>
            </div>
        </div>
    </div>

    <!--  -->
    <Transition name="overlay-modal-fade">
        <div v-if="store.modals.createVault.open || store.modals.editVault.open || store.modals.deleteVault.open || store.modals.createAccount.open || store.modals.editAccount.open || store.modals.deleteAccount.open"
            @click="closeModal" class="fixed z-[99999] top-0 left-0 w-full h-screen bg-black/80"></div>
    </Transition>
    <!-- MODAL VAULT -->
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
                    <buttonFl @click="editVault" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.editVault.loading" label="Save" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalDelete v-if="store.modals.deleteVault.open" head="Are you sure?"
            paragraph="Deleting the vault is permanent and irreversible. You will lose all accounts within it.">
            <template #footer>
                <buttonFl @click="closeModal" type="outline" size="default" :hasIcon="false" :loading="false"
                    label="Cancel" class="w-full" />
                <buttonFl @click="deleteVaultFromProfile" type="outline" size="default" :hasIcon="false"
                    :loading="false" label="Delete vault" class="w-full danger" />
            </template>
        </modalDelete>
    </Transition>

    <!-- MODAL ACCOUNT -->
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.createAccount.open" title="Add a new account">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.createAccount.data.name" type="text" forInput="name" label=""
                        placeholder="Name" :required="true" :error="store.modals.createAccount.error.name" />
                    <dropdown label="Select the vault where you want to place the account"
                        :selected="store.modals.createAccount.data.vault_name_selected">
                        <template #inner>
                            <div @click="selectVaultForCreateAccount(vault)"
                                v-for="(vault, vaultIndex) in store.vaults.data" :key="vaultIndex"
                                class="w-full h-[36px] rounded-[10px] flex items-center bg-transparent hover:bg-white/10 cursor-pointer"
                                :class="{ 'bg-white/20': vault.vault_id === store.modals.createAccount.data.vault_id }">
                                <div class="h-full aspect-square flex items-center justify-center">
                                    <Check v-if="vault.vault_id === store.modals.createAccount.data.vault_id"
                                        size="20" />
                                </div>
                                <span>{{ vault.vaults?.name }}</span>
                            </div>
                        </template>
                    </dropdown>
                    <div class="separator relative mt-6 flex gap-[12px] items-center justify-center">
                        <div class="separator-start"></div>
                        <span class="flex flex-none">Account section</span>
                        <div class="separator-end"></div>
                    </div>
                    <div v-if="store.modals.createAccount.fields.username" class="flex gap-[12px] items-center">
                        <inputField v-model="store.modals.createAccount.data.username" type="text" forInput="username"
                            label="" placeholder="Username" :required="true"
                            :error="store.modals.createAccount.error.username" class="w-full" />
                        <div @click="store.modals.createAccount.fields.username = false"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div v-if="store.modals.createAccount.fields.email" class="flex gap-[12px] items-center">
                        <inputField v-model="store.modals.createAccount.data.email" type="email" forInput="email"
                            label="" placeholder="Email" :required="true"
                            :error="store.modals.createAccount.error.email" class="w-full" />
                        <div @click="store.modals.createAccount.fields.email = false"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div v-if="store.modals.createAccount.fields.password" class="flex gap-[12px] items-center">
                        <inputField v-model="store.modals.createAccount.data.password" type="password"
                            forInput="password" label="" placeholder="Password" :required="true"
                            :error="store.modals.createAccount.error.password" class="w-full" />
                        <div @click="store.modals.createAccount.fields.password = false"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div @contextmenu.prevent="showContextMenu($event, null, 'create-account-add-element')"
                        class="w-full h-[48px] px-[16px] py-[12px] rounded-[16px] border border-dashed text-base font-medium text-[#989898] border-[#7C7C7C] bg-[#2E2E2E] hover:bg-white/15 hover:border-white cursor-pointer transition-all duration-150">
                        <span>Add element</span>
                    </div>
                    <buttonFl @click="createAccount" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.createAccount.loading" label="Add" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.editAccount.open" title="Edit account">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.editAccount.data.name" type="text" forInput="name" label=""
                        placeholder="Name" :required="true" :error="store.modals.editAccount.error.name" />
                    <buttonFl @click="editAccount" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.editAccount.loading" label="Save" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalDelete v-if="store.modals.deleteAccount.open" head="Are you sure?"
            paragraph="Deleting your account is permanent and irreversible. You will lose all information in it.">
            <template #footer>
                <buttonFl @click="closeModal" type="outline" size="default" :hasIcon="false" :loading="false"
                    label="Cancel" class="w-full" />
                <buttonFl @click="deleteAccountFromVault" type="outline" size="default" :hasIcon="false"
                    :loading="false" label="Delete account" class="w-full danger" />
            </template>
        </modalDelete>
    </Transition>

    <!-- CONTEXT MENU -->
    <Transition name="contextmenu-fade">
        <contextMenu v-if="store.contextMenu.open"
            :style="{ top: `${store.contextMenu.y}px`, left: `${store.contextMenu.x}px` }">
            <template #inner>

                <div v-if="store.contextMenu.type === 'vault'">
                    <div @click="openModalEditVault"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Pencil size="20" />
                        <span>Edit vault</span>
                    </div>
                    <div @click="openModalDeleteVault"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Trash2 size="20" />
                        <span>Delete vault</span>
                    </div>
                </div>
                <div v-if="store.contextMenu.type === 'account'">
                    <div @click="openModalEditAccount"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Pencil size="20" />
                        <span>Edit account</span>
                    </div>
                    <div @click="openModalDeleteAccount"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Trash2 size="20" />
                        <span>Delete account</span>
                    </div>
                </div>
                <div v-if="store.contextMenu.type === 'create-account-add-element'">
                    <div @click="store.modals.createAccount.fields.username = !store.modals.createAccount.fields.username"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.createAccount.fields.username }">
                        <Plus v-if="!store.modals.createAccount.fields.username" size="20" />
                        <Minus v-else size="20" />
                        <span>Username</span>
                    </div>
                    <div @click="store.modals.createAccount.fields.email = !store.modals.createAccount.fields.email"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.createAccount.fields.email }">
                        <Plus v-if="!store.modals.createAccount.fields.email" size="20" />
                        <Minus v-else size="20" />
                        <span>Email</span>
                    </div>
                    <div @click="store.modals.createAccount.fields.password = !store.modals.createAccount.fields.password"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.createAccount.fields.password }">
                        <Plus v-if="!store.modals.createAccount.fields.password" size="20" />
                        <Minus v-else size="20" />
                        <span>Password</span>
                    </div>
                    <div @click="store.modals.createAccount.fields.description = !store.modals.createAccount.fields.description"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.createAccount.fields.description }">
                        <Plus v-if="!store.modals.createAccount.fields.description" size="20" />
                        <Minus v-else size="20" />
                        <span>Description</span>
                    </div>
                </div>

            </template>
        </contextMenu>
    </Transition>
</template>

<script>
import { supabase } from '../lib/supabase';
import { auth } from '../data/auth';
import { store } from '../data/store';

import navbar from '../components/nav/navbar.vue';
import navItem from '../components/nav/nav-item.vue';
import cardAccount from '../components/card/card-account.vue';
import buttonFl from '../components/button/button-fl.vue';
import modalCreate from '../components/modal/modal-create.vue';
import modalDelete from '../components/modal/modal-delete.vue';
import inputField from '../components/input/input-field.vue';
import contextMenu from '../components/menu/context-menu.vue';
import dropdown from '../components/dropdown/dropdown.vue';

// ICONS
import { Vault, Pencil, Trash2, Plus, Minus, Check } from 'lucide-vue-next';

export default {
    name: "Home",
    components: {
        navbar,
        navItem,
        cardAccount,
        buttonFl,
        modalCreate,
        modalDelete,
        inputField,
        contextMenu,
        dropdown,

        // ICONS
        Vault,
        Pencil,
        Trash2,
        Plus,
        Minus,
        Check
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
                return this.store.selectedVault.loading = false;
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

            if (!parsedValue && !vaultId) {
                return this.store.selectedVault.loading = false;
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

            if (!this.auth.PROFILE_AUTH_ID) {
                this.store.modals.createVault.error.name = "General error.";
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
        async editVault() {
            this.store.modals.editVault.loading = true;

            if (!this.store.modals.editVault.data.name) {
                this.store.modals.editVault.error.name = "The name is required.";
                this.store.modals.editVault.loading = false;
                return this.store.modals.editVault.loading = false;
            }

            if (this.store.modals.editVault.data.name === this.store.contextMenu.data.vaults.name) {
                this.store.modals.editVault.loading = false;
                return this.store.modals.editVault.loading = false;
            }

            const fieldData = this.store.modals.editVault.data;

            try {
                const { data, error } = await supabase
                    .from('vaults')
                    .update({ name: fieldData.name })
                    .eq('id', fieldData.id)

                if (!error) {
                    // console.log(data)

                    await this.getVaults();
                    this.closeContextMenu();
                    this.store.modals.editVault.open = false;
                }
            } catch (e) {
                console.error(e);
                this.store.modals.editVault.open = false;
            } finally {
                this.store.modals.editVault.loading = false;
            }
        },
        async deleteVaultFromProfile() {
            this.store.modals.deleteVault.loading = true;

            const fieldData = this.store.modals.deleteVault.data;

            try {
                // Prima otteniamo tutti gli account_id associati al vault
                const { data: accountsData, error: fetchError } = await supabase
                    .from('vault_accounts')
                    .select('account_id')
                    .eq('vault_id', fieldData.vault_id);

                if (fetchError) {
                    console.error('Errore durante il recupero degli account:', fetchError);
                    return;
                }

                // Eliminiamo le associazioni dalla tabella vault_accounts
                const { error: vaultAccountsError } = await supabase
                    .from('vault_accounts')
                    .delete()
                    .eq('vault_id', fieldData.vault_id);

                if (vaultAccountsError) {
                    console.error('Errore durante l\'eliminazione delle associazioni account:', vaultAccountsError);
                    return;
                }

                // Eliminiamo gli account dalla tabella accounts
                if (accountsData && accountsData.length > 0) {
                    const accountIds = accountsData.map(acc => acc.account_id);
                    const { error: accountsError } = await supabase
                        .from('accounts')
                        .delete()
                        .in('id', accountIds);

                    if (accountsError) {
                        console.error('Errore durante l\'eliminazione degli account:', accountsError);
                        return;
                    }
                }

                // Poi eliminiamo l'associazione tra profilo e vault
                const { error: profileVaultError } = await supabase
                    .from('profile_vaults')
                    .delete()
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)
                    .eq('vault_id', fieldData.vault_id);

                if (!profileVaultError) {
                    this.deleteVault(fieldData);
                    await this.getVaults();
                }
            } catch (e) {
                console.error(e);
                this.store.modals.editVault.open = false;
            }
        },
        async deleteVault(fieldData) {
            try {
                const { data, error } = await supabase
                    .from('vaults')
                    .delete()
                    .eq('id', fieldData.vault_id)

                if (!error) {
                    // console.log(data);

                    await this.getVaults();
                    this.closeContextMenu();
                    this.store.modals.deleteVault.open = false;
                }
            } catch (e) {
                console.error(e);
                this.store.modals.editVault.open = false;
            } finally {
                this.store.modals.deleteVault.loading = true;
            }
        },
        async createAccount() {
            this.store.modals.createAccount.loading = true;

            const fieldData = this.store.modals.createAccount.data;

            try {
                const { data, error } = await supabase
                    .from('accounts')
                    .insert({
                        account_image: fieldData?.account_image,
                        name: fieldData.name,
                        username: fieldData.username,
                        email: fieldData.email,
                        password: fieldData.password,
                        description: fieldData.description,
                        website_url: fieldData.website_url,
                    })
                    .select('id')

                if (!error) {
                    // console.log(data);
                    const accountId = data[0].id;

                    await this.addAccountToVault(accountId);
                }
            } catch (e) {
                console.error(e);
            }
        },
        async addAccountToVault(accountId) {
            const selected_vault = this.store.modals.createAccount.data.vault_id;

            try {
                const { data, error } = await supabase
                    .from('vault_accounts')
                    .insert({ vault_id: selected_vault, account_id: accountId })
                    .single()

                if (!error) {
                    // console.log(data);

                    await this.getAccountsFromVault();

                    this.store.modals.createAccount.open = false;
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.modals.createAccount.loading = false;
            }
        },
        async deleteAccountFromVault() {
            this.store.modals.deleteAccount.loading = true;

            const fieldData = this.store.modals.deleteAccount.data;

            try {
                const { data, error } = await supabase
                    .from('vault_accounts')
                    .delete()
                    .eq('vault_id', fieldData.vault_id)
                    .eq('account_id', fieldData.account_id)

                if (!error) {
                    // console.log(data);
                    this.deleteAccount(fieldData);
                }
            } catch (e) {
                console.error(e);
                this.store.modals.deleteAccount.open = false;
            }
        },
        async deleteAccount(fieldData) {
            try {
                const { data, error } = await supabase
                    .from('accounts')
                    .delete()
                    .eq('id', fieldData.account_id)

                if (!error) {
                    //console.log(data);

                    await this.getAccountsFromVault();
                    this.closeContextMenu();
                    this.store.modals.deleteAccount.open = false;
                }
            } catch (e) {
                console.error(e);
                this.store.modals.deleteAccount.open = false;
            } finally {
                this.store.modals.deleteAccount.loading = false;
            }
        },
        async selectVaultForCreateAccount(vault) {
            const vaultId = vault.vault_id;

            if (vaultId === this.store.modals.createAccount.data.vault_id) {
                return false;
            }

            try {
                const { data, error } = await supabase
                    .from('profile_vaults')
                    .select('profile_id, vault_id, vaults(name)')
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)
                    .eq('vault_id', vaultId)
                    .single()

                if (!error) {
                    // console.log(data);

                    this.store.modals.createAccount.data.vault_id = data.vault_id;
                    this.store.modals.createAccount.data.vault_name_selected = data.vaults.name;
                }
            } catch (e) {
                console.error(e);
            }
        },
        async setVaultOnDropdown() {
            const selectedVaultId = localStorage.getItem('selected-vault');
            const parsedValue = JSON.parse(selectedVaultId);
            const vaultId = parsedValue.vaults.id;

            if (!vaultId && !this.store.modals.createAccount.data.vault_id) {
                return false;
            }

            try {
                const { data, error } = await supabase
                    .from('profile_vaults')
                    .select('profile_id, vault_id, vaults(name)')
                    .eq('profile_id', this.auth.PROFILE_AUTH_ID)
                    .eq('vault_id', vaultId)
                    .single()

                if (!error) {
                    // console.log(data);

                    this.store.modals.createAccount.data.vault_id = data.vault_id;
                    this.store.modals.createAccount.data.vault_name_selected = data.vaults.name;
                }
            } catch (e) {
                console.error(e);
            }
        },

        closeModal() {
            if (this.store.modals.createVault.open) {
                this.store.modals.createVault.open = false;
            }

            if (this.store.modals.editVault.open) {
                this.store.modals.editVault.open = false;
            }

            if (this.store.modals.deleteVault.open) {
                this.store.modals.deleteVault.open = false;
            }

            if (this.store.modals.createAccount.open) {
                this.store.modals.createAccount.open = false;
            }

            if (this.store.modals.editAccount.open) {
                this.store.modals.editAccount.open = false;
            }

            if (this.store.modals.deleteAccount.open) {
                this.store.modals.deleteAccount.open = false;
            }
        },
        showContextMenu(event, data, type) {
            event.preventDefault();
            this.store.contextMenu.type = type;
            this.store.contextMenu.open = true;
            this.store.contextMenu.x = event.clientX;
            this.store.contextMenu.y = event.clientY;
            this.store.contextMenu.data = data;
        },
        closeContextMenu() {
            this.store.contextMenu.open = false;
            this.store.contextMenu.x = 0;
            this.store.contextMenu.y = 0;
            this.store.contextMenu.data = null;
        },
        openModalEditVault() {
            this.store.modals.editVault.open = !this.store.modals.editVault.open;

            this.store.modals.editVault.data.name = this.store.contextMenu?.data?.vaults.name;
            this.store.modals.editVault.data.id = this.store.contextMenu?.data?.vaults.id;

            this.store.contextMenu.open = false;
            this.store.contextMenu.x = 0;
            this.store.contextMenu.y = 0;
        },
        openModalDeleteVault() {
            this.store.modals.deleteVault.open = !this.store.modals.deleteVault.open;

            this.store.modals.deleteVault.data = this.store.contextMenu.data;

            this.store.contextMenu.open = false;
            this.store.contextMenu.x = 0;
            this.store.contextMenu.y = 0;
        },
        openModalEditAccount() {
            this.store.modals.editAccount.open = !this.store.modals.editAccount.open;

            this.store.modals.editAccount.data.id = this.store.contextMenu?.data?.accounts.id;
            this.store.modals.editAccount.data.name = this.store.contextMenu?.data?.accounts.name;
            this.store.modals.editAccount.data.username = this.store.contextMenu?.data?.accounts.username;
            this.store.modals.editAccount.data.email = this.store.contextMenu?.data?.accounts.email;
            this.store.modals.editAccount.data.password = this.store.contextMenu?.data?.accounts.password;
            this.store.modals.editAccount.data.description = this.store.contextMenu?.data?.accounts.description;
            this.store.modals.editAccount.data.website_url = this.store.contextMenu?.data?.accounts.website_url;

            this.store.contextMenu.open = false;
            this.store.contextMenu.x = 0;
            this.store.contextMenu.y = 0;
        },
        openModalDeleteAccount() {
            this.store.modals.deleteAccount.open = !this.store.modals.deleteAccount.open;

            this.store.modals.deleteAccount.data = this.store.contextMenu.data;

            this.store.contextMenu.open = false;
            this.store.contextMenu.x = 0;
            this.store.contextMenu.y = 0;
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
        },
        'store.modals.createAccount': {
            handler(value) {
                if (!value.open) {
                    value.data.name = null;
                }

                if (!value.fields.username) {
                    value.data.username = null;
                }

                if (!value.fields.email) {
                    value.data.email = null;
                }

                if (!value.fields.password) {
                    value.data.password = null;
                }

                if (!value.fields.description) {
                    value.data.description = null;
                }
            },
            immediate: true,
            deep: true
        },
        'store.modals.createAccount': {
            handler(value) {
                if (!value.data.vault_id) {
                    this.setVaultOnDropdown();
                }

                if (!value.open) {
                    value.data.vault_id = null;
                }
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