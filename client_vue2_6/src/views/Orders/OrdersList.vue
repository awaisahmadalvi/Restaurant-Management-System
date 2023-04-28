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
      >List of Orders
    </v-card-title>
    <OrdersEditDialog
      :orderEdit="editOrder"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <OrderDetailsDialog :orderId="order_id" v-model="showOrderDetails" />
    <!-- :item-class="row_classes" -->
    <v-data-table
      :headers="headers"
      :items="ordersList"
      class="elevation-12 mx-6 my-8"
      @click:row="editOrderFunc"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Orders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-row class="mt-2">
            <v-checkbox
              class="ma-2"
              color="primary"
              v-model="isToday"
              label="Today's?"
              @click="refreshList"
            ></v-checkbox>
            <v-checkbox
              class="ma-2"
              color="primary"
              v-model="isCompleted"
              label="Incomplete?"
              @click="refreshList"
            ></v-checkbox>
          </v-row>
          <v-spacer></v-spacer>
          <v-text-field
            v-show="showSearchField"
            v-model="search"
            label="Search"
            single-line
            hide-details
            class="shrink"
            autofocus
          ></v-text-field>
          <v-icon @click="showSearchField = !showSearchField"
            >mdi-magnify</v-icon
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            class="ma-2"
            @click.stop="addOrderFunc"
            small
            color="primary"
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
                <v-btn color="primary" text @click="closeDelete">No</v-btn>
                <v-btn color="error" text @click="deleteItemConfirm">Yes</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.details`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-2"
              color="info"
              fab
              dark
              large
              v-bind="attrs"
              v-on="on"
              :disabled="item.is_paid != 'No'"
              :to="`/menugrid/${item._id}`"
            >
              <v-icon x-large>mdi-food</v-icon>
            </v-btn>
          </template>
          <span>View Menu</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-1"
              color="warning"
              fab
              large
              dark
              v-bind="attrs"
              v-on="on"
              @click.stop.prevent="
                {
                  order_id = item;
                  //order_id = item._id;
                  showOrderDetails = true;
                }
              "
            >
              <v-icon large>mdi-playlist-check</v-icon>
            </v-btn>
          </template>
          <span>View Bill</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop.prevent="editOrderFunc(item)"
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
          <span>Edit Order</span>
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
          <span>Delete Order</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop.prevent="editOrderFunc(item)"
              small
              :color="status_color(item)"
              dark
              outlined
              rounded
              v-bind="attrs"
              v-on="on"
            >
              {{ item.status }}
            </v-btn>
          </template>
          <span>Change Status</span>
        </v-tooltip>
      </template>

      <template v-slot:footer>
        <!-- <v-row> <v-col cols="12" sm="12"> Showing </v-col> </v-row> -->
        <v-row class="mt-2">
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
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
const axios = require("axios").default;

import OrdersEditDialog from "./OrderEditDialog.vue";
import OrderDetailsDialog from "./OrderDetailsDialog.vue";

export default {
  name: "OrdersList",
  components: { OrdersEditDialog, OrderDetailsDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    ordersList: [],
    tableListinTable: [],
    editDialog: false,
    showEditForm: false,
    editOrder: null,
    isEdit: false,
    showOrderDetails: false,
    // order_id: "",
    order_id: {},

    isToday: false,
    isCompleted: false,

    page: 1,
    totalPages: 0,
    pageSize: 10,
    pageSizes: [10, 20, 50],

    headers: [
      {
        text: "Order#",
        align: "start",
        value: "daily_number",
      },
      { text: "Details", value: "details", sortable: false },
      {
        text: "Table #",
        // sortable: false,
        value: "table[0].number",
      },
      // { text: "Completed?", value: "is_paid" },
      { text: "Bill Amount (PKR)", value: "total_bill" },
      { text: "Status", align: "center", value: "status" },
      { text: "Time of Order", value: "createdAt" },
      // { text: "Last Updated", value: "updatedAt" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    deleteOrders(id) {
      let uri = `http://` + window.location.hostname + `:3000/orderslist/${id}`;
      axios
        .delete(uri, this.ordersList)
        .then(() => {
          this.refreshList();
        })
        .catch((error) => {
          console.error("ERROR deleteOrders: ", error);
        });
    },

    editOrderFunc(orderTemp) {
      if (orderTemp.status == "Started") {
        this.$router.push({
          path: "/menugrid/" + orderTemp._id,
        });
        // /menugrid/orderTemp._id;
      } else if (orderTemp.is_paid != "Yes") {
        this.isEdit = true;
        this.editOrder = orderTemp;
        this.showEditForm = true;
      }
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
    status_color(item) {
      // console.log("item: ", item);
      if (item.status == "Completed") {
        return "success darken-1"; //can also return multiple classes e.g ["orange","disabled"]
      } else if (item.status == "Started") {
        return "warning"; //can also return multiple classes e.g ["orange","disabled"]
      } else if (item.status == "Preparing") {
        return "info darken-1"; //can also return multiple classes e.g ["orange","disabled"]
      }
      return "text"; //can also return multiple classes e.g ["orange","disabled"]
    },

    getRequestParams(searchTitle, page, pageSize, isToday, isCompleted) {
      let params = {};

      if (searchTitle) {
        params["title"] = searchTitle;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      // if (isToday) {
      //   params["isToday"] = isToday;
      // }

      if (isToday) {
        // var period = {};
        var startDate = new Date(); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")

        startDate.setSeconds(0);
        startDate.setHours(0);
        startDate.setMinutes(0);

        var dateMidnight = new Date(startDate);
        dateMidnight.setHours(23);
        dateMidnight.setMinutes(59);
        dateMidnight.setSeconds(59);
        // period.start = startDate;
        // period.end = dateMidnight;
        params["period_start"] = startDate;
        params["period_end"] = dateMidnight;
        params["isToday"] = isToday;
      }

      if (isCompleted) {
        params["isCompleted"] = "No";
      }
      return params;
    },

    retrieveOrderslist() {
      const params = this.getRequestParams(
        this.searchTitle,
        this.page,
        this.pageSize,
        this.isToday,
        this.isCompleted
      );
      let uri = `http://` + window.location.hostname + `:3000/orderslist/`;
      axios
        .get(uri, { params })
        .then((response) => {
          console.log(response.data);

          const { docs, metadata } = response.data[0];

          this.ordersList = docs;
          metadata.length == 0
            ? {}
            : (this.totalPages = Math.ceil(metadata[0].total / this.pageSize));
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.retrieveOrderslist();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrieveOrderslist();
    },

    refreshList() {
      this.retrieveOrderslist();
    },
  },
  created() {
    // this.getOrdersList();
    this.refreshList();
  },
  mounted() {
    // this.orderId = this.$route.params.id;
  },
  computed: {},

  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.refreshList();
    },
    showOrderDetails(val) {
      val ? val : this.refreshList();
    },
  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only 
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
-->