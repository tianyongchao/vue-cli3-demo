import Vue from "vue";
import Router from "vue-router";
import Login from './view/Login/Login.vue'
import Layout from './components/common/Layout.vue'
import Tian from './view/Tian/Tian.vue'
Vue.use(Router)
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/market',
      component: Layout,
      children: [
        {
          path: 'tian',
          component: Tian,
        }
      ]
    }
  ]
}
)
export default router;