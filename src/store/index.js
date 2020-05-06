import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://localhost:3000",
    cargando: false,
    data: [
      { tabla: "cont_catalogo", variable: "catálogo" },
      { tabla: "csituacion", variable: "situaciones" },
      { tabla: "csector", variable: "sectores" },
      { tabla: "cont_integracion", variable: "enlaces" },
      { tabla: "ctipos_pago", variable: "tipos_pago" },
    ],
    catálogo: [],
    situaciones: [],
    sectores: [],
    enlaces: [],
    tipos_pago: [],
  },
  mutations: {
    setVariable(state, payload) {
      state[payload.variable] = payload.data;
    },
    setCargando(state, payload) {
      state.cargando = payload;
    },
  },
  actions: {
    getData: function({ commit, state }) {
      commit("setCargando", true);
      state.data.forEach((d) => {
        const url = `${state.api}/getData`;
        console.log(url);
        fetch(url, {
          method: "post",
          body: JSON.stringify(d),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((r) => {
            return r.json();
          })
          .then((res) => {
            //console.log(res);
            commit("setCargando", false);
            commit("setVariable", { variable: d.variable, data: res });
          });
      });
    },
  },
  modules: {},
});
