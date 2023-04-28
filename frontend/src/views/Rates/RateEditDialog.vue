<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Rate</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Rate {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="rate.name"
                    :rules="rateNameRules"
                    :counter="20"
                    label="Rate Title*"
                    required
                    autofocus
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="rate.desc"
                    :rules="rateDescRules"
                    :counter="200"
                    rows="1"
                    auto-grow
                    label="Rate Description*"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="rate.price"
                    :rules="ratePriceRules"
                    :counter="6"
                    rows="1"
                    auto-grow
                    label="Price*"
                    required
                    type="number"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editRate() : addRate()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Rate
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
    dishId: String,
    rateEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    genreList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // rate: {},
    valid: false,
    rateNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20",
    ],
    rateDescRules: [
      (v) => !!v || "Description is required",
      (v) => (v && v.length <= 200) || "Description must be less than 200",
    ],
    ratePriceRules: [
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
    addRate() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          this.rate.is_active = true;
          this.rate.dish_id = this.dishId;
          let uri = "http://" + window.location.hostname + ":3000/ratelist";
          axios
            .post(uri, this.rate)
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
    editRate() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          this.rate.dish_id = this.dishId;
          console.log(this.rate);
          let uri =
            `http://` +
            window.location.hostname +
            `:3000/ratelist/${this.rate._id}`;
          axios
            .patch(uri, this.rate)
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
  computed: {
    // dishID: {
    //   get() {
    //     if (this.dishId == null) {
    //       return [];
    //     }
    //     // this.setDishGenre(this.dishEdit);
    //     return this.dishId;
    //   },
    //   set(dishId) {
    //     this.$emit("input", dishId);
    //   },
    // },
    rate: {
      get() {
        if (this.rateEdit == null) {
          // this.addoredit = "Add";
          // this.reset();
          // this.resetValidation();
          // this.setRateGenre(null);
          return {};
        }
        // this.setRateGenre(this.rateEdit);
        return this.rateEdit;
      },
      set(rateEdit) {
        this.$emit("input", rateEdit);
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