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
        <v-data-table dense :items-per-page="rows" :items="catálogo" :headers="columnas"></v-data-table>
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
      rowsItemsPerPage: [10, 20, 30]
    };
  },
  computed: {
    catálogo: function() {
      var mv = this;
      if (mv.buscar.length == 0) {
        return this.$store.state.catálogo;
      } else {
        return this.$store.state.catálogo.filter(row => {
          return (
            (row.descripción + " " + row.cuenta)
              .toLowerCase()
              .indexOf(mv.buscar.toLowerCase()) >= 0
          );
        });
      }
    },
    columnas: function() {
      var result = [];
      if (this.catálogo.length > 0) {
        Object.keys(this.catálogo[0]).forEach(k => {
          result.push({ value: k, text: k });
        });
      }
      return result;
    }
  }
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
  max-width: 800px;
  flex: none;
}
</style>
