import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user.js'
import { Guid } from '@/config/helper'
import { payServices } from '@/config/PayServices'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/pages/Home/Index.vue'),
            meta: {
                layout: 'Default'
            }
        },
        {
            path: '/about-us',
            name: 'about',
            component: () => import('@/views/pages/Home/AboutUs.vue'),
            meta: {
                layout: 'Default'
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/pages/Account/Profile.vue'),
            meta: {
                layout: 'Default',
                auth:true
            }
        },
        {
            path: '/myreservations',
            name: 'MyReservations',
            component: () => import('@/views/pages/Account/UserReservation.vue'),
            meta: {
                layout: 'Default',
                auth:true
            },
            children:[
                {
                    path : "/:reservationId",
                    name:"MyReservationTicket",
                    component: () => import('@/views/pages/Account/ReservationTickets.vue'),
                    meta:{
                        auth:true
                    }
                }
            ]
        },
        
        {
            path: '/mypayments',
            name: 'MyPayments',
            component: () => import('@/views/pages/Account/UserTransactions.vue'),
            meta: {
                layout: 'Default',
                auth:true
            }
        },
        {
            path: '/check',
            name: 'check',
            component: () => import('@/views/pages/Home/CheckTicket.vue'),
            meta: {
                layout: 'Default'
            }
        },
        {
            path: '/event/:id',
            name: 'event',
            component: () => import('@/views/pages/Event/Index.vue'),
            redirect: { name: 'event0' },
            beforeEnter: (to, form, next) => {
                console.log(to)
                try {
                    Guid({}).fromCompressedToFull(to.params.id)
                    next()
                } catch (err) {
                    return
                }
            },
            children: [
                {
                    path: '0',
                    name: 'event0',
                    component: () => import('@/views/pages/Event/Steps/FirstStep.vue'),
                    beforeEnter: (to, form, next) => {
                        try {
                            Guid({}).fromCompressedToFull(to.params.id)
                            next()
                        } catch (err) {
                            return
                        }
                    }
                },
                {
                    path: '1/:eventId',
                    name: 'event1',

                    component: () => import('@/views/pages/Event/Steps/SecondStep.vue'),
                    beforeEnter: (to, form, next) => {
                        try {
                            Guid({}).fromCompressedToFull(to.params.id)
                            Guid({}).fromCompressedToFull(to.params.eventId)

                            next()
                        } catch (err) {
                            return
                        }
                    }
                },
                {
                    path: '2/:eventId',
                    name: 'event2',
                    component: () => import('@/views/pages/Event/Steps/ThridStep.vue'),
                    beforeEnter: (to, form, next) => {
                        try {
                            Guid({}).fromCompressedToFull(to.params.id)
                            Guid({}).fromCompressedToFull(to.params.eventId)
                            next()
                        } catch (err) {
                            return
                        }
                    },
                    meta:{
                        auth:true
                    }
                },
                {
                    path: '3/:reservationId',
                    name: 'event3',
                    component: () => import('@/views/pages/Event/Steps/FourthStep.vue'),
                    beforeEnter: (to, form, next) => {
                        try {
                            Guid({}).fromCompressedToFull(to.params.id)
                            Guid({}).fromCompressedToFull(to.params.reservationId)
                            next()
                        } catch (err) {
                            return
                        }
                    },
                    meta:{
                        auth:true
                    }
                }
            ],
            meta: {
                layout: 'Default',
               
            }
        },
        {
            path: '/buy/:id/:eventId/:payService/:txId',
            name: 'buyStep',
            component: () => import('@/views/pages/Event/BuyStep.vue'),
            beforeEnter: (to, form, next) => {
                console.log(to)
                try {
                    Guid({}).fromCompressedToFull(to.params.id)
                    Guid({}).fromCompressedToFull(to.params.eventId)
                    Guid({}).fromCompressedToFull(to.params.txId)

                    if (!Object.values(payServices).includes(to.params.payService)) throw new Error()
                    next()
                } catch (err) {
                    console.log(err)
                }
            },
            meta: {
                layout: 'Default',
                auth:true
            }
        },
        {
            path: '/logout',
            name: 'logout',

            beforeEnter: (to, from, next) => {
                const userStore = useUserStore()
                userStore.logOut()
                if (from.name === 'event') next({ name: 'rerender', params: { render: from.fullPath } })
                else next({ name: 'home' })
            }
        },
        {
            path: '/:render',
            name: 'rerender',
            component: () => import('@/views/components/Tricks/rerender.vue')
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
            component: () => import('@/views/pages/AdminPanel/Index.vue'),
            redirect: { name: 'AdminDashboard' },
            //alias : '/dashboard',
            meta: {
                layout: 'Admin',
                label: 'صفحه اصلی',
                auth:true
            },
            children: [
                {
                    name: 'AdminDashboard',
                    path: 'dashboard',
                    component: () => import('@/views/pages/AdminPanel/dashboard.vue'),
                    meta: {
                        label: 'صفحه اصلی',
                        auth:true
                    }
                },
                {
                    name: 'ManagePlaces',
                    path: 'managePlaces',
                    component: () => import('@/views/pages/AdminPanel/Places.vue'),
                    redirect: { name: 'AllPlaces' },
                    children: [
                        {
                            name: 'AllPlaces',
                            path: '',
                            component: () => import('@/views/ui/AdminPanel/Places/AllPlaces.vue'),
                            meta: {
                                label: 'مکانهای برکزاری',
                                auth:true
                            },
                            children: [
                                {
                                    path: 'create',
                                    name: 'createPlace',
                                    component: () => import('@/views/ui/AdminPanel/Places/CreatePlace.vue'),
                                    meta: {
                                        label: 'ایجاد ماکن برگزاری',
                                        auth:true
                                    }
                                },
                                {
                                    path: 'edit/:id',
                                    name: 'editPlace',
                                    component: () => import('@/views/ui/AdminPanel/Places/CreatePlace.vue'),
                                    meta: {
                                        label: 'ویرایش مکان برگزاری',
                                        auth:true
                                    }
                                },

                                {
                                    path: 'manage/:id',
                                    name: 'managePlace',
                                    component: () => import('@/views/ui/AdminPanel/Places/ManageHalls.vue'),
                                    meta: {
                                        label: 'مدیریت مکان برگزاری',
                                        auth:true
                                    },
                                    children: [
                                        {
                                            path: 'create',
                                            name: 'createHall',
                                            component: () => import('@/views/ui/AdminPanel/Places/CreateHall.vue'),
                                            meta: {
                                                label: 'مدیریت مکان برگزاری',
                                                auth:true
                                            },
                                        },
                                        {
                                            path: 'edit/:hallId',
                                            name: 'editHall',
                                            component: () => import('@/views/ui/AdminPanel/Places/CreateHall.vue'),
                                            meta: {
                                                label: 'مدیریت مکان برگزاری',
                                                auth:true
                                            },
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'ManageConcerts',
                    path: 'concerts',
                    component: () => import('@/views/pages/AdminPanel/Concerts.vue'),
                    redirect: { name: 'AllConcerts' },
                    meta: {
                        label: 'کنسرتها',
                        auth:true
                    },
                    children: [
                        {
                            path: '',
                            name: 'AllConcerts',
                            component: () => import('@/views/ui/AdminPanel/Concerts/AllConcerts.vue'),
                            meta: {
                                label: 'کنسرت ها',
                                auth:true
                            }
                        },
                        {
                            path: 'createConcert',
                            name: 'createConcert',
                            component: () => import('@/views/ui/AdminPanel/Concerts/CreateConcert.vue'),
                            meta: {
                                label: 'ایجاد یک کنسرت',
                                auth:true
                            }
                        },
                        {
                            path: 'EditConcert/:concertId',
                            name: 'EditConcert',
                            component: () => import('@/views/ui/AdminPanel/Concerts/CreateConcert.vue'),
                            meta: {
                                label: 'ویرایش یک کنسرت',
                                auth:true
                            }
                        }
                    ]
                },
                {
                    name: 'ManagePromoters',
                    path: 'managePromoters',
                    component: () => import('@/views/pages/AdminPanel/Promoters.vue'),
                    redirect: { name: 'AllPromoters' },
                    children: [
                        {
                            name: 'AllPromoters',
                            path: '',
                            component: () => import('@/views/ui/AdminPanel/Promoters/AllPromoters.vue'),
                            meta: {
                                label: 'برگزار کنندگان',
                                auth:true
                            },
                            children: [
                                {
                                    path: 'create',
                                    name: 'createPromoter',
                                    component: () => import('@/views/ui/AdminPanel/Promoters/CreatePromoters.vue'),
                                    meta: {
                                        label: 'ایجاد برگزارکننده',
                                        auth:true
                                    }
                                },
                                {
                                    path: 'edit/:id',
                                    name: 'editPromoter',
                                    component: () => import('@/views/ui/AdminPanel/Promoters/CreatePromoters.vue'),
                                    meta: {
                                        label: 'ویرایش برگزارکننده',
                                        auth:true
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'StaticData',
                    path: 'staticdata',
                    component: () => import('@/views/pages/AdminPanel/StaticData.vue'),
                    redirect: { name: 'ManageStaticData' },
                    children: [
                        {
                            name: 'ManageStaticData',
                            path: 'managestaticdata',
                            component: () => import('@/views/ui/AdminPanel/StaticData/ManageStaticData.vue'),
                            meta:{
                                auth:true
                            }
                        }
                    ]
                },
                {
                    name: 'discount',
                    path: 'discount',
                    component: () => import('@/views/pages/AdminPanel/StaticData.vue'),
                    redirect: { name: 'Managediscount' },
                    children: [
                        {
                            name: 'Managediscount',
                            path: 'managediscount',
                            component: () => import('@/views/ui/AdminPanel/Discount/AllDiscount.vue'),
                            meta:{
                                auth:true
                            }
                        },
                        {
                            name: 'createDiscount',
                            path: 'createDiscount',
                            component: () => import('@/views/ui/AdminPanel/Discount/CreateDiscount.vue'),
                            
                            meta:{
                                auth:true
                            }
                        },
                        {
                            name: 'editDiscount',
                            path: 'editDiscount/:id',
                            component: () => import('@/views/ui/AdminPanel/Discount/CreateDiscount.vue'),
                            meta:{
                                auth:true
                            }
                        }
                    ]
                },
                {
                    name: 'ManageUsers',
                    path: 'manageusers',
                    component: () => import('@/views/pages/AdminPanel/StaticData.vue'),
                    redirect: { name: 'manageallusers' },
                    children: [
                        {
                            name: 'manageallusers',
                            path: 'manageallusers',
                            component: () => import('@/views/ui/AdminPanel/Users/Users.vue'),
                            meta:{
                                auth:true
                            },
                            children:[
                                {
                                    name: 'editUser',
                                    path: 'edit/:id',
                                    component: () => import('@/views/ui/AdminPanel/Users/EditUser.vue'),
                                    meta:{
                                        auth:true
                                    }
                                },
                                {
                                    name: 'UserPayments',
                                    path: 'userpayments/:id',
                                    component: () => import('@/views/ui/AdminPanel/Users/UserTransactions.vue'),
                                    meta:{
                                        auth:true
                                    }
                                },
                                {
                                    name: 'UserReservations',
                                    path: 'UserReservations/:id',
                                    component: () => import('@/views/ui/AdminPanel/Users/UserReservation.vue'),
                                    meta:{
                                        auth:true
                                    }
                                },
                            ]
                        }
                       
                    ]
                }
            ]
        }
    ]
});

router.beforeEach(async (to,from,next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    
    const authRequired = !!to.meta.auth;
    const auth = useUserStore();
    console.log(to,authRequired);
    if (authRequired && !auth.isAuthenticated) {
        auth.returnUrl = to.fullPath;
        next('/');
        return;
    }
    next();
});

export default router
