<template>
  <v-container>
    <v-card>
      <v-card-title class="pt-1 pb-1 blue-grey lighten-5">
        Enlace de uentas
        <v-spacer></v-spacer>
        <v-select
          single-line
          hide-details
          :items="sectores"
          outlined
          dense
          filled
          v-model="enlaceActual.id_sector"
        ></v-select>
        <v-btn fab small dark color="red" class="ml-1" to="/">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-tabs v-model="tab" active-class="active-tab" slider-color="primary">
          <v-tab :href="`#tab${tb.value}`" v-for="tb in clasificación" :key="tb.value">{{tb.text}}</v-tab>
          <v-tab href="#tab3">Desembolsos y otros</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :value="`tab${tb.value}`" v-for="tb in clasificación" :key="tb.value">
            <v-layout row>
              <card-situacion
                v-for="sit in $store.state.situaciones"
                :situacion="sit"
                :clasificacion="tb"
                :sector="enlaceActual.id_sector"
                :key="sit.text"
              ></card-situacion>
            </v-layout>
          </v-tab-item>
          <v-tab-item value="tab3"></v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import cardSituacion from "@/components/card_situacion";
export default {
  components: {
    cardSituacion
  },
  data() {
    return {
      tab: 1,
      dlgNuevo: false,
      enlaceActual: {
        tipo: 0,
        id_sector: 1,
        id_situación: 0,
        id_pago: 0,
        tipo_plazo: 0,
        id_cuenta_debe: 0,
        id_cuenta_haber: 0
      },
      clasificación: [
        { value: 1, text: "recepción de pagos" },
        { value: 2, text: "devengado" }
      ]
    };
  },
  methods: {},
  computed: {
    sectores: function() {
      var result = [];
      this.$store.state.sectores.forEach(sc => {
        result.push({ value: sc.value, text: `${sc.text} - corto plazo` });
        result.push({
          value: sc.value + 100,
          text: `${sc.text} - largo plazo`
        });
      });
      return result;
    }
  }
};
</script>

<style scoped>
.v-input {
  flex: none;
  max-width: 300px;
}
.active-tab {
  background: linear-gradient(to bottom, skyblue 0%, dodgerblue 100%);
  box-shadow: 0 0 3px #333;
  border-radius: 10px 0 0 0;
  text-shadow: 1px 1px 2px #ddd;
}
</style>