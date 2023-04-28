<template>
  <v-card class="ma-6 pb-1">
    <v-card-title
      class="
        text-h4
        font-weight-bold
        title
        py-2
        text-center
        justify-center
        white--text
      "
    >
      List of Dishes
    </v-card-title>
    <DishesEditDialog
      :dishEdit="editDish"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <!-- <v-row class="mx-6">
      <v-combobox
        col="1"
        md="1"
        v-model="filterGenre"
        :items="genreList"
        item-value="_id"
        item-text="name"
        label="Genre"
        multiple
        chips
      ></v-combobox>
      sort-by="name"
      outlined
    </v-row> -->

    <v-data-table
      :headers="headers"
      :items="dishesList"
      @click:row="editDishFunc"
      :search="search"
      class="elevation-12 mx-6 my-8"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Dishes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-row class="mt-2">
            <v-checkbox
              class="ma-2"
              color="primary"
              v-model="isGetActive"
              label="Active?"
              @click="refreshList"
            ></v-checkbox>
          </v-row>
          <v-spacer></v-spacer>
          <v-text-field
            autofocus
            v-show="showSearchField"
            v-model="search"
            label="Search"
            single-line
            hide-details
            class="shrink"
            clearable
            clear-icon="mdi-close-circle"
            @keydown.enter.prevent="
              page = 1;
              refreshList();
            "
          ></v-text-field>
          <v-icon @click="showSearchField = !showSearchField"
            >mdi-magnify</v-icon
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            class="mx-1"
            @click.stop="addDishFunc"
            x-small
            color="primary"
            fab
            dark
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-dialog v-model="showDelDialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this Dish with associated
                data?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >No</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Yes</v-btn
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
                @click.stop="setDishActive(item, false)"
                color="success"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </template>
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
                @click.stop="setDishActive(item, true)"
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
              class="ma-1"
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
          <span>View Images</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-1"
              x-small
              color="teal"
              fab
              dark
              v-bind="attrs"
              v-on="on"
              :to="`/ratelist/${item._id}`"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
          </template>
          <span>View Rate List</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-1"
              @click.stop="editDishFunc(item)"
              x-small
              color="neutral"
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
              class="ma -1"
              @click.stop="deleteItem(item._id)"
              x-small
              color="danger"
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

      <template v-slot:footer>
        <v-col cols="12" sm="12">
          <v-row>
            <v-col class="px-6" cols="4" sm="2">
              <v-select
                outlined
                v-model="pageSize"
                :items="pageSizes"
                label="Items per Page"
                @change="handlePageSizeChange"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="10">
              <v-pagination
                color="grey"
                v-model="page"
                :length="totalPages"
                total-visible="7"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
                @input="handlePageChange"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import DishesEditDialog from "./DishesEditDialog.vue";

export default {
  name: "DishesList",
  components: { DishesEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    dishesList: [],
    genreList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editDish: null,
    imageDishId: null,
    isEdit: false,

    // Filter Values
    isGetActive: false,
    filterGenre: "",

    page: 1,
    totalPages: 0,
    pageSize: 10,
    pageSizes: [10, 20, 50],

    headers: [
      {
        text: "Number",
        align: "start",
        // sortable: true,
        value: "number",
      },
      {
        text: "Title",
        // align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Description", value: "desc", sortable: false },
      { text: "Genre", value: "genre[0].name", sortable: false },
      { text: "is active", value: "is_active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getGenreList() {
      let uri = "http://" + window.location.hostname + ":3000/genre"; //get only active
      axios
        .get(uri)
        .then((response) => {
          this.genreList = response.data;
        })
        .catch((error) => {
          console.error("ERROR getGenreList: ", error);
        });
    },

    getRequestParams(page, pageSize, isGetActive, search, filterGenre) {
      let params = {};

      if (pageSize) {
        params["size"] = pageSize;
      }

      if (isGetActive) {
        params["is_active"] = isGetActive;
      }

      if (search) {
        params["name"] = search;
      }

      if (!isNaN(search)) {
        params["number"] = search;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (filterGenre) {
        params["genre"] =
          // console.log(
          filterGenre.map((genre) => {
            return genre._id;
          });
        // );
      }

      console.log(params);

      return params;
    },

    retrieveDishes() {
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.isGetActive,
        this.search,
        this.filterGenre
      );
      let uri = `http://` + window.location.hostname + `:3000/dishes`;
      axios
        .get(uri, { params })
        .then((response) => {
          console.log(response.data);

          const { docs, metadata } = response.data[0];

          this.dishesList = docs;
          this.totalPages = Math.ceil(metadata[0].total / this.pageSize);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.retrieveDishes();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrieveDishes();
    },

    refreshList() {
      this.retrieveDishes();
    },

    // getDishesList() {
    //   let uri = "http://" + window.location.hostname + ":3000/dishes";
    //   axios
    //     .get(uri)
    //     .then((response) => {
    //       this.dishesList = response.data;
    //     })
    //     .catch((error) => {
    //       console.error("ERROR getDishesList: ", error);
    //     });
    // },
    deleteDishes(id) {
      let uri = `http://` + window.location.hostname + `:3000/dishes/${id}`;
      axios
        .delete(uri, this.dishesList)
        .then(() => {
          this.refreshList();
        })
        .catch((error) => {
          console.error("ERROR deleteDishes: ", error);
        });
    },
    setDishActive(dishTemp, is_active) {
      // console.log(genreTemp._id);
      // console.log(genreTemp.is_active);
      dishTemp.is_active = is_active;
      // console.log(genreTemp.is_active);
      let uri =
        `http://` + window.location.hostname + `:3000/dishes/${dishTemp._id}`;

      axios
        .patch(uri, dishTemp, this.dishesList)
        .then(() => {
          this.refreshList();
        })
        .catch((error) => {
          console.error("ERROR setDishActive: ", error);
        });
    },

    addPhotos(dishId) {
      this.imageDishId = dishId;
      this.showEditForm = true;
    },

    editDishFunc(dishTemp) {
      this.isEdit = true;
      this.editDish = dishTemp;
      this.showEditForm = true;
    },

    addDishFunc() {
      this.isEdit = false;
      this.editDish = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteDishes(this.deleteid);
      this.closeDelete();
    },

    closeDelete() {
      this.showDelDialog = false;
      this.$nextTick(() => {
        this.deleteid = -1;
        this.editedIndex = -1;
      });
    },
  },

  computed: {},
  created() {
    // this.getDishesList();
    this.refreshList();
    this.getGenreList();
  },
  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.refreshList();
    },
  },
};
</script>