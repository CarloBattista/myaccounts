import { createRouter, createWebHistory } from 'vue-router';

// onBoard
import Login from '../views/onBoard/Login.vue';
import Signup from '../views/onBoard/Signup.vue';
import ForgotPassword from '../views/onBoard/ForgotPassword.vue';

// General
import Home from '../views/Home.vue';
import Pricing from '../views/Pricing.vue';

// Settings
import Account from '../views/settings/Account.vue';

const routes = [
    // onBoard
    {
        path: '/identity/login/:id?',
        name: 'identity-login',
        component: Login,
        props: true,
        meta: { title: "MyAccounts • Login" }
    },
    {
        path: '/identity/signup',
        name: 'identity-signup',
        component: Signup,
        props: true,
        meta: { title: "MyAccounts • Sign up" }
    },
    {
        path: '/forgot-password/:id?',
        name: 'forgot-password',
        component: ForgotPassword,
        props: true,
        meta: { title: "MyAccounts • Forgot password" }
    },

    // General
    {
        path: '/',
        name: 'home',
        component: Home,
        props: true,
        meta: { title: "MyAccounts • Home" }
    },
    {
        path: '/pricing',
        name: 'pricing',
        component: Pricing,
        props: true,
        meta: { title: "MyAccounts • Pricing" }
    },

    // Settings
    {
        path: '/settings/account',
        name: 'settings',
        component: Account,
        props: true,
        meta: { title: "MyAccounts" }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const pageTitle = to.meta.title;
    if (pageTitle) {
        document.title = pageTitle;
    } else {
        document.title = "MyAccounts";
    }
    next();
});

export default router;