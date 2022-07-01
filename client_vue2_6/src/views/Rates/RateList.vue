<template>
  <v-sheet min-height="580px">
    <h1 class="blue-grey ma-2 text-center white--text">List of Rates</h1>
    <RatesEditDialog
      :rateEdit="editRate"
      :isEdit="isEdit"
      :dishId="dishId"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="ratesList"
      sort-by="name"
      class="elevation-12 ma-6"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Rates</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-1"
            @click.stop="addRateFunc"
            x-small
            color="blue"
            fab
            dark
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-dialog v-model="showDelDialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this Rate with associated
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
                @click="setRateActive(item, false)"
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
                @click="setRateActive(item, true)"
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
              @click.stop="editRateFunc(item)"
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
          <span>Edit Rate</span>
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
          <span>Delete Rate</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import axios from "axios";
import RatesEditDialog from "./RateEditDialog.vue";

export default {
  name: "RatesList",

  components: { RatesEditDialog },
  data: () => ({
    showDelDialog: false,
    dishId: null,
    deleteid: -1,
    selectedGenre: [],
    ratesList: [],
    genreList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editRate: null,
    imageRateId: null,
    isEdit: false,

    headers: [
      {
        text: "Rate Title",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Description", value: "desc" },
      { text: "Price", value: "price" },
      { text: "is active", value: "is_active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getRatesList() {
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/ratelist/dishid/${this.dishId}`;
      axios.get(uri).then((response) => {
        this.ratesList = response.data;
      });
    },
    deleteRates(id) {
      let uri = `http://` + window.location.hostname + `:3000/ratelist/${id}`;
      axios.delete(uri, this.ratesList).then(() => {
        this.getRatesList();
      });
    },
    setRateActive(rateTemp, is_active) {
      rateTemp.is_active = is_active;
      let uri =
        `http://` + window.location.hostname + `:3000/ratelist/${rateTemp._id}`;
      axios.patch(uri, rateTemp, this.ratesList).then(() => {
        this.getRatesList();
      });
    },

    editRateFunc(rateTemp) {
      this.isEdit = true;
      this.editRate = rateTemp;
      this.showEditForm = true;
    },

    addRateFunc() {
      this.isEdit = false;
      this.editRate = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteRates(this.deleteid);
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
  mounted() {
    this.dishId = this.$route.params.id;
    // console.log("MOUNTED DISHID", this.dishId);
  },
  created() {
    this.dishId = this.$route.params.id;
    this.getRatesList();
  },
  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.getRatesList();
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