<template>
  <v-sheet min-height="580px">
    <h1 class="blue-grey ma-2 text-center white--text">List of Dishes</h1>
    <DishesEditDialog :dishEdit="editDish" v-model="showEditForm" />
    <v-data-table
      :headers="headers"
      :items="dishesList"
      sort-by="name"
      class="elevation-12 ma-6"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Dishes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <DishesAddDialog />
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.is_active`]="{ item }">
        <td v-if="item.is_active">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click="setDishActive(item, false)"
                color="success"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-check</v-icon></v-btn
              ></template
            >
            <span>Deactivate</span>
          </v-tooltip>
        </td>
        <td v-else>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click="setDishActive(item, true)"
                color="error"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Activate</span>
          </v-tooltip>
        </td>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              x-small
              color="cyan"
              fab
              dark
              v-bind="attrs"
              v-on="on"
              :to="`/imagelist/${item._id}`"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </template>
          <span>Add Images</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="editDishFunc(item)"
              x-small
              color="grey accent-4"
              fab
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit Dish</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click="deleteItem(item._id)"
              x-small
              color="red accent-4"
              fab
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete Dish</span>
        </v-tooltip>

        <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import axios from "axios";
import DishesAddDialog from "./DishesAddDialog.vue";
import DishesEditDialog from "./DishesEditDialog.vue";

export default {
  name: "DishesList",
  components: { DishesAddDialog, DishesEditDialog },
  data: () => ({
    dialogDelete: false,
    selectedGenre: [],
    dishesList: [],
    genreList: [],
    deleteid: -1,
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editDish: null,
    imageDishId: null,

    headers: [
      {
        text: "Dish Title",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Description", value: "desc" },
      // { text: "Genre", value: "desc" },
      { text: "is active", value: "is_active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  computed: {},

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getDishesList();
  },
  methods: {
    getGenreList() {
      let uri = "http://localhost:3000/genre"; //get only active
      axios.get(uri).then((response) => {
        this.genreList = response.data;
      });
    },
    getDishesList() {
      let uri = "http://localhost:3000/dishes";
      axios.get(uri).then((response) => {
        this.dishesList = response.data;
      });
    },
    deleteDishes(id) {
      this.deleteAssociatedImages(id);
      let uri = `http://localhost:3000/dishes/${id}`;
      axios.delete(uri, this.dishesList).then(() => {
        this.getDishesList();
      });
    },
    deleteAssociatedImages(id) {
      let uri = `http://localhost:3000/images/dishid/${id}`;
      axios.delete(uri);
    },
    setDishActive(dishTemp, is_active) {
      // console.log(genreTemp._id);
      // console.log(genreTemp.is_active);
      dishTemp.is_active = is_active;
      // console.log(genreTemp.is_active);
      let uri = `http://localhost:3000/dishes/${dishTemp._id}`;
      axios.patch(uri, dishTemp, this.dishesList).then(() => {
        this.getDishesList();
      });
    },

    addPhotos(dishId) {
      this.imageDishId = dishId;
      this.showEditForm = true;
    },

    editDishFunc(dishTemp) {
      this.editDish = dishTemp;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteDishes(this.deleteid);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.deleteid = -1;
        this.editedIndex = -1;
      });
    },
  },
  updated() {
    this.getDishesList();
  },
};
</script>