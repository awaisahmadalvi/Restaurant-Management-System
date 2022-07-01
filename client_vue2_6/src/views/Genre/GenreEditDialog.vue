<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Genre</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Genre {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="genre.name"
                    :rules="genreNameRules"
                    :counter="20"
                    label="Genre Name*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editGenre() : addGenre()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Genre
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
    genreEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    genreList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // genre: {},
    valid: false,
    genreNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20",
    ],
    genreDescRules: [
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
    addGenre() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          this.genre.is_active = true;
          this.genre.genre_id = this.select._id;
          let uri = "http://" + window.location.hostname + ":3000/genre";
          axios
            .post(uri, this.genre)
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
    editGenre() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          this.genre.genre_id = this.select._id;
          console.log(this.genre);
          let uri =
            `http://` +
            window.location.hostname +
            `:3000/genre/${this.genre._id}`;
          axios
            .patch(uri, this.genre)
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
  created() {
    this.getGenreList();
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
    genre: {
      get() {
        return this.genreEdit == null ? {} : this.genreEdit;
      },
      set(genreEdit) {
        this.$emit("input", genreEdit);
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