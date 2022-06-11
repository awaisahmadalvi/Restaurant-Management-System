<template>
  <v-sheet>
    <v-btn color="accent" large @click.stop="showScheduleForm = true"> </v-btn>
    <ScheduleForm str="dasdasdsa" v-model="showScheduleForm" />
  </v-sheet>
</template>

<script>
import ScheduleForm from "./ScheduleForm.vue";

export default {
  data() {
    return {
      showScheduleForm: false,
    };
  },
  components: {
    ScheduleForm,
  },
};
</script>