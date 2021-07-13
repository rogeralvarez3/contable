import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://192.168.1.211:3000",
    cargando: false,
    drawer: undefined,
    data: [{
        tabla: "cont_catalogo",
        variable: "catálogo"
      },
      {
        tabla: "csituacion",
        variable: "situaciones"
      },
      {
        tabla: "csector",
        variable: "sectores"
      },
      {
        tabla: "cont_enlaces_cartera",
        variable: "enlaces"
      },
      {
        tabla: "cont_enlaces_ahorro",
        variable: "enlaces_ahorro"
      },
      {
        tabla: "ctipos_pago",
        variable: "tipos_pago"
      },
      {
        tabla: "fsucursal",
        variable: "sucursales"
      },
      {
        tabla: "cfondo",
        variable: "fondos"
      },
      {
        tabla: "cont_comprobantes_diario",
        variable: "comprobantes_diario"
      },
      {
        tabla: "view_comprobantes_diario",
        variable: "view_comprobantes_diario"
      },
      {
        tabla: "cont_enlaces_por_desembolsos",
        variable: "enlaces_desembolsos",
      },
      {
        tabla: "configeneral",
        variable: "info"
      },
      {
        tabla: "fechatrabajo",
        variable: "fecha_trabajo"
      },
      {
        tabla: "atipocuenta",
        variable: "tiposcuenta"
      },
      {
        tabla: "atipos_mov_cuentas",
        variable: "tiposmovcuentas"
      },
      {
        tabla: 'ccuentasdebancos',
        variable: 'bancos'
      },
      {
        tabla: 'consecutivoComprobante',
        variable: 'consecutivoComprobante',
        sp: true
      },
      {
        tabla: "cont_referencias",
        variable: "referencias"
      },
      {
        tabla: "cont_tiposcuenta",
        variable: "tiposcuentascontable"
      }
    ],
    sucursales: [],
    catálogo: [],
    situaciones: [],
    fondos: [],
    sectores: [],
    enlaces: [],
    enlaces_ahorro: [],
    comprobantes_diario: [],
    view_comprobantes_diario: [],
    comprobantes_cheque: [],
    view_comprobantes_cheque: [],
    tipos_pago: [],
    tiposcuenta: [],
    bancos: [],
    tiposmovcuentas: [],
    tiposcuentascontable: [],
    fecha_trabajo: [{
      fechaactual: "2021-01-01"
    }],
    comprobanteActual: {
      id: 0,
      fecha: "",
      detalle: []
    },
    tipo_fondo: [{
        value: 1,
        text: "PROPIOS"
      },
      {
        value: 2,
        text: "ADMINISTRADOS"
      },
    ],
    enlaces_desembolsos: [],
    info: {},
    logo: "",
    referencias: [],
    opciones: [{
      "Formato del catálogo": "",
      Logo: ""
    }],
    alertDisplayTime: 3000,
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
    delete(state, payload) {
      const idx = state[payload.variable].findIndex(item => {
        return item.id == payload.id
      })
      state[payload.variable].splice(idx, 1)
    },
    addRow(state, payload) {
      state[payload.variable].push(payload.data)
    }
  },
  actions: {
    getData: function ({
      commit,
      state
    }, payload) {
      commit("setCargando", true);
      const url = `${state.api}/get`;
      if (payload) {
        fetch(url, {
            method: "post",
            body: JSON.stringify(payload),
            headers: {
              "content-Type": "application/json"
            },
          })
          .then((r) => {
            return r.json();
          })
          .then((res) => {
            commit("setCargando", false);
            commit("setVariable", {
              variable: payload.variable,
              data: res
            });
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
              commit("setVariable", {
                variable: d.variable,
                data: res
              });
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
              cta.nivel == 6 &&
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
          return cta.nivel == 6;
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
    comprobantes_diario: (state) => (texto) => {
      if (texto.trim().length === 0) {
        return state.view_comprobantes_diario;
      }
      let result = state.view_comprobantes_diario.filter((item) => {
        var cad = "";
        Object.keys(item).forEach((k) => {
          if (item[k]) {
            if (k.toLowerCase().indexOf('fecha') >= 0) {
              var date = item[k].toString().split("T");
              cad +=
                date[0]
                .split("-")
                .reverse()
                .join("/") + " ";
            } else {
              cad += item[k].toString() + " ";
            }
          }

        });
        //console.log(cad);
        return (
          cad
          .toLowerCase()
          .trim()
          .indexOf(texto.toLowerCase()) >= 0
        );
      });
      //console.log(result);
      return result.slice(0,15);
    },
  },
});