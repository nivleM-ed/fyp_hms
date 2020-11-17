<template>
  <div class="m-4">
    <v-card flat>
      <v-row>
        <v-col cols="5">
          <v-card >
            <v-tabs background-color="yellow darken-4" dark>
              <v-tabs-slider color="purple"></v-tabs-slider>
              <v-tab @click="graph_show = 0">
                Day
              </v-tab>
              <v-tab @click="graph_show = 1">
                Month
              </v-tab>
              <v-tab @click="graph_show = 2">
                Year
              </v-tab>
            </v-tabs>
            
            <v-card flat class="p-2" color="yellow darken-1">
              <v-sheet color="rgba(0, 0, 0, .12)" class="p-2">
              <v-card-title>
                {{ overview_graph_title }}
              </v-card-title>
              <v-card class="mx-auto text-center" color="red" dark max-width="600">
                <v-card-title>
                  Last Expenditure
                </v-card-title>
                <v-card-text>
                  <v-sheet color="rgba(0, 0, 0, .12)">
                    <v-sparkline
                      :value="graph_expenditure"
                      color="rgba(255, 255, 255, .7)"
                      height="100"
                      padding="24"
                      stroke-linecap="round"
                      smooth
                    >
                      <template v-slot:label="item">
                        RM{{ item.value }}
                      </template>
                    </v-sparkline>
                  </v-sheet>
                </v-card-text>
              </v-card>

              <v-card class="mx-auto text-center mt-3 mb-2" color="green" dark max-width="600">
                <v-card-title>
                  Last Savings
                </v-card-title>
                <v-card-text>
                  <v-sheet color="rgba(0, 0, 0, .12)">
                    <v-sparkline
                      :value="graph_savings"
                      color="rgba(255, 255, 255, .7)"
                      height="100"
                      padding="24"
                      stroke-linecap="round"
                      smooth
                    >
                      <template v-slot:label="item">
                        RM{{ item.value }}
                      </template>
                    </v-sparkline>
                  </v-sheet>
                </v-card-text>
              </v-card>
              </v-sheet>
            </v-card>
          </v-card>
        </v-col>

        <v-divider class="mx-4" vertical></v-divider>
        <v-col>
          <v-row>
            <v-card class="mt-2" color="teal darken-3" dark max-width="600">
              <v-card-title>
                Some statistics for you
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <p v-for="item in stats_data" :key="item" class="p-2">
                    - {{ item }}
                  </p>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-card class="mt-2" color="teal darken-3" dark max-width="600">
              <v-card-title>
                Recurring Payment
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <div class="p-2">
                    Your next bill payment is in {{ recur_shortest_time }} days.
                    <p v-for="item in recur_shortest" :key="item">
                      - {{ item.title }} ({{ new Date(item.date) }})
                    </p>
                  </div>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import utils from "@/js/utils.js";
// import expenseDailyPieChart from "@/components/expenseDailyPieChart";
import expenseClass from "@/js/expense_class.js";

export default {
  name: "ExpenseStatistics",
  // components: { expenseDailyPieChart },
  data() {
    return {
      stats_data: [],
      overview_graph_title: "Data for the past 10 days",
      graph_savings: [],
      graph_expenditure: [],
      graph_expenditure_year: [],
      graph_savings_year: [],
      graph_expenditure_month: [],
      graph_savings_month: [],
      graph_expenditure_day: [],
      graph_savings_day: [],
      graph_show: 0,

      recur_shortest_time: 0,
      recur_shortest: [],

      monthlyExpenses: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 75, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          // width: '300px',
          fullWidth: true,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      list: {
        0: false,
        1: false,
        2: false,
      },
      date: {},
      year_expenses: {},
      month_expenses: {},
      day_expenses: {},
      utils: utils,
      daily_total_spent: 0,
      daily_total_received: 0,
      chartDataSpent: [],
      chartDataReceived: [],
    };
  },
  props: ["expenses", "recurring_payment"],
  async created() {
    this.date = this.utils.getSeperateDate(new Date());
    await this.getExpensesData();
    await this.setGraph();
    await this.setStatsInfo();
    await this.getDailyExp();
    await this.getRecurNext();
  },
  methods: {
    async getDailyExp() {
      let daily = await new expenseClass().getDailyExp(new Date());
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
    },
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
    async getExpensesData() {
      let year, month, day;
      if (this.expenses) {
        year = this.expenses[
          this.expenses.findIndex((x) => x.year === this.date.year)
        ];
        if (year) {
          month =
            year.data[year.data.findIndex((x) => x.month === this.date.month)];
          if (month) {
            day =
              month.data[month.data.findIndex((x) => x.day === this.date.day)];
          }
        }

        this.year_expenses = year == null ? null : year;
        this.month_expenses = month == null ? null : month;
        this.day_expenses = day == null ? null : day;
      }
    },
    async setGraph() {
      let graph_data = await new expenseClass().setGraphData();
      this.graph_expenditure_year = graph_data.graph_expenditure_year;
      this.graph_savings_year = graph_data.graph_savings_year;
      this.graph_expenditure_month = graph_data.graph_expenditure_month;
      this.graph_savings_month = graph_data.graph_savings_month;
      this.graph_expenditure_day = graph_data.graph_expenditure_day;
      this.graph_savings_day = graph_data.graph_savings_day;

      this.graph_savings = this.graph_savings_day;
      this.graph_expenditure = this.graph_expenditure_day;
    },
    async setStatsInfo() {
      this.stats_data = await new expenseClass().getStatsData();
      console.log(this.stats_data);
    },
    // test() {
    //   if (this.graph_show == 2) this.graph_show = 0;
    //   else this.graph_show++;
    // },
  },
  watch: {
    graph_show(val) {
      if (val == 0) {
        this.graph_savings = this.graph_savings_day;
        this.graph_expenditure = this.graph_expenditure_day;
        this.overview_graph_title = "Data for the past 10 days";
      } else if (val == 1) {
        this.graph_savings = this.graph_savings_month;
        this.graph_expenditure = this.graph_expenditure_month;
        this.overview_graph_title = "Data for the past 6 months";
      } else if (val == 2) {
        this.graph_savings = this.graph_savings_year;
        this.graph_expenditure = this.graph_expenditure_year;
        this.overview_graph_title = "Data for the past 5 years";
      }
    },
    async expenses() {
      await this.getExpensesData();
      await this.setGraph();
      await this.setStatsInfo();
      await this.getDailyExp();
    },
    async recurring_payment() {
      await this.getRecurNext();
    },
  },
};
</script>
