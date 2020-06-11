<template>
  <v-container>
    <v-card width="900" class="mt-2">
      <v-card-title class="pa-0">
        <v-btn fab small text disabled>
          <v-icon>mdi-file</v-icon>
        </v-btn>Comprobantes de diario
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn fab small dark color="success" v-on="on" v-if="totales.ok">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span>Guardar comprobante</span>
        </v-tooltip>
        <v-btn fab small dark color="error" to="/">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row class="pa-2">
          <v-text-field label="Fecha:" type="date" class="mr-2" :value="fechaActual()"></v-text-field>
          <v-select label="Sucursal:" :items="$store.state.sucursales" class="mr-2"></v-select>
          <v-select label="Fondo:" :items="$store.state.sectores" class="mr-2"></v-select>
          <v-autocomplete label="Número de asiento:" class="mr-2" hide-no-data></v-autocomplete>
          <v-textarea label="Descripción:" class="mr-2"></v-textarea>
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
            <v-simple-table height="300" dense fixed-header>
              <thead>
                <tr>
                  <th class="text-left">Código</th>
                  <th class="text-left">Cuenta</th>
                  <th class="text-right">Debe</th>
                  <th class="text-right">Haber</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cta in cuentas" :key="cta.id">
                  <td>{{cta.cuenta}}</td>
                  <td>{{cta.descripción}}</td>
                  <td>
                    <v-text-field type="text" class="numero" v-model="cta.debe" dense hide-details />
                  </td>
                  <td>
                    <v-text-field
                      type="text"
                      class="numero"
                      v-model="cta.haber"
                      dense
                      hide-details
                    />
                  </td>
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
                <th colspan="2">TOTALES:</th>
                <th>{{totales.debe}}</th>
                <th>{{totales.haber}}</th>
              </tfoot>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <v-dialog width="600" v-model="dlg">
      <v-card>
        <v-card-title class="pa-0">
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
          <v-flex class="pa-2">
            <v-text-field
              outlined
              hide-details
              dense
              placeholder="Buscar..."
              v-model="dlgBuscar"
              append-icon="mdi-magnify"
            ></v-text-field>
            <v-simple-table dense fixed-header height="300">
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="cta in cuentasDetalle"
                  :key="cta.value"
                  @dblclick="cuentas.push({id:cta.id,cuenta:cta.cuenta,descripción:cta.descripción,debe:0,haber:0})"
                >
                  <td>{{cta.cuenta}}</td>
                  <td>{{cta.descripción}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dlg: false,
      dlgBuscar: "",
      selectedCta: {},
      cuentas: []
    };
  },
  methods: {
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
      if (debe == haber && debe>0) {
        return { debe: debe, haber: haber,ok:true };
      } else {
        return { debe: debe, haber: haber,ok:false };
      }
    }
  }
};
</script>
<style>
.numero .v-text-field__slot input {
  text-align: right;
}
table tfoot th {
  font-size: 18px !important;
  text-align: right !important;
}
</style>