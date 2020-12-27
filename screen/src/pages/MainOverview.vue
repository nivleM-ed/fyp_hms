<template>
  <v-card flat class="m-4" min-height="700px">
    <v-card flat>
      <v-row>
        <v-col cols="auto">
          <v-row class="mx-auto">
            <v-card
              flat
              elevation="1"
              class="mt-xs-2"
              color="amber lighten-5"
              :min-width="width"
            >
              <v-card-title>
                Upcoming Tasks
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div v-if="upcoming_tasks.length > 0">
                    <div class="vuebar-element-2" v-bar>
                      <div>
                        <div
                          v-for="item in upcoming_tasks"
                          :key="item.id"
                          class="p-2"
                        >
                          - <b>{{ item.name }}</b> ({{
                            utils.momentFormatDate(true, new Date(item.start))
                          }})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center" v-else>
                    <p class="pt-2">
                      You have no upcoming task yet. Click to add new task.
                    </p>
                    <v-btn depressed color="green" @click="toPage('task_ov')">
                      Add task
                    </v-btn>
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="upcoming_tasks.length > 0"
                  depressed
                  color="green"
                  @click="toPage('task_ov')"
                >
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="mx-auto">
            <v-card
              flat
              class="mt-2"
              color="amber lighten-5"
              elevation="2"
              :min-width="width"
            >
              <v-card-title>
                Tasks to be completed
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div v-if="incomplete_tasks.length > 0">
                    <div
                      class="vuebar-element-2"
                      height="200px"
                      width="100%"
                      v-bar
                    >
                      <div>
                        <div
                          v-for="item in incomplete_tasks"
                          :key="item.id"
                          class="p-2"
                        >
                          - <b>{{ item.name }}</b> ({{
                            utils.momentFormatDate(true, new Date(item.end))
                          }})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <p class="pt-2">
                      You have no task that can be completed yet.
                    </p>
                    <v-btn depressed color="green" @click="toPage('task_ov')">
                      Add Task
                    </v-btn>
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="incomplete_tasks.length > 0"
                  depressed
                  color="green"
                  @click="toPage('task_ov')"
                >
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-row class="mx-auto">
            <v-card
              flat
              color="amber lighten-5"
              elevation="2"
              :min-width="width"
            >
              <v-card-title>
                Today's Expenses
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div v-if="now_expense.length > 0">
                    <div
                      class="vuebar-element-2"
                      height="200px"
                      width="100%"
                      v-bar
                    >
                      <div>
                        <div
                          v-for="item in now_expense"
                          :key="item.id"
                          class="p-2"
                        >
                          - <b>{{ item.title }}</b>
                          <v-icon v-if="!item.money_in" color="red darken-2">
                            mdi-minus
                          </v-icon>
                          <v-icon v-else color="green darken-2">
                            mdi-plus
                          </v-icon>
                          RM {{ item.amount }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center" v-else>
                    <p class="pt-2">
                      You have not spent or received anything today.
                    </p>
                    <v-btn
                      depressed
                      color="green"
                      @click="toPage('expense_ov?tab=1')"
                    >
                      Add Expenses
                    </v-btn>
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="now_expense.length > 0"
                  depressed
                  color="green"
                  @click="toPage('expense_ov?tab=1')"
                >
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="mx-auto">
            <v-card
              flat
              class="mt-2"
              color="amber lighten-5"
              elevation="2"
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
                      - <b>{{ item.title }}</b> ({{
                        utils.momentFormatDate(false, new Date(item.date))
                      }})
                    </p>
                  </div>
                  <div v-else class="text-center">
                    <p class="pt-2">You have no recurring bills set.</p>
                    <v-btn
                      depressed
                      color="green"
                      @click="toPage('expense_ov?tab=2')"
                    >
                      Add recurring payment
                    </v-btn>
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="getLow().length > 0"
                  depressed
                  color="green"
                  @click="toPage('expense_ov?tab=2')"
                >
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-row class="mx-auto">
            <v-card
              flat
              color="amber lighten-5"
              elevation="2"
              :min-width="width"
            >
              <v-card-title>
                Food Item running low:
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)" min-height="100px">
                  <div v-if="getLow().length > 0">
                    <div
                      class="vuebar-element-3"
                      height="200px"
                      width="100%"
                      v-bar
                    >
                      <div>
                        <div
                          v-for="item in getLow()"
                          :key="item.id"
                          class="p-2"
                        >
                          - <b>{{ item.name }}</b> ({{ item.quantity }}
                          {{ item.category }} left)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <p class="pt-2">You have no food running low</p>
                    <v-btn depressed color="green" @click="toPage('inv_ov')">
                      View Inventory
                    </v-btn>
                  </div>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="getLow().length > 0"
                  depressed
                  color="green"
                  @click="toPage('inv_ov')"
                >
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row>
            <v-card
              height="100%"
              flat
              :min-width="width"
              color="amber lighten-5"
              elevation="2"
              class="m-3"
            >
              <v-card-title>
                Amount Spent & Received Chart
              </v-card-title>
              <v-card-text>
                <expenseDailyPieChart
                  :expDetailsShow="false"
                  :chartDataReceived="chartDataReceived"
                  :chartDataSpent="chartDataSpent"
                  :daily_total_spent="daily_total_spent"
                  :daily_total_received="daily_total_received"
                  :mainOv="true"
              /></v-card-text>
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

import expenseDailyPieChart from "@/components/expenseDailyPieChart";

export default {
  components: { expenseDailyPieChart },
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
      recurring_task: [],
      completed_tasks: [],
      incomplete_tasks: [],
      upcoming_tasks: [],

      now_expense: [],
      daily_total_spent: 0,
      daily_total_received: 0,

      chartDataSpent: [],
      chartDataReceived: [],
    };
  },
  props: ["logged"],
  async created() {
    this.$emit("checkLogged");

    if (this.$vuetify.breakpoint.mdAndDown) {
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
      if (this.recurring_payment.length > 0) {
        for (var i in this.recurring_payment) {
          //get shortest time first
          if (
            this.utils.dateDiff(
              this.recurring_payment[i].date,
              new Date(),
              true
            ) < shortest_time
          ) {
            shortest = this.recurring_payment[i];
            shortest_time = this.utils.dateDiff(
              this.recurring_payment[i].date,
              new Date(),
              true
            );
          }
        }
        tmp.push(shortest);
        for (i in this.recurring_payment) {
          if (
            this.utils.dateDiff(
              this.recurring_payment[i].date,
              new Date(),
              true
            ) == shortest_time &&
            this.recurring_payment[i].id != shortest.id
          ) {
            tmp.push(this.recurring_payment[i]);
          }
        }

        this.recur_shortest_time = shortest_time;
        this.recur_shortest = tmp;
      } else {
        this.recur_shortest = [];
      }
    },

    getLow() {
      let tmp = this.food.filter((x) => {
        //should i use switch case here?
        if (x.category === "Grams(g)") {
          return parseInt(x.quantity) <= parseInt(this.low_food_setting.low_g);
        } else if (x.category === "Kilograms(kg)") {
          return parseInt(x.quantity) <= parseInt(this.low_food_setting.low_kg);
        } else if (x.category === "Packets") {
          return (
            parseInt(x.quantity) <= parseInt(this.low_food_setting.low_packet)
          );
        } else if (x.category === "Bottles") {
          return (
            parseInt(x.quantity) <= parseInt(this.low_food_setting.low_bottle)
          );
        } else if (x.category === "Boxes") {
          return (
            parseInt(x.quantity) <= parseInt(this.low_food_setting.low_box)
          );
        } else if (x.category === "Millilitres(ml)") {
          return parseInt(x.quantity) <= parseInt(this.low_food_setting.low_ml);
        } else if (x.category === "Litres(l)") {
          return parseInt(x.quantity) <= parseInt(this.low_food_setting.low_l);
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
        this.chartDataSpent = null;
        this.chartDataReceived = null;
        this.daily_total_spent = 0;
        this.daily_total_received = 0;
      } else {
        this.now_expense = daily.expense.data;
        this.chartDataSpent = daily.spent;
        this.chartDataReceived = daily.received;
        this.daily_total_spent = daily.total_spent;
        this.daily_total_received = daily.total_received;
      }
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
      this.recurring_task = this.taskObj.recurring_task;
      this.completed_tasks = this.taskObj.completed_tasks;

      await this.getDailyExp();
      await this.arrangeTasks();

      await this.$emit("updateData", 1);
    },

    toPage(page, id) {
      var tmp = "";
      if (id) {
        tmp = "/main/" + page + "?id=" + id;
      } else {
        tmp = "/main/" + page;
      }

      this.$router.push(tmp);
    },
  },
};
</script>
