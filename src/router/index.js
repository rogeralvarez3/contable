import Vue from "vue";
import VueRouter from "vue-router";
import Catálogo from "../views/Catalogo.vue";
import Comprobantes from "../views/Comprobantes.vue";
import enlaces_cartera from "../views/enlaces_cartera.vue";
import enlaces_ahorro from "../views/enlaces_ahorro.vue";
import Cheques from "../views/Cheques.vue"
import Depositos from "../views/Depositos.vue"
import Reportes from "../views/Reportes.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/catalogo",
    name: "catalogo",
    component: Catálogo,
  },
  {
    path: "/comprobantes",
    name: "comprobantes",
    component: Comprobantes,
  },
  {
    path: "/cheques",
    name: "cheques",
    component: Cheques,
  },
  {
    path: "/depositos",
    name: "depositos",
    component: Depositos,
  },
  {
    path: "/reportes",
    name: "reportes",
    component: Reportes,
  },
  {
    path: "/enlaces_cartera",
    name: "enlaces_cartera",
    component: enlaces_cartera,
  },
  {
    path: "/enlaces_ahorro",
    name: "enlaces_ahorro",
    component: enlaces_ahorro,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
