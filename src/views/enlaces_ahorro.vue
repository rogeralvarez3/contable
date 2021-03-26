<template>
  <v-container>
    <v-card width="1000">
      <v-card-title
        >Enlaces de ahorro <v-spacer></v-spacer
        ><v-btn fab small dark color="red"
          ><v-icon small @click="$router.push('/')">mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <v-layout row>
          <v-card width="500">
            <v-card-text>
              <v-simple-table dense height="500" fixed-header>
                <thead>
                  <tr>
                    <th>CUENTA</th>
                    <th>DESCRIPCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="clickeable"
                    v-for="(item, i) in $store.state.tiposcuenta"
                    :key="i"
                    @click="selected = item"
                    :bgcolor="item == selected ? '#aaccff' : ''"
                  >
                    <td v-text="item.value"></td>
                    <td v-text="item.text"></td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>

          <v-card width="480" class="ml-2" v-if="selected.value.length > 0">
            <v-card-title>Detalle</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-simple-table dense height="400">
                <thead>
                  <tr>
                    <th>Movimiento</th>
                    <th>Debe</th>
                    <th>Haber</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in $store.state.tiposmovcuentas"
                    :key="i"
                  >
                    <td
                      v-text="item.descripción"
                      style="text-transform:capitalize"
                    ></td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            small
                            width="100"
                            @click="
                              campo = 0;
                              tipo_cuenta_selected = item.id;
                            "
                            >{{
                              id2Cuenta(getEnlace(item.id).id_cuenta_debe)
                                .cuenta.replace(/-/g,'')
                            }}</v-btn
                          > </template
                        ><span>
                          {{
                            id2Cuenta(getEnlace(item.id).id_cuenta_debe)
                              .descripción
                          }}
                        </span>
                      </v-tooltip>
                    </td>
                    <td>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            small
                            width="100"
                            @click="
                              campo = 1;
                              tipo_cuenta_selected = item.id;
                            "
                            >{{
                              id2Cuenta(getEnlace(item.id).id_cuenta_haber)
                                .cuenta.replace(/-/g,'')
                            }}</v-btn
                          > </template
                        ><span>
                          {{
                            id2Cuenta(getEnlace(item.id).id_cuenta_haber)
                              .descripción
                          }}
                        </span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dlg" width="600" persistent>
      <buscar-cuenta
        v-on:selected="guardar($event)"
        v-on:close="tipo_cuenta_selected = 0"
      ></buscar-cuenta>
    </v-dialog>
  </v-container>
</template>

<script>
import buscarCuenta from "../components/buscar_cuenta.vue";
export default {
  components: { buscarCuenta },

  data() {
    return {
      selected: { value: "", text: "" },
      buscar: "",
      tipo_cuenta_selected: 0,
      campo: 0,
    };
  },

  methods: {
    guardar: function(evento) {
      let mv = this;
      mv.$store.commit("setCargando", true);
      let data = {
        tabla: "cont_enlaces_ahorro",
        data: {
          id: mv.getEnlace(this.tipo_cuenta_selected).id,
          id_cuenta: mv.selected.value,
          id_mov_cuenta: mv.tipo_cuenta_selected,
        },
      };
      mv.campo == 0
        ? (data.data.id_cuenta_debe = evento.id)
        : (data.data.id_cuenta_haber = evento.id);
      //console.log(evento);
      fetch(`${mv.$store.state.api}/save`, {
        method: "post",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (!json.errno) {
            mv.$store.dispatch("getData", {
              tabla: "cont_enlaces_ahorro",
              variable: "enlaces_ahorro",
            });
            // eslint-disable-next-line no-debugger
            //debugger;
            mv.tipo_cuenta_selected = 0;
            mv.campo = 0;
            mv.$store.commit("setCargando", false);
          } else {
            console.log(json);
            mv.$store.commit("setCargando", false);
          }
        });
    },
    id2Cuenta: function(id) {
      let mv = this;
      let result = mv.$store.state.catálogo.filter((item) => {
        return item.id == id;
      });
      if (result.length > 0) {
        return result[0];
      } else {
        return {};
      }
    },
    getEnlace: function(id_mov_cuenta) {
      let mv = this;
      let result = [];
      result = mv.$store.state.enlaces_ahorro.filter((item) => {
        return (
          item.id_mov_cuenta == id_mov_cuenta &&
          item.id_cuenta == mv.selected.value
        );
      });
      if (result.length > 0) {
        result = result[0];
      }
      // eslint-disable-next-line no-debugger
      //debugger
      return result;
    },
  },
  computed: {
    dlg: function() {
      let mv = this;
      if (mv.tipo_cuenta_selected > 0) {
        return true;
      } else {
        return false;
      }
    },
    detalle: function() {
      let mv = this;
      let result = mv.$store.state.enlaces_ahorro.filter((item) => {
        return item.id_cuenta == mv.selected.value;
      });
      if (result.length > 0) {
        return result;
      } else {
        return [];
      }
    },
  },
};
</script>

<style>
.clickeable {
  cursor: pointer;
}
</style>
