<template>
    <navbar :logo="true" :firstAction="store.vaults.data.length >= 1" :secondAction="true" :profile="true" :authenticated="auth.isAuthenticated" />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen grid lg:grid-cols-[1fr,auto,minmax(auto,1fr)]">
            <div class="w-full max-w-[320px] hidden lg:flex flex-col gap-[8px]">
                <buttonFl @click="openModalCreateVault" type="outline" size="small" :hasIcon="false"
                    :disabled="!auth.profile?.is_subscribed && store.vaults.data.length >= 3" :label="$t('create_vault')"
                    class="w-fit" />
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
                            type="secondary" size="small" :hasIcon="false" :label="$t('add_account')" />
                    </div>
                    <div v-else-if="!store.vaults.data || store.vaults.data.length === 0 && !store.vaults.loading"
                        class="w-full my-6 flex flex-col gap-3 items-center justify-center text-center text-balance text-[#989898] text-base font-normal">
                        <p>{{ $t('no_found_vaults_this_profile') }}</p>
                    </div>
                    <cardAccount v-if="!store.accounts.loading"
                        @contextmenu.prevent="showContextMenu($event, account, 'account')"
                        @dblclick="handleAccount(account)" v-for="(account, accountIndex) in store.accounts.data"
                        :key="accountIndex" :loading="false" :data="account" :index="accountIndex" />
                    <cardAccount v-else-if="store.accounts.loading" v-for="(account, accIndex) in 8" :key="accIndex"
                        :loading="true" :data="account" :index="accIndex" />
                </div>
            </div>
        </div>
    </div>

    <!-- OVERLAY -->
    <Transition name="overlay-modal-fade">
        <div v-if="store.modals.createVault.open || store.modals.editVault.open || store.modals.deleteVault.open || store.modals.selectedAccount.open || store.modals.createAccount.open || store.modals.editAccount.open || store.modals.deleteAccount.open"
            @click="closeModal" class="fixed z-[99999] top-0 left-0 w-full h-screen bg-black/80"></div>
    </Transition>
    <!-- MODAL VAULT -->
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.createVault.open" :title="$t('head_create_new_vault')">
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
                        :loading="store.modals.createVault.loading" :label="$t('create_vault')" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.editVault.open" :title="$t('head_edit_vault')">
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
                        :loading="store.modals.editVault.loading" :label="$t('save')" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalDelete v-if="store.modals.deleteVault.open" :head="$t('you_sure')"
            :paragraph="$t('delete_vault_message_alert')">
            <template #footer>
                <buttonFl @click="closeModal" type="outline" size="default" :hasIcon="false" :loading="false"
                    :label="$t('cancel')" class="w-full" />
                <buttonFl @click="deleteVaultFromProfile" type="outline" size="default" :hasIcon="false"
                    :loading="false" :label="$t('delete_vault')" class="w-full danger" />
            </template>
        </modalDelete>
    </Transition>

    <!-- MODAL ACCOUNT -->
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.createAccount.open" :title="$t('head_create_new_account')">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.createAccount.data.name" type="text" forInput="name" label=""
                        placeholder="Name" :required="true" :error="store.modals.createAccount.error.name" />
                    <dropdown :label="$t('select_vault_where_you_want_place_account')"
                        :selected="store.modals.createAccount.data.vault_name_selected"
                        :error="store.modals.createAccount.error.vault_id">
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
                        <span class="flex flex-none">{{ $t('account_section') }}</span>
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
                    <div v-if="store.modals.createAccount.fields.website_url" class="flex gap-[12px] items-center">
                        <inputField @input="websiteImage($event, store.modals.createAccount)"
                            v-model="store.modals.createAccount.data.website_url" type="text" forInput="websiteUrl"
                            label="" placeholder="Website" :required="true"
                            :error="store.modals.createAccount.error.website_url" class="w-full" />
                        <div @click="clearField('website_url')"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div @contextmenu.prevent="showContextMenu($event, null, 'create-account-add-element')"
                        class="w-full h-[48px] px-[16px] py-[12px] rounded-[16px] border border-dashed text-base font-medium text-[#989898] border-[#7C7C7C] bg-[#2E2E2E] hover:bg-white/15 hover:border-white cursor-pointer transition-all duration-150">
                        <span>{{ $t('add_element') }}</span>
                    </div>
                    <buttonFl @click="createAccount" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.createAccount.loading" :label="$t('add')" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.editAccount.open" :title="$t('edit_account')">
            <template #inner>
                <form @submit.prevent class="w-full flex flex-col gap-[16px]">
                    <inputField v-model="store.modals.editAccount.data.name" type="text" forInput="name" label=""
                        placeholder="Name" :required="true" :error="store.modals.editAccount.error.name" />
                    <dropdown :label="$t('select_vault_where_you_want_place_account')"
                        :selected="store.modals.editAccount.data.vault_name_selected"
                        :error="store.modals.editAccount.error.vault_id">
                        <template #inner>
                            <div @click="selectVaultForEditAccount(vault)"
                                v-for="(vault, vaultIndex) in store.vaults.data" :key="vaultIndex"
                                class="w-full h-[36px] rounded-[10px] flex items-center bg-transparent hover:bg-white/10 cursor-pointer"
                                :class="{ 'bg-white/20': vault.vault_id === store.modals.editAccount.data.vault_id }">
                                <div class="h-full aspect-square flex items-center justify-center">
                                    <Check v-if="vault.vault_id === store.modals.editAccount.data.vault_id" size="20" />
                                </div>
                                <span>{{ vault.vaults?.name }}</span>
                            </div>
                        </template>
                    </dropdown>
                    <div class="separator relative mt-6 flex gap-[12px] items-center justify-center">
                        <div class="separator-start"></div>
                        <span class="flex flex-none">{{ $t('account_section') }}</span>
                        <div class="separator-end"></div>
                    </div>
                    <div v-if="store.modals.editAccount.fields.username" class="flex gap-[12px] items-center">
                        <inputField v-model="store.modals.editAccount.data.username" type="text" forInput="username"
                            label="" placeholder="Username" :required="true"
                            :error="store.modals.editAccount.error.username" class="w-full" />
                        <div @click="clearField('username')"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div v-if="store.modals.editAccount.fields.email" class="flex gap-[12px] items-center">
                        <inputField v-model="store.modals.editAccount.data.email" type="email" forInput="email" label=""
                            placeholder="Email" :required="true" :error="store.modals.editAccount.error.email"
                            class="w-full" />
                        <div @click="clearField('email')"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div v-if="store.modals.editAccount.fields.password" class="flex gap-[12px] items-center">
                        <inputField v-model="store.modals.editAccount.data.password" type="password" forInput="password"
                            label="" placeholder="Password" :required="true"
                            :error="store.modals.editAccount.error.password" class="w-full" />
                        <div @click="clearField('password')"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div v-if="store.modals.editAccount.fields.website_url" class="flex gap-[12px] items-center">
                        <inputField @input="websiteImage($event, store.modals.editAccount)"
                            v-model="store.modals.editAccount.data.website_url" type="text" forInput="websiteUrl"
                            label="" placeholder="Website" :required="true"
                            :error="store.modals.editAccount.error.website_url" class="w-full" />
                        <div @click="clearField('website_url')"
                            class="h-[48px] aspect-square rounded-[16px] border border-dashed border-[#7C7C7C] text-[#989898] bg-[#2E2E2E] hover:border-[#F34822] hover:text-[#F34822] hover:bg-[#F34822]/20 opacity-70 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-150">
                            <Trash2 size="20" />
                        </div>
                    </div>
                    <div @contextmenu.prevent="showContextMenu($event, null, 'edit-account-add-element')"
                        class="w-full h-[48px] px-[16px] py-[12px] rounded-[16px] border border-dashed text-base font-medium text-[#989898] border-[#7C7C7C] bg-[#2E2E2E] hover:bg-white/15 hover:border-white cursor-pointer transition-all duration-150">
                        <span>{{ $t('add_element') }}</span>
                    </div>
                    <buttonFl @click="editAccount" type="primary" size="default" :hasIcon="false"
                        :loading="store.modals.editAccount.loading" :label="$t('save')" class="w-full" />
                </form>
            </template>
        </modalCreate>
    </Transition>
    <Transition name="modal-fade">
        <modalDelete v-if="store.modals.deleteAccount.open" :head="$t('you_sure')"
            :paragraph="$t('delete_account_message_alert')">
            <template #footer>
                <buttonFl @click="closeModal" type="outline" size="default" :hasIcon="false" :loading="false"
                    :label="$t('cancel')" class="w-full" />
                <buttonFl @click="deleteAccountFromVault" type="outline" size="default" :hasIcon="false"
                    :loading="false" :label="$t('delete_account')" class="w-full danger" />
            </template>
        </modalDelete>
    </Transition>

    <Transition name="modal-fade">
        <modalCreate v-if="store.modals.selectedAccount.open" :title="store.modals.selectedAccount.data?.accounts.name"
            :image="store.modals.selectedAccount.data?.accounts.account_image">
            <template #inner>
                <div class="w-full flex flex-col gap-[16px]">
                    <div v-if="store.modals.selectedAccount.data?.accounts.username" tabindex="0"
                        class="group relative h-[48px] px-[16px] py-[12px] rounded-[16px] outline outline-2 outline-transparent text-base font-medium text-white bg-[#2E2E2E] focus:bg-[#1E1E1E] hover:bg-[#2b2b2b] focus:outline-white cursor-pointer">
                        <span>{{ store.modals.selectedAccount.data?.accounts.username }}</span>
                        <div @click="handleCopy(store.modals.selectedAccount.data?.accounts.username)"
                            class="absolute top-0 right-0 h-full px-[12px] flex items-center justify-center rounded-r-[16px] bg-[#2876FF]/10 hover:bg-[#2876FF]/20 opacity-0 group-hover:opacity-100 cursor-pointer">
                            <span>Copia</span>
                        </div>
                    </div>
                    <div v-if="store.modals.selectedAccount.data?.accounts.email" tabindex="0"
                        class="group relative h-[48px] px-[16px] py-[12px] rounded-[16px] outline outline-2 outline-transparent text-base font-medium text-white bg-[#2E2E2E] focus:bg-[#1E1E1E] hover:bg-[#2b2b2b] focus:outline-white cursor-pointer">
                        <span>{{ store.modals.selectedAccount.data?.accounts.email }}</span>
                        <div @click="handleCopy(store.modals.selectedAccount.data?.accounts.email)"
                            class="absolute top-0 right-0 h-full px-[12px] flex items-center justify-center rounded-r-[16px] bg-[#2876FF]/10 hover:bg-[#2876FF]/20 opacity-0 group-hover:opacity-100 cursor-pointer">
                            <span>Copia</span>
                        </div>
                    </div>
                    <div v-if="store.modals.selectedAccount.data?.accounts.password" tabindex="0"
                        class="group relative h-[48px] px-[16px] py-[12px] rounded-[16px] outline outline-2 outline-transparent text-base font-medium text-white bg-[#2E2E2E] focus:bg-[#1E1E1E] hover:bg-[#2b2b2b] focus:outline-white cursor-pointer">
                        <span>••••••••••••</span>
                        <div @click="handleCopy(store.modals.selectedAccount.data?.accounts.password)"
                            class="absolute top-0 right-0 h-full px-[12px] flex items-center justify-center rounded-r-[16px] bg-[#2876FF]/10 hover:bg-[#2876FF]/20 opacity-0 group-hover:opacity-100 cursor-pointer">
                            <span>Copia</span>
                        </div>
                    </div>
                </div>
            </template>
        </modalCreate>
    </Transition>

    <!-- CONTEXT MENU -->
    <Transition name="contextmenu-fade" class="whitespace-nowrap">
        <contextMenu v-if="store.contextMenu.open"
            :style="{ top: `${store.contextMenu.y}px`, left: `${store.contextMenu.x}px` }">
            <template #inner>

                <div v-if="store.contextMenu.type === 'vault'">
                    <div @click="openModalEditVault"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Pencil size="20" />
                        <span>{{ $t('edit_vault') }}</span>
                    </div>
                    <div @click="openModalDeleteVault"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Trash2 size="20" />
                        <span>{{ $t('delete_vault') }}</span>
                    </div>
                </div>
                <div v-if="store.contextMenu.type === 'account'">
                    <div @click="openModalEditAccount"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Pencil size="20" />
                        <span>{{ $t('edit_account') }}</span>
                    </div>
                    <div @click="openModalDeleteAccount"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer">
                        <Trash2 size="20" />
                        <span>{{ $t('delete_account') }}</span>
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
                    <div @click="store.modals.createAccount.fields.website_url = !store.modals.createAccount.fields.website_url"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.createAccount.fields.website_url }">
                        <Plus v-if="!store.modals.createAccount.fields.website_url" size="20" />
                        <Minus v-else size="20" />
                        <span>Website</span>
                    </div>
                </div>
                <div v-if="store.contextMenu.type === 'edit-account-add-element'">
                    <div @click="store.modals.editAccount.fields.username = !store.modals.editAccount.fields.username"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.editAccount.fields.username }">
                        <Plus v-if="!store.modals.editAccount.fields.username" size="20" />
                        <Minus v-else size="20" />
                        <span>Username</span>
                    </div>
                    <div @click="store.modals.editAccount.fields.email = !store.modals.editAccount.fields.email"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.editAccount.fields.email }">
                        <Plus v-if="!store.modals.editAccount.fields.email" size="20" />
                        <Minus v-else size="20" />
                        <span>Email</span>
                    </div>
                    <div @click="store.modals.editAccount.fields.password = !store.modals.editAccount.fields.password"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.editAccount.fields.password }">
                        <Plus v-if="!store.modals.editAccount.fields.password" size="20" />
                        <Minus v-else size="20" />
                        <span>Password</span>
                    </div>
                    <div @click="store.modals.editAccount.fields.description = !store.modals.editAccount.fields.description"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.editAccount.fields.description }">
                        <Plus v-if="!store.modals.editAccount.fields.description" size="20" />
                        <Minus v-else size="20" />
                        <span>Description</span>
                    </div>
                    <div @click="store.modals.editAccount.fields.website_url = !store.modals.editAccount.fields.website_url"
                        class="relative w-full h-[36px] px-[10px] rounded-[12px] whitespace-nowrap flex gap-[8px] items-center bg-transparent hover:bg-white/10 text-white text-base font-medium cursor-pointer"
                        :class="{ 'bg-white/20': store.modals.editAccount.fields.website_url }">
                        <Plus v-if="!store.modals.editAccount.fields.website_url" size="20" />
                        <Minus v-else size="20" />
                        <span>Website</span>
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
            auth,
            debounceTimeout: null
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

            if (!this.auth.profile?.is_subscribed && this.store.vaults.data.length >= 3) {
                this.store.modals.createVault.error.name = "Non puoi creare più di 3 vaults senza un abbonamento.";
                this.store.modals.createVault.loading = false;
                return;
            }

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

                    this.store.toast.open = true;
                    this.store.toast.message = this.$t('toast_create_new_vault');
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

                    this.store.toast.open = true;
                    this.store.toast.message = this.$t('toast_edit_vault');
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

                this.store.toast.open = true;
                this.store.toast.message = this.$t('toast_delete_vault');
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

            if (!this.store.modals.createAccount.data.vault_id) {
                return this.store.modals.createAccount.loading = false;
            }

            const fieldData = this.store.modals.createAccount.data;

            try {
                const { data, error } = await supabase
                    .from('accounts')
                    .insert({
                        account_image: this.store.modals?.account_image,
                        name: fieldData?.name,
                        username: fieldData?.username,
                        email: fieldData?.email,
                        password: fieldData?.password,
                        description: fieldData?.description,
                        website_url: fieldData?.website_url,
                    })
                    .select('id')

                if (!error) {
                    // console.log(data);
                    const accountId = data[0].id;

                    await this.addAccountToVault(accountId);

                    this.store.toast.open = true;
                    this.store.toast.message = this.$t('toast_add_new_account');
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
                    this.store.modals.createAccount.error.vault_id = null;
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.store.modals.createAccount.loading = false;
            }
        },
        async editAccount() {
            this.store.modals.editAccount.loading = true;

            const fieldData = this.store.modals.editAccount.data;

            try {
                const { data, error } = await supabase
                    .from('accounts')
                    .update({
                        account_image: this.store.modals?.account_image,
                        name: fieldData?.name,
                        username: fieldData?.username,
                        email: fieldData?.email,
                        password: fieldData?.password,
                        description: fieldData?.description,
                        website_url: fieldData?.website_url,
                    })
                    .eq('id', fieldData.id)

                if (!error) {
                    // console.log(data)
                    await supabase
                        .from('vault_accounts')
                        .update({ vault_id: fieldData.vault_id })
                        .eq('account_id', fieldData.id);

                    await this.getAccountsFromVault();
                    this.closeContextMenu();
                    this.store.modals.editAccount.open = false;

                    this.store.toast.open = true;
                    this.store.toast.message = this.$t('toast_edit_account');
                }
            } catch (e) {
                console.error(e);
                this.store.modals.editAccount.open = false;
            } finally {
                this.store.modals.editAccount.loading = false;
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

                    this.store.toast.open = true;
                    this.store.toast.message = this.$t('toast_delete_account');
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
        async selectVaultForEditAccount(vault) {
            const vaultId = vault.vault_id;

            if (vaultId === this.store.modals.editAccount.data.vault_id) {
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

                    this.store.modals.editAccount.data.vault_id = data.vault_id;
                    this.store.modals.editAccount.data.vault_name_selected = data.vaults.name;
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
        async getVaultOfAccount() {
            const accountId = this.store.modals.editAccount.data.id;

            if (!accountId) {
                return false;
            }

            try {
                const { data, error } = await supabase
                    .from('vault_accounts')
                    .select('vault_id, account_id, vaults(name)')
                    .eq('account_id', accountId)
                    .single()

                if (!error) {
                    // console.log(data)

                    this.store.modals.editAccount.data.vault_id = data.vault_id;
                    this.store.modals.editAccount.data.vault_name_selected = data.vaults.name;
                }
            } catch (e) {
                console.error(e);
            }
        },
        async websiteImage(event, dataField) {
            clearTimeout(this.debounceTimeout);

            this.debounceTimeout = setTimeout(async () => {
                const apiKey = import.meta.env.VITE_LOGO_DEV_API_KEY;
                const size = 256;

                const fieldWebsite = event.target.value;
                const fieldFormatted = fieldWebsite.toLowerCase();

                try {
                    const apiUrl = `https://img.logo.dev/${fieldFormatted}?token=${apiKey}&size=${size}&retina=true`;

                    const res = await fetch(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                        },
                    });

                    if (res.ok) {
                        // console.log(res);
                        const image = res.url;

                        this.store.modals.account_image = image;
                    } else {
                        console.warn(res);
                        this.store.modals.account_image = null;
                    }
                } catch (e) {
                    console.error(e);
                    this.store.modals.account_image = null;
                }
            }, 500);
        },
        async handleAccount(account) {
            const vaultId = account.vault_id;
            const accountId = account.account_id;

            this.store.modals.selectedAccount.open = true;
            this.store.modals.selectedAccount.loading = true;

            try {
                const { data, error } = await supabase
                    .from('vault_accounts')
                    .select('vault_id, account_id, accounts(*)')
                    .eq('vault_id', vaultId)
                    .eq('account_id', accountId)
                    .single()

                if (!error) {
                    // console.log(data);

                    this.store.modals.selectedAccount.data = data;
                }
            } catch (e) {
                console.error(e);
                this.store.modals.selectedAccount.loading = false;
                this.store.modals.selectedAccount.open = false;
            } finally {
                this.store.modals.selectedAccount.loading = false;
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

            if (this.store.modals.selectedAccount.open) {
                this.store.modals.selectedAccount.open = false;
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
        openModalCreateVault() {
            this.store.modals.createVault.open = !this.store.modals.createVault.open;

            if (!this.auth.profile?.is_subscribed && this.store.vaults.data.length >= 3) {
                return this.store.modals.createVault.open = false;
            }
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

            this.getVaultOfAccount();

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
        },
        clearField(typeField) {
            if (typeField === 'username') {
                this.store.modals.editAccount.data.username = null;
                this.store.modals.editAccount.fields.username = false;
            }

            if (typeField === 'email') {
                this.store.modals.editAccount.data.email = null;
                this.store.modals.editAccount.fields.email = false;
            }

            if (typeField === 'password') {
                this.store.modals.editAccount.data.password = null;
                this.store.modals.editAccount.fields.password = false;
            }

            if (typeField === 'description') {
                this.store.modals.editAccount.data.description = null;
                this.store.modals.editAccount.fields.description = false;
            }
        },
        handleCopy(data) {
            if (!data) {
                return false;
            }
            navigator.clipboard.writeText(data).catch(err => {
                console.error(err);
            });
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
                    // console.log("Ho trovato il vault selezionato.");
                    return true;
                } else {
                    // console.log("Vault selezionato non trovato, seleziono il primo disponibile.");
                    this.selectedVault(value[0]);
                    return false;
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
        'store.modals.createAccount.data.vault_id': {
            handler(value) {
                if (!value) {
                    this.setVaultOnDropdown();
                }
            },
            deep: true
        },
        'store.modals.createAccount.open': {
            handler(value) {
                if (!value) {
                    this.store.modals.createAccount.data.vault_id = null;

                    this.store.modals.createAccount.data.username = null;
                    this.store.modals.createAccount.fields.username = false;

                    this.store.modals.createAccount.data.email = null;
                    this.store.modals.createAccount.fields.email = false;

                    this.store.modals.createAccount.data.password = null;
                    this.store.modals.createAccount.fields.password = false;

                    this.store.modals.createAccount.data.description = null;
                    this.store.modals.createAccount.fields.description = false;

                    this.store.modals.createAccount.data.website_url = null;
                    this.store.modals.createAccount.fields.website_url = false;
                }
            },
            immediate: true,
            deep: true
        },
        'store.modals.editAccount': {
            handler(value) {
                if (value.open) {
                    if (value.data.username !== null) {
                        value.fields.username = !!value.data.username;
                    }
                    if (value.data.email !== null) {
                        value.fields.email = !!value.data.email;
                    }
                    if (value.data.password !== null) {
                        value.fields.password = !!value.data.password;
                    }
                    if (value.data.description !== null) {
                        value.fields.description = !!value.data.description;
                    }
                    if (value.data.website_url !== null) {
                        value.fields.website_url = !!value.data.website_url;
                    }
                } else {
                    value.data.username = null;
                    value.fields.username = false;

                    value.data.email = null;
                    value.fields.email = false;

                    value.data.password = null;
                    value.fields.password = false;

                    value.data.description = null;
                    value.fields.description = false;

                    value.data.website_url = null;
                    value.fields.website_url = false;
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