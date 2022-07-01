<template>
  <v-sheet>
    <v-navigation-drawer v-model="drawer" app>
      <v-system-bar></v-system-bar>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="@/assets/bilal.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Bilal Hassan
            </v-list-item-title>
            <v-list-item-subtitle>bilal@gmail.com</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
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

      <v-list-group
        v-for="item in items2"
        :key="item.title"
        :prepend-icon="item.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="child in item.items" :key="child.title">
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-navigation-drawer>

    <v-app-bar
      app
      fade-img-on-scroll
      shrink-on-scroll
      dense
      dark
      color="#6A76AB"
      src="../../assets/banner.jpg"
      prominent
      elevation="12"
      elevate-on-scroll
      extended
      extension-height="50"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top left, rgba(50,100,100,.1), rgba(25,32,72,.5)"
        ></v-img>
      </template>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Restaurant Management System</v-toolbar-title>
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
      { icon: "mdi-silverware-fork-knife", text: "Test", route: "/test" },
      {
        icon: "mdi-silverware-fork-knife",
        text: "Data Table",
        route: "/datatable",
      },
    ],
    items2: [
      {
        action: "mdi-ticket",
        items: [{ title: "List Item" }],
        title: "Attractions",
      },
      {
        action: "mdi-silverware-fork-knife",
        items: [
          { title: "Breakfast & brunch" },
          { title: "New American" },
          { title: "Sushi" },
        ],
        title: "Dining",
      },
      {
        action: "mdi-school",
        items: [{ title: "List Item" }],
        title: "Education",
      },
      {
        action: "mdi-human-male-female-child",
        items: [{ title: "List Item" }],
        title: "Family",
      },
      {
        action: "mdi-bottle-tonic-plus",
        items: [{ title: "List Item" }],
        title: "Health",
      },
      {
        action: "mdi-briefcase",
        items: [{ title: "List Item" }],
        title: "Office",
      },
      {
        action: "mdi-tag",
        items: [{ title: "List Item" }],
        title: "Promotions",
      },
    ],
  }),
};
</script>
