import type { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue'
import IndexPage from 'pages/IndexPage.vue'
import Tabel from "src/shablon_components/Tabel.vue";
import Layout from "src/shablon_components/Layout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [{ path: '', name: 'login', component: IndexPage }],
  },

  {
    path: '/cabinet',
    name: 'CabinetPage',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Tabel',
        component: Tabel,
        meta: {
          title: 'Test',
          icon: 'mdi-test-tube',
        },
      },
      {
        path: 'user-roles',
        name: 'PageUserRoles',
        component: () => import('pages/UserRoles.vue'),
        meta: {
          icon: 'mdi-account-key',
          title: 'modules.userRoles',
        }
      },
    ],
  },
/*  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },*/
]

export default routes;
