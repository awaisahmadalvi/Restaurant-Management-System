<template>
  <v-app>
    <nav-drawer />
    <v-spacer></v-spacer>
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

  data: () => ({
    //
  }),
};
</script>
