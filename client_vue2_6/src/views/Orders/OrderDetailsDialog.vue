<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card id="print" class="pa-2">
        <v-alert
          v-model="isAlert"
          :type="alertType"
          closable
          close-label="Close Alert"
          >Bill Payment
          {{ alertType == "success" ? "Successfull" : "Failed" }}.</v-alert
        >
        <v-card-title class="mb-6">
          <h1>Detail of Order</h1>
          <h3>{{ orderId.daily_number }} - {{ orderId.createdAt }}</h3>
          <v-spacer></v-spacer>

          <v-btn @click="printDoc" fab color="primary">
            <v-icon dark> mdi-printer-pos </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-for="orderdetail in orderDetails" :key="orderdetail._id">
          <v-container>
            <v-row>
              <v-col cols="9">
                <h4>
                  {{ orderdetail.rate[0].dish[0].name }} x{{ orderdetail.qty }}
                </h4>
                <!-- <h4>{{ orderdetail.rate[0].dish[0].desc }}</h4> -->
                <h4>{{ orderdetail.rate[0].name }}</h4>
                <!-- <h4>{{ orderdetail.rate[0].desc }}</h4> -->
              </v-col>
              <v-col cols="3" align="right" justify="center">
                <h4>Price:{{ orderdetail.price * orderdetail.qty }}</h4>
              </v-col>
              <v-divider class="mx-2"></v-divider>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-subtitle>
          <h2 class="my-1" align="right" justify="center">
            Total Bill: PKR {{ bill }}/-
          </h2>
          <v-divider class="mx-2 my-4"></v-divider>
          <v-autocomplete
            class="mx-2 mt-10"
            v-model="discountValue"
            :items="discounts"
            label="Apply Discount (%)"
          ></v-autocomplete>
          <h2 class="my-4" align="right" justify="center">
            Discounted Bill: PKR
            {{ this.bill * (1 - this.discountValue / 100) }}/-
          </h2>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-2 mb-2"
            @click="payBill()"
            variant="outlined"
            color="primary"
            :disabled="orderId.is_paid == `Yes`"
          >
            Pay Bill
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: {
    value: Boolean,
    // orderId: String,
    orderId: Object,
    orderEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    isAlert: false,
    alertType: "success",
    orderDetails: [],
    bill: 0,
    discounts: [0, 10, 15],
    discountValue: "",
  }),
  methods: {
    getOrderDetails() {
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/orderDetail/orderid/${this.order_id}`;
      axios.get(uri).then((response) => {
        this.orderDetails = response.data;
        this.bill = response.data.reduce(function (tot, arr) {
          // return the sum with previous value
          return tot + arr.price * arr.qty;

          // set initial value as 0
        }, 0);
        console.log("getOrderDetails: ", this.orderDetails);
      });
    },
    payBill() {
      let order = {};
      order.is_paid = "Yes";
      order.total_bill = this.bill * (1 - this.discountValue / 100);
      order.status = "Completed";
      // console.log(order);
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/orderslist/${this.order_id}`;
      axios
        .patch(uri, order)
        .then(() => {
          this.alertType = "success";
          this.isAlert = true;
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            this.show = false;
            this.isAlert = false;
            // console.log("Success");
            // this.reset();
          });
        })
        .catch((error) => {
          console.error(error);
          this.alertType = "error";
          this.isAlert = true;
        });
    },

    printDoc() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("print").innerHTML;
      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }
      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );
      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          ${stylesHtml}
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
      // var mywindow = window.open("", "PRINT", "height=400,width=600");
      // mywindow.document.write(document.getElementById("print").innerHTML);
      // mywindow.document.close(); // necessary for IE >= 10
      // mywindow.focus(); // necessary for IE >= 10*/
      // mywindow.print();
      // mywindow.close();
      // document.getElementById("page").print();
      // window.print();
    },
  },
  mounted() {
    // this.getOrderDetails();
  },
  computed: {
    show: {
      get() {
        if (this.value) this.getOrderDetails();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    order_id: {
      get() {
        return this.orderId._id;
      },
    },
  },
};
</script>