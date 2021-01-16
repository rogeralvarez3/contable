<template>
  <v-app>
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
          <v-flex>
            <v-text-field
              label="Buscar"
              v-model="buscar"
              prepend-inner-icon="mdi-magnify"
              class="ml-2"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-simple-table dense>
          <thead>
            <tr>
              <th >CUENTA</th>
              <th >DESCRIPCIÓN</th>
              <th></th>
              <th></th>
            </tr>
            
          </thead>
          <tbody>
            <tr>
              
            </tr>
          </tbody>
        </v-simple-table>
      </v-flex>
    </v-layout>
  </v-app>
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
  },
};
</script>

<style>
.rpt {
  width: 650px;
  height: 800px;
}
</style>
