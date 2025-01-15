import { createRouter, createWebHistory } from 'vue-router';

// onBoard
import Login from '../views/onBoard/Login.vue';

// General
import Home from '../views/Home.vue';

const routes = [
    // General
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