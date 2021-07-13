<template>
  <v-container>
    <v-dialog width="1100" v-model="dlgFind">
      <v-card>
        <v-card-title>
          <div class="pl-2">Lista de comprobantes</div>
          <v-spacer></v-spacer>
          <div width="200" class="mr-1">
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
          </div>

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
                  <th>Tipo fondo</th>
                  <th>Sucursal</th>
                  <th>Fondo</th>
                  <th>Referencia</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in comprobantes"
                  :key="i"
                  @click="getComprobante(row.id)"
                >
                  <td>{{ row.id.toString().padStart(10, "0") }}</td>
                  <td>
                    {{ row.fecha.split("T")[0].split("-").reverse().join("/") }}
                  </td>
                  <td>{{ row.tipo_fondo }}</td>
                  <td>{{ row.sucursal ? row.sucursal.toLowerCase() : "-" }}</td>
                  <td>{{ row.fondo ? row.fondo.toLowerCase() : "-" }}</td>
                  <td>{{ row.referencia }}</td>
                  <td>{{ row.descripción }}</td>
                  <td>
                    {{
                      new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(row.monto)
                    }}
                  </td>
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
        >Comprobantes de diario
        <v-spacer></v-spacer>
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
              :disabled="!totales.ok"
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
              :disabled="data.id == 0"
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
              @click="limpiar()"
              :disabled="JSON.stringify(data) == JSON.stringify(dataInit)"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Limpiar</span>
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
              :disabled="$store.state.view_comprobantes_diario.length == 0"
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
          <div width="200">
            <v-text-field
              label="Número de comprobante:"
              class="mr-2"
              v-model="consecutivo"
              disabled
            ></v-text-field>
          </div>
          <div width="200">
            <v-select
              label="Referencia:"
              class="mr-2"
              v-model="data.referencia"
              :disabled="data.cerrado > 0"
              :items="referencias"
              item-text="descripción"
              item-value="id"
              @change="data.referencia == 0 ? (dlgAddReference = true) : null"
            ></v-select>
          </div>
          <v-text-field
            label="Descripción:"
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
                  <th>
                    {{
                      new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totales.debe)
                    }}
                  </th>
                  <th>
                    {{
                      new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totales.haber)
                    }}
                  </th>
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
            <v-text-field
              label="Concepto:"
              class="mr-2"
              v-model="selectedCta.concepto"
            />
            <v-layout row class="pl-3 pr-3">
              <v-text-field
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
    <v-dialog width="400" v-model="dlgAddReference">
      <v-card>
        <v-card-title class=""
          >Nueva referencia <v-spacer></v-spacer
          ><v-btn
            small
            fab
            dark
            color="red"
            @click="
              dlgAddReference = false;
              data.referencia = null;
            "
            ><v-icon>mdi-close</v-icon></v-btn
          ></v-card-title
        >
        <v-card-text>
          <v-text-field
            label="Descripción de la referencia"
            v-model="newReference"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn mall color="primary" @click="saveReference()">GUARDAR</v-btn>
          <v-spacer></v-spacer>
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
        referencia: "",
        descripción: "",
        cerrado: 0,
      },
      data2: {
        id: 0,
        fecha: "",
        tipo_fondo: 1,
        sucursal: 0,
        fondo: 0,
        referencia: "",
        descripción: "",
        cerrado: 0,
      },
      dataInit: {
        id: 0,
        fecha: "",
        tipo_fondo: 1,
        sucursal: 0,
        fondo: 0,
        referencia: "",
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
      },
      cuentas: [],
      cuentas2: [],
      detallePropagado: [],
      documento: "",
      newReference: "",
      dlgAddReference: false,
    };
  },
  watch: {
    fechaactual: {
      deep: true,
      handler(val) {
        const mv = this;
        mv.data.fecha = val;
        mv.data2.fecha = val;
        mv.dataInit.fecha = val;
      },
    },
  },
  methods: {
    saveReference() {
      const mv = this;
      const data = JSON.stringify({
        tabla: "cont_referencias",
        data: { descripción: mv.newReference },
      });
      fetch(`${mv.$store.state.api}/save`, {
        method: "post",
        body: data,
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.insertId) {
            mv.$store.dispatch("getData", {
              tabla: "cont_referencias",
              variable: "referencias",
            });
            mv.dlgAddReference = false;
            mv.data.referencia = json.insertId;
            mv.newReference = "";
          } else {
            console.log(json);
          }
        });
    },
    limpiar: function () {
      let mv = this;
      if (mv.totales.ok) {
        mv.$swal({
          icon: "warning",
          title: "Advertencia!",
          text: "Se van a limpiar los datos del formulario y no ha guardado los cambios",
          showCancelButton: true,
        }).then((res) => {
          if (res.value) {
            mv.data = Object.assign({}, mv.dataInit);
            mv.cuentas = [];
          }
        });
      } else {
        mv.data = Object.assign({}, mv.dataInit);
        mv.cuentas = [];
      }
    },
    getComprobante(id) {
      var mv = this;
      fetch(mv.$store.state.api + "/get", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tabla: "cont_comprobantes_diario",
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
            mv.data2 = Object.assign({}, mv.data);
            fetch(mv.$store.state.api + "/get", {
              method: "post",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                tabla: "cont_detallecomprobantes_diario",
                campos: "*",
                condición: "id_comprobante=" + r[0].id,
              }),
            })
              .then((json2) => {
                return json2.json();
              })
              .then((r2) => {
                mv.cuentas = r2;
                mv.cuentas.forEach((c) => {
                  let idx = mv.cuentasDetalle.findIndex((item) => {
                    return item.id == c.id_cuenta;
                  });
                  c.cuenta = mv.cuentasDetalle[idx].cuenta;
                  c.descripción = mv.cuentasDetalle[idx].descripción;
                });
                mv.cuentas2 = Object.assign([], mv.cuentas);
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
        tabla: "cont_comprobantes_diario",
        data: mv.data,
        children: children,
        childTable: "cont_detallecomprobantes_diario",
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
      result = util.ordenar(result, "fecha");
      result.forEach((r) => {
        totales.debe += r.nivel == 3 ? parseFloat(r.debe) : 0;
        totales.haber += r.nivel == 3 ? parseFloat(r.haber) : 0;
      });
      //result.push(totales);
      //console.log(result);
      // return result;
      let tfoot = [
        [
          { content: "TOTALES", colSpan: 4, styles: { halign: "center" } },
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
      let nomb = info.nombreinstitucion.split("\\n");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(nomb[0], 4, 1.5);
      doc.text(nomb[1], 4, 2);
      doc.text(info.nombreinstitucion2, 4, 2.5);
      doc.setFontSize(9);
      doc.text(`RUC: ${info.ruc}`, 4, 3);
      doc.setFontSize(14);
      doc.text("COMPROBANTE DE DIARIO", 4, 3.7);
      //--------------------CONTENIDO--------------------------------//
      let linea = 4;
      doc.setLineWidth(0.01);
      doc.rect(12.7, 1, 7.4, 2.9);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Comprobante Nº: ${mv.data.número}`, 13, 1.5);
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
          { content: "PARCIAL", styles: { halign: "right" } },
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
    referencias: function () {
      const mv = this;
      let refs = mv.$store.state.referencias;
      refs.unshift({ id: 0, descripción: "Agregar nueva referencia" });
      return refs;
    },
    comprobantes: function () {
      let mv = this;
      let result = mv.$store.getters.comprobantes_diario(mv.find);
      return result;
    },
    consecutivo: function () {
      const mv = this;
      let result = "0000000001";
      if (mv.$store.state.comprobantes_diario.length > 0) {
        const max = mv.$store.state.comprobantes_diario.reduce(
          (prev, current) => {
            return prev.id > current.id ? prev : current;
          }
        ).id;
        result = (max + 1).toString().padStart(10, "0");
      }
      if (mv.data.id > 0) {
        result = mv.data.id.toString().padStart(10, "0");
      }
      //console.log(result)
      return result;
    },
    fechaactual: function () {
      const fecha =
        this.$store.state.fecha_trabajo[0].fechaactual.split("T")[0];
      return fecha;
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
      if (debe == haber && mv.cuentas.length > 1) {
        if (
          (mv.data.sucursal > 0 || mv.data.fondo > 0) &&
          mv.data.descripción.length > 0 &&
          mv.data.referencia > 0 &&
          JSON.stringify(mv.data) + JSON.stringify(mv.cuentas) !=
            JSON.stringify(mv.data2) + JSON.stringify(mv.cuentas2)
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
