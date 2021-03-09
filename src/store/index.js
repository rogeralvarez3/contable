import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://192.168.1.211:3000",
    cargando: false,
    drawer: undefined,
    data: [
      { tabla: "cont_catalogo", variable: "catálogo" },
      { tabla: "csituacion", variable: "situaciones" },
      { tabla: "csector", variable: "sectores" },
      { tabla: "cont_enlaces_cartera", variable: "enlaces" },
      { tabla: "cont_enlaces_ahorro", variable: "enlaces_ahorro" },
      { tabla: "ctipos_pago", variable: "tipos_pago" },
      { tabla: "fsucursal", variable: "sucursales" },
      { tabla: "cfondo", variable: "fondos" },
      { tabla: "view_comprobantes", variable: "comprobantes" },
      {
        tabla: "cont_enlaces_por_desembolsos",
        variable: "enlaces_desembolsos",
      },
      { tabla: "configeneral", variable: "info" },
      { tabla: "fechatrabajo", variable: "fecha_trabajo" },
      { tabla: "atipocuenta", variable: "tiposcuenta" },
      { tabla: "atipos_mov_cuentas", variable: "tiposmovcuentas" },
      {tabla:'bancos',variable:'bancos'}
    ],
    sucursales: [],
    catálogo: [],
    situaciones: [],
    fondos: [],
    sectores: [],
    enlaces: [],
    enlaces_ahorro: [],
    comprobantes: [],
    tipos_pago: [],
    tiposcuenta: [],
    bancos:[],
    tiposmovcuentas: [],
    fecha_trabajo: [{ fechaactual: "2021-01-01" }],
    comprobanteActual: { id: 0, fecha: "", detalle: [] },
    tipo_fondo: [
      { value: 1, text: "PROPIOS" },
      { value: 2, text: "ADMINISTRADOS" },
    ],
    enlaces_desembolsos: [],
    info: {},
    logo: "",
  },
  mutations: {
    setVariable(state, payload) {
      //state[payload.variable] = payload.data;
      // eslint-disable-next-line no-debugger
      //debugger
      Vue.set(state, payload.variable, payload.data);
    },
    setCargando(state, payload) {
      //state.cargando = payload;
      Vue.set(state, "cargando", payload);
    },
  },
  actions: {
    getData: function({ commit, state }, payload) {
      commit("setCargando", true);
      const url = `${state.api}/get`;
      if (payload) {
        fetch(url, {
          method: "post",
          body: JSON.stringify(payload),
          headers: { "content-Type": "application/json" },
        })
          .then((r) => {
            return r.json();
          })
          .then((res) => {
            commit("setCargando", false);
            commit("setVariable", { variable: payload.variable, data: res });
          });
      } else {
        state.data.forEach((d) => {
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
      }
    },
  },
  getters: {
    cuentasDetalle: (state) => (text) => {
      var result = [];
      if (text) {
        if (text.trim().length > 0) {
          result = state.catálogo.filter((cta) => {
            cta.fullText =
              cta.cuenta.replace(/-/g, "") + " - " + cta.descripción;
            return (
              cta.tipo == 2 &&
              (
                cta.cuenta.replace(/-/g, "") +
                " " +
                cta.cuenta +
                " " +
                cta.descripción
              )
                .toLowerCase()
                .indexOf(text.toLowerCase()) >= 0
            );
          });
        }
      } else {
        result = state.catálogo.filter((cta) => {
          cta.fullText = cta.cuenta.replace(/-/g, "") + " - " + cta.descripción;
          return cta.tipo == 2;
        });
      }
      return result;
    },
    dlookup: (state) => (params) => {
      var result = state[params.tabla].filter((item) => {
        return item[params.campo] == params.valor;
      });
      if (result.length > 0) {
        return result[0];
      } else {
        return {};
      }
    },
    comprobantes: (state) => (texto) => {
      if (texto.trim().length === 0) {
        return state.comprobantes;
      }
      return state.comprobantes.filter((item) => {
        var cad = "";
        Object.keys(item).forEach((k) => {
          var date = item[k].toString().split("T");
          if (date[0].length == 10) {
            cad +=
              date[0]
                .split("-")
                .reverse()
                .join("/") + " ";
          } else {
            cad += item[k].toString() + " ";
          }
        });
        console.log(cad);
        return (
          cad
            .toLowerCase()
            .trim()
            .indexOf(texto.toLowerCase()) >= 0
        );
      });
    },
  },
});
