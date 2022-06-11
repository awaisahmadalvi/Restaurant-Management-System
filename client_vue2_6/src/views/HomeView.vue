<template>
  <v-container fluid>
    <v-carousel
      cycle
      continuous
      height="400"
      hide-delimiter-background
      show-arrows-on-hover
      interval="3000"
      delimiter-icon="mdi-minus"
    >
      <v-carousel-item
        v-for="(item, i) in images"
        :key="i"
        :src="item.image_data"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>
    <v-row>
      <v-col cols="12">
        <v-combobox
          v-model="select"
          :items="genreList"
          item-value="_id"
          item-text="name"
          label="Genre"
          outlined
          dense
          @change="changed(select)"
        ></v-combobox>
      </v-col>
    </v-row>
    <hello-world />
  </v-container>
</template>

<script>
import axios from "axios";
import HelloWorld from "../components/HelloWorld";

export default {
  name: "HomeVue",

  created() {
    this.getGenreList();
    this.getImages();
  },

  components: {
    HelloWorld,
  },
  data() {
    return {
      genreList: [],
      select: [],
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      images: [],
      // items: [
      //   { name: "Programming", value: 1 },
      //   { name: "Design", value: 2 },
      //   { name: "Vue", value: 3 },
      //   { name: "Vuetify", value: 4 },
      // ],
    };
  },
  methods: {
    getImages() {
      let uri = "http://localhost:3000/images";
      axios.get(uri).then((response) => {
        this.images = response.data;
      });
    },
    changed(select) {
      console.log(select.name);
      console.log(select._id);
    },
    getGenreList() {
      let uri = "http://localhost:3000/genre";
      axios.get(uri).then((response) => {
        this.genreList = response.data;
      });
    },
  },
};
</script>
