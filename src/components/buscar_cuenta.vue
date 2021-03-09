<template>
  <v-card>
    <v-card-title
      >Seleccionar cuenta <v-spacer></v-spacer
      ><v-btn fab small dark color="red" @click="$emit('close')"
        ><v-icon small>mdi-close</v-icon></v-btn
      ></v-card-title
    >
    <v-divider></v-divider>
    <v-card-text>
      <v-text-field
        hide-details
        dense
        v-model="buscar"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar..."
        class="pb-2 pt-2"
        outlined
      ></v-text-field>
      <v-simple-table dense height="400" fixed-header>
        <thead>
          <tr>
            <th>CUENTA</th>
            <th>DESCRIPCIÓN</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in cuentas"
            :key="i"
            @click="$emit('selected', item)"
            class="clickeable"
          >
            <td v-text="item.cuenta"></td>
            <td v-text="item.descripción"></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      buscar: "",
    };
  },
  computed: {
    cuentas: function() {
      let mv = this;
      return mv.$store.getters.cuentasDetalle(mv.buscar);
    },
  },
};
</script>

<style>
.clickeable {
  cursor: pointer;
}
</style>
