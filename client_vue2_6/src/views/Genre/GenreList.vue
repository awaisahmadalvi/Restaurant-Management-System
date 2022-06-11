<template>
  <v-sheet min-height="580px">
    <div>
      <h1 class="blue-grey ma-2 text-center white--text">List of Genre</h1>
      <!-- <v-btn :to="{ name: 'Add Table' }" variant="outlined" color="primary">
      Add Table
    </v-btn> -->
      <GenreAddDialog />
      <v-simple-table class="ma-4" fixed-header>
        <thead>
          <tr>
            <th class="text-left">Genre Name</th>
            <th class="text-left">Active</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="genre in genreList" :key="genre._id">
            <td>{{ genre.name }}</td>
            <td v-if="genre.is_active">
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click="setActive(genre, false)"
                color="success"
              >
                <v-icon>mdi-check</v-icon></v-btn
              >
            </td>
            <td v-else>
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click="setActive(genre, true)"
                color="error"
              >
                <v-icon>mdi-close</v-icon></v-btn
              >
            </td>

            <td>
              <!-- <router-link
              :to="{ name: 'Add Table', params: { id: table._id } }"
              class="btn btn-primary"
              >Edit</router-link
            > -->
              <!-- <v-btn
              class="mx-1"
              :to="{ name: 'Edit Genre', params: { id: genre._id } }"
              icon="mdi-pencil"
              size="x-small"
              color="primary"
            ></v-btn> -->
              <v-btn
                class="mx-1"
                @click="deleteGenre(genre._id)"
                x-small
                color="red accent-4"
                fab
                dark
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </v-sheet>
</template>

<script>
import axios from "axios";
import GenreAddDialog from "./GenreAddDialog.vue";

export default {
  name: "GenreList",
  components: { GenreAddDialog },
  data() {
    return {
      genreList: [],
    };
  },
  created() {
    this.getGenreList();
  },
  methods: {
    getGenreList() {
      let uri = "http://localhost:3000/genre";
      axios.get(uri).then((response) => {
        this.genreList = response.data;
      });
    },
    deleteGenre(id) {
      let uri = `http://localhost:3000/genre/${id}`;
      axios.delete(uri, this.genreList).then(() => {
        this.getGenreList();
      });
    },
    setActive(genreTemp, is_active) {
      // console.log(genreTemp._id);
      // console.log(genreTemp.is_active);
      genreTemp.is_active = is_active;
      // console.log(genreTemp.is_active);
      let uri = `http://localhost:3000/genre/${genreTemp._id}`;
      axios.patch(uri, genreTemp, this.genreList).then(() => {
        this.getGenreList();
      });
    },
  },
  updated() {
    this.getGenreList();
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
