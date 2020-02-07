import Vue from 'vue';
import Router from 'vue-router';
import WelcomeScreen from '@/components/WelcomeScreen.vue';
import Inventory from '@/components/Inventory.vue';
import Logs from '@/components/Logs.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome-screen',
      component: WelcomeScreen,
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: Inventory,
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
    },
  ],
});
