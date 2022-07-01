<template>
  <v-sheet min-height="580px">
    <h1 class="blue-grey ma-2 text-center white--text">List of Orders</h1>
    <OrdersEditDialog
      :orderEdit="editOrder"
      :isEdit="isEdit"
      :orderId="orderId"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="ordersList"
      sort-by="name"
      class="elevation-12 ma-6"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Orders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-1"
            @click.stop="addOrderFunc"
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
                >Are you sure you want to delete this Order with associated
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="editOrderFunc(item)"
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
          <span>Edit Order</span>
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
          <span>Delete Order</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import axios from "axios";
import OrdersEditDialog from "./OrderEditDialog.vue";

export default {
  name: "OrdersList",
  components: { OrdersEditDialog },
  data: () => ({
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    ordersList: [],
    tableListinTable: [],
    editDialog: false,
    showEditForm: false,
    editOrder: null,
    isEdit: false,
    orderId: -1,

    headers: [
      {
        text: "Table #",
        align: "start",
        // sortable: false,
        value: "table[0].number",
      },
      { text: "Completed?", value: "is_paid" },
      { text: "Bill Amount", value: "total_bill" },
      { text: "Status", value: "status" },
      { text: "Time of Order", value: "createdAt" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getOrdersList() {
      let uri = `http://` + window.location.hostname + `:3000/orderslist/`;
      axios.get(uri).then((res) => {
        this.ordersList = res.data;
        // console.log(res);
      });
    },
    deleteOrders(id) {
      let uri = `http://` + window.location.hostname + `:3000/orderslist/${id}`;
      axios.delete(uri, this.ordersList).then(() => {
        this.getOrdersList();
      });
    },

    editOrderFunc(orderTemp) {
      this.isEdit = true;
      this.editOrder = orderTemp;
      this.showEditForm = true;
    },

    addOrderFunc() {
      this.isEdit = false;
      this.editOrder = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteOrders(this.deleteid);
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
    this.getOrdersList();
  },
  mounted() {
    this.orderId = this.$route.params.id;
  },
  computed: {},

  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.getOrdersList();
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