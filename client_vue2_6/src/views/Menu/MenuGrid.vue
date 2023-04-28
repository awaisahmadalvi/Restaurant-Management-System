<template>
  <v-card class="ma-6 pb-1">
    <v-card-title
      class="
        text-h3
        font-weight-bold font-italic
        title
        white--text
        text-center
        justify-center
        py-6
      "
    >
      <div>JÜSTA HIGHLAND & RESORT</div>
    </v-card-title>

    <v-row dense>
      <v-spacer></v-spacer>
      <v-col class="mt-1 mr-4" :cols="8" xs="6" sm="4" md="3" lg="3">
        <v-text-field
          v-model="search"
          label="Search Dish#"
          class="shrink"
          clearable
          clear-icon="mdi-close-circle"
          append-outer-icon="mdi-magnify"
          @keydown.enter.prevent="
            tab = 1;
            searchDish(search);
          "
          @click:append-outer="
            tab = 1;
            searchDish(search);
          "
          @click:clear="tab = 0"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider horizontal />
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab v-for="item in tabNames" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-container fluid>
            <v-spacer></v-spacer>
            <v-row dense>
              <v-col
                v-for="genre in genreList"
                :key="genre._id"
                :cols="12"
                xs="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  @click="
                    tab = 1;
                    getDishesForGenre(genre._id);
                  "
                  class="flex-column d-flex align-center justify-center"
                  min-height="200"
                >
                  <v-card-title
                    primary-title
                    style="word-break: break-word"
                    class="justify-center"
                    v-text="genre.name"
                  ></v-card-title>

                  <!-- <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions> -->
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat
          ><v-container fluid>
            <v-row dense v-if="dishList.length == 0">
              <v-spacer></v-spacer>
              <h4>No Genre Selected</h4>
              <v-spacer></v-spacer>
            </v-row>
            <v-row dense v-else>
              <v-col
                v-for="(dish, index) in dishList"
                :key="dish._id"
                :cols="12"
                xs="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  @click="
                    tab = 2;
                    getRateListForDish(dish);
                  "
                  class="flex-column d-flex align-center justify-center"
                  min-height="200"
                  height="300"
                >
                  <v-carousel
                    cycle
                    continuous
                    height="200"
                    hide-delimiters
                    interval="3000"
                    :show-arrows="false"
                  >
                    <v-carousel-item
                      v-for="(item, i) in images[index]"
                      :key="i"
                      :src="item.image_data"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    ></v-carousel-item>
                    <!-- style="opacity: 0.7" -->
                  </v-carousel>
                  <v-card-title
                    primary-title
                    style="word-break: break-word"
                    align="center"
                    justify="center"
                    v-text="dish.name"
                  ></v-card-title>

                  <v-card-text
                    style="word-break: break-word"
                    align="center"
                    justify="center"
                    >{{ dish.desc }}</v-card-text
                  >
                  <!-- <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions> -->
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat
          ><v-container fluid>
            <v-row dense v-if="rateList.length == 0">
              <v-spacer></v-spacer>
              <h4>No Dish Selected</h4>
              <v-spacer></v-spacer>
            </v-row>
            <v-row dense v-else>
              <v-col
                v-for="rate in rateList"
                :key="rate._id"
                :cols="12"
                xs="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  @click="
                    tab = 3;
                    addToCart(rate);
                  "
                  class="flex-column d-flex align-center justify-center"
                  min-height="200"
                >
                  <v-card-title
                    primary-title
                    style="word-break: break-word"
                    class="justify-center"
                    v-text="rate.name"
                  ></v-card-title>
                  <v-card-subtitle
                    class="justify-center"
                    style="word-break: break-word"
                    v-text="rate.desc"
                  ></v-card-subtitle>

                  <!-- <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions> -->
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat
          ><v-container fluid>
            <v-data-table
              :headers="cartHeaders"
              :items="cartItems"
              class="elevation-12 ma-6"
              hide-default-footer
              ><template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Cart</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
              <template v-slot:[`item.qty`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-1"
                      @click="item.qty > 1 ? --item.qty : item.qty"
                      x-small
                      color="grey accent-4"
                      fab
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>Subtract</span>
                </v-tooltip>
                {{ item.qty }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-1"
                      @click="++item.qty"
                      x-small
                      color="neutral"
                      fab
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Add</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-1"
                      @click="deleteItemFromCart(item)"
                      x-small
                      color="error"
                      fab
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete Item</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <div class="text-h5 ma-2 text-center">
              Total Bill: {{ totalBill }}
            </div>
            <v-spacer></v-spacer>
            <v-btn
              class="mx-6 my-2"
              color="success"
              :disabled="totalBill <= 0"
              text
              outlined
              @click="checkout"
            >
              Check out
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";
// import router from "vue-router";
export default {
  name: "MenuComponent",
  data: () => ({
    showSnackbar: false,
    snackbarText: "My timeout is set to 2000.",
    snackbarTimeout: 2000,

    search: "",

    tab: null,
    genreList: [],
    dishList: [],
    rateList: [],
    images: [],
    currentDish: "",

    orderid: null,
    orderDetail: [],

    tabNames: ["Genre", "Dishes", "Serving", "Cart"],
    cartRateList: [],
    cartItems: [],
    cartHeaders: [
      {
        text: "Dish",
        align: "start",
        // sortable: false,
        value: "name",
      },
      { text: "Rate Item", value: "rate" },
      { text: "Price", value: "price" },
      { text: "Qty", value: "qty" },
      { text: "Actions", value: "actions" },
    ],
  }),

  methods: {
    getGenreList() {
      let uri = `http://` + window.location.hostname + `:3000/genre`;
      axios
        .get(uri)
        .then((response) => {
          this.genreList = response.data;
          console.log("genre", response.data);
        })
        .catch((error) => {
          console.error("ERROR getGenreList: ", error);
        });
    },
    getDishesForGenre(genreId) {
      console.log("genreID", genreId);
      let params = {};
      params["is_active"] = true;
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/dishes/genreid/${genreId}`;
      axios
        .get(uri, { params })
        .then((response) => {
          this.dishList = response.data;
          this.getImagesForDishes();
          console.log("dish", response.data);
        })
        .catch((error) => {
          console.error("ERROR getDishesForGenre: ", error);
        });
    },

    getRequestParams(search) {
      let params = {};
      params["is_active"] = true;

      if (!isNaN(search)) {
        params["number"] = search;
      }
      return params;
    },

    searchDish(dishNum) {
      console.log("Dish Number: ", dishNum);
      const params = this.getRequestParams(dishNum);
      let uri = `http://` + window.location.hostname + `:3000/dishes`;
      axios
        .get(uri, { params })
        .then((response) => {
          console.log(response.data);

          const { docs } = response.data[0];
          this.dishList = {};
          this.dishList = docs;
          this.getImagesForDishes();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getImagesForDishes() {
      this.images = Array(this.dishList.length);
      console.log(this.images.length);
      this.dishList.forEach((dish, index) => {
        let uri =
          `http://` +
          window.location.hostname +
          `:3000/images/dishid/${dish._id}`;
        axios.get(uri).then((response) => {
          // this.images.push("");
          this.images.push("");
          this.images[index] = response.data;

          console.log("Getting Images", index);
          // console.log("Images", this.images[dish._id]);
        });
      });
    },

    getRateListForDish(dish) {
      console.log("dishId", dish._id);
      let params = {};
      params["is_active"] = true;
      let uri =
        `http://` +
        window.location.hostname +
        `:3000/ratelist/dishid/${dish._id}`;
      axios
        .get(uri, { params })
        .then((response) => {
          this.rateList = response.data;
          this.currentDish = dish.name;
          console.log("rate", response.data);
        })
        .catch((error) => {
          console.error("ERROR getRateListForDish: ", error);
        });
    },

    addToCart(rate) {
      var index = this.cartRateList.indexOf(rate._id);
      console.log("index", index);
      if (index < 0) {
        this.cartRateList.push(rate._id);
        this.cartItems.push({
          name: this.currentDish,
          rate: rate.name,
          price: rate.price,
          qty: 1,
        });
      } else {
        ++this.cartItems[index].qty;
        // console.log("QTY", ++obj.qty);
      }
    },
    deleteItemFromCart(item) {
      const index = this.cartItems.indexOf(item);
      if (index > -1) {
        // only splice array when item is found
        this.cartItems.splice(index, 1); // 2nd parameter means remove one item only
        this.cartRateList.splice(index, 1); // 2nd parameter means remove one item only
      }
    },
    checkout() {
      this.cartRateList.forEach((cartRate, index) => {
        this.orderDetail.push({
          order_id: this.orderid,
          rate_id: cartRate,
          qty: this.cartItems[index].qty,
          price: this.cartItems[index].price,
        });
      });

      console.log(this.orderDetail);
      let data = {};
      data.orderDetail = this.orderDetail;
      let uri = "http://" + window.location.hostname + ":3000/orderdetail";
      axios
        .post(uri, data)
        .then(() => {
          console.log("Cart uploaded successfully");
          this.snackbarText = "Cart uploaded successfully";
          this.showSnackbar = true;
          new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
            this.$router.push({ name: "OrderList" });
          });
        })
        .catch((error) => {
          console.error(error);
        });

      let order = {
        status: "Placed",
      };

      // console.log(this.order);
      uri =
        `http://` +
        window.location.hostname +
        `:3000/orderslist/${this.orderid}`;
      axios
        .patch(uri, order)
        .then(() => {
          this.alertType = "success";
          this.isAlert = true;
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            this.show = false;
            this.isAlert = false;
            // this.reset();
          });
        })
        .catch((error) => {
          console.error(error);
          this.alertType = "error";
          this.isAlert = true;
        });
    },
  },

  mounted() {
    this.orderid = this.$route.params.id;
  },
  computed: {
    totalBill() {
      let initialValue = 0;
      return this.cartItems.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue.price * currentValue.qty;
      }, initialValue);
    },
  },
  created() {
    this.orderid = this.$route.params.id;
    this.getGenreList();
    // this.getGenreList();
  },
};
</script>