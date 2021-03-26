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
                  <th>Número</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in comprobantes"
                  :key="i"
                  @click="getComprobante(row.id)"
                >
                  <td>{{ row.id }}</td>
                  <td>
                    {{ row.fecha.split("T")[0].split("-").reverse().join("/") }}
                  </td>
                  <td>{{ row.sucursal ? row.sucursal.toLowerCase() : "" }}</td>
                  <td>{{ row.fondo ? row.fondo.toLowerCase() : "" }}</td>
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
        >Comprobantes de cheques
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
              :disabled="data.cerrado == 0"
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
              :disabled="!totales.ok || data.cerrado > 0"
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
              @click="generarDetallePropagado()"
              :disabled="!totales.ok || data.id == 0"
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
              :disabled="!totales.ok || data.cerrado > 0"
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
            v-model="fechaactual"
            disabled
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
                return f.tipo == data.tipo_fondo;
              })
            "
            class="mr-2"
            v-model="data.fondo"
            :disabled="data.cerrado > 0"
            v-if="data.tipo_fondo > 1"
          ></v-select>
          <div width="100" class="mr-1">
            <v-text-field label="Número de cheque" v-model="data.consecutivo" disabled></v-text-field>
          </div>
          
          <v-text-field
            label="A nombre de:"
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
                    {{
                      cta.debe
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(cta.debe)
                        : "0.00"
                    }}
                  </td>
                  <td class="text-right">
                    {{
                      cta.haber
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(cta.haber)
                        : "0.00"
                    }}
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
                          :disabled="data.cerrado > 0"
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
            <v-checkbox
              v-model="selectedCta.cuentaDeBanco"
              label="Es cuenta de banco"
            ></v-checkbox>

            <v-layout row>
              <v-text-field
                v-if="!selectedCta.cuentaDeBanco"
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
    <v-dialog width="700" v-model="dlgPreview">
      <v-card>
        <v-card-text class="pa-0">
          <iframe
            :src="docPdf"
            frameborder="0"
            height="600"
            width="700"
          ></iframe>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dlgPreview = false">CERRAR</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const util = require("../../utils");
