<template>
  <v-container>
    <v-dialog width="800" v-model="dlgFind">
      <v-card>
        <v-card-title class="">
          <v-text-field
            hide-details
            dense
            outlined
            rounded
            filled
            v-model="find"
            append-icon="mdi-magnify"
            placeholder="Buscar comprobante..."
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-btn small dark fab color="red" @click="dlgFind = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container class="pl-0 pr-0">
            <v-simple-table dense fixed-header height="350">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Fecha</th>
                  <th>Sucursal</th>
                  <th>Fondo</th>
                  <th>Sector</th>
                  <th>Número</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in $store.getters.comprobantes(find)"
                  :key="i"
                  @click="getComprobante(row.id)"
                >
                  <td>{{ row.id }}</td>
                  <td>
                    {{
                      row.fecha
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")
                    }}
                  </td>
                  <td>{{ row.sucursal.toLowerCase() }}</td>
                  <td>{{ row.fondo.toLowerCase() }}</td>
                  <td>{{ row.sector.toLowerCase() }}</td>
                  <td>{{ row.número }}</td>
                  <td>{{ row.descripción }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card width="900" class="mt-2">
      <v-card-title class="">
        <v-btn fab small text disabled> <v-icon>mdi-file</v-icon> </v-btn
        >Comprobantes de diario
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              dark
              color="primary"
              class="mr-1"
              v-on="on"
              @click="limpiar()"
              :disabled="data.cerrado==0"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Nuevo comprobante</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              dark
              color="success"
              class="mr-1"
              v-on="on"
              @click="guardarComprobante()"
              :disabled="!totales.ok || data.cerrado>0"
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span>Guardar comprobante</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              dark
              color="blue-grey"
              class="mr-1"
              v-on="on"
              @click="() => {}"
              :disabled="!totales.ok || data.cerrado>0"
            >
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
          <span>Imprimir</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              dark
              color="warning"
              class="mr-1"
              v-on="on"
              @click="() => {}"
              :disabled="!totales.ok || data.cerrado>0"
            >
              <v-icon>mdi-sticker-remove</v-icon>
            </v-btn>
          </template>
          <span>Borrar</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              small
              dark
              fab
              color="green"
              class="mr-1"
              @click="dlgFind = false"
              v-on="on"
              v-if="data.id > 0"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Nuevo comprobante</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              fab
              small
              color="teal"
              dark
              class="mr-1"
              @click="dlgFind = true"
            >
              <v-icon small>mdi-magnify</v-icon>
            </v-btn>
          </template>
          <span>Buscar comprobante</span>
        </v-tooltip>
        <v-btn fab small dark color="error" to="/">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row class="pa-2">
          <v-text-field
            label="Fecha:"
            type="date"
            class="mr-2"
            v-model="data.fecha"
            :disabled="data.cerrado > 0"
          ></v-text-field>
          <v-select
            label="Tipo de fondo:"
            :items="$store.state.tipo_fondo"
            v-model="data.tipo_fondo"
            class="mr-2"
            :disabled="data.cerrado > 0"
          ></v-select>
          <v-select
            label="Sucursal:"
            :items="$store.state.sucursales"
            class="mr-2"
            v-model="data.sucursal"
            :disabled="data.cerrado > 0"
            v-if="data.tipo_fondo == 1"
          ></v-select>
          <v-select
            label="Fondo:"
            :items="
              $store.state.fondos.filter((f) => {
                return f.tipo == 2;
              })
            "
            class="mr-2"
            v-model="data.fondo"
            :disabled="data.cerrado > 0"
            v-if="data.tipo_fondo > 1"
          ></v-select>
          <v-select
            label="Sector:"
            :items="$store.state.sectores"
            class="mr-2"
            v-model="data.sector"
            :disabled="data.cerrado > 0"
          ></v-select>
          <v-text-field
            label="Número de asiento:"
            class="mr-2"
            v-model="data.número"
            :disabled="data.cerrado > 0"
          ></v-text-field>
          <v-text-field
            label="Descripción:"
            class="mr-2"
            multiline
            v-model="data.descripción"
            :disabled="data.cerrado > 0"
          ></v-text-field>
        </v-layout>
        <v-card>
          <v-card-title class="">
            <v-btn fab small text disabled> <v-icon>mdi-menu</v-icon> </v-btn
            >Detalle del comprobante
            <v-spacer></v-spacer>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  small
                  dark
                  color="primary"
                  v-on="on"
                  @click="dlg = true"
                  v-if="data.cerrado == 0"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Agregar cuenta</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-simple-table height="220" dense fixed-header>
              <thead>
                <tr>
                  <th class="text-left">Cuenta</th>
                  <th class="text-left">Descripción</th>
                  <th class="text-right">Debe</th>
                  <th class="text-right">Haber</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cta, i) in cuentas" :key="cta.id">
                  <td>{{ cta.cuenta }}</td>
                  <td>{{ cta.descripción }}</td>
                  <td class="text-right">
                    {{ cta.debe ? parseFloat(cta.debe).toFixed(2) : "0.00" }}
                  </td>
                  <td class="text-right">
                    {{ cta.haber ? parseFloat(cta.haber).toFixed(2) : "0.00" }}
                  </td>
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          fab
                          text
                          color="red"
                          v-on="on"
                          @click="cuentas.splice(i, 1)"
                          :disabled="data.cerrado>0"
                        >
                          <v-icon small>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>quitar cuenta</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
              <tfoot
                v-if="cuentas.length > 0"
                :class="
                  totales.debe == totales.haber ? 'blue--text' : 'red--text'
                "
              >
                <tr>
                  <th colspan="2">TOTALES:</th>
                  <th>{{ parseFloat(totales.debe).toFixed(2) }}</th>
                  <th>{{ parseFloat(totales.haber).toFixed(2) }}</th>
                </tr>
              </tfoot>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <v-dialog width="500" v-model="dlg">
      <v-card>
        <v-card-title class="pa-0 grey lighten-4">
          <v-btn fab small text disabled> <v-icon>mdi-plus</v-icon> </v-btn
          >Agregar cuenta
          <v-spacer></v-spacer>
          <v-btn fab small dark color="error" @click="dlg = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-flex>
            <v-autocomplete
              label="Cuenta:"
              class="mr-2"
              :items="cuentasDetalle"
              hide-no-data
              item-value="id"
              item-text="fullText"
              v-model="selectedCta.id_cuenta"
            />
            <v-text-field
              label="Concepto:"
              class="mr-2"
              v-model="selectedCta.concepto"
            />
            <v-layout row>
              <v-text-field
                label="Debe:"
                class="mr-2 numero"
                v-model="selectedCta.debe"
              />
              <v-text-field
                label="Haber:"
                class="mr-2 numero"
                v-model="selectedCta.haber"
              />
            </v-layout>
          </v-flex>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-text="'Insertar'"
            color="primary"
            dark
            @click="agregarCuenta()"
            :disabled="
              (selectedCta.debe <= 0 && selectedCta.haber <= 0) ||
                selectedCta.id_cuenta == 0
            "
          />
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dlgFind: false,
      find: "",
      data: {
        id: 0,
        fecha: "",
        tipo_fondo: 1,
        sucursal: 0,
        fondo: 0,
        sector: 0,
        número: "",
        descripción: "",
        cerrado: 0,
      },
      dataInit: {
        id: 0,
        fecha: "",
        tipo_fondo: 1,
        sucursal: 0,
        fondo: 0,
        sector: 0,
        número: "",
        descripción: "",
        cerrado: 0,
      },
      dlg: false,
      dlgBuscar: "",
      selectedCta: {
        id_cuenta: 0,
        cuenta: "",
        descripción: "",
        debe: 0,
        haber: 0,
        concepto: "",
      },
      cuentas: [],
      numerosDeComprobantes: [],
    };
  },
  methods: {
    limpiar: function() {
      let mv = this;
      mv.data = Object.assign({}, mv.dataInit);
      mv.cuentas = [];
    },
    getComprobante(id) {
      var mv = this;
      fetch(mv.$store.state.api + "/get", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tabla: "contcomprobantes",
          campos: "*",
          condición: "id=" + id,
        }),
      })
        .then((json) => {
          return json.json();
        })
        .then((r) => {
          if (!r.errno) {
            mv.dlgFind = false;
            if (!r[0]) {
              return;
            }
            r[0].fecha = r[0].fecha.substr(0, 10);
            mv.data = r[0];
            fetch(mv.$store.state.api + "/get", {
              method: "post",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                tabla: "view_detallecomprobante",
                campos: "*",
                condición: "id_comprobante=" + r[0].id,
              }),
            })
              .then((json2) => {
                return json2.json();
              })
              .then((r2) => {
                mv.cuentas = r2;
              });
          } else {
            console.log(r);
          }
        });
    },
    guardarComprobante() {
      var mv = this;
      var children = [];

      mv.cuentas.forEach((cta) => {
        var myCta = {};
        Object.keys(cta).forEach((k) => {
          if (k != "cuenta" && k != "descripción") {
            myCta[k] = cta[k];
          }
        });
        children.push(myCta);
      });
      var data = {
        tabla: "contcomprobantes",
        data: mv.data,
        children: children,
        childTable: "contdetallecomprobantes",
        childIdKey: "id_comprobante",
      };
      //console.log(data)
      fetch(mv.$store.state.api + "/save", {
        method: "post",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      })
        .then((d) => {
          return d.text();
        })
        .then((r) => {
          if (!r.errno) {
            mv.$swal({
              icon: "success",
              title: "Guardado correctamente!",
              position: "top-end",
              showConfirmButton: false,
              timer: 4000,
              toast: true,
            });
          } else {
            mv.$swal({
              icon: "success",
              title: `Error ${r.errno}`,
              text: r.sqlMessage,
              position: "top-end",
              showConfirmButton: false,
              timer: 4000,
              toast: true,
            });
          }

          console.log(r);
        });
    },
    clearSelectedCta() {
      var mv = this;
      mv.selectedCta.id_cuenta = 0;
      mv.selectedCta.cuenta = "";
      mv.selectedCta.descripción = "";
      mv.selectedCta.debe = 0;
      mv.selectedCta.haber = 0;
      mv.selectedCta.concepto = "";
    },
    agregarCuenta() {
      var mv = this;
      var myObj = Object.assign({}, mv.selectedCta);
      var myCta = mv.$store.getters.dlookup({
        tabla: "catálogo",
        campo: "id",
        valor: mv.selectedCta.id_cuenta,
      });
      myObj.cuenta = myCta.cuenta;
      myObj.descripción = myCta.descripción;
      mv.cuentas.push(myObj);
      mv.clearSelectedCta();
      mv.dlg = false;
    },
    fechaActual: function() {
      var result = new Date()
        .toLocaleDateString()
        .split("/")
        .reverse();
      var m = [];
      result.forEach((e) => {
        if (e.length == 1) {
          m.push(e.padStart(2, "0"));
        } else {
          m.push(e);
        }
      });
      result = m.join("-");
      //console.log(result)
      return result;
    },
    getNumsComp: function() {
      var mv = this;
      var url = `${mv.$store.state.api}/get`;
      console.log(url);
      fetch(url, {
        body: JSON.stringify({ tabla: "v_numero_de_comprobantes" }),
        method: "post",
        headers: { "content-Type": "application/json" },
      })
        .then((json) => {
          return json.json();
        })
        .then((r) => {
          //console.log('resultado',r)
          mv.numerosDeComprobantes = r;
        });
    },
  },
  computed: {
    cuentasDetalle: function() {
      var mv = this;
      return mv.$store.getters.cuentasDetalle();
    },
    totales: function() {
      var mv = this;
      var debe = 0;
      var haber = 0;
      mv.cuentas.forEach((cta) => {
        debe += cta.debe ? parseFloat(cta.debe) : 0.0;
        haber += cta.haber ? parseFloat(cta.haber) : 0.0;
      });
      if (debe == haber && debe > 0) {
        if (
          mv.data.fecha.length > 0 &&
          mv.data.sucursal > 0 &&
          mv.data.sector > 0 &&
          mv.data.descripción.length > 0
        ) {
          return { debe: debe, haber: haber, ok: true };
        } else {
          return { debe: debe, haber: haber, ok: false };
        }
      } else {
        return { debe: debe, haber: haber, ok: false };
      }
    },
  },
  mounted: function() {
    this.data.fecha = this.fechaActual();
    //this.getNumsComp()
  },
};
</script>
<style>
.numero .v-text-field__slot input {
  text-align: right;
}
table thead tr,
table thead tr th {
  background: none !important;
}
table tfoot tr th {
  font-size: 18px !important;
  text-align: right !important;
}
</style>
