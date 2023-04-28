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
      List of Genre
    </v-card-title>
    <GenreEditDialog
      :genreEdit="editGenre"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="genreList"
      sort-by="name"
      @click:row="editGenreFunc"
      :search="search"
      class="elevation-12 mx-6 my-8"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Genre</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-show="showSearchField"
            v-model="search"
            label="Search"
            single-line
            hide-details
            class="shrink"
          ></v-text-field>
          <v-icon @click="showSearchField = !showSearchField"
            >mdi-magnify</v-icon
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            class="mx-1"
            @click.stop.prevent="addGenreFunc"
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
                >Are you sure you want to delete this Genre with associated
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
                @click.stop.prevent="setGenreActive(item, false)"
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
                @click.stop.prevent="setGenreActive(item, true)"
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
              @click.stop.prevent="editGenreFunc(item)"
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
          <span>Edit Genre</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop.prevent="deleteItem(item._id)"
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
          <span>Delete Genre</span>
        </v-tooltip>

        <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import GenreEditDialog from "./GenreEditDialog.vue";

export default {
  name: "GenreList",
  components: { GenreEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    genreList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editGenre: null,
    imageGenreId: null,
    isEdit: false,

    headers: [
      {
        text: "Genre Name",
        align: "start",
        sortable: false,
        value: "name",
      },
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
    deleteGenre(id) {
      let uri = `http://` + window.location.hostname + `:3000/genre/${id}`;
      axios
        .delete(uri, this.genreList)
        .then(() => {
          this.getGenreList();
        })
        .catch((error) => {
          console.error("ERROR deleteGenre: ", error);
        });
    },
    setGenreActive(genreTemp, is_active) {
      // console.log(genreTemp._id);
      // console.log(genreTemp.is_active);
      genreTemp.is_active = is_active;
      // console.log(genreTemp.is_active);
      let uri =
        `http://` + window.location.hostname + `:3000/genre/${genreTemp._id}`;
      axios
        .patch(uri, genreTemp, this.genreList)
        .then(() => {
          this.getGenreList();
        })
        .catch((error) => {
          console.error("ERROR setGenreActive: ", error);
        });
    },

    editGenreFunc(genreTemp) {
      this.isEdit = true;
      this.editGenre = genreTemp;
      this.showEditForm = true;
    },

    addGenreFunc() {
      this.isEdit = false;
      this.editGenre = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteGenre(this.deleteid);
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
    this.getGenreList();
  },
  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.getGenreList();
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>