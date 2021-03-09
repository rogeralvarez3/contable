<template>
  <v-container>
    <v-card width="450" class="ma-2">
      <v-card-text>
        <table class="lista">
          <tr v-for="(item, i) in enlaces" :key="i">
            <th>{{ item.toString().replace(/_/g, " ") }}:</th>
            <td
              @click="
                selected.item = item;
                dlgCuentas = true;
              "
            >
              {{ showLink(item).replace(/-/g,'') }}
            </td>
          </tr>
        </table>
      </v-card-text>
    </v-card>
    <v-dialog width="600" v-model="dlgCuentas">
      <v-card>
        <v-card-title>
          <v-text-field
            dense
            hide-details
            append-icon="mdi-magnify"
            v-model="buscar"
            placeholder="buscar"
            outlined
          ></v-text-field>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table dense height="400" fixed-header>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in cuentas"
                :key="i"
                @dblclick="
                  selected.cuenta = item.id;
                  save();
                  dlgCuentas = false;
                "
              >
                <td>{{ item.cuenta }}</td>
                <td>{{ item.descripción }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dlgCuentas = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "desembolsos-y-otros",
  props: {
    sector: Number,
    tipo_fondo: Number,
  },
  data() {
    return {
      buscar: "",
      dlgCuentas: false,
      enlaces: [
        "cuenta_deudora",
        "cuenta_transitoria",
        "comisión",
        "gastos_legales",
        "inscripción",
        "seguro_mn",
        "seguro_me",
        "saneamiento",
      ],
      selected: { item: "", cuenta: 0 },
    };
  },
  methods: {
    showLink: function(col) {
      let mv = this;
      let result = mv.$store.state.enlaces_desembolsos.filter((item) => {
        return item.sector == mv.sector && item.tipo_fondo == mv.tipo_fondo;
      });
      if (result.length > 0) {
        let cuenta = mv.$store.state.catálogo.filter((item) => {
          return item.id == result[0][col];
        });
        if (cuenta.length > 0) {
          return cuenta[0].cuenta;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    save: function() {
      let mv = this;
      let enlace = mv.$store.state.enlaces_desembolsos.filter((item) => {
        return item.sector == mv.sector && item.tipo_fondo == mv.tipo_fondo;
      });

      let data = {
        tabla: "cont_enlaces_por_desembolsos",
        data: {
          sector: mv.sector,
          tipo_fondo: mv.tipo_fondo,
          [mv.selected.item]: mv.selected.cuenta,
        },
      };
      if (enlace.length > 0) {
        data.data.id = enlace[0].id;
      }
      fetch(`${mv.$store.state.api}/save`, {
        method: "post",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      })
        .then((json) => {
          return json.json();
        })
        .then((res) => {
          if (res.errNo) {
            console.log(res.errNo);
          } else {
            mv.$store.dispatch("getData", {
              tabla: "cont_enlaces_por_desembolsos",
              variable: "enlaces_desembolsos",
            });
          }
        });
    },
  },
  computed: {
    cuentas: function() {
      let mv = this;
      let result = mv.$store.getters.cuentasDetalle(mv.buscar);
      return result;
    },
    item_activo: function() {
      let mv = this;
      let result = mv.$store.state.enlaces_desembolsos.filter((item) => {
        return (
          item.sucursal == mv.sucursal &&
          item.tipo_fondo == mv.tipo_fondo &&
          item.fondo == mv.tipo_fondo &&
          item.sector == mv.sector
        );
      });
      return result;
    },
  },
};
</script>

<style scoped>
.theme--light.v-data-table.v-data-table--fixed-header thead th {
  background: linear-gradient(to top, white 0%, #fff 100%) !important;
}
tbody td {
  cursor: pointer;
}
.lista tr {
  padding: 2px;
}
.lista th {
  text-align: left;
  text-transform: capitalize;
  width: 150px;
}
.lista td {
  border-bottom: 1px solid #ddd;
  width: 300px;
}
.lista td,
.lista th {
  padding: 4px;
  cursor: pointer;
}
</style>
