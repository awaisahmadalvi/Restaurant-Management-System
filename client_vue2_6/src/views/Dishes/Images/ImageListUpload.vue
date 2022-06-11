<template>
  <v-sheet min-height="580px">
    <div>
      <h1 class="blue-grey ma-2 text-center white--text">List of Images</h1>
      <!-- <v-btn :to="{ name: 'Add Table' }" variant="outlined" color="primary">
      Add Table
    </v-btn> -->

      <v-file-input
        v-model="files"
        prepend-icon="mdi-camera-plus"
        small-chips
        accept="image/png, image/jpeg, image/bmp"
        hide-input
        show-size
        multiple
        clearable
        @change="onFileChange"
      ></v-file-input>
      <v-spacer></v-spacer>
      <v-row>
        <v-col v-for="(image, index) in images" :key="index" :cols="12" :sm="4">
          <v-card>
            <v-img
              :src="image"
              :lazy-src="require('../../../assets/logo.png')"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
              <v-card-title text="ASD">
                <v-spacer></v-spacer>
                <v-btn icon @click="removeImage(index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-card-title
              >
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-sheet>
</template>

<script>
import axios from "axios";

export default {
  name: "TableList",
  components: {},
  data() {
    return {
      fileList: [],
      files: [],
      images: [],
      nFiles: 0,
    };
  },
  // created() {
  //   this.getTables();
  // },
  methods: {
    getTables() {
      let uri = "http://localhost:3000/tables";
      axios.get(uri).then((response) => {
        this.tables = response.data;
      });
    },
    deleteTable(id) {
      let uri = `http://localhost:3000/tables/${id}`;
      axios.delete(uri, this.table).then(() => {
        this.getTables();
      });
    },
    createImage(file) {
      var selectedFiles = file;
      // console.log("selected files: " + selectedFiles.length);
      for (var i = 0; i < selectedFiles.length; i++) {
        this.fileList.push(selectedFiles[i]);
      }

      for (var j = 0; j < this.fileList.length; j++) {
        let reader = new FileReader(); //instantiate a new file reader
        this.images = [];
        reader.addEventListener(
          "load",
          function () {
            this.images.push(reader.result);

            // console.log("images length: " + this.images.length);
            // this.$refs["image" + parseInt(j)][0].src = reader.result;
          }.bind(this),
          false
        ); //add event listener

        reader.readAsDataURL(this.fileList[j]);
      }
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
  // updated() {
  //   this.getTables();
  // },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
