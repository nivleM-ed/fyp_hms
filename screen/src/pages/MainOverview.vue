<template>
  <v-card flat class="m-4">
    <v-card flat>
      <v-row>
        <v-col cols="6">
          <v-row class="mx-auto">
            <v-card
              flat
              class="mt-xs-2"
              color="teal darken-3"
              dark
              :min-width="width"
            >
              <v-card-title>
                Upcoming Tasks
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div
                    v-for="item in upcoming_tasks"
                    :key="item.id"
                    class="p-2"
                  >
                    - {{ item.name }} - {{ new Date(item.start) }}
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="green">
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="mx-auto">
            <v-card
              flat
              class="mt-2"
              color="teal darken-3"
              dark
              :min-width="width"
            >
              <v-card-title>
                Tasks to be completed
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div
                    v-for="item in incomplete_tasks"
                    :key="item.id"
                    class="p-2"
                  >
                    - {{ item.name }} - {{ new Date(item.end) }}
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="green">
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="mx-auto">
            <v-card
              flat
              class="mt-2"
              color="teal darken-3"
              dark
              :min-width="width"
            >
              <v-card-title>
                Latest Expenses
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div
                    v-for="item in now_expense.data"
                    :key="item.id"
                    class="p-2"
                  >
                    - {{ item.title }}
                    <v-icon v-if="!item.money_in" color="red darken-2">
                      mdi-minus
                    </v-icon>
                    <v-icon v-else color="green darken-2">
                      mdi-plus
                    </v-icon>
                    RM {{ item.amount }}
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="green">
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row class="mx-auto">
            <v-card
              flat
              color="teal darken-3"
              dark
              :min-width="width"
            >
              <v-card-title>
                Food Item running low:
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div v-for="item in getLow(food)" :key="item.id" class="p-2">
                    {{ item.name }} - {{ item.quantity }}
                    {{ item.category }} left
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="green">
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="mx-auto">
            <v-card
              flat
              class="mt-2"
              color="teal darken-3"
              dark
              :min-width="width"
            >
              <v-card-title>
                Recurring Payment
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div class="p-2" v-if="recur_shortest.length > 0">
                    Your next bill payment is in {{ recur_shortest_time }} days.
                    <p v-for="item in recur_shortest" :key="item">
                      - {{ item.title }} ({{ new Date(item.date) }})
                    </p>
                  </div>
                  <div v-else>
                    You have no recurring bills set.
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="green">
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import utils from "@/js/utils.js";

import expenseClass from "@/js/expense_class.js";
import invClass from "@/js/inventory_class.js";
import taskClass from "@/js/task_class.js";

export default {
  components: {},
  data() {
    return {
      recurring_payment: {},
      expObj: new expenseClass(),
      utils: utils,
      recur_shortest_time: 0,
      recur_shortest: [],
      width: 0,

      invObj: null,
      food: [],
      low_food_setting: {},

      tasks: [],
      completed_tasks: [],
      incomplete_tasks: [],
      upcoming_tasks: [],

      now_expense: [],
    };
  },
  props: ["logged"],
  async created() {
    this.$emit("checkLogged");

    if(this.$vuetify.breakpoint.mdAndDown) {
      this.width = 400;
    } else {
      this.width = 550;
    }

    if (this.logged) {
      this.expObj = new expenseClass();
      this.invObj = new invClass();
      this.taskObj = new taskClass();

      await this.updateData();
    }
    await this.getRecurNext();
  },
  methods: {
    async getRecurNext() {
      let tmp = [];
      let shortest_time = Infinity;
      let shortest;
      for (var i in this.recurring_payment) {
        //get shortest time first
        if (
          this.utils.dateDiff(this.recurring_payment[i].date, new Date()) <
          shortest_time
        ) {
          shortest = this.recurring_payment[i];
          shortest_time = this.utils.dateDiff(
            this.recurring_payment[i].date,
            new Date()
          );
        }
      }
      tmp.push(shortest);
      for (i in this.recurring_payment) {
        if (
          this.utils.dateDiff(this.recurring_payment[i].date, new Date()) ==
            shortest_time &&
          this.recurring_payment[i].id != shortest.id
        ) {
          tmp.push(this.recurring_payment[i]);
        }
      }

      this.recur_shortest_time = shortest_time;
      this.recur_shortest = tmp;
    },

    getLow() {
      let tmp = this.food.filter((x) => {
        //should i use switch case here?
        if (x.category === "Grams(g)") {
          return x.quantity <= this.low_food_setting.low_g;
        } else if (x.category === "Kilograms(kg)") {
          return x.quantity <= this.low_food_setting.low_kg;
        } else if (x.category === "Packets") {
          return x.quantity <= this.low_food_setting.low_packet;
        } else if (x.category === "Bottles") {
          return x.quantity <= this.low_food_setting.low_bottle;
        } else if (x.category === "Boxes") {
          return x.quantity <= this.low_food_setting.low_box;
        } else if (x.category === "Millilitres(ml)") {
          return x.quantity <= this.low_food_setting.low_ml;
        } else if (x.category === "Litres(l)") {
          return x.quantity <= this.low_food_setting.low_l;
        } else {
          console.log("error: getLow (this shouldn't happen)");
        }
      });
      return tmp;
    },

    async getDailyExp() {
      let daily = await this.expObj.getDailyExp(new Date());
      if (daily == "noData") {
        this.now_expense = [];
      } else {
        this.now_expense = daily.expense;
      }
      console.log(daily);
    },

    async arrangeTasks() {
      for (var i in this.tasks) {
        if (this.utils.checkTimePast(this.tasks[i])) {
          this.incomplete_tasks.push(this.tasks[i]);
        } else {
          this.upcoming_tasks.push(this.tasks[i]);
        }
      }
    },

    async updateData() {
      await this.expObj.getExpDB();
      await this.invObj.getInvDB();
      await this.taskObj.getTaskDB();

      this.expenses = this.expObj.expenses;
      this.recurring_payment = this.expObj.recurring_payment;

      this.food = this.invObj._food;
      this.low_food_setting = this.invObj._low_food_setting;

      this.tasks = this.taskObj.tasks;
      this.completed_tasks = this.taskObj.completed_tasks;

      await this.getDailyExp();
      await this.arrangeTasks();

      await this.$emit("updateData", 1);
    },
  },
};
</script>
