<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-list-item
        v-for="mn in menu"
        :key="mn.value"
        @click="mn.action();menu_active=mn.value"
        :class="mn.value==menu_active?'active-menu':''"
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
      <v-app-bar-nav-icon class="hidden-lg-and-up"></v-app-bar-nav-icon>
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
export default {
  name: "App",
  data: () => ({
    menu_active: 0,
    menu: [
      {
        value: 1,
        text: "Catálogo",
        icon: "mdi-book",
        action: function() {
          Router.push("/catalogo").catch(() => {});
        }
      },
      {
        value: 2,
        text: "Enlazar cuentas",
        icon: "mdi-link",
        action: function() {
          Router.push("/enlaces").catch(() => {});
        }
      },
      {
        value: 3,
        text: "Comprobantes",
        icon: "mdi-note",
        action: function() {
          Router.push("/comprobantes").catch(() => {});
        }
      },
      {
        value: 4,
        text: "Usuario",
        icon: "mdi-account",
        action: function() {
          Router.push("/usuario").catch(() => {});
        }
      },
      {
        value: 5,
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
</script>
<style lang="css">
.v-card {
  box-shadow: 1px 1px 4px #555;
}
.v-dialog .v-card__title {
  background: white;
}
.v-card__actions {
  background: linear-gradient(to bottom, #eee 0%, #ccc 100%);
}
.v-card__title {
  background: linear-gradient(to top, #eee 0%, #ccc 100%);
  text-shadow: 1px 1px 2px white;
  color: #555;
}
.v-btn--fab.v-btn--contained {
  box-shadow: 1px 1px 4px #555;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: linear-gradient(to bottom, #555 0%, #333 100%);
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
.active-menu {
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
</style>
