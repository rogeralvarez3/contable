<template>
  <v-container>
    <v-card width="600" class="mt-2">
      <v-card-title class="pa-0">
        <v-toolbar dense color="blue-grey lighten-5" elevation="1">
          <v-btn fab small text>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <v-toolbar-title>Comprobantes de diario</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-text-field label="Fecha:"></v-text-field>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
