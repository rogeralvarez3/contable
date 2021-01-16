<template>
  <v-container>
    <v-tabs active-class="active-tab" slider-color="primary" v-model="tab">
      <v-tab v-for="tab in tabs" :key="tab.text">
        {{ tab.text }}
      </v-tab>
    </v-tabs>
    <v-tabs-items height="550" v-model="tab">
      <v-tab-item v-for="(tb, i) in tabs" :key="i">
        <v-card>
          <v-card-text>
            <balanza :title="tb.text" v-if="i == 0"></balanza>
            <bg :title="tb.text" v-if="i == 1"></bg>
            <er :title="tb.text" v-if="i == 2"></er>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import balanza from "../components/balanza.vue";
import bg from "../components/bg";
import er from "../components/er";
export default {
  components: { balanza, bg, er },
  data() {
    return {
      rpt: { mostrar: 0, período: "" },
      tab: 0,
      tabs: [
        { text: "Balanza de comprobación" },
        { text: "Balance general" },
        { text: "Estado de resultado" },
        { text: "Libro mayor" },
        { text: "Libro diario" },
        { text: "Movimiento de cuentas" }
      ]
    };
  }
};
</script>
