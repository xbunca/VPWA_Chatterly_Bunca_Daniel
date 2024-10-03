import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LogInPage.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('pages/RegistrationPage.vue')
      }
    ]
  },

  {
    path: '/home',
    name: 'home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/WelcomePage.vue')
      },
      {
        path: '/home/chat',
        name: 'chat',
        component: () => import('pages/ChatRoomPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
