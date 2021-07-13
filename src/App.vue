<template>
  <v-app>
    <v-navigation-drawer app clipped v-model="$store.state.drawer">
      <v-list-item
        v-for="(mn, i) in menu"
        :key="i"
        :to="mn.to"
        :class="$route.name == mn.to ? 'active' : ''"
      >
        <v-list-item-icon>
          <v-icon v-text="mn.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="mn.text"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-app-bar
      app
      dense
      clipped-left
      class="elevation-1"
      color="blue-grey darken-4"
      dark
    >
      <v-app-bar-nav-icon
        v-if="!$store.state.drawer"
        @click="$store.state.drawer = !$store.state.drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Contbilidad</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu y offset-y>
        <template v-slot:activator="{ on }">
          <v-btn fab small dark v-on="on"><v-icon>mdi-cog</v-icon> </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="mn in menu2"
            :key="mn.text"
            :to="mn.to"
            :class="$route.name == mn.to ? 'active' : ''"
          >
            <v-list-item-title>{{ mn.text }}</v-list-item-title></v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-fab-transition>
        <router-view></router-view>
      </v-fab-transition>
    </v-content>
    <v-dialog v-model="cargando" persistent width="200">
      <v-card>
        <v-card-text>
          <v-layout row class="pt-2">
            <h1 class="mt-2">ESPERE...</h1>
            <v-icon large color="primary">mdi-spin mdi-movie-roll</v-icon>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Store from "./store/index";
import io from "socket.io/client-dist/socket.io";
var mv = {
  name: "App",
  data: () => ({
    menu: [
      {
        text: "Comprobantes",
        icon: "mdi-note",
        to: "comprobantes_diario",
      },
      {
        text: "Cheques",
        icon: "mdi-ticket-account",
        to: "comprobantes_cheques",
      },
      {
        text: "Depósitos",
        icon: "mdi-receipt",
        to: "depositos",
      },
      {
        text: "Reportes",
        icon: "mdi-chart-bar",
        to: "reportes",
      },
    ],
    menu2: [
      { text: "Configurar inicio de operaciones", to: "inicio_de_operaciones" },
      {
        text: "Catálogo de cuentas",
        to: "catalogo",
      },
      {
        text: "Integración de ahorro",
        to: "enlaces_ahorro",
      },
      {
        text: "Integración de cartera",
        to: "enlaces_cartera",
      },
    ],
  }),
  methods: {
    getLogo: function () {
      fetch(`${Store.state.api}/img/logo.jpg`)
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          let reader = new FileReader();
          reader.onload = (e) => {
            Store.commit("setVariable", {
              variable: "logo",
              data: e.target.result,
            });
          };
          reader.readAsDataURL(blob);
        });
    },
  },
  computed: {
    cargando: function () {
      return Store.state.cargando;
    },
  },
  mounted: function () {
    let mv = this;
    Store.dispatch("getData");
    mv.getLogo();
    //console.log(window.location.pathname+window.location.search)
    io(mv.$store.state.api);
  },
};
export default mv;
</script>
<style lang="css">
body {
  font-size: 9px;
}
.v-card {
  box-shadow: 1px 1px 4px #555;
}
.v-dialog .v-card__title {
  background: white;
}
.v-card__actions {
  background: linear-gradient(to bottom, #eee 0%, #ccc 100%);
}
.v-card__title,
.v-dialog > .v-card > .v-card__title {
  /*background: linear-gradient(to bottom, #eee 0%,rgb(200,200,200)50%, #bbb 50%, rgb(240,240,240)100%);*/
  background: #eee;
  text-shadow: 1px 1px 2px white;
  color: #555;
  border: 1px solid #ddd;
  border-top: none;
  padding: 4px !important;
  padding-top: 1px;
  padding-bottom: 2px;
}
.v-btn--fab.v-btn--contained {
  box-shadow: 1px 1px 4px #555;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  /*background: linear-gradient(to bottom,rgb(255, 255, 255) 0%, rgb(109, 114, 124) 50%, rgb(90, 96, 104) 50%,rgb(185, 190, 204) 100%);*/
  /*text-shadow: 0px -1px 1px white;
  color: #379;*/

  font-weight: bold;
  font-size: 22px;
}
.v-navigation-drawer {
  /*background: linear-gradient(to top, #eee 0%, #ddd 100%);*/
  background-position: center;
  /*background: url("./assets/7136.jpg");
  background: url("./assets/trees.jpg");*/
  background-size: cover;
  -moz-background-size: cover;
  text-shadow: 1px 1px 2px white;
  font-weight: bold;
  color: #555;
}
.active-menu,
.v-list-item .list-item--active {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(0, 100, 255, 0.1) 100%
  );
  box-shadow: 0px 1px 3px #aaa;
}
.active-menu .v-list-item__title,
.active-menu .v-list-item__icon i {
  color: rgb(32, 87, 168);
}
.active-tab {
  background: linear-gradient(to bottom, skyblue 0%, dodgerblue 100%);
  box-shadow: 0 0 3px #333;
  border-radius: 0 10px 0 0;
  text-shadow: 1px 1px 2px #ddd;
}

.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined),
.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  /* background-color: #272727; */
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 40%,
    rgba(255, 255, 255, 0.6) 100%
  ) !important;
  border: 1px solid #aaa;
  /*border-radius: 15px;*/
}

.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  color: white;
  text-shadow: 1px 0 1px #aaa !important;
}
table thead tr th {
  background: none !important;
}
.swal2-popup {
  font-family: "system-ui" !important;
}
input[type="number"] {
  text-align: right;
}
</style>
