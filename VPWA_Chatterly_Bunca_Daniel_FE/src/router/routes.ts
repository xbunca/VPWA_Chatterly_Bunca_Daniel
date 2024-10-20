import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [

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
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/WelcomePage.vue')
      },
      {
        path: '/chat/:id',
        name: 'chat',
        component: () => import('pages/ChatRoomPage.vue')
      },
      {
        path: '/chat/join',
        name: 'joinChat',
        component: () => import('pages/CreateChatPage.vue')
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
