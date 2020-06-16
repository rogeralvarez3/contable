<template>
  <v-container>
    <v-card width="900" class="mt-2">
      <v-card-title class="pa-0">
        <v-btn fab small text disabled>
          <v-icon>mdi-file</v-icon>
        </v-btn>Comprobantes de diario
        <v-spacer></v-spacer>

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
            :value="fechaActual()"
            v-model="data.fecha"
          ></v-text-field>
          <v-select
            label="Sucursal:"
            :items="$store.state.sucursales"
            class="mr-2"
            v-model="data.sucursal"
          ></v-select>
          <v-select
            label="Fondo:"
            :items="$store.state.sectores"
            class="mr-2"
            v-model="data.sector"
          ></v-select>
          <v-text-field
            label="Número de asiento:"
            class="mr-2"
            v-model="data.asiento"
          ></v-text-field>
          <v-text-field label="Descripción:" class="mr-2" multiline v-model="data.descripción"></v-text-field>
        </v-layout>
        <v-card>
          <v-card-title class="pa-0">
            <v-btn fab small text disabled>
              <v-icon>mdi-menu</v-icon>
            </v-btn>Detalle del comprobante
            <v-spacer></v-spacer>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn fab small dark color="primary" v-on="on" @click="dlg=true">
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
                <tr v-for="cta in cuentas" :key="cta.id">
                  <td>{{cta.cuenta}}</td>
                  <td>{{cta.descripción}}</td>
                  <td class="text-right">{{cta.debe}}</td>
                  <td class="text-right">{{cta.haber}}</td>
                  <td>
                    <v-btn small fab text color="red">
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
              <tfoot
                v-if="cuentas.length > 0"
                :class="totales.debe==totales.haber?'blue--text':'red--text'"
              >
                <tr>
                  <th colspan="2">TOTALES:</th>
                  <th>{{totales.debe}}</th>
                  <th>{{totales.haber}}</th>
                </tr>
              </tfoot>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn fab small dark color="success" v-on="on" v-show="totales.ok">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span>Guardar comprobante</span>
        </v-tooltip>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <v-dialog width="500" v-model="dlg">
      <v-card>
        <v-card-title class="pa-0 grey lighten-4">
          <v-btn fab small text disabled>
            <v-icon>mdi-plus</v-icon>
          </v-btn>Agregar cuenta
          <v-spacer></v-spacer>
          <v-btn fab small dark color="error" @click="dlg=false">
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
              v-model="selectedCta.id"
            />
            <v-text-field label="Concepto:" class="mr-2" v-model="selectedCta.concepto" />
            <v-layout row>
              <v-text-field label="Debe:" class="mr-2 numero" v-model="selectedCta.debe" />
              <v-text-field label="Haber:" class="mr-2 numero" v-model="selectedCta.haber" />
            </v-layout>
          </v-flex>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn v-text="'Insertar'" @click="agregarCuenta()" />
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
      data: {
        id: 0,
        fecha: "",
        sucursal: 0,
        sector: 0,
        asiento: "",
        descripción: ""
      },
      dlg: false,
      dlgBuscar: "",
      selectedCta: {
        id: 0,
        cuenta: "",
        descripción: "",
        debe: 0,
        haber: 0,
        concepto: ""
      },
      cuentas: []
    };
  },
  methods: {
    clearSelectedCta() {
      var mv = this;
      mv.selectedCta.id = 0;
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
        valor: mv.selectedCta.id
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
      result.forEach(e => {
        if (e.length == 1) {
          m.push(e.padStart(2, "0"));
        } else {
          m.push(e);
        }
      });
      result = m.join("-");
      return result;
    }
  },
  computed: {
    cuentasDetalle: function() {
      var mv = this;
      return mv.$store.getters.cuentasDetalle(mv.dlgBuscar);
    },
    totales: function() {
      var mv = this;
      var debe = 0;
      var haber = 0;
      mv.cuentas.forEach(cta => {
        debe += parseFloat(cta.debe);
        haber += parseFloat(cta.haber);
      });
      if (debe == haber && debe > 0) {
        if (
          mv.data.fecha.length>0 &&
          mv.data.sucursal > 0 &&
          mv.data.sector > 0 &&
          mv.data.asiento.length > 0 &&
          mv.data.descripción.length > 0
        ) {
          return { debe: debe, haber: haber, ok: true };
        } else {
          return { debe: debe, haber: haber, ok: false };
        }
      } else {
        return { debe: debe, haber: haber, ok: false };
      }
    }
  }
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