<template>
  <v-container>
    <v-card width="900">
      <v-card-title class="pt-2 pb-2">
        <v-icon class="mr-1">mdi-book</v-icon>Catálogo de cuentas
        <v-spacer></v-spacer>
        <v-btn fab small color="primary" dark @click="dlgNuevo = true">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
        <v-text-field
          label="Buscar"
          v-model="buscar"
          outlined
          dense
          clearable
          single-line
          hide-details
          rounded
          append-icon="mdi-magnify"
          class="ml-1"
        ></v-text-field>
        <v-btn
          fab
          small
          color="purple"
          dark
          class="ml-1"
          @click="dlgFiltro = true"
        >
          <v-icon small>mdi-filter</v-icon>
        </v-btn>
        <v-btn fab small color="red" dark to="/" class="ml-1">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table dense height="600" fixed-header>
          <thead>
            <tr>
              <th v-text="'cuenta'" />
              <th v-text="'descripción'" />
              <th v-text="'nivel'" />
              <th v-text="'tipo'" />
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(cta, i) in catálogo"
              :key="i"
              @click="selected = Object.assign({}, cta)"
              :class="cta.id == selected.id ? 'selected' : ''"
            >
              <td>
                {{ cta.cuenta }}
              </td>
              <td>{{ cta.descripción }}</td>
              <td>{{ cta.nivel }}</td>
              <td>
                {{
                  $store.state.tiposcuentascontable.filter((item) => {
                    return item.value == cta.tipo;
                  })[0]
                    ? $store.state.tiposcuentascontable.filter((item) => {
                        return item.value == cta.tipo;
                      })[0].text
                    : ""
                }}
              </td>
              <td>
                <v-icon
                  small
                  color="error"
                  style="cursor: pointer"
                  @click="tryDelete()"
                  >mdi-close</v-icon
                >
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog width="400" v-model="dlgNuevo" persistent>
      <div id="dlgNuevo">
        <v-card>
          <v-card-title
            >Agregar cuenta <v-spacer></v-spacer
            ><v-btn fab small dark color="error" @click="dlgNuevo = false"
              ><v-icon>mdi-close</v-icon></v-btn
            ></v-card-title
          >
          <v-card-text>
            <v-text-field
              label="Cuenta"
              v-mask="'#-#-#-##-#-##'"
              v-model="nuevo.cuenta"
              v-if="dlgNuevo"
              autofocus
            ></v-text-field>
            <v-text-field
              label="Descripción"
              v-model="nuevo.descripción"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="save()">GUARDAR</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
    <v-dialog v-model="dlgFiltro" width="400">
      <div id="dlgFiltro">
        <v-card>
          <v-card-title>Filtros</v-card-title>
          <v-card-text>
            <table class="mt-2">
              <tr>
                <th width="50">Nivel:</th>
                <td width="50">
                  <v-select
                    :items="[
                      { value: '=', text: '=' },
                      { value: '<', text: '<' },
                      { value: '>', text: '>' },
                      { value: '<=', text: '<=' },
                      { value: '>=', text: '>=' },
                    ]"
                    outlined
                    dense
                    hide-details
                    v-model="filtro.operadorNivel"
                  ></v-select>
                </td>
                <td width="100">
                  <v-select
                    :items="[
                      { value: 1, text: 1 },
                      { value: 2, text: 2 },
                      { value: 3, text: 3 },
                      { value: 4, text: 4 },
                      { value: 5, text: 5 },
                      { value: 6, text: 6 },
                    ]"
                    outlined
                    dense
                    hide-details
                    v-model="filtro.nivel"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th>Tipo:</th>
                <td colspan="2">
                  <v-select
                    :items="$store.state.tiposcuentascontable"
                    outlined
                    dense
                    hide-details
                    v-model="filtro.tipo"
                  ></v-select>
                </td>
              </tr>
            </table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="
                filtro = { nivel: null, operadorNivel: '=', tipo: null };
                dlgFiltro = false;
              "
              >borrar filtros</v-btn
            >
            <v-btn color="primary" @click="dlgFiltro = false">Aceptar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
