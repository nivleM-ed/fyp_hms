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
      console.log(val);
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
                this.sentence =
                  "You have " + this.money_in + " RM" + val.data.amount;
                this.color = "success";
                break;
              case "update_daily_exp":
                this.money_in = val.data.money_in ? "gained" : "spent";
                this.title = val.data.title;
                this.sentence =
                  "Updated: You have " +
                  this.money_in +
                  " RM" +
                  val.data.amount;
                this.color = "success";
                break;
              case "delete_daily_exp":
                this.title = val.data.title;
                this.sentence = "Daily Expense completed";
                this.color = "success";
                break;
              case "food_add_to_list":
                this.title = "Add food item to list";
                this.sentence = "Item successfully added to list";
                this.color = "success";
                break;
              case "shopping_add_to_task":
                this.title = val.data.name;
                this.sentence =
                  "You have added a new task for " +
                  utils.momentFormatDate(false, val.data.start_date) +
                  " with shopping list";
                this.color = "success";
                break;
              case "add_food":
                this.title = "Added new food - " + val.data.name;
                this.sentence = "Quantity: " + val.data.quantity;
                this.color = "success";
                break;
              case "update_food":
                this.title = "Updated food - " + val.data.name;
                this.sentence = "Quantity: " + val.data.quantity;
                this.color = "success";
                break;
              case "delete_food":
                this.title = "Deleted food";
                this.color = "success";
                break;
              case "delete_shopping_list":
                this.title = "Deleted Shopping List - " + val.data.name;
                this.color = "success";
                break;
              case "add_shopping_list":
                this.title = "Added Shopping List - " + val.data;
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
