<template>
  <v-row justify="end">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          id="editbtn"
          class="mx-6 my-2"
          color="primary"
          v-bind="attrs"
          v-on="on"
          >Add Dish</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Dish</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isSuccess"
              type="success"
              closable
              close-label="Close Alert"
              >Dish added successfully.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="dish.name"
                    :rules="dishNameRules"
                    :counter="20"
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
              <v-btn
                class="mr-4"
                @click="addDish"
                variant="outlined"
                color="primary"
              >
                Add Dish
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
    genreList: [],
    select: [],
    dialog: false,
    isSuccess: false,
    dish: {},
    valid: false,
    dishNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20",
    ],
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
      this.validate();
      if (this.valid) {
        this.dish.is_active = true;
        this.dish.genre_id = this.select._id;
        let uri = "http://localhost:3000/dishes";
        axios.post(uri, this.dish).then(() => {
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
    getGenreList() {
      let uri = "http://localhost:3000/genre";
      axios.get(uri).then((response) => {
        this.genreList = response.data;
      });
    },
  },
  created() {
    this.getGenreList();
  },
};
</script>