<template>
  <v-container>
    <v-card>
      <v-card-title class="pt-2 pb-2">
        <v-icon class="mr-1">mdi-book</v-icon>Catálogo de cuentas
        <v-text-field
          label="Buscar"
          v-model="buscar"
          outlined
          dense
          clearable
          single-line
          hide-details
          append-icon="mdi-magnify"
          class="ml-3"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn fab small color="red" dark class="ml-1" to="/">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table dense>
          <thead>
            <tr>
              <th v-text="'cuenta'" />
              <th v-text="'descripción'" />
              <th v-text="'nivel'" />
              <th v-text="'tipo'" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cta, i) in catálogo" :key="i" :class="cta.nivel == 1
                  ? `font-weight-bold ${niveles[cta.nivel - 1]}--text`
                  : `${niveles[cta.nivel - 1]}--text`">
              <td>
                <span
                  :class="`pl-${(cta.nivel - 1) * 2}`"
                ></span
                >{{ cta.cuenta.replace(/-/g,'') }}
              </td>
              <td>{{ cta.descripción }}</td>
              <td>{{ cta.nivel }}</td>
              <td>{{ cta.tipo == 1 ? "Resumen" : "Detalle" }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Catálogo",
  data() {
    return {
      buscar: "",
      rows: 20,
      rowsItemsPerPage: [10, 20, 30],
      niveles: ["red", "pink", "purple", "deep-purple", "indigo","blue"]
    };
  },
  computed: {
    catálogo: function() {
      var mv = this;
      if (mv.buscar.length == 0) {
        return this.$store.state.catálogo;
      } else {
        return this.$store.state.catálogo.filter((row) => {
          return (
            (row.descripción + " " + row.cuenta)
              .toLowerCase()
              .indexOf(mv.buscar.toLowerCase()) >= 0
          );
        });
      }
    },
  },
};
</script>
<style lang="css" scoped>
th {
  text-transform: capitalize;
}
.v-input {
  max-width: 300px;
  flex: none;
}
.v-data-table {
  
  flex: none;
}
</style>
