<template>
  <v-row justify="end">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-6 my-2" color="primary" v-bind="attrs" v-on="on"
          >Add Table</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Table</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isSuccess"
              type="success"
              closable
              close-label="Close Alert"
              >Table added successfully.</v-alert
            >
            <v-alert
              v-model="numberError"
              type="error"
              closable
              close-label="Close Alert"
              >Table Number already exists</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="tableNumber"
                    :rules="tableNumberRules"
                    :counter="2"
                    label="Table Number"
                    type="number"
                    required
                    :disabled="isSuccess"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn
                :disabled="isSuccess"
                class="mr-4"
                @click="addTable"
                variant="outlined"
                color="primary"
              >
                Add Table
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
  data: () => ({
    dialog: false,
    isSuccess: false,
    valid: false,
    tableNumber: null,
    numberError: false,
    tableNumberRules: [
      (v) => !!v || "Number is required",
      (v) => v < 100 || "Number must be less than 100",
    ],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    // tableAvailableCheck() {
    //   this.errorMessages = this.numberError ? `Duplicate Table Found` : "";
    //   let b = this.numberError;
    //   this.numberError = false;
    //   return !b;
    // },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    addTable: function () {
      this.validate();

      if (this.valid) {
        let table = {};
        table.order_id = "-1";
        table.number = this.tableNumber;
        let uri = "http://localhost:3000/tables";
        axios
          .post(uri, table)
          .then((res) => {
            console.log(res);
            // this.$router.push({ name: "posts" });
            this.numberError = false;
            this.isSuccess = true;
            new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
              this.dialog = false;
              this.isSuccess = false;
              this.reset();
            });
          })
          .catch(function (error) {
            // if (error.response) {
            //   // The request was made and the server responded with a status code
            //   // that falls out of the range of 2xx
            //   // this.numberError = true; no variable is catch scope
            //   alert(error.response.data.message, 1000);
            //   console.log(error.response.data);
            //   console.log(error.response.status);
            //   console.log(error.response.headers);
            // } else if (error.request) {
            //   // The request was made but no response was received
            //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            //   // http.ClientRequest in node.js
            //   console.log(error.request);
            // } else {
            //   // Something happened in setting up the request that triggered an Error
            //   console.log("Error", error.message);
            // }
            // console.log(error.config);
            return error.response;
          })
          .then((err) => {
            // console.log(err.status);
            if (err.data.message.includes("Tables validation failed:")) {
              // if (err.status == 400) {
              // console.log("asdasdasdasdas");
              this.numberError = true; //no variable is catch scope
              // alert(err.data.message);
            }
          });
      }
    },
  },
};
</script>