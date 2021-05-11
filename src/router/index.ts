import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import NotFound from "@/views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/promql',
    },
    {
        path: '/home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/promql',
        component: () => import('../views/PromQL.vue'),
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
