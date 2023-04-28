<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Dish</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Dish {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="dish.name"
                    :rules="dishNameRules"
                    :counter="50"
                    label="Dish Title*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="dish.desc"
                    :rules="dishDescRules"
                    :counter="200"
                    rows="1"
                    auto-grow
                    label="Dish Description*"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="select"
                    :items="genreList"
                    item-value="_id"
                    item-text="name"
                    label="Genre"
                    outlined
                    :rules="genreRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="dish.number"
                    :rules="dishNmbrRules(latestNumber)"
                    label="Dish Number*"
                    required
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editDish() : addDish()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Dish
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
    dishEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    genreList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // dish: {},
    valid: false,
    latestNumber: 0,
    dishNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50",
    ],
    // dishNmbrRules: [
    //   (v) => !!v || "Number is required",
    //   (v, ltstnmbr) =>
    //     (v && v > ltstnmbr) || "Number must be less than ${ltstnmbr}",
    // ],
    dishNmbrRules: (limit) => [
      (val) => val >= limit || `Please use greater or equal to ${limit}`,
    ],

    // dishNmbrRules: {
    //   max(maxNum) {
    //     return (v) =>
    //       (v || "").length > maxNum || "Number Must be greater than " + maxNum;
    //   },
    // },
    dishDescRules: [
      (v) => !!v || "Description is required",
      (v) => (v && v.length <= 200) || "Description must be less than 200",
    ],
    genreRule: [(v) => !!v || "Genre is required"],
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
    addDish() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          this.dish.is_active = true;
          this.dish.genre_id = this.select._id;
          let uri = "http://" + window.location.hostname + ":3000/dishes";
          axios
            .post(uri, this.dish)
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
    editDish() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          this.dish.genre_id = this.select._id;
          console.log(this.dish);
          let uri =
            `http://` +
            window.location.hostname +
            `:3000/dishes/${this.dish._id}`;
          axios
            .patch(uri, this.dish)
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
    getGenreList() {
      let uri = "http://" + window.location.hostname + ":3000/genre";
      axios.get(uri).then((response) => {
        this.genreList = response.data;
      });
    },
    getLatestDishNumber() {
      let uri =
        "http://" + window.location.hostname + ":3000/dishes/latestnumber";
      axios.get(uri).then((response) => {
        console.log("response.data", response.data);
        this.latestNumber = response.data[0].number;
        this.dish.number = this.latestNumber + 1;
        console.log("latestNumber", this.latestNumber);
      });
    },
    setDishGenre(dishEdt) {
      if (dishEdt == null) {
        this.select = null;
        return;
      }
      this.latestNumber = dishEdt.number;
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/genre/${dishEdt.genre_id}`;
      axios.get(uri).then((response) => {
        this.select = response.data.name;
      });
      // console.log(this.select);
      // return;
    },
  },
  created() {
    this.getLatestDishNumber();
    this.getGenreList();
  },
  watch: {
    isEdit(newValue) {
      // console.log("oldValue: ", oldValue);
      // console.log("newValue: ", newValue);
      if (newValue == false) {
        this.addoredit = "Add";
        this.$refs.form.reset();
        this.getLatestDishNumber();
      } else {
        this.addoredit = "Edit";
      }
    },
  },
  computed: {
    dish: {
      get() {
        this.setDishGenre(this.dishEdit);
        return this.dishEdit == null ? {} : this.dishEdit;
      },
      set(dishEdit) {
        this.$emit("input", dishEdit);
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