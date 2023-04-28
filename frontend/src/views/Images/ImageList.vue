<template>
  <v-card class="ma-6 pb-1">
    <v-card-title
      class="
        text-h4
        font-weight-bold
        title
        py-2
        text-center
        justify-center
        white--text
      "
      >Images of {{ dish.name }}
    </v-card-title>

    <v-spacer></v-spacer>

    <ImageAddDialog class="mr-4 mt-4" :dishId="dishId" v-model="showEditForm" />
    <v-container>
      <v-row>
        <v-col v-for="(image, index) in images" :key="index" :cols="6" :sm="4">
          <v-card>
            <v-img
              :src="image.image_data"
              :lazy-src="require('../../assets/logo.png')"
              aspect-ratio="1"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate></v-progress-circular>
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
  </v-card>
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
      dish: [],
      showEditForm: false,
    };
  },

  methods: {
    getImages() {
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/images/dishid/${this.dishId}`;
      console.log(uri);
      axios
        .get(uri)
        .then((response) => {
          this.images = response.data;
        })
        .catch((error) => {
          console.error("ERROR getImages: ", error);
        });
    },
    deleteImage(id) {
      let uri = `http://` + window.location.hostname + `:3000/images/${id}`;
      axios
        .delete(uri, this.images)
        .then(() => {
          this.getImages();
        })
        .catch((error) => {
          console.error("ERROR deleteImage: ", error);
        });
    },
    getDish() {
      let uri =
        `http://` + window.location.hostname + `:3000/dishes/${this.dishId}`;
      axios
        .get(uri, this.dish)
        .then((response) => {
          this.dish = response.data;
        })
        .catch((error) => {
          console.error("ERROR getDish: ", error);
        });
    },
  },
  mounted() {
    this.dishId = this.$route.params.id;
  },
  created() {
    this.dishId = this.$route.params.id;
    this.getImages();
    this.getDish();
  },
  watch: {
    // showDelDialog(val) {
    //   val || this.closeDelete();
    // },
    showEditForm(val) {
      val ? val : this.getImages();
    },
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
