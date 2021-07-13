import Vue from "vue";
import VueRouter from "vue-router";
import Catálogo from "../views/Catálogo.vue";
import ComprobantesDiario from "../views/Comprobantes_diario.vue";
import enlaces_cartera from "../views/enlaces_cartera.vue";
import enlaces_ahorro from "../views/enlaces_ahorro.vue";
import ComprobantesCheques from "../views/Comprobantes_cheques.vue"
import Depositos from "../views/Depositos.vue"
import Reportes from "../views/Reportes.vue"
import InicioDeOperaciones from "../views/InicioDeOperaciones.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/catalogo",
    name: "catalogo",
    component: Catálogo,
  },
  {
    path: "/comprobantes_diario",
    name: "comprobantes_diario",
    component: ComprobantesDiario,
  },
  {
    path: "/comprobantes_cheques",
    name: "comprobantes_cheques",
    component: ComprobantesCheques,
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
    path: "/inicio_de_operaciones",
    name: "inicio_de_operaciones",
    component: InicioDeOperaciones,
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
