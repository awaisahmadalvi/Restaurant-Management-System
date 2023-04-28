<template>
  <v-card class="ma-6 pb-1">
    <v-card-title
      class="text-h4 font-weight-bold title py-2 text-center justify-center white--text"
      >List of Tables
    </v-card-title>
    <TableEditDialog
      :tableEdit="editItem"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="itemsList"
      sort-by="name"
      @click:row="editItemFunc"
      :search="search"
      class="elevation-12 mx-6 my-8"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Dine-in Tables</v-toolbar-title>
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
          <v-icon @click.stop="showSearchField = !showSearchField"
            >mdi-magnify</v-icon
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            class="mx-1"
            @click.stop="addItemFunc"
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
                >Are you sure you want to delete this Item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.stop="closeDelete">No</v-btn>
                <v-btn color="error" text @click.stop="deleteItemConfirm"
                  >Yes</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="editItemFunc(item)"
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
          <span>Edit Table</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
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
          <span>Delete Table</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="resetTableOrder(item._id)"
              x-small
              color="success"
              fab
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
          </template>
          <span>Reset Table Order</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import TableEditDialog from "./TableEditDialog.vue";

export default {
  name: "ItemList",
  components: { TableEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    itemsList: [],
    itemListinTable: [],
    editDialog: false,
    showEditForm: false,
    editItem: null,
    isEdit: false,

    headers: [
      {
        text: "Table #",
        align: "start",
        // sortable: false,
        value: "number",
      },
      { text: "Order Serving", value: "order_id" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getTablesList() {
      let uri = `http://` + window.location.hostname + `:3000/tables/`;
      axios
        .get(uri)
        .then((res) => {
          this.itemsList = res.data;
          // console.log(res);
        })
        .catch((error) => {
          console.error("ERROR getTablesList: ", error);
        });
    },

    deleteTable(id) {
      let uri = `http://` + window.location.hostname + `:3000/tables/${id}`;
      axios
        .delete(uri, this.itemsList)
        .then(() => {
          this.getTablesList();
        })
        .catch((error) => {
          console.error("ERROR deleteTable: ", error);
        });
    },

    resetTableOrder(id) {
      this.table = {};
      this.table.order_id = "-1";
      console.log(this.table);
      let uri = `http://` + window.location.hostname + `:3000/tables/${id}`;

      axios
        .patch(uri, this.table)
        .then(() => {
          this.getTablesList();
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editItemFunc(itemTemp) {
      this.isEdit = true;
      this.editItem = itemTemp;
      this.showEditForm = true;
    },

    addItemFunc() {
      this.isEdit = false;
      this.editItem = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteTable(this.deleteid);
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
  created() {
    this.getTablesList();
  },
  computed: {},

  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.getTablesList();
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