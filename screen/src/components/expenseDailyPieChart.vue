<template>
  <v-container>
    <v-expand-transition>
      <v-card v-show="!expDetailsShow" :height="height" flat>
        <v-container fill-height fluid v-if="mainOv != true">
          <v-row v-if="daily_total_spent <= 0 && daily_total_received <= 0">
            <!-- <v-col> -->
            <v-overlay :absolute="true" :value="true">
              <p>You did not spent or receive anything today</p>
            </v-overlay>
            <!-- </v-col> -->
          </v-row>
          <v-row v-else>
            <v-col cols="6">
              <GChart
                type="PieChart"
                :data="chartDataSpent"
                :options="chartOptionsSpent"
                v-if="daily_total_spent > 0"
              />
              <v-overlay :absolute="true" :value="true" v-else>
                <p>You did not spent</p>
              </v-overlay>
            </v-col>
            <v-col cols="6">
              <GChart
                type="PieChart"
                :data="chartDataReceived"
                :options="chartOptionsReceived"
                v-if="daily_total_received > 0"
              />
              <v-overlay :absolute="true" :value="true" v-else>
                <p>You did not receive anything</p>
              </v-overlay>
            </v-col>
          </v-row>
        </v-container>
        <v-container fill-height fluid v-else>
          <v-row v-if="daily_total_spent <= 0 && daily_total_received <= 0">
            <!-- <v-col> -->
            <v-overlay :absolute="true" :value="true">
              <p>You did not spent or receive anything today</p>
            </v-overlay>
            <!-- </v-col> -->
          </v-row>
          <v-row v-else>
            <v-col cols="6">
              <GChart
                type="PieChart"
                :data="chartDataSpent"
                :options="chartOptionsSpent2"
                v-if="daily_total_spent > 0"
              />
              <v-overlay :absolute="true" :value="true" v-else>
                <p>You did not spent</p>
              </v-overlay>
            </v-col>
            <v-col cols="6">
              <GChart
                type="PieChart"
                :data="chartDataReceived"
                :options="chartOptionsReceived2"
                v-if="daily_total_received > 0"
              />
              <v-overlay :absolute="true" :value="true" v-else>
                <p>You did not receive anything</p>
              </v-overlay>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-expand-transition>
  </v-container>
</template>
<script>
import utils from "@/js/utils.js";

export default {
  name: "expenseDailyPieChart",
  data() {
    return {
      utils: utils,
      chartOptionsSpent: {
        title: "Amount Spent",
        legend: { position: "bottom" },
        height: utils.toPX(55, "vh"),
        width: utils.toPX(25, "vw"),
      },
      chartOptionsReceived: {
        title: "Amount Received",
        legend: { position: "bottom" },
        height: utils.toPX(55, "vh"),
        width: utils.toPX(25, "vw"),
      },

      chartOptionsSpent2: {
        title: "Amount Spent",
        legend: { position: "bottom" },
        height: utils.toPX(30, "vh"),
        width: utils.toPX(11, "vw"),
      },
      chartOptionsReceived2: {
        title: "Amount Received",
        legend: { position: "bottom" },
        height: utils.toPX(30, "vh"),
        width: utils.toPX(11, "vw"),
      },
      height: "60vh"
    };
  },
  props: [
    "expDetailsShow",
    "chartDataSpent",
    "chartDataReceived",
    "daily_total_spent",
    "daily_total_received",
    "mainOv",
  ],
  async created() {
    if(this.mainOv) {
      this.height = "35vh";
    }
  },
  methods: {},
  watch: {},
};
</script>
<style></style>
