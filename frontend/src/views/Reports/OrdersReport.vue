<template>
  <v-card class="ma-6 pb-1">
    <v-row class="d-print-none mx-6 mt-6">
      <v-col cols="12">
        <div class="text-h6 justify-center">Filter Orders:</div>
      </v-col>
    </v-row>
    <v-row dense class="d-print-none mx-6">
      <v-col dense cols="12" sm="6" xs="12" md="4" lg="4">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-combobox
              v-model="dates"
              multiple
              chips
              small-chips
              label="Date range"
              prepend-icon="mdi-calendar"
              append-icon="mdi-filter"
              readonly
              clearable
              v-bind="attrs"
              v-on="on"
            ></v-combobox>
          </template>
          <v-date-picker
            v-model="dates"
            :show-current="date"
            show-adjacent-months
            range
          >
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="menu = false"> Cancel </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                {
                  retrieveOrderslist();
                  menu = false;
                }
              "
            >
              <!-- <v-btn text color="primary" @click="$refs.menu.save(dates)"> -->
              OK
            </v-btn></v-date-picker
          >
        </v-menu>
      </v-col>
      <v-col dense cols="12" sm="2" xs="2" md="2" lg="2">
        <v-checkbox
          class="pa-2 ml-6"
          color="primary"
          v-model="isCompleted"
          label="Completed?"
          @click="refreshList"
        ></v-checkbox>
      </v-col>
      <v-spacer></v-spacer>

      <v-col dense cols="12" sm="1" xs="1" md="1" lg="1">
        <v-btn @click="printDoc" fab color="primary">
          <v-icon dark> mdi-printer-pos </v-icon>
        </v-btn>
      </v-col>
    </v-row>

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
      >Order's Report
    </v-card-title>

    <v-data-table
      :headers="summaryHeaders"
      :items="summaryItems"
      class="elevation-12 mx-6 my-8"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Summary</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-data-table
      :headers="headers"
      :items="ordersList"
      class="elevation-12 mx-6 my-8"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
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

export default {
  name: "OrdersList",
  components: {},
  data: () => ({
    ordersList: [],
    summaryItems: [],
    temp: {},

    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    dates: [],

    isCompleted: true,

    page: 1,
    totalPages: 0,
    pageSize: 20,
    pageSizes: [20, 50, 100],

    headers: [
      {
        text: "Time of Order",
        sortable: false,
        align: "start",
        value: "createdAt",
      },
      {
        text: "Order#",
        sortable: false,
        value: "daily_number",
      },
      { text: "Completed?", sortable: false, value: "is_paid" },
      { text: "Bill Amount", sortable: false, value: "total_bill" },
    ],
    summaryHeaders: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Value",
        value: "value",
      },
    ],
  }),

  methods: {
    getRequestParams(searchTitle, page, pageSize, dates, isCompleted) {
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

      if (dates.length > 0) {
        // var period = {};

        // date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        //   .toISOString()
        //   .substr(0, 10),
        var startDate = new Date(dates[0]);
        var endDate;
        if (dates.length == 1) endDate = startDate;
        else endDate = new Date(dates[1]);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        // ).toISOString();
        // var dateMidnight = dates[1];
        // console.log("startDate: ", dates[0]);
        // console.log("endDate: ", dates[1]);

        // console.log("startDate: ", startDate);
        // console.log("endDate: ", endDate);

        params["period_start"] = startDate;
        params["period_end"] = endDate;
      }

      if (isCompleted) {
        params["isCompleted"] = "Yes";
      }
      return params;
    },

    getStats() {
      // console.log("getStats");
      // console.log("Dates: ", this.dates);
      const params = this.getRequestParams(
        this.searchTitle,
        this.page,
        this.pageSize,
        this.dates,
        this.isCompleted
      );
      let uri = `http://` + window.location.hostname + `:3000/orderslist/stats`;
      axios
        .get(uri, { params })
        .then((response) => {
          const stats = response.data[0];
          this.summaryItems = [
            {
              name: "Total Orders",
              value: stats.count,
            },
            {
              name: "Total Inflows",
              value: stats.inflows,
            },
          ];
        })
        .catch((e) => {
          console.log(e);
        });
    },

    retrieveOrderslist() {
      this.getStats();
      console.log("retrieveOrderslist");
      console.log("Dates: ", this.dates);
      const params = this.getRequestParams(
        this.searchTitle,
        this.page,
        this.pageSize,
        this.dates,
        this.isCompleted
      );
      let uri = `http://` + window.location.hostname + `:3000/orderslist/`;
      axios
        .get(uri, { params })
        .then((response) => {
          console.log(response.data);

          const { docs, metadata } = response.data[0];

          // this.temp["name"] = "Total Orders";
          // this.temp["value"] = metadata[0].total;
          // var t = [this.temp];
          // this.summaryItems = t;
          // this.summaryItems[1] = this.temp;
          // this.summaryItems[2] = this.temp;?

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

    printDoc() {
      // var mywindow = window.open("", "PRINT", "height=400,width=600");
      // mywindow.document.write(document.getElementById("page").innerHTML);
      // mywindow.document.close(); // necessary for IE >= 10
      // mywindow.focus(); // necessary for IE >= 10*/
      // mywindow.print();
      // mywindow.close();
      // document.getElementById("page").print();
      window.print();
    },
  },
  created() {
    // this.getOrdersList();
    this.refreshList();
  },
  mounted() {},
  computed: {},

  watch: {
    // menu(val) {
    //   val ? this.retrieveOrderslist() : val;
    // },
  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only 
-->
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
