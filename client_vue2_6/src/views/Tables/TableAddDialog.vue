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
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="table.number"
                    :rules="tableNumberRules"
                    :counter="2"
                    label="Table Number"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn
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
    table: {},
    tableNumberRules: [
      (v) => !!v || "Number is required",
      (v) => v < 100 || "Number must be less than 100",
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
    addTable: function () {
      this.validate();
      if (this.valid) {
        this.table.order_id = "-1";
        let uri = "http://localhost:3000/tables";
        axios.post(uri, this.table).then(() => {
          // this.$router.push({ name: "posts" });
          this.isSuccess = true;
        });
        new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
          this.dialog = false;
          this.isSuccess = false;
          this.reset();
        });
      }
    },
  },
};
</script>