import {createRouter, createWebHistory} from 'vue-router'
import useUserStore from "@/stores/user.js";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import("@/views/pages/Home/Index.vue"),
            meta: {
                layout: 'Default'
            }
        },
        {
            path: '/event/:id',
            name: 'event',
            component: () => import("@/views/pages/Event/Index.vue"),
            meta: {
                layout: 'Default'
            }
        },
        {
            path: "/logout",
            name: "logout",

            beforeEnter: (to, from, next) => {
                const userStore = useUserStore();
                userStore.logOut();
                if (from.name === "event")
                    next({name: "rerender", params: {render: from.fullPath}})
                else
                    next({name: 'home'})
            }
        },
        {
            path: '/:render',
            name: 'rerender',
            component: () => import("@/views/components/Tricks/rerender.vue"),

        },
        //   {
        //     path: '/about',
        //     name: 'about',
        //     // route level code-splitting
        //     // this generates a separate chunk (About.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import('../views/AboutView.vue')
        //   }
    ]
})

export default router
