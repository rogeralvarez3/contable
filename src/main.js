import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.min.css";
import swal from "vue-sweetalert2";
import vmask from "v-mask";

Vue.config.productionTip = false;
Vue.use(swal);
Vue.use(vmask);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
