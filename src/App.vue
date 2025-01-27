<template>
  <div>
    <RouterView @profile-completed="getProfile" @profile-updated="getProfile" />
    <Transition name="toast-fade">
      <toast v-if="store.toast.open">
        <template #icon>
          <Check v-if="store.toast.type === 'success'" />
          <ShieldAlert v-if="store.toast.type === 'alert'" />
          <ShieldX v-if="store.toast.type === 'error'" />
        </template>
      </toast>
    </Transition>
  </div>

  <!-- OVERLAY -->
  <Transition name="overlay-modal-fade">
    <div v-if="store.modals.completeProfile.open && !this.auth.PROFILE_COMPLETE"
      @click="store.modals.completeProfile.open = false"
      class="fixed z-[99999] top-0 left-0 w-full h-screen bg-black/80">
    </div>
  </Transition>

  <!-- MODAL PROFILE -->
  <Transition name="modal-fade">
    <modalCreate v-if="store.modals.completeProfile.open && !this.auth.PROFILE_COMPLETE"
      :title="$t('head_create_new_account')">
      <template #inner>
        <form @submit.prevent class="w-full flex flex-col gap-[16px]">
          <inputField v-model="store.modals.completeProfile.data.first_name" type="text" forInput="firstName" label=""
            placeholder="First name" :required="true" :error="store.modals.completeProfile.error.first_name" />
          <inputField v-model="store.modals.completeProfile.data.last_name" type="text" forInput="lastName" label=""
            placeholder="Last name" :required="true" :error="store.modals.completeProfile.error.last_name" />
          <buttonFl @click="completeProfile" type="primary" size="default" :hasIcon="false"
            :loading="store.modals.completeProfile.loading" :label="$t('save')" class="w-full" />
        </form>
      </template>
    </modalCreate>
  </Transition>
</template>

<script>
import { supabase } from "./lib/supabase";
import { auth } from "./data/auth";
import { store } from "./data/store";

import { UAParser } from 'ua-parser-js';

import i18n from "./lib/i18n";

import toast from "./components/toast/toast.vue";
import modalCreate from "./components/modal/modal-create.vue";
import inputField from "./components/input/input-field.vue";
import buttonFl from "./components/button/button-fl.vue";

// ICONS
import { Check, ShieldAlert, ShieldX } from 'lucide-vue-next'

export default {
  name: "App",
  components: {
    toast,
    modalCreate,
    inputField,
    buttonFl,

    // ICONS
    Check,
    ShieldAlert,
    ShieldX
  },
  data() {
    return {
      auth,
      store
    }
  },
  methods: {
    async getUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (!error) {
          // console.log(data);
          this.auth.user = data.user;
          this.auth.isAuthenticated = true;
          localStorage.setItem('isAuthenticated', true);
          this.getSession();
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (!error) {
          // console.log(data);
          this.auth.session = data.session;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getProfile() {
      const AUTH_USER_ID = this.auth.user.id;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', AUTH_USER_ID)

        if (!error) {
          // console.log(data);
          this.auth.profile = data[0];
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getGeolocationData() {
      const apiKey = import.meta.env.VITE_IPINFO_KEY;
      const apiUrl = `https://ipinfo.io/json?token=${apiKey}`;

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data) {
          // console.log(data);
          this.auth.deviceInfo.city = data?.city;
          this.auth.deviceInfo.country = data?.country;
          this.auth.deviceInfo.country_code = data?.country;
          this.auth.deviceInfo.time_zone = data?.timezone;
          this.auth.deviceInfo.ip_address = data?.ip;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async completeProfile() {
      this.store.modals.completeProfile.loading = true;

      const fieldData = this.store.modals.completeProfile.data;

      if (this.auth.PROFILE_COMPLETE) {
        this.store.modals.completeProfile.open = false;
        this.store.modals.completeProfile.loading = false;
        return;
      }

      if (!fieldData.first_name || !fieldData.last_name) {
        this.store.modals.completeProfile.error.first_name = "Il nome è obbligatorio.";
        this.store.modals.completeProfile.error.last_name = "Il cognome è obbligatorio.";
        this.store.modals.completeProfile.loading = false;
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ first_name: fieldData?.first_name, last_name: fieldData?.last_name })
          .eq('id', this.auth.PROFILE_AUTH_ID)

        if (!error) {
          // console.log(data);

          this.getProfile();
          this.store.modals.completeProfile.open = false;
          this.store.modals.completeProfile.data.first_name = null;
          this.store.modals.completeProfile.data.last_name = null;
          this.store.modals.completeProfile.error.first_name = null;
          this.store.modals.completeProfile.error.last_name = null;
        }
      } catch (e) {
        console.error(e);
        this.store.modals.completeProfile.open = false;
      } finally {
        this.store.modals.completeProfile.loading = false;
      }
    },

    getLang() {
      const lang = this.auth.profile.lang;
      const fallbackLang = "en";

      if (lang) {
        this.auth.lang = lang;
        this.$i18n.locale = lang;
        localStorage.setItem('locale', lang);
      } else {
        this.auth.lang = fallbackLang;
        this.$i18n.locale = fallbackLang;
        localStorage.setItem('locale', fallbackLang);
      }
    },
    checkDevice() {
      const parser = new UAParser();
      const data = parser.getResult();
      // console.log(data);

      if (data) {
        this.auth.deviceInfo.model = data?.device?.model;
        this.auth.deviceInfo.name = data?.os?.name;
        this.auth.deviceInfo.os = data?.os?.name;
        this.auth.deviceInfo.os_version = data?.os?.version;
        this.auth.deviceInfo.type = data?.device?.type || "Desktop";
        this.auth.deviceInfo.status = true;
        this.auth.deviceInfo.user_agent = data?.ua
      }
    },
  },
  mounted() {
    this.getUser();
    this.checkDevice();
    this.getGeolocationData();
  },
  watch: {
    'auth.user': {
      handler(value) {
        if (value) {
          this.getSession();
          this.getProfile();
        }
      },
      deep: true
    },
    'auth.profile': {
      handler(value) {
        if (value && value.id) {
          this.auth.PROFILE_AUTH_ID = value.id;
        } else {
          this.auth.PROFILE_AUTH_ID = null;
        }

        if (!value.first_name && !value.last_name) {
          this.auth.PROFILE_COMPLETE = false;
        } else {
          this.auth.PROFILE_COMPLETE = true;
        }

        this.getLang();
      },
      deep: true
    },
    'store.modals': {
      handler(value) {
        if (value.createVault.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }

        if (value.editVault.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }

        if (value.deleteVault.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }

        if (value.createAccount.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }

        if (value.editAccount.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
      },
      immediate: true,
      deep: true
    },
    'auth.deleteAccount': {
      handler(value) {
        if (value.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
      },
      immediate: true,
      deep: true
    },
    'store.contextMenu': {
      handler(value) {
        if (value.open) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
      },
      immediate: true,
      deep: true
    },
  }
}
</script>

<style scoped></style>