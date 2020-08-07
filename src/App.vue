<template>
  <v-app>
    <v-navigation-drawer app clipped v-model="$store.state.drawer">
      <v-list-item
        v-for="(mn,i) in menu"
        :key="i"
        @click="mn.action();menu_active=i"
        :class="i==menu_active?'active-menu':''"
      >
        <v-list-item-icon>
          <v-icon v-text="mn.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="mn.text"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-app-bar app dense dark clipped-left class="elevation-1">
      <v-app-bar-nav-icon v-if="!$store.state.drawer" @click="$store.state.drawer=!$store.state.drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>ContApp</v-toolbar-title>
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
import Router from "./router/index";
import Store from "./store/index";
var mv= {
  name: "App",
  data: () => ({
    menu_active: 0,
    menu: [
      {
        text: "Ocultar menú",
        icon: "mdi-chevron-left",
        action: function() {
          Store.state.drawer=false
        }
      },
      {
        text: "Catálogo",
        icon: "mdi-book",
        action: function() {
          Router.push("/catalogo").catch(() => {});
        }
      },
      {
        text: "Enlazar cuentas",
        icon: "mdi-link",
        action: function() {
          Router.push("/enlaces").catch(() => {});
        }
      },
      {
        text: "Comprobantes",
        icon: "mdi-note",
        action: function() {
          Router.push("/comprobantes").catch(() => {});
        }
      },
      {
        text: "Cheques",
        icon: "mdi-ticket-account",
        action: function() {
          Router.push("/cheques").catch(() => {});
        }
      },
      {
        text: "Depósitos",
        icon: "mdi-receipt",
        action: function() {
          Router.push("/depositos").catch(() => {});
        }
      },
      {
        text: "Reportes",
        icon: "mdi-chart-bar",
        action: function() {
          Router.push("/reportes").catch(() => {});
        }
      },
      {
        text: "Salir",
        icon: "mdi-close",
        action: function() {
          console.log("Salir");
        }
      }
    ]
  }),
  methods: {},
  computed: {
    cargando: function() {
      return this.$store.state.cargando;
    }
  },
  mounted: () => {
    Store.dispatch("getData");
  }
};
export default mv
</script>
<style lang="css">
body{
  font-size:9px;
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
.v-card__title, .v-dialog > .v-card > .v-card__title {
  background: linear-gradient(to bottom, #eee 0%,rgb(200,200,200)50%, #bbb 50%, rgb(240,240,240)100%);
  text-shadow: 1px 1px 2px white;
  color: #555;
  border:1px solid #ddd;
  border-top:none;
  padding:4px !important;
}
.v-btn--fab.v-btn--contained {
  box-shadow: 1px 1px 4px #555;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: linear-gradient(to bottom,rgb(255, 255, 255) 0%, rgb(109, 114, 124) 50%, rgb(90, 96, 104) 50%,rgb(185, 190, 204) 100%);
  text-shadow: 1px 1px 3px black;
  color: #ddd;
  font-weight: bold;
}
.v-navigation-drawer {
  background: linear-gradient(to top, #eee 0%, #ddd 100%);
  background-position: center;
  background: url("./assets/7136.jpg");
  background: url("./assets/trees.jpg");
  background-size: cover;
  -moz-background-size: cover;
  text-shadow: 1px 1px 2px white;
  font-weight: bold;
  color: #555;
}
.active-menu, .v-list-item .list-item--active {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(0, 100, 255, 0.1) 100%
  ) ;
  box-shadow: 0px 1px 3px #aaa;
}
.active-menu .v-list-item__title,
.active-menu .v-list-item__icon i {
  color: rgb(32, 87, 168);
}
.active-tab {
  background: linear-gradient(to bottom, skyblue 0%, dodgerblue 100%);
  box-shadow: 0 0 3px #333;
  border-radius: 10px 0 0 0;
  text-shadow: 1px 1px 2px #ddd;
}

.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined),.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    /* background-color: #272727; */
    background-image: linear-gradient(to bottom, rgba(255,255,255,0.8)0%,rgba(255,255,255,0.3)50%, transparent 40%, rgba(255,255,255,0.6)100%) !important;
    border:1px solid #aaa;
    border-radius: 15px;
}

</style>
