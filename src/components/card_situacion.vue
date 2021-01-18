<template>
  <div>
    <v-card width="420" class="ma-1">
      <v-card-title
        v-text="situación.text"
        class="blue-grey lighten-5 pt-1 pb-1 text-lowercase"
        v-model="buscar"
      ></v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table dense>
          <thead>
            <tr>
              <th></th>
              <th>Debe</th>
              <th>Haber</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pago in this.$store.state.tipos_pago" :key="pago.value">
              <th>{{ pago.text }}:</th>
              <td
                @dblclick="
                  selected.id = showLink(pago.value, 0).value;
                  selected.id_pago = pago.value;
                  selected.mov = 'id_cuenta_debe';
                  dlg = true;
                "
                class="clickeable"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span
                      v-on="on"
                    >{{ value2text('id',showLink(pago.value, 0).text,'catálogo').cuenta }}</span>
                  </template>
                  <span>{{ value2text('id',showLink(pago.value, 0).text,'catálogo').descripción }}</span>
                </v-tooltip>
              </td>
              <td
                @dblclick="
                  selected.id = showLink(pago.value, 0).value;
                  selected.id_pago = pago.value;
                  selected.mov = 'id_cuenta_haber';
                  
                  dlg = true;
                "
                class="clickeable"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span
                      v-on="on"
                    >{{ value2text('id',showLink(pago.value, 1).text,'catálogo').cuenta }}</span>
                  </template>
                  <span>{{ value2text('id',showLink(pago.value, 1).text,'catálogo').descripción }}</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog width="600" v-model="dlg">
      <v-card>
        <v-card-title>
          <v-text-field
            dense
            single-line
            hide-details
            outlined
            append-icon="mdi-magnify"
            label="Buscar"
            v-model="buscar"
          ></v-text-field>
        </v-card-title>

        <v-card-text>
          <v-simple-table dense height="350" fixed-header class="bordered">
            <thead>
              <tr>
                <th>cuenta</th>
                <th>descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cta in $store.getters.cuentasDetalle(buscar)"
                :key="cta.cuenta"
                @click="selected.cuenta = cta.id"
                @dblclick="save()"
                :class="selected.cuenta == cta.id? 'selected' : ''"
              >
                <td>{{ cta.cuenta }}</td>
                <td>{{ cta.descripción }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-divider class="borde-oscuro"></v-divider>
        <v-card-actions class="grey lighten-2">
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="save()">Aceptar</v-btn>
          <v-btn small @click="dlg = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "card-situación",
  props: {
    sector: Number,
    situación: Object,
    clasificación: Number,
    tipo_fondo:Number
  },
  data() {
    return {
      dlg: false,
      buscar: "",
      selected: { id: 0, id_pago: 0, mov: "", cuenta: "" }
    };
  },
  methods: {
    save: function() {
      var mv = this;
      mv.$store.commit("setCargando", true);
      var data = {
        tabla: "cont_integracion",
        data: {
          id: mv.selected.id ? mv.selected.id : 0,
          clasificación: mv.clasificación,
          id_situación: mv.situación.value,
          id_sector: mv.sector,
          id_pago: mv.selected.id_pago,
          tipo_fondo:mv.tipo_fondo,
          [mv.selected.mov]: mv.selected.cuenta
        }
      };

      fetch(mv.$store.state.api + "/save", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(d => {
          return d.json();
        })
        .then(r => {
          console.log(r);
          mv.$store.dispatch("getData", {
            tabla: "cont_integracion",
            variable: "enlaces"
          });
          mv.$store.commit("setCargando", false);
          mv.dlg = false;
        });
    },
    showLink: function(idPago, mov) {
      var mv = this;
      var links = mv.$store.state.enlaces;
      var result = links.filter(l => {
        return (
          l.clasificación == mv.clasificación &&
          l.id_pago == idPago &&
          l.id_sector == mv.sector &&
          l.id_situación == mv.situación.value
        );
      });
      if (result.length > 0) {
        result = result[0];
        if (mov == 0) {
          return { value: result.id, text: result.id_cuenta_debe };
        } else {
          return { value: result.id, text: result.id_cuenta_haber };
        }
      } else {
        return { id: 0, text: "" };
      }
    },
    value2text: function(keyBuscada, valor, variable) {
      var mv = this;
      var result = mv.$store.state[variable].filter(f => {
        return f[keyBuscada] === valor;
      });
      if (result.length === 0) {
        return "";
      } else {
        return result[0];
      }
    }
  },
  computed: {
   
  }
};
</script>

<style scoped>
.theme--light.v-data-table.v-data-table--fixed-header thead th {
  text-transform: capitalize;
  color: black;
  background: linear-gradient(to top, rgb(254, 254, 254) 0%, #ddd 100%);
}

.bordered {
  border: 1px solid #ddd;
  box-shadow: 1px 1px 3px #555;
  margin-top: 1em;
}
.v-dialog table tr,
.clickeable {
  cursor: pointer;
}
.selected,
.v-dialog tr:hover td {
  background: linear-gradient(
    to bottom,
    rgba(100, 180, 255, 0.3) 0%,
    rgba(100, 149, 255, 0.2)
  );
  color: darkslateblue;
}
tr:hover:not(.selected) td {
  background-color: initial;
  color: initial;
}
.borde-oscuro {
  border-top: 1px solid #ccc;
}
</style>