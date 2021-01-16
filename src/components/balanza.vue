<template>
  <v-app>
    <v-layout row>
      <v-btn
        fab
        absolute
        top
        right
        @click="
          generarPdf();
          dlg = true;
        "
        ><v-icon>mdi-printer</v-icon></v-btn
      >
      <v-flex>
        <v-layout class="col-4">
          <v-flex>
            <v-text-field
              v-model="rpt.período"
              label="Período"
              v-mask="'##-####'"
              placeholder="ejemplo 01-2020 (enero 2020)"
            ></v-text-field>
            <v-select
              :items="[
                { value: 0, text: 'Solo cuentas de detalle' },
                { value: 1, text: 'Solo cuentas de resumen' },
                { value: 2, text: 'Todas las cuentas' },
              ]"
              label="Mostrar"
              v-model="rpt.mostrar"
            ></v-select>

            <v-select
              label="Tipo de fondo"
              :items="[
                { value: 1, text: 'PROPIOS' },
                { value: 2, text: 'ADMINISTRADOS' },
              ]"
              v-model="rpt.tipoFondo"
            ></v-select>
            <v-select
              label="Sucursal"
              :items="sucursales"
              v-model="rpt.sucursal"
              v-if="rpt.tipoFondo == 1"
            ></v-select>
            <v-select
              label="Fondo"
              :items="fondos"
              v-model="rpt.fondo"
              v-else
            ></v-select>
            <v-select
              label="Sector"
              :items="$store.state.sectores"
              v-model="rpt.sector"
            ></v-select> </v-flex
          ><v-spacer></v-spacer>
          <v-flex>
            <v-text-field
              label="Buscar"
              v-model="buscar"
              prepend-inner-icon="mdi-magnify"
              class="ml-2"
            ></v-text-field>
            <v-checkbox
              class="ml-2"
              v-model="rpt.soloconmoviientos"
              label="Ver solo cuentas con movimientos"
            ></v-checkbox>
            <v-btn @click="generarBalanza()">Generar</v-btn>
          </v-flex>
        </v-layout>
        <table id="tabla">
          <thead class="font-weight-black">
            <tr>
              <td rowspan="2">CUENTA</td>
              <td rowspan="2">DESCRIPCIÓN</td>
              <td colspan="2">SALDO ANTERIOR</td>
              <td colspan="2">MOVIMIENTOS</td>
              <td colspan="2">SALDO ACTUAL</td>
            </tr>
            <tr>
              <td class="right">debe</td>
              <td class="right">haber</td>
              <td class="right">debe</td>
              <td class="right">haber</td>
              <td class="right">debe</td>
              <td class="right">haber</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in balanza"
              :key="i"
              :class="
                item.nivel == 1
                  ? `font-weight-bold ${niveles[item.nivel - 1]}--text`
                  : `${niveles[item.nivel - 1]}--text`
              "
            >
              <td>
                <span v-if="rpt.mostrar > 0">{{ " ".repeat(item.nivel) }}</span
                >{{ item.cuenta }}
              </td>
              <td>{{ item.descripción }}</td>
              <td class="right">{{ item.debe1 }}</td>
              <td class="right">{{ item.haber1 }}</td>
              <td class="right">{{ item.debe2 }}</td>
              <td class="right">{{ item.haber2 }}</td>
              <td class="right">{{ item.debe3 }}</td>
              <td class="right">{{ item.haber3 }}</td>
            </tr>
          </tbody>
        </table>
      </v-flex>
    </v-layout>
    <v-dialog width="800" v-model="dlg" persistent>
      <v-card>
        <v-card-title class="grey lighten-4 pa-0 pl2"
          >Balanza de comprobación <v-spacer></v-spacer
          ><v-btn small fab dark color="error" @click="dlg = false"
            ><v-icon small>mdi-close</v-icon></v-btn
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text class="pa-2">
          <iframe
            :src="rpt.doc"
            frameborder="0"
            width="100%"
            height="650"
          ></iframe>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default {
  props: { title: String },
  data() {
    return {
      buscar: "",
      rpt: {
        período: "01-2020",
        mostrar: 0,
        soloconmoviientos: false,
        doc: "",
        tipoFondo: 1,
        fondo: 1,
        sucursal: 1,
        sector: 1,
      },
      balanza: [],
      niveles: ["red", "pink", "purple", "deep-purple", "indigo", "blue"],
      logo:
        "data:image/jpeg;base64,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",
      dlg: false,
    };
  },
  methods: {
    generarPdf: function() {
      let mv = this;
      let doc = new jsPDF({
        orientation: "landscape",
        unit: "cm",
        format: [22, 28],
      });
      doc.addImage(mv.logo, "JPEG", 1, 1, 1, 1);
      doc.setFontSize(16);
      doc.setFont("courier", "bold");
      doc.text(mv.title, 2.5, 1.8);
      doc.setLineWidth(0.01);
      doc.line(1, 2.3, 27, 2.3);
      doc.autoTable({
        html: "#tabla",
        showHead: "everyPage",
        headStyles: { fillColor: "#eee", textColor: "black" },
        startY: 2.5,
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      for (let i = 1; i < doc.internal.pages.length; i++) {
        doc.setPage(i);
        doc.text(
          "página " + i + " de " + (doc.internal.pages.length - 1).toString(),
          23,
          21
        );
      }
      let uri = doc.output("datauristring");
      //console.log(uri);
      mv.rpt.doc = uri;
    },
    generarBalanza: function() {
      let mv = this;
      let params = `'${mv.rpt.período}',${mv.rpt.sucursal},${mv.rpt.tipoFondo},${mv.rpt.fondo},${mv.rpt.sector}`;
      let data = JSON.stringify({ sp: `balanza(${params})` });
      fetch(`${mv.$store.state.api}/exeSP`, {
        method: "post",
        body: data,
        headers: { "content-type": "application/json" },
      })
        .then((json) => {
          return json.json();
        })
        .then((res) => {
          if (res.length > 1) {
            mv.balanza = res[0];
          }
        });
    },
  },
  computed: {
    sucursales: function() {
      let mv = this;
      let lista = Object.assign([], mv.$store.state.sucursales);
      lista.push({ value: lista[lista.length], text: "TODAS" });
      return lista;
    },
    fondos: function() {
      let mv = this;
      let lista = Object.assign([], mv.$store.state.fondos).filter((item) => {
        return item.tipo == 2;
      });
      lista.push({ value: mv.$store.state.fondos.length, text: "TODOS" });
      mv.rpt.fondo = mv.$store.state.fondos.length;
      return lista;
    },
  },
};
</script>

<style scoped>
.rpt {
  width: 650px;
  height: 800px;
}
table {
  border-collapse: collapse;
  border: 1px solid #ddd;
  border-radius: 4px;
}

table tr th,
table tr td {
  border: 1px solid #ddd;
  padding: 2px 6px;
}
table tbody tr td {
  border-width: 0 0 1px 0 !important;
}
table tbody tr:nth-child(even) {
  background-color: rgb(250, 250, 250);
}
thead {
  background: linear-gradient(to bottom, #fefefe 0%, #eeeeee 100%);
}
.right {
  text-align: right !important;
}
</style>