export default {
  data() {
    return {
      dlgFind: false,
      dlgPreview: false,
      docPdf: "",
      find: "",
      data: {
        id: 0,
        fecha: "",
        tipo_fondo: 1,
        sucursal: 0,
        fondo: 0,
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
        cuentaDeBanco: false,
      },
      cuentas: [],
      detallePropagado: [],
      documento: "",
    };
  },
  watch: {
    fechaactual() {
      this.data.fecha = this.fechaactual;
    },
  },
  methods: {
    limpiar: function () {
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
                tabla: "view_suma_detallecomprobante",
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
      mv.data.fecha = mv.fechaactual;
      var data = {
        tabla: "contcomprobantes",
        data: mv.data,
        children: children,
        childTable: "contdetallecomprobantes",
        childIdKey: "id_comprobante",
      };
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
      let mv = this;
      let myObj = Object.assign({}, mv.selectedCta);
      /*let idx = mv.cuentas.findIndex((cta) => {
        return cta.id_cuenta == mv.selectedCta.id_cuenta;
      });
      if (idx >= 0) {
        mv.$swal
          .fire({
            icon: "question",
            title: "Cuenta encontrada",
            text:
              "Se ha encontrado esta misma cuenta en el detalle del comprobante.\n¿Desea sumarle la cantidad?",
            //showConfirmButton:true,
            showCancelButton: true,
          })
          .then((res) => {
            if (res.value) {
              mv.cuentas[idx].debe =
                parseFloat(mv.cuentas[idx].debe) +
                parseFloat(mv.selectedCta.debe);
              mv.cuentas[idx].haber =
                parseFloat(mv.cuentas[idx].haber) +
                parseFloat(mv.selectedCta.haber);
            }
            mv.clearSelectedCta();
            mv.dlg = false;
          });
      } else {*/
      let myCta = mv.$store.getters.dlookup({
        tabla: "catálogo",
        campo: "id",
        valor: mv.selectedCta.id_cuenta,
      });
      myObj.cuenta = myCta.cuenta;
      myObj.descripción = myCta.descripción;
      mv.cuentas.push(myObj);
      mv.clearSelectedCta();
      mv.dlg = false;
      //}
    },
    generarDetallePropagado: function () {
      let mv = this;
      let result = [];
      let totales = {
        cuenta: "",
        descripción: "TOTALES ===============>",
        nivel: 3,
        debe: 0,
        haber: 0,
      };
      let tfoot = ["TOTALES", 0.0, 0.0];
      mv.cuentas.forEach((cta) => {
        let sub = cta.cuenta.toString().split("-");
        for (let i = sub.length; i > 2; i--) {
          let strL = sub.slice(0, i).join("-");
          let strR = cta.cuenta
            .toString()
            .substr(strL.length, cta.cuenta.length - strL.length);
          let strNew = strL + strR.replace(/[1-9]/g, "0");
          let existente = result.findIndex((row) => {
            return row.cuenta == strNew;
          });
          let strCuentaCat = mv.$store.state.catálogo.filter((item) => {
            return item.cuenta == strNew;
          })[0];
          if (strCuentaCat.nivel == 3 || strCuentaCat.nivel == 6) {
            if (existente < 0) {
              result.push({
                // id: strCuentaCat.id,
                cuenta: strNew,
                descripción: strCuentaCat.descripción,
                nivel: strCuentaCat.nivel,
                debe: parseFloat(cta.debe),
                haber: parseFloat(cta.haber),
              });
            } else {
              result[existente].debe =
                parseFloat(result[existente].debe) + parseFloat(cta.debe);
              result[existente].haber =
                parseFloat(result[existente].haber) + parseFloat(cta.haber);
            }
          }
        }
      });
      result = util.ordenar(result);
      result.forEach(item=>{
        item.cuenta=item.cuenta.replace(/-/g,'')
      })
      result.forEach((r) => {
        totales.debe += r.nivel == 3 ? parseFloat(r.debe) : 0;
        totales.haber += r.nivel == 3 ? parseFloat(r.haber) : 0;
      });
      tfoot = [
        [
          { content: "TOTALES", colSpan: 4,styles:{halign:"center"} },
          {
            content: new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(totales.debe),
            styles: { halign: "right" },
          },
          {
            content: new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(totales.haber),
            styles: { halign: "right" },
          },
        ],
      ];
      //result.push(totales);
      //console.log(result);
      // return result;
      mv.generarPdf(result, tfoot);
    },
    generarPdf: function (cuentas, tfoot) {
      let mv = this;
      let doc = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: "letter",
      });
      let info = mv.$store.state.info[0];
      //-----------------MEMBRETE-------------------------------------//
      doc.addImage(mv.$store.state.logo, "PNG", 1.2, 1, 2.5, 2);
      let nomb = info.nombreinstitucion.split(" ");
      let nomb1 = nomb[0] + " " + nomb[1] + " " + nomb[2];
      let nomb2 = nomb[3] + " " + nomb[4] + " " + nomb[5];
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(nomb1, 4, 1.5);
      doc.text(nomb2, 4, 2);
      doc.text(info.nombreinstitucion2, 4, 2.5);
      doc.setFontSize(9);
      doc.text(`RUC: ${info.ruc}`, 4, 3);
      doc.setFontSize(14);
      doc.text("COMPROBANTE DE CHEQUE", 4, 3.7);
      //--------------------CONTENIDO--------------------------------//
      let linea = 4;
      doc.setLineWidth(0.01);
      doc.rect(12.7, 1, 7.4, 2.9);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Cheque Nº: ${mv.data.número}`, 13, 1.5);
      doc.text(
        `Sucursal: ${
          mv.$store.getters.dlookup({
            tabla: "sucursales",
            campo: "value",
            valor: mv.data.sucursal,
          }).text
        }`,
        13,
        1.9
      );
      doc.text(
        `Tipo de fondo: ${
          mv.data.tipo_fondo == 1 ? "PROPIOS" : "ADMINISTRADOS"
        }`,
        13,
        2.3
      );
      doc.text(
        `Nombre del fondo: ${
          mv.$store.getters.dlookup({
            tabla: "fondos",
            campo: "value",
            valor: mv.data.fondo,
          }).text
        }`,
        13,
        2.7
      );
      doc.setFontSize(10);

      let thead = [
        [
          "CUENTA",
          "DESCRIPCIÓN",
          "",
          {content:"PARCIAL",styles:{halign:"right"}},
          { content: "DEBE", styles: { halign: "right" } },
          { content: "HABER", styles: { halign: "right" } },
        ],
      ];
      let tbody = [];

      cuentas.forEach((cta) => {
        let debe = cta.debe.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        let haber = cta.haber.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        tbody.push([
          cta.cuenta,
          cta.descripción,
          cta.nivel == 6 ? (cta.debe > 0 ? "DE" : "CR") : "",
          cta.nivel == 6 ? (cta.debe > 0 ? debe : haber) : "",
          cta.nivel == 3 ? (cta.debe > 0 ? debe : "") : "",
          cta.nivel == 3 ? (cta.haber > 0 ? haber : "") : "",
        ]);
      });
      linea += 2;
      doc.setFontSize(6);
      doc.text(mv.$store.state.sucursales[0].text, 14, linea);
      let miFecha = mv.data.fecha.split("-");
      doc.text(`${miFecha[2]}    ${miFecha[1]}    ${miFecha[0]}`, 17, linea);
      doc.setFontSize(10);
      linea += 1;
      doc.text(mv.data.descripción, 6, linea);
      doc.text(mv.cantidadEnLetras[1], 14, linea);
      linea += 0.8;
      doc.text(mv.cantidadEnLetras[0], 6, linea);
      linea += 3;
      doc.autoTable({
        head: thead,
        body: tbody,
        foot: tfoot,
        startY: linea,
        startX: 1,
        theme: "plain",
        styles: { fontSize: 9 },
        columnStyles: {
          3: { halign: "right" },
          4: { halign: "right" },
          5: { halign: "right" },
        },
        willDrawCell: function (data) {
          if (data.section == "head") {
            let lineWidth = 0.0;
            Object.values(data.row.cells).forEach((item) => {
              lineWidth += item.width;
            });
            data.doc.setLineWidth(0.01);
            data.doc.line(
              data.row.cells[0].x,
              data.row.cells[0].y + data.row.cells[0].height,
              lineWidth + data.row.cells[0].x,
              data.row.cells[0].y + data.row.cells[0].height
            );
          } else if (data.section == "foot") {
            let lineWidth = 0.0;
            Object.values(data.row.cells).forEach((item) => {
              lineWidth += item.width;
            });
            data.doc.setLineWidth(0.01);
            data.doc.line(
              data.row.cells[0].x,
              data.row.cells[0].y,
              lineWidth + data.row.cells[0].x,
              data.row.cells[0].y
            );
             data.doc.line(
              data.row.cells[0].x,
              data.row.cells[0].y + data.row.cells[0].height,
              lineWidth + data.row.cells[0].x,
              data.row.cells[0].y + data.row.cells[0].height
            );
          }
        },
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      let finalY = doc.lastAutoTable.finalY;
      if (finalY > 24) {
        doc.addPage();
      }
      doc.setDrawColor("#555");
      doc.line(3, 24.5, 10, 24.5);
      doc.line(12, 24.5, 19, 24.5);
      doc.text("Elaborado por:", 3, 25);
      doc.text("Elaborado por:", 12, 25);
      //===================PIE DE PÁGINA===========================//
      for (let i = 1; i < doc.internal.pages.length; i++) {
        doc.setPage(i);
        doc.text(
          "página " + i + " de " + (doc.internal.pages.length - 1).toString(),
          17,
          26.7
        );
      }
      mv.docPdf = doc.output("dataurlstring");
      mv.dlgPreview = true;
    },
  },
  computed: {
    cantidadEnLetras: function () {
      let mv = this;
      let result = [];
      mv.cuentas.forEach((item) => {
        let idx = mv.$store.state.bancos.findIndex((b) => {
          return item.descripción.indexOf(b.nombre) >= 0;
        });

        if (idx >= 0) {
          result = [
            util.num2Letras(item.haber, ".", "córdobas"),
            "C$ " + new Intl.NumberFormat("en-US").format(item.haber),
          ];
        }
      });
      return result;
    },
    comprobantes: function () {
      let mv = this;
      let result = mv.$store.getters.comprobantes(mv.find).filter((item) => {
        return item.escheque > 0;
      });
      return result;
    },
    fechaactual: function () {
      return this.$store.state.fecha_trabajo[0].fechaactual.split("T")[0];
    },
    cuentasDetalle: function () {
      var mv = this;
      return mv.$store.getters.cuentasDetalle();
    },
    totales: function () {
      var mv = this;
      var debe = 0;
      var haber = 0;
      mv.cuentas.forEach((cta) => {
        debe += cta.debe ? parseFloat(cta.debe) : 0.0;
        haber += cta.haber ? parseFloat(cta.haber) : 0.0;
      });
      if (debe == haber && debe > 0) {
        if (
          mv.data.sucursal > 0 &&
          mv.data.descripción.length > 0 &&
          mv.data.fondo > 0
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
