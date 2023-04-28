<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Order</span>
        </v-card-title>
        <v-card-text>
          <v-form
            :disabled="isDisabled"
            ref="form"
            lazy-validation
            v-model="valid"
          >
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Order#{{ orderNumber }} {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="select"
                    :items="tableList"
                    item-value="_id"
                    item-text="number"
                    label="Table #"
                    outlined
                  >
                    <template v-slot:no-data>
                      <v-list-item class="error">
                        <v-list-item-content>
                          <v-list-item-title>
                            <span>No Table Free. Please Create/free one.</span>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-col>
              </v-row>
              <!-- <v-row v-if="isEdit"> -->
              <v-row>
                <v-col cols="8">
                  <v-combobox
                    v-model="order.status"
                    :items="statusList"
                    label="Status"
                    outlined
                    :disabled="!isEdit"
                  ></v-combobox>
                </v-col>

                <v-col cols="4">
                  <v-btn
                    class="py-7"
                    @click="updateStatus"
                    variant="outlined"
                    color="primary"
                    :dark="isEdit"
                    :disabled="!isEdit || order.status == 'Serving'"
                  >
                    >> {{ statusList[nextStatusIndex + 1] }}
                  </v-btn>
                </v-col>
              </v-row>

              <!-- <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="order.is_paid"
                    :items="isCompletedList"
                    label="Is Order Completed?*"
                    outlined
                    disabled
                  ></v-combobox>
                </v-col>
              </v-row> -->
              <!-- <v-row v-if="isEdit"> -->
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="order.is_paid"
                    label="Is Order Completed?*"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- <v-row v-if="isEdit"> -->
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="order.total_bill"
                    rows="1"
                    auto-grow
                    label="Total Bill*"
                    type="number"
                    disabled
                  ></v-textarea>
                  <!-- :disabled="!isEdit" -->
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editOrder() : addOrder()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Order
              </v-btn>
            </v-container>
          </v-form>
          <small>*indicates required field</small>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: {
    value: Boolean,
    orderId: String,
    orderEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    tableList: [],
    orderNumber: 0,
    nextStatusIndex: 1,
    table_id: null,
    select: [],
    isDisabled: false,
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // order: {},
    valid: false,
    isCompletedList: ["No", "Yes"],
    statusList: [
      "Started",
      "Placed",
      "Accepted",
      "Preparing",
      "Ready",
      "Serving",
      "Completed",
    ],
    orderNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20",
    ],
    orderDescRules: [
      (v) => !!v || "Description is required",
      (v) => (v && v.length <= 200) || "Description must be less than 200",
    ],
    orderPriceRules: [
      (v) => !!v || "Price is required",
      (v) => (v && v >= 0) || "Price must be Greater than 0",
    ],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    addOrder() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          this.order.is_paid = "No";
          this.order.total_bill = 0;
          this.order.status = "Started";
          this.order.table_id = this.select._id;
          console.log("Add Order:", this.order);
          this.isDisabled = true;
          let uri = "http://" + window.location.hostname + ":3000/orderslist";
          axios
            .post(uri, this.order)
            .then((response) => {
              this.orderNumber = response.data.daily_number;
              this.alertType = "success";
              this.isAlert = true;
              new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                this.show = false;
                this.isAlert = false;
                // this.reset();
              });
            })
            .catch((error) => {
              console.error(error);
              this.alertType = "error";
              this.isAlert = true;
            });
        }
      }
    },
    editOrder() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          this.order.table_id = this.select._id;
          console.log("Edit Order:", this.order);
          let uri =
            `http://` +
            window.location.hostname +
            `:3000/orderslist/${this.order._id}`;
          axios
            .patch(uri, this.order)
            .then((response) => {
              this.orderNumber = response.data.daily_number;
              this.alertType = "success";
              this.isAlert = true;
              new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                this.show = false;
                this.isAlert = false;
                // this.reset();
              });
            })
            .catch((error) => {
              console.error(error);
              this.alertType = "error";
              this.isAlert = true;
            });
        }
      }
    },
    updateStatus() {
      this.order.status = this.statusList[this.nextStatusIndex + 1];
      this.editOrder();
    },
    getFreeTableList() {
      let params = {};
      params["is_empty"] = true;
      let uri = "http://" + window.location.hostname + ":3000/tables";
      axios.get(uri, { params }).then((response) => {
        this.tableList = response.data;
        // console.log("Tables list: ", this.tableList);
      });
    },
    setOrderTable(orderEdt) {
      this.nextStatusIndex = this.statusList.findIndex(this.checkStatusIndex);

      if (this.isEdit == false) {
        this.select = null;
        return orderEdt;
      }
      this.select = {
        number: orderEdt.table[0].number,
        _id: orderEdt.table_id,
      };
    },
    checkStatusIndex(status) {
      if (this.orderEdit == null) return 0;
      return status == this.orderEdit.status;
    },
  },
  watch: {
    isEdit(newValue) {
      // console.log("oldValue: ", oldValue);
      // console.log("newValue: ", newValue);
      if (newValue == false) {
        this.addoredit = "Add";
        this.$refs.form.reset();
      } else {
        this.addoredit = "Edit";
      }
    },
  },
  mounted() {
    this.getFreeTableList();
  },
  computed: {
    order: {
      get() {
        this.setOrderTable(this.orderEdit);
        return this.orderEdit == null
          ? {
              is_paid: "No",
              total_bill: "Not Available Yet",
              status: "Started",
            }
          : this.orderEdit;
      },
      set(orderEdit) {
        this.$emit("input", orderEdit);
      },
    },
    show: {
      get() {
        this.getFreeTableList();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        if (value == false) {
          this.reset();
          this.isDisabled = false;
          this.resetValidation();
        }
      },
    },
  },
};
</script>