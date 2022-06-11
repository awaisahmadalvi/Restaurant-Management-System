<template>
  <div>
    <h1 class="blue-grey text-center white--text">List of Genre</h1>
    <!-- <v-btn :to="{ name: 'Add Table' }" variant="outlined" color="primary">
      Add Table
    </v-btn> -->
    <GenreAddDialog />
    <v-table class="ma-4" fixed-header height="600px">
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
              icon="mdi-check"
              size="x-small"
              color="success"
            ></v-btn>
          </td>
          <td v-else>
            <v-btn
              class="mx-1"
              icon="mdi-close"
              size="x-small"
              color="error"
            ></v-btn>
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
              icon="mdi-delete"
              size="x-small"
              color="error"
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
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
