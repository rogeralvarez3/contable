<template>
  <v-container>
    <v-card width="900">
      <v-card-title>
        Congiguración del inicio de operaciones
        <v-spacer></v-spacer>
        <v-btn small dark fab color="primary" @click="importar()" class="mr-1"
          ><v-icon>mdi-import</v-icon></v-btn
        >
        <v-btn small dark fab color="error" to="/"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-flex>
          <v-row class="pa-4">
            <v-row width="60" class="mr-2 ml-1">
              <v-select
                :items="meses"
                v-model="data.mes"
                label="Mes"
                class="mr-2"
              ></v-select>
              <v-select
                :items="[
                  2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
                ]"
                v-model="data.año"
                label="Año"
                class="mr-2"
              ></v-select>
            </v-row>

            <v-select
              :items="tiposFondo"
              label="Tipo de fondo"
              v-model="data.tipo_fondo"
              class="mr-2"
            ></v-select>
            <v-select
              v-if="data.tipo_fondo == 2"
              :items="
                $store.state.fondos.filter((f) => {
                  return f.tipo == 2;
                })
              "
              label="Fondo"
              v-model="data.fondo"
            ></v-select>
            <v-select
              v-else
              :items="$store.state.sucursales"
              label="Sucursal"
              v-model="data.sucursal"
            ></v-select>
          </v-row>
          <v-card>
            <v-card-title>
              <div width="150" class="mr-2">
                <v-text-field
                  dense
                  hide-details
                  rounded
                  outlined
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Buscar cuenta"
                ></v-text-field>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-data-table
                :headers="headers"
                dense
                :search="buscar"
              ></v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Excel from "xlsx";
export default {
  data() {
    return {
      tiposFondo: [
        { value: 1, text: "PROPIOS" },
        { value: 2, text: "ADMINISTRADOS" },
      ],
      data: {
        mes: 1,
        año: 2021,
        tipo_fondo: 1,
        sucursal: 1,
        fondo: 1,
      },
      headers: [
        { value: "id", text: "Id" },
        { value: "cuenta", text: "Cuenta" },
        { value: "descripcion", text: "Descripción" },
        { value: "debe", text: "Debe" },
        { value: "haber", text: "Haber" },
        { value: "edit", text: "Editar" },
      ],
      buscar: "",
      meses: [
        { value: 1, text: "enero" },
        { value: 2, text: "febrero" },
        { value: 3, text: "marzo" },
        { value: 4, text: "abril" },
        { value: 5, text: "mayo" },
        { value: 6, text: "junio" },
        { value: 7, text: "julio" },
        { value: 8, text: "agosto" },
        { value: 9, text: "septiembre" },
        { value: 10, text: "octubre" },
        { value: 11, text: "noviembre" },
        { value: 12, text: "diciembre" },
      ],
      excelData: [],
    };
  },
  methods: {
    showData: function () {
      const mv = this;
      fetch(`${mv.$store.state.server}`);
    },
    importar: function () {
      const mv = this;
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.onchange = (event) => {
        const file = event.target.files[0];
        const rdr = new FileReader();
        rdr.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const WB = Excel.read(data, { type: "array" });
          const Sheets = WB.SheetNames;
          console.log(Sheets);
          const Sheet = WB.Sheets[Sheets[0]];
          let res = Excel.utils.sheet_to_json(Sheet);
          Object.keys(res).length != 3
            ? mv.$swal({
                icon: "error",
                title: "Cantidad de columnas no coincide"
              })
            : (mv.excelData = res);
        };
        rdr.readAsArrayBuffer(file);
      };
      input.click();
    },
  },
};
</script>

<style></style>
