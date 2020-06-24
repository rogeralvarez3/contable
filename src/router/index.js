import Vue from "vue";
import VueRouter from "vue-router";
import Catálogo from "../views/Catalogo.vue";
import Comprobantes from "../views/Comprobantes.vue";
import Enlaces from "../views/Enlaces.vue";
import Cheques from "../views/Cheques.vue"
import Depositos from "../views/Depositos.vue"

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
    path: "/enlaces",
    name: "enlaces",
    component: Enlaces,
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
