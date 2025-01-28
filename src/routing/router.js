import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../data/auth';

// onBoard
import Login from '../views/onBoard/Login.vue';
import Signup from '../views/onBoard/Signup.vue';
import ForgotPassword from '../views/onBoard/ForgotPassword.vue';

// General
import Home from '../views/Home.vue';
import Pricing from '../views/Pricing.vue';

// Settings
import Account from '../views/settings/Account.vue';
import Devices from '../views/settings/Devices.vue';
import Security from '../views/settings/Security.vue';

const routes = [
    // onBoard
    {
        path: '/identity/login/:id?',
        name: 'identity-login',
        component: Login,
        props: true,
        meta: { title: "MyAccounts • Login", requiresAuth: false, role: 'guest' }
    },
    {
        path: '/identity/signup',
        name: 'identity-signup',
        component: Signup,
        props: true,
        meta: { title: "MyAccounts • Sign up", requiresAuth: false, role: 'guest' }
    },
    {
        path: '/forgot-password/:id',
        name: 'forgot-password',
        component: ForgotPassword,
        props: true,
        meta: { title: "MyAccounts • Forgot password", requiresAuth: false, role: 'guest' }
    },

    // General
    {
        path: '/',
        name: 'home',
        component: Home,
        props: true,
        meta: { title: "MyAccounts • Home", requiresAuth: true, role: 'auth' }
    },
    {
        path: '/pricing',
        name: 'pricing',
        component: Pricing,
        props: true,
        meta: { title: "MyAccounts • Pricing", requiresAuth: false, role: 'guest' }
    },

    // Settings
    {
        path: '/settings/account',
        name: 'settings-account',
        component: Account,
        props: true,
        meta: { title: "MyAccounts • Account", requiresAuth: true, role: 'auth' }
    },
    {
        path: '/settings/devices',
        name: 'settings-devices',
        component: Devices,
        props: true,
        meta: { title: "MyAccounts • Devices", requiresAuth: true, role: 'auth' }
    },
    {
        path: '/settings/security',
        name: 'settings-security',
        component: Security,
        props: true,
        meta: { title: "MyAccounts • Security", requiresAuth: true, role: 'auth' }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const pageTitle = to.meta.title || "MyAccounts";
    document.title = pageTitle;

    const stringAuth = localStorage.getItem('isAuthenticated') || "false";
    const isAuthenticated = JSON.parse(stringAuth);

    if (to.name === 'pricing') {
        return next();
    }

    // Reindirizza alla home se un utente autenticato prova ad accedere a pagine per guest
    if (to.meta.role === 'guest' && isAuthenticated) {
        return next({ name: 'home' });
    }

    // Reindirizza alla pagina di login se un utente non autenticato prova ad accedere a pagine protette
    if (to.meta.role === 'auth' && !isAuthenticated) {
        return next({ name: 'identity-login' });
    }

    next();
});

export default router;