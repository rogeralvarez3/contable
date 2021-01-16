<template>
  <v-container>
    <v-card>
      <v-card-title class="pt-1 pb-1 blue-grey lighten-5">
        Enlace de uentas
        <v-spacer></v-spacer>
        <v-select
          class="mr-2"
          label="Tipo de fondo:"
          :items="[
            { value: 1, text: 'FONDOS PROPIOS' },
            { value: 2, text: 'FONDOS ADMINISTRADOS' }
          ]"
          v-model="enlaceActual.tipo_fondo"
          single-line
          hide-details
          outlined
          dense
          filled
        >
        </v-select>
        <v-select
          label="Sector:"
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
          <v-tab
            :href="`#tab${tb.value}`"
            v-for="tb in clasificación"
            :key="tb.value"
            >{{ tb.text }}</v-tab
          >
          <v-tab href="#tab3">Desembolsos y otros</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            :value="`tab${tb.value}`"
            v-for="tb in clasificación"
            :key="tb.value"
          >
            <v-layout row>
              <card-situacion
                v-for="sit in $store.state.situaciones"
                :situación="sit"
                :clasificación="tb.value"
                :sector="enlaceActual.id_sector"
                :tipo_fondo="enlaceActual.tipo_fondo"
                :key="sit.text"
              ></card-situacion>
            </v-layout>
          </v-tab-item>
          <v-tab-item value="tab3">
            <desembolsosyotros></desembolsosyotros>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import cardSituacion from "@/components/card_situacion";
import desembolsosyotros from "@/components/integracion_desembolsos";
export default {
  components: {
    cardSituacion,
    desembolsosyotros
  },
  data() {
    return {
      tab: "tab1",
      dlgNuevo: false,
      enlaceActual: {
        tipo: 0,
        id_sector: 1,
        id_situación: 0,
        id_pago: 0,
        tipo_plazo: 0,
        id_cuenta_debe: 0,
        id_cuenta_haber: 0,
        tipo_fondo: 1
      },
      clasificación: [
        { value: 1, text: "recepción de pagos" },
        { value: 2, text: "devengado" }
      ]
    };
  },
  watch: {
    tab(value) {
      let mv = this;
      let p = new URL(document.location).searchParams.get("tab");
      if (p == value) return;
      mv.$router.push(mv.$router.history.current.path + "?tab=" + value);
    }
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
  },
  mounted: function() {
    let params = new URL(document.location).searchParams;
    //console.log(params.get("tab"));
    this.tab = params.get("tab");
  }
};
</script>

<style scoped>
.v-input {
  flex: none;
  max-width: 300px;
}
</style>
