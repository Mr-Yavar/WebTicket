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
            name: 'event1',
            redirect: to => ({name: "event", params: {...to.params, step: 1}}),
            beforeEnter: () => console.log(41)

        },
        {
            path: '/event/:id/:step',
            name: 'event',
            component: () => import("@/views/pages/Event/Index.vue"),
            beforeEnter: (to, from, next) => {
                console.log("df", to.params.step);
                if (!isNaN(Number(to.params.step))) {
                    next();
                }

            },
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
        {
            path: '/admin',
            name: 'adminPanel',
            component: () => import("@/views/pages/AdminPanel/Index.vue"),
            redirect: {name: "AdminDashboard"},
            //alias : '/dashboard',
            meta: {
                layout: 'Admin',
                label : "صفحه اصلی"
            },
            children:
                [
                    {
                        name: "AdminDashboard",
                        path: "dashboard",
                        component: () => import("@/views/pages/AdminPanel/dashboard.vue"),
                        meta:{
                            label : "صفحه اصلی"
                        }
                    },
                    {
                        name: "ManagePlaces",
                        path: "managePlaces",
                        component: () => import("@/views/pages/AdminPanel/Places.vue"),
                        redirect : {name:"AllPlaces"},
                        children: [
                            {
                                name:"AllPlaces",
                                path: "",
                                component: () => import("@/views/ui/AdminPanel/Places/AllPlaces.vue"),
                                meta:{
                                    label : "مکانهای برکزاری"
                                },
                                children : [
                                    {
                                        path: "create",
                                        name:"createPlace",
                                        component: () => import("@/views/ui/AdminPanel/Places/CreatePlace.vue"),
                                        meta:{
                                            label : "ایجاد ماکن برگزاری"
                                        }
                                    },
                                    {
                                        path: "edit/:id",
                                        name:"editPlace",
                                        component: () => import("@/views/ui/AdminPanel/Places/CreatePlace.vue"),
                                        meta:{
                                            label : "ویرایش مکان برگزاری"
                                        }
                                    },

                                    {
                                        path: "manage/:id",
                                        name:"managePlace",
                                        component: () => import("@/views/ui/AdminPanel/Places/ManageHalls.vue"),
                                        meta:{
                                            label : "مدیریت مکان برگزاری"
                                        },
                                        children : [
                                            {
                                                path : "create",
                                                name : "createHall",
                                                component : () => import("@/views/ui/AdminPanel/Places/CreateHall.vue")
                                            },
                                            {
                                                path : "edit/:hallId",
                                                name : "editHall",
                                                component : () => import("@/views/ui/AdminPanel/Places/CreateHall.vue")
                                            }
                                        ]
                                    }
                                ]
                            },

                        ]
                    },
                    {
                        name : "ManageConcerts",
                        path : "concerts",
                        component : ()=>import("@/views/pages/AdminPanel/Concerts.vue"),
                        redirect : {name:"AllConcerts"},
                        meta : {
                            label : "کنسرتها"
                        },
                        children:[
                            {
                                path: "",
                                name:"AllConcerts",
                                component: () => import("@/views/ui/AdminPanel/Concerts/AllConcerts.vue"),
                                meta:{
                                    label : "کنسرت ها"
                                                                }
                            },
                            {
                                path: "createConcert",
                                name:"createConcert",
                                component: () => import("@/views/ui/AdminPanel/Places/CreatePlace.vue"),
                                meta:{
                                    label : "ایجاد ماکن برگزاری"
                                }
                            }
                        ]
                    }
                ]

        }

    ]
})

export default router
