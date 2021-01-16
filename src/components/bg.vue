<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <v-layout class="col-3">
          <v-flex>
            <v-text-field
              v-model="rpt.período"
              label="Período"
              v-mask="'##-####'"
              placeholder="ejemplo 01-2020 (enero 2020)"
            ></v-text-field> </v-flex
          ><v-spacer></v-spacer>
        </v-layout>
        <v-simple-table dense>
          <thead>
            <tr>
              <th>CUENTAS</th>
              <th>MONTO</th>
              <th>TOTALES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cta, i) in cuentasMayores" :key="i">
              <td>
                <span class="relleno" v-if="cta.nivel > 1">{{
                  cta.cuenta + " - " + cta.descripción
                }}</span
                ><strong v-else>{{
                  cta.cuenta + " - " + cta.descripción
                }}</strong>
              </td>
              <td class="right"><span v-if="cta.nivel > 1">0.00</span></td>
              <td class="right"><strong v-if="cta.nivel == 1">0.00</strong></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">TOTALES</td>
              <td colspan="2" class="right">0.00</td>
            </tr>
          </tfoot>
        </v-simple-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { jsPDF } from "jspdf";
export default {
  props: { title: String },
  data() {
    return {
      buscar: "",
      rpt: { período: "01-2020", mostrar: 0, doc: "" },
    };
  },
  methods: {
    generarPdf: function() {
      let mv = this;
      let doc = new jsPDF("p", "pt", "letter");
      doc.addImage(mv.logo, "JPEG", 40, 40);
      doc.text(mv.title, 150, 80);
      let uri = doc.output("datauristring");
      console.log(uri);
      mv.rpt.doc = uri;
    },
  },
  computed: {
    cuentasDetalle: function() {
      var mv = this;
      return mv.$store.getters.cuentasDetalle(mv.buscar);
    },
    cuentasMayores: function() {
      let mv = this;
      return mv.$store.state.catálogo.filter((item) => {
        let tipo = parseInt(item.cuenta.split("-")[0]);
        return item.nivel <= 3 && tipo <= 3;
      });
    },
  },
};
</script>

<style>
.rpt {
  width: 650px;
  height: 800px;
}
tfoot tr td,
thead tr th {
  background: linear-gradient(to bottom, #eeeeee 0%, #dddddd 10%);
  font-weight: bold;
}
.relleno {
  padding-left: 30px;
}
</style>
