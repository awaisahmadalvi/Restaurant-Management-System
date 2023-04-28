<template>
  <v-row justify="end">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small color="primary" fab dark>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Images</span>
        </v-card-title>
        <v-file-input
          ref="addimage"
          v-model="files"
          prepend-icon=""
          small-chips
          accept="image/png, image/jpeg, image/bmp"
          hide-input
          show-size
          multiple
          clearable
          @change="onFileChange"
        ></v-file-input>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                v-for="(image, index) in images"
                :key="index"
                :cols="6"
                :sm="4"
              >
                <v-card>
                  <v-alert
                    :value="image.isUploaded"
                    type="success"
                    closable
                    close-label="Close Alert"
                    >uploaded</v-alert
                  >
                  <v-img
                    :src="image.data"
                    :lazy-src="require('../../assets/logo.png')"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                    <v-card-title>
                      <v-spacer />
                      <v-fab-transition>
                        <v-btn fab light small @click="removeImage(index)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-fab-transition>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-col>
              <v-col :cols="4" :sm="4">
                <v-card
                  height="126"
                  color="primary lighten-1"
                  dark
                  @click="addImageFunc"
                >
                  <v-card-actions>
                    <v-row
                      class="fill-height ma-10"
                      align="center"
                      justify="center"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-btn class="mx-6 my-2" color="primary" @click="uploadImages"
            >Upload Images
          </v-btn>
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
    dishId: Object,
  },
  data: () => ({
    dialog: false,
    isSuccess: false,
    uploadSuccess: [false],
    fileList: [],
    files: [],
    images: [],
    imageRules: [
      (files) =>
        !files ||
        !files.some((file) => file.size > 2e6) ||
        "Avatar size should be less than 2 MB!",
    ],
  }),
  methods: {
    uploadImages: function () {
      this.images.forEach((image2Upload, index) => {
        if (!this.fileList[index].isUploaded) {
          let imageSchema = {};
          imageSchema.dish_id = this.dishID;
          imageSchema.image_data = image2Upload.data;
          let uri = "http://" + window.location.hostname + ":3000/images";
          axios.post(uri, imageSchema).then(() => {
            // this.$router.push({ name: "posts" });
            image2Upload.isUploaded = true;

            this.fileList[index].isUploaded = true;
            // this.isSuccess = true;
          });
          new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
            // this.dialog = false;
            // this.isSuccess = false;
            // this.reset();
          });
        }
      });
    },
    addImageFunc() {
      this.$refs.addimage.$refs.input.click();
      console.log("asda");
    },
    createImage(file) {
      var selectedFiles = file;
      // console.log("selected files: " + selectedFiles.length);
      selectedFiles.forEach((sFile) => {
        let fileObj = {};
        fileObj.isUploaded = false;
        fileObj.file = sFile;
        this.fileList.push(fileObj);
      });
      this.fileList.forEach((fileObj) => {
        let reader = new FileReader(); //instantiate a new file reader
        this.images = [];
        reader.addEventListener(
          "load",
          function () {
            let img = {};
            img.data = reader.result;
            img.isUploaded = fileObj.isUploaded;
            this.images.push(img);
            // console.log("images length: " + this.images.length);
            // this.$refs["image" + parseInt(j)][0].src = reader.result;
          }.bind(this),
          false
        ); //add event listener

        reader.readAsDataURL(fileObj.file);
      });
    },
    onFileChange(file) {
      if (!file) {
        return;
      }
      this.createImage(file);
    },
    removeImage(index) {
      this.fileList.splice(index, 1);
      this.images.splice(index, 1);
    },
  },
  computed: {
    dishID: {
      get() {
        if (this.dishId == null) {
          return [];
        }
        // this.setDishGenre(this.dishEdit);
        return this.dishId;
      },
      set(dishId) {
        this.$emit("input", dishId);
      },
    },
    // genre: {
    //   get() {
    //     // console.log(this.select);
    //     return this.select;
    //   },
    //   set(select) {
    //     this.$emit("input", select);
    //   },
    // },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>