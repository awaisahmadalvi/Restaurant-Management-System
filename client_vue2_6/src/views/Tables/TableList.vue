<template>
  <v-sheet min-height="580px">
    <div>
      <h1 class="blue-grey ma-2 text-center white--text">List of Tables</h1>
      <!-- <v-btn :to="{ name: 'Add Table' }" variant="outlined" color="primary">
      Add Table
    </v-btn> -->

      <v-spacer></v-spacer>

      <TableAddDialog />
      <v-simple-table class="ma-4" fixed-header>
        <thead>
          <tr>
            <th class="text-left">Table Number</th>
            <th class="text-left">Order Serving</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="table in tables" :key="table._id">
            <td>{{ table.number }}</td>
            <td v-if="table.order_id < 0">No Order</td>
            <td v-else>{{ table.order_id }}</td>

            <td>
              <!-- <router-link
              :to="{ name: 'Add Table', params: { id: table._id } }"
              class="btn btn-primary"
              >Edit</router-link
            > -->
              <!-- <v-btn
              class="mx-1"
              :to="{ name: 'Add Table', params: { id: table._id } }"
              icon="mdi-pencil"
              size="x-small"
              color="primary"
            ></v-btn> -->
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click="deleteTable(table._id)"
                color="error"
              >
                <v-icon> mdi-delete </v-icon>
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
import TableAddDialog from "./TableAddDialog.vue";

export default {
  name: "TableList",
  components: { TableAddDialog },
  data() {
    return {
      tables: [],
    };
  },
  created() {
    this.getTables();
  },
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
  },
  updated() {
    this.getTables();
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
