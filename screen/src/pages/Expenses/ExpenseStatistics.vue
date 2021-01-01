<template>
  <div class="m-4">
    <v-card flat>
      <v-row>
        <v-col cols="6">
          <v-card elevation="2">
            <v-tabs background-color="lime accent-1" v-model="graph_show">
              <v-tabs-slider color="purple"></v-tabs-slider>
              <v-tab>
                Day
              </v-tab>
              <v-tab>
                Month
              </v-tab>
              <v-tab>
                Year
              </v-tab>
            </v-tabs>

            <v-card flat class="p-4" color="lime lighten-5">
              <!-- <v-sheet color="rgba(0, 0, 0, .12)" class="p-2"> -->
              <v-card-title>
                {{ overview_graph_title }}
              </v-card-title>
              <v-card
                class="mx-auto text-center"
                color="red lighten-1"
                max-width="600"
                dark
              >
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

              <v-card
                class="mx-auto text-center mt-3"
                color="light-green darken-1"
                dark
                max-width="600"
              >
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
              <!-- </v-sheet> -->
            </v-card>
          </v-card>
        </v-col>

        <v-divider class="mx-4" vertical></v-divider>
        <v-col>
          <v-row>
            <v-card class="mt-2" color="amber lighten-5" :width="width">
              <v-card-title>
                Some statistics for you
              </v-card-title>
              <v-card-text>
                <v-sheet class="p-2" color="rgba(0, 0, 0, .12)">
                  <div v-if="stats_data.length > 0">
                    <p v-for="item in stats_data" :key="item">- {{ item }}</p>
                  </div>
                  <div v-else class="text-center">
                    <p class="p-2 m-2">There is no statistics for you yet.</p>
                  </div>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-card class="mt-2" color="amber lighten-5" :width="width">
              <v-card-title>
                Recurring Payment
              </v-card-title>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <div class="p-2" v-if="recur_shortest.length > 0">
                    Your next bill payment is in {{ recur_shortest_time }} days.
                    <p v-for="item in recur_shortest" :key="item">
                      - <b>{{ item.title }}</b> ({{
                        utils.momentFormatDate(false, new Date(item.date))
                      }})
                    </p>
                  </div>
                  <div v-else class="text-center">
                    <p class="p-2 m-2">You have no recurring bills set.</p>
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

      date: {},
      year_expenses: {},
      month_expenses: {},
      day_expenses: {},
      utils: utils,
      tab_open: 1,
      width: 0,
    };
  },
  props: ["expenses", "recurring_payment"],
  async created() {
    if (this.$vuetify.breakpoint.mdAndDown) {
      this.width = 400;
    } else {
      this.width = 550;
    }

    this.date = this.utils.getSeperateDate(new Date());
    await this.setStatsInfo();
    await this.getRecurNext();
    await this.setGraph();
    this.changeShowGraph();
  },
  methods: {
    async changeShowGraph() {
      setInterval(() => {
        if (this.graph_show == 2) this.graph_show = 0;
        else this.graph_show++;
      }, 5000);
    },
    async getRecurNext() {
      try {
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
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async setGraph() {
      try {
        let graph_data = await new expenseClass().setGraphData();
        console.log(graph_data)
        this.graph_expenditure_year = graph_data.graph_expenditure_year;
        this.graph_savings_year = graph_data.graph_savings_year;
        this.graph_expenditure_month = graph_data.graph_expenditure_month;
        this.graph_savings_month = graph_data.graph_savings_month;
        this.graph_expenditure_day = graph_data.graph_expenditure_day;
        this.graph_savings_day = graph_data.graph_savings_day;

        this.graph_savings = this.graph_savings_day;
        this.graph_expenditure = this.graph_expenditure_day;
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async setStatsInfo() {
      try {
        this.stats_data = await new expenseClass().getStatsData();
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
  },
  watch: {
    graph_show(val) {
      try {
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
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async expenses() {
      await this.setGraph();
      await this.setStatsInfo();
    },
    async recurring_payment() {
      await this.getRecurNext();
    },
  },
};
</script>
