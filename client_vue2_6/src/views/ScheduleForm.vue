<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-actions>
        <v-btn
          color="primary"
          flat
          @click.stop="
            asd();
            show = false;
          "
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    str: String,
  },

  methods: {
    asd() {
      console.log(this.str);
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  created() {
    console.log(this.show);
    console.log(this.str);
  },
};
</script>