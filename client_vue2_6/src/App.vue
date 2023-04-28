<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <nav-drawer />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavDrawer from "./components/layouts/NavDrawer.vue";
export default {
  components: { NavDrawer },
  name: "App",

  data: () => ({}),
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
/* .v-data-table__wrapper {
  background-color: #1f1d2c;
} */

#app {
  font-family: "Roboto", sans-serif;

  font-style: normal;
  font-weight: 500;
  font-display: swap;
}
</style>

