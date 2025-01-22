import { createRouter, createWebHistory } from 'vue-router';

// onBoard
import Login from '../views/onBoard/Login.vue';

// General
import Home from '../views/Home.vue';
import Pricing from '../views/Pricing.vue';

// Account
import Settings from '../views/account/Settings.vue';

const routes = [
    // onBoard
    {
        path: '/identity/login',
        name: 'identity-login',
        component: Login,
        props: true,
        meta: { title: "MyAccounts" }
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

    // Account
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
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