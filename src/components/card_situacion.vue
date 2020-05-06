<template>
  <div>
    <v-card width="420" class="ma-1">
      <v-card-title
        v-text="situacion.text"
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
              <th>{{pago.text}}:</th>
              <td
                @dblclick="selected.id_pago=pago.value;selected.mov='id_cuenta_debe';dlg=true"
                class="clickeable"
              >
                <span>{{showLink(pago.value,0)}}</span>
              </td>
              <td
                @dblclick="selected.id_pago=pago.value;selected.mov='id_cuenta_haber';dlg=true"
                class="clickeable"
              >
                <span>{{showLink(pago.value,1)}}</span>
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
                v-for="cta in cuentasDetalle"
                :key="cta.value"
                @click="selected[selected.mov]=cta.value"
                :class="selected[selected.mov]==cta.value?'selected':''"
              >
                <td>{{ cta.text.split( ' - ' )[0] }}</td>
                <td>{{ cta.text.split( ' - ' )[1] }}</td>
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
    situacion: Object,
    clasificación: Number
  },
  data() {
    return {
      dlg: false,
      buscar: "",
      selected: { id_pago: 0, id_cuenta_debe: 0, id_cuenta_haber: 0 }
    };
  },
  methods: {
    save: function() {
      var mv = this;
      mv.$store.commit("setCargando", true);
      var data = {
        tabla: "cont_integracion",
        data: {
          id: 0,
          clasificación: mv.clasificación,
          id_situación: mv.situacion.id,
          id_sector: mv.sector,
          id_pago: mv.selected.id_pago,
          id_cuenta_debe: mv.selected.id_cuenta_debe,
          id_cuenta_haber: mv.selected.id_cuenta_haber
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
          l.id_situación == mv.situacion.id
        );
      });
      if (result.length > 0) {
        if (mov == 0) {
          return result.id_cuenta_debe;
        } else {
          return result.id_cuenta_haber;
        }
      } else {
        return "";
      }
    }
  },
  computed: {
    cuentasDetalle: function() {
      var mv = this;
      var filtro = this.$store.state.catálogo.filter(cta => {
        return cta.tipo == 2;
      });
      var result = [];
      filtro.forEach(cta => {
        result.push({
          value: cta.id,
          text: cta.cuenta + " - " + cta.descripción
        });
      });
      result = result.filter(f => {
        return f.text.toLowerCase().indexOf(mv.buscar.toLowerCase()) >= 0;
      });
      return result;
    }
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