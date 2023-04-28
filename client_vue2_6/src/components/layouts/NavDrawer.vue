<template>
  <v-sheet>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item class="justify-center">
          <v-list-item-avatar class="elevation-6" size="120">
            <v-img src="@/assets/Junaid.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item class="text-center">
          <v-list-item-content>
            <v-list-item-title class="text-h6"> Junaid Alvi </v-list-item-title>
            <v-list-item-subtitle>+92 305 7310036</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="primary--text" v-model="selectedItem">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            router
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dense elevate-on-scroll>
      <!-- <v-app-bar app dense dark color="#6A76AB"> -->
      <!--     
      src="../../assets/banner.jpg"
      fade-img-on-scroll
      shrink-on-scroll
      extended
      extension-height="50"
      prominent
      elevation="12"
      elevate-on-scroll
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top left, rgba(50,100,100,.1), rgba(25,32,72,.5)"
        ></v-img>
      </template> -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>JÜSTA HIGHLAND & RESORT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="d-print-none" @click="toggle_dark_mode">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>
  </v-sheet>
</template>



<script>
export default {
  //   name: "App",
  data: () => ({
    alert: false,
    drawer: false,
    selectedItem: 0,
    snackbar: false,

    items: [
      { icon: "mdi-chart-bar", text: "Dashboard", route: "/" },
      { icon: "mdi-table-chair", text: "Tables", route: "/tables" },
      { icon: "mdi-file-tree", text: "Genre", route: "/genre" },
      { icon: "mdi-food", text: "Dishes", route: "/dishes" },
      {
        icon: "mdi-clipboard-list",
        text: "Orders",
        route: "/orderlist",
      },
      { icon: "mdi-collage", text: "Menu", route: "/menugrid" },
      { icon: "mdi-chart-bar", text: "Reports", route: "/ordersreport" },
    ],
  }),
  methods: {
    toggle_dark_mode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    },
  },
  mounted() {
    const theme = localStorage.getItem("dark_theme");
    if (theme) {
      if (theme === "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.$vuetify.theme.dark = true;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    }
  },
};
</script>


<style>
</style>