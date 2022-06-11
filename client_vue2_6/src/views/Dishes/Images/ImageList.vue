<template>
  <v-sheet min-height="580px">
    <div>
      <h1 class="blue-grey ma-2 text-center white--text">Images of Dish</h1>
      <!-- <v-btn :to="{ name: 'Add Table' }" variant="outlined" color="primary">
      Add Table
    </v-btn> -->

      <v-spacer></v-spacer>

      <ImageAddDialog :dishId="dishId" v-model="showEditForm" />
      <v-container>
        <v-row>
          <v-col
            v-for="(image, index) in images"
            :key="index"
            :cols="6"
            :sm="4"
          >
            <v-card>
              <v-img
                :src="image.image_data"
                :lazy-src="require('../../../assets/logo.png')"
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
                    <v-btn fab light small @click="deleteImage(image._id)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-fab-transition>
                </v-card-title>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-sheet>
</template>

<script>
import axios from "axios";
import ImageAddDialog from "./ImageAddDialog.vue";

export default {
  name: "ImagesGrid",
  components: { ImageAddDialog },

  data() {
    return {
      images: [],
      dishId: null,
      showEditForm: false,
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    getImages() {
      let uri = `http://localhost:3000/images/dishid/${this.dishId}`;
      console.log(uri);
      axios.get(uri).then((response) => {
        this.images = response.data;
      });
    },
    deleteImage(id) {
      let uri = `http://localhost:3000/images/${id}`;
      axios.delete(uri, this.images).then(() => {
        this.getImages();
      });
    },
  },
  mounted() {
    this.dishId = this.$route.params.id;
  },
  updated() {
    this.getImages();
  },
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
