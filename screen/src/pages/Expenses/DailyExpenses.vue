<template>
  <div class="m-4">
    <addUpdateExpenseDialog
      :addUpdateMenu.sync="addUpdateMenu"
      :date_pick="date_pick"
      :selectedExpInner="selectedExpInner"
      v-on:addNewExpense="addNewExpense"
      v-on:updateExpenses="updateExpenses"
      v-on:deleteExp="deleteExp"
    />
    <v-flex>
      <v-card flat min-height="60vh">
        <v-row>
          <v-col cols="5">
            <v-sheet height="64">
              <v-toolbar flat color="white">
                <v-btn outlined class="mr-4" @click="setToday">
                  Today
                </v-btn>
                <v-btn
                  fab
                  text
                  small
                  color="grey darken-2"
                  @click="date_pick = utils.prevDay(date_pick)"
                >
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>

                <v-menu
                  ref="date_menu"
                  v-model="date_menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn outlined v-on="on">{{ date }}</v-btn>
                  </template>
                  <v-date-picker v-model="date_pick" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="date_menu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.date_menu.save(date_pick)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>

                <v-btn
                  fab
                  text
                  small
                  color="grey darken-2"
                  @click="date_pick = utils.nextDay(date_pick)"
                >
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
              </v-toolbar>
            </v-sheet>

            <v-row v-if="now_expense.data">
              <v-card outlined height="60vh" width="100%">
                <v-card flat class="vuebar-element" v-bar>
                  <v-list dense width="100%">
                    <v-list-item-group v-model="item" color="primary">
                      <template v-for="(expense, index) in now_expense.data">
                        <v-list-item :key="index">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row>
                                <v-col cols="5">
                                  {{ expense.title }}
                                </v-col>
                                <v-col cols="1">
                                  <v-icon
                                    v-if="!expense.money_in"
                                    color="red darken-2"
                                  >
                                    mdi-minus
                                  </v-icon>
                                  <v-icon v-else color="green darken-2">
                                    mdi-plus
                                  </v-icon>
                                </v-col>
                                <v-col cols="2">
                                  RM {{ expense.amount }}
                                </v-col>
                                <v-col v-if="expense.category" cols="auto">
                                  (
                                  {{
                                    expense.category
                                      ? utils.toFirstUpperCase(
                                          expense.category,
                                          false
                                        )
                                      : null
                                  }}
                                  )
                                </v-col>
                                <v-col v-else cols="auto">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <div v-on="on">
                                        <v-icon color="red"
                                          >mdi-exclamation</v-icon
                                        >
                                        Update category
                                      </div>
                                    </template>
                                    <span
                                      >Uncategorised expense will not show up in
                                      the overview</span
                                    >
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-card>
              </v-card>
            </v-row>

            <v-row v-else>
              <v-card v-show="!expDetailsShow" height="60vh" flat width="100%">
                <v-container fill-height fluid>
                  <v-row align="center" justify="center">
                    <v-col class="text-center">
                      <p>
                        You have not spent today.
                      </p>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            v-on="on"
                            @click.prevent="openAddMenu()"
                          >
                            Add Expense
                          </v-btn>
                        </template>
                        <span>Add Expense</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>

            <v-row v-if="now_expense.data">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="success"
                    dark
                    v-on="on"
                    class="ml-4 mt-4"
                    @click.prevent="openAddMenu()"
                  >
                    Add Expense
                  </v-btn>
                </template>
                <span>Add Expense</span>
              </v-tooltip>
            </v-row>
          </v-col>

          <v-divider class="mx-4" vertical></v-divider>

          <v-col>
            <v-card height="100%" flat min-height="70vh">
              <expenseDailyPieChart
                :expDetailsShow="expDetailsShow"
                :chartDataReceived="chartDataReceived"
                :chartDataSpent="chartDataSpent"
                :daily_total_spent="daily_total_spent"
                :daily_total_received="daily_total_received"
              />
              <viewExpense
                :selectedExpInner="selectedExpInner"
                v-on:updateButton="addUpdateMenu = true"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
import utils from "@/js/utils.js";
import expenseClass from "@/js/expense_class.js";
import addUpdateExpenseDialog from "@/components/addUpdateExpenseDialog";
import expenseDailyPieChart from "@/components/expenseDailyPieChart";
import viewExpense from "@/components/viewExpense";

export default {
  name: "DailyExpenses",
  components: { addUpdateExpenseDialog, expenseDailyPieChart, viewExpense },
  data() {
    return {
      addUpdateMenu: false,
      item: null,
      add_valid: false,
      isUpdate: false,
      deleteAuth: false,
      expDetailsShow: false,

      date_menu: false,
      tab_open: 1,
      utils: utils,

      date_pick: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),

      selectedExpInner: null,
      now_expense: {},
      daily_total_spent: 0,
      daily_total_received: 0,

      chartDataSpent: [],
      chartDataReceived: [],
    };
  },
  props: ["expenses", "selectedExp"],
  async created() {
    await this.getDailyExp();
  },
  computed: {
    date() {
      return utils.momentFormatDate(false, this.date_pick);
    },
  },
  methods: {
    openAddMenu() {
      try {
        if (this.selectedExpInner) {
          this.item = null;
          setTimeout(() => {
            this.addUpdateMenu = true;
          }, 500);
        } else {
          this.addUpdateMenu = true;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    setToday() {
      this.date_pick = this.today;
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async addNewExpense(new_expense) {
      this.$emit("addNewExpense", new_expense);
    },
    async updateExpenses(data) {
      this.$emit("updateExpenses", data);
    },
    async deleteExp(selectedExp) {
      this.$emit("deleteExp", selectedExp);
      this.addUpdateMenu = false;
      this.selectedExpInner = null;
    },
    async getDailyExp() {
      try {
        let date = new Date(this.date_pick);
        let daily = await new expenseClass().getDailyExp(date);
        if (daily == "noData") {
          this.now_expense = [];
          this.chartDataSpent = null;
          this.chartDataReceived = null;
          this.daily_total_spent = 0;
          this.daily_total_received = 0;
        } else {
          this.now_expense = daily.expense;
          this.chartDataSpent = daily.spent;
          this.chartDataReceived = daily.received;
          this.daily_total_spent = daily.total_spent;
          this.daily_total_received = daily.total_received;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    setDetails(created, id) {
      if (created) {
        console.log("NO GO SET DETAILS");
      } else {
        this.selectedExpInner = this.now_expense.data[id];
      }
    },
    async setToExp(data) {
      try {
        this.date_pick = data.date;
        if(this.now_expense.data) {
          let index = this.now_expense.data.findIndex((x) => x.id == data.id);
        this.item = index;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
  },
  watch: {
    item: async function(val) {
      if (val == null) {
        this.selectedExpInner = null;
      } else {
        this.setDetails(false, val);
      }
    },
    selectedExpInner() {
      if (this.selectedExpInner) {
        this.expDetailsShow = true;
      } else {
        this.expDetailsShow = false;
      }
    },
    async selectedExp(val) {
      if (val) {
        this.item = null;
        await this.setToExp(val);
      }
    },
    async date_pick() {
      this.item = null;
      await this.getDailyExp();
    },
    async expenses() {
      await this.getDailyExp(new Date(this.date_pick));
    },
  },
};
</script>
<style></style>
