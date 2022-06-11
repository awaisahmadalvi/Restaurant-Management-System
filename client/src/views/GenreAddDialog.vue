<template>
  <v-row justify="end">
    <v-dialog v-model="dialog">
      <template v-slot:activator="{ props }">
        <v-btn class="mx-6 my-2" color="primary" v-bind="props"
          >Add Genre</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Genre</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isSuccess"
              type="success"
              closable
              close-label="Close Alert"
              >Genre added successfully.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="genre.name"
                    :rules="genreNameRules"
                    :counter="20"
                    label="Genre Name*"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn
                class="mr-4"
                @click="addGenre"
                variant="outlined"
                color="primary"
              >
                Add Genre
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
    genre: {},
    genreNameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length < 20 || "Name must be less than 20",
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
    addGenre: function () {
      this.validate();
      if (this.valid) {
        this.genre.is_active = true;
        let uri = "http://localhost:3000/genre";
        axios.post(uri, this.genre).then(() => {
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