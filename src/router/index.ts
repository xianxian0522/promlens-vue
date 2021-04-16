import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import NotFound from "@/views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/about',
        component: () => import('../views/About.vue'),
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
