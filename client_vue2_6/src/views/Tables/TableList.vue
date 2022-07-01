<template>
  <v-sheet min-height="580px">
    <h1 class="blue-grey ma-2 text-center white--text">List of Tables</h1>
    <TableEditDialog
      :tableEdit="editItem"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="itemsList"
      sort-by="name"
      class="elevation-12 ma-6"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Dine-in Tables</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-1"
            @click.stop="addItemFunc"
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
                >Are you sure you want to delete this Item?</v-card-title
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="editItemFunc(item)"
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
          <span>Edit Item</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click="deleteTable(item._id)"
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
          <span>Delete Item</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import axios from "axios";
import TableEditDialog from "./TableEditDialog.vue";

export default {
  name: "ItemList",
  components: { TableEditDialog },
  data: () => ({
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
      axios.get(uri).then((res) => {
        this.itemsList = res.data;
        // console.log(res);
      });
    },
    deleteTable(id) {
      let uri = `http://` + window.location.hostname + `:3000/tables/${id}`;
      axios.delete(uri, this.itemsList).then(() => {
        this.getTablesList();
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
      this.deleteItem(this.deleteid);
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