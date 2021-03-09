<template>
  <v-app>
    <v-layout row>
      <v-btn fab absolute top right @click="generarPdf()"
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
              v-model="rpt.soloconmovimientos"
              label="Ver solo cuentas con movimientos"
            ></v-checkbox>
            <v-btn @click="generarBalanza()">Generar</v-btn>
          </v-flex>
        </v-layout>
        <table id="tabla" v-if="balanza.length>0">
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
              v-show="
                rpt.soloconmovimientos
                  ? item.debe2 > 0 || item.haber2 > 0
                  : true
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
          ><v-btn
            small
            fab
            dark
            color="error"
            @click="
              dlg = false;
              rpt.doc = '';
            "
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
        soloconmovimientos: false,
        doc: "",
        tipoFondo: 1,
        fondo: 1,
        sucursal: 1,
        sector: 1,
      },
      balanza: [],
      niveles: ["red", "pink", "purple", "deep-purple", "indigo", "blue"],

      dlg: false,
    };
  },
  methods: {
    generarPdf: async function () {
      let mv = this;
      mv.$store.commit("setCargando", true);

      let doc = new jsPDF({
        orientation: "landscape",
        unit: "cm",
        format: [22, 28],
      });
      let fetchResult = await fetch(`${mv.$store.state.api}/segoeUi.txt`)
        .then((file) => {
          return file.text();
        })
        .then((res) => {
          return res;
        });
      let segoeUi = await fetchResult;
      fetchResult = await fetch(`${mv.$store.state.api}/seguibl.txt`)
        .then((file) => {
          return file.text();
        })
        .then((res) => {
          return res;
        });
      let seguiBl = await fetchResult;

      doc.addImage(mv.$store.state.logo, "PNG", 1, 1, 1, 1);
      doc.addFileToVFS("seguibl.ttf", seguiBl);
      doc.addFont("seguibl.ttf", "seguiBl", "bold");
      doc.addFileToVFS("segoeui.ttf", segoeUi);
      doc.addFont("segoeui.ttf", "segoeUi", "normal");
      doc.setFont("seguiBl", "bold");
      doc.text(mv.title, 2.5, 1.8);
      doc.setLineWidth(0.01);
      doc.line(1, 2.3, 27, 2.3);
      //doc.setFontSize(8)
      doc.autoTable({
        html: "#tabla",
        showHead: "everyPage",
        headStyles: { fillColor: "#eee", textColor: "black", font: "seguiBl" },
        startY: 2.5,
        styles: { font: "segoeUi", fontSize: 8 },
      });

      doc.setFont("segoeUi", "normal");
      doc.setFontSize(10);
      for (let i = 1; i < doc.internal.pages.length; i++) {
        doc.setPage(i);
        doc.text(
          "página " + i + " de " + (doc.internal.pages.length - 1).toString(),
          23,
          21
        );
      }
      var blobPDF = doc.output("blob");
      var blobUrl = URL.createObjectURL(blobPDF);
      mv.$store.commit("setCargando", false);
      mv.dlg = true;
      mv.rpt.doc = blobUrl;
    },
    generarBalanza: function () {
      let mv = this;
      mv.$store.commit("setCargando", true);
      let params = `'${mv.rpt.período}',${mv.rpt.sucursal},${mv.rpt.tipoFondo},${mv.rpt.fondo}`;
      let data = JSON.stringify({ sp: `balanza(${params})` });
      // eslint-disable-next-line no-debugger

      fetch(`${mv.$store.state.api}/exeSP`, {
        method: "post",
        body: data,
        headers: { "content-type": "application/json" },
      })
        .then((json) => {
          return json.json();
        })
        .then((res) => {
          mv.$store.commit("setCargando", false);
          if (res.length > 1) {
            mv.balanza = res[0];
          }
        });
    },
  },
  computed: {
    sucursales: function () {
      let mv = this;
      let lista = Object.assign([], mv.$store.state.sucursales);
      lista.push({ value: lista[lista.length], text: "TODAS" });
      return lista;
    },
    fondos: function () {
      let mv = this;
      let lista = Object.assign([], mv.$store.state.fondos).filter((item) => {
        return item.tipo == 2;
      });
      lista.push({ value: mv.$store.state.fondos.length, text: "TODOS" });
      mv.rpt.fondo = mv.$store.state.fondos.length;
      return lista;
    },
  },
  mounted: function () {
    let mv = this;
    let now = new Date();
    mv.rpt.período =
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getFullYear();
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
