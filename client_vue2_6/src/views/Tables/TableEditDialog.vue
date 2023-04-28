<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Table</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Table {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="table.number"
                    rows="1"
                    label="Table Number*"
                    required
                    type="number"
                    :rules="tableNumberRules"
                    autofocus
                  ></v-text-field>
                  <!-- 
                    @change="$emit('update:tableEdit', $event.target.value)"
                    :disabled="!isEdit" -->
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editTable() : addTable()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Table
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
    tableId: String,
    tableEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // table: {},
    valid: false,
    tablePriceRules: [
      (v) => !!v || "Number is required",
      (v) => (v && v >= 0) || "Number must be Greater than 0",
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
    addTable() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          // console.log(this.table);
          let uri = "http://" + window.location.hostname + ":3000/tables";
          axios
            .post(uri, this.table)
            .then(() => {
              this.alertType = "success";
              this.isAlert = true;
              new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                this.show = false;
                this.isAlert = false;
                this.reset();
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
    editTable() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          this.table.table_id = this.select._id;
          // console.log(this.table);
          let uri =
            `http://` +
            window.location.hostname +
            `:3000/tables/${this.table._id}`;
          axios
            .patch(uri, this.table)
            .then(() => {
              this.alertType = "success";
              this.isAlert = true;
              new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                this.show = false;
                this.isAlert = false;
                this.reset();
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
  created() {
    this.getTableList();
  },
  computed: {
    table: {
      get() {
        return this.tableEdit == null
          ? {
              number: "0",
              order_id: "-1",
            }
          : this.tableEdit;
      },
      set(tableEdit) {
        this.$emit("tableEdit", tableEdit);
      },
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        if (value == false) {
          this.reset();
          this.resetValidation();
        }
      },
    },
  },
};
</script>