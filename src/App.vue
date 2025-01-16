<template>
  <div>
    <RouterView />
    <toast v-if="false" />
  </div>
</template>

<script>
import { supabase } from "./lib/supabase";
import { auth } from "./data/auth";
import { store } from "./data/store";

import i18n from "./lib/i18n";

import toast from "./components/toast/toast.vue";

export default {
  name: "App",
  components: {
    toast
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
    }
  },
  mounted() {
    this.getUser();
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