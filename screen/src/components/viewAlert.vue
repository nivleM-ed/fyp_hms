<template>
  <v-snackbar v-model="visible" bottom :color="color" right>
    Task: {{ title }} <br />
    {{ sentence }}
    <v-btn dark text @click="visible = false">
      Close
    </v-btn>
  </v-snackbar>
</template>
<script>
import utils from "@/js/utils.js";
export default {
  data() {
    return {
      visible: false,
      money_in: false,
      sentence: "",
      color: "",
      title: "",
      queue: [],
    };
  },
  props: ["data"],
  async created() {},
  methods: {},
  watch: {
    data(val) {
      let delay = 0;
      try {
        if (this.visible) {
          delay = 6000;
        }

        setTimeout(() => {
          if (val) {
            switch (val.type) {
              case "new_task":
                this.title = val.data.name;
                this.sentence =
                  "You have added a new task for " +
                  utils.momentFormatDate(false, val.data.start_date);
                this.color = "success";
                break;
              case "update_task":
                this.title = val.data.name;
                this.sentence =
                  "You have updated " +
                  val.data.name +
                  " for " +
                  utils.momentFormatDate(false, val.data.start_date);
                this.color = "success";
                break;
              case "delete_task":
                this.title = val.data.name;
                this.sentence = "Task deleted";
                this.color = "success";
                break;
              case "complete_task":
                this.title = val.data.name;
                this.sentence = "Task completed";
                this.color = "success";
                break;
              case "new_expense":
                this.money_in = val.data.money_in ? "gained" : "spent";
                this.title = val.data.title;
                this.sentence = "You have " + this.money_in + " RM" + val.data.amount;
                this.color = "success";
                break;
              case "update_daily_exp":
                this.money_in = val.data.money_in ? "gained" : "spent";
                this.title = val.data.title;
                this.sentence = "Updated: You have " + this.money_in + " RM" + val.data.amount;
                this.color = "success";
                break;
              case "delete_daily_exp":
                this.title = val.data.title;
                this.sentence = "Daily Expense completed";
                this.color = "success";
                break;
            }
            this.visible = true;
          }
        }, delay);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
