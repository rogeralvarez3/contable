<template>
  <v-container>
    <v-layout row>
      <v-card width="350" class="ma-2">
        <v-card-title>Desembolsos</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Cuenta deudora" dense v-model="enlace.id_cuenta_debe"></v-text-field>
          <v-text-field label="Cuenta transitoria" dense v-model="enlace.id_cuenta_haber"></v-text-field>
          <v-text-field label="Comisión" dense v-model="enlace.comisión"></v-text-field>
          <v-text-field label="Gastos legales" dense v-model="enlace.gastos_legales"></v-text-field>
          <v-text-field label="Inscripción" dense v-model="enlace.inscripción"></v-text-field>
        </v-card-text>
      </v-card>
      <v-card width="350" class="ma-2">
        <v-card-title>Otros</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Saneamiento (Gastos)" dense></v-text-field>
          <v-text-field
            label="Seguro por cuentas mayores a 100K (U$)"
            dense
          ></v-text-field>
          <v-text-field
            label="Seguro por cuentas mayores a 100K (C$)"
            dense
          ></v-text-field>
        </v-card-text>
      </v-card> </v-layout
  ></v-container>
</template>

<script>
export default {
  name: "desembolsos-y-otros",
  data() {
    return {
        enlace:{id_cuenta_debe:'',id_cuenta_haber:'',id_sector:'',id_situación:'',id_pago:'',clasificación:'',tipo_fondo:'',descripción:'',gastos_legales:'',comisión:''}
    };
  },
};
</script>

<style></style>