import { identificarCuenta } from "../../utils";
const Draggable = require("draggable");
export default {
  name: "Catálogo",
  data() {
    return {
      buscar: "",
      rows: 20,
      rowsItemsPerPage: [10, 20, 30],
      niveles: ["red", "pink", "purple", "deep-purple", "indigo", "blue"],
      dlgNuevo: false,
      dlgFiltro: false,
      nuevo: {
        cuenta: null,
        descripción: null,
        nivel: null,
        tipo: null,
        naturaleza: null,
      },
      selected: { id: 0 },
      filtro: { nivel: null, operadorNivel: "=", tipo: null },
    };
  },
  watch: {
    dlgNuevo(value) {
      if (value) {
        setTimeout(() => {
          let dlgNuevo = document.getElementById("dlgNuevo");
          if (dlgNuevo) {
            new Draggable(dlgNuevo);
            console.log("draggable");
          }
        }, 400);
      }
    },
    dlgFiltro(value) {
      if (value) {
        setTimeout(() => {
          let dlgFiltro = document.getElementById("dlgFiltro");
          if (dlgFiltro) {
            new Draggable(dlgFiltro);
            console.log("draggable");
          }
        }, 400);
      }
    },
  },
  methods: {
    save: function () {
      const mv = this;
      let cuenta = identificarCuenta(mv.nuevo.cuenta);
      cuenta.cuenta = mv.nuevo.cuenta;
      cuenta.descripción = mv.nuevo.descripción;
      const data = JSON.stringify({
        tabla: "cont_catalogo",
        data: cuenta,
      });
      fetch(`${mv.$store.state.api}/save`, {
        method: "post",
        body: data,
        headers: { "content-type": "application/json" },
      })
        .then((result) => {
          return result.json();
        })
        .then((json) => {
          //.log(json);return;/*
          if (json.insertId) {
            cuenta.id = json.insertId;
            mv.$store.commit("addRow", { variable: "catálogo", data: cuenta });
            mv.selected = Object.assign({}, cuenta);
            mv.nuevo = {
              id: null,
              cuenta: null,
              descripción: null,
              tipo: null,
              nivel: null,
              naturaleza: null,
            };
            mv.dlgNuevo = false;
            mv.$swal({
              icon: "success",
              title: "Nueva cuenta guardada!",
              position: "top-end",
              toast: true,
              timer: 3000,
            });
          } else {
            console.log(json);
            if (json.errno == 1062) {
              mv.$swal({
                icon: "error",
                title: "Error al guardar",
                text: "Ya existe una cuenta con ese código",
              });
            }
          }
        });
    },
    tryDelete: function () {
      const mv = this;
      mv.$swal({
        icon: "question",
        title: "¿Borrar cuenta seleccionada?",
        text: "Haga click en Si para borrar",
        confirmButtonText: "Sí",
        showCancelButton: true,
        confirmButtonColor: "red",
      }).then((res) => {
        if (res.value) {
          mv.delete();
        }
      });
    },
    delete: function () {
      let mv = this;
      let data = JSON.stringify({
        tabla: "cont_catalogo",
        id: mv.selected.id,
      });
      fetch(`${mv.$store.state.api}/delete`, {
        method: "post",
        body: data,
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.errno) return;
          mv.$store.commit("delete", {
            variable: "catálogo",
            id: mv.selected.id,
          });
          json.toast = true;
          json.timer = 3000;
          json.position = "top-end";
          mv.$swal(json);
        });
    },
    compare: function (a, b) {
      if (a.cuenta < b.cuenta) {
        return -1;
      }
      if (a.cuenta > b.cuenta) {
        return 1;
      }
      return 0;
    },
  },
  computed: {
    catálogo: function () {
      var mv = this;
      let result = mv.$store.state.catálogo;
      let operadores = {
        "=": (a, b) => {
          return a == b;
        },
        "<": (a, b) => {
          return a < b;
        },
        ">": (a, b) => {
          return a > b;
        },
        "<=": (a, b) => {
          return a <= b;
        },
        ">=": (a, b) => {
          return a >= b;
        },
      };
      if (mv.filtro.nivel) {
        result = result.filter((item) => {
          return operadores[mv.filtro.operadorNivel](
            item.nivel,
            mv.filtro.nivel
          );
        });
      }
      if (mv.filtro.tipo) {
        result = result.filter((item) => {
          return item.tipo == mv.filtro.tipo;
        });
      }
      if (mv.buscar.length == 0) {
        return result.sort(mv.compare).slice(0, 23);
      } else {
        return result
          .filter((row) => {
            return (
              (row.descripción + " " + row.cuenta.toString().replace(/-/g, ""))
                .toLowerCase()
                .indexOf(mv.buscar.toLowerCase().replace(/-/g, "")) >= 0
            );
          })
          .sort(mv.compare)
          .slice(0, 23);
      }
    },
  },
};
</script>
<style lang="css" scoped>
th {
  text-transform: capitalize;
}
.v-input {
  max-width: 400px;
  flex: none;
}
.v-data-table {
  flex: none;
}
.selected td,
.select:hover td {
  background-color: dodgerblue;
  color: #fff;
}
.v-overlay {
  backdrop-filter: blur(2);
}
</style>
