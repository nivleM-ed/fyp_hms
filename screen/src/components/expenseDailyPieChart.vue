<template>
  <v-container>
    <v-expand-transition>
      <v-card v-show="!expDetailsShow" height="60vh" flat>
        <v-container fill-height fluid>
          <v-row style="height:100%">
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
        height: utils.toPX(60, "vh"),
        width: utils.toPX(25, "vw"),
      },
      chartOptionsReceived: {
        title: "Amount Received",
        legend: { position: "bottom" },
        height: utils.toPX(60, "vh"),
        width: utils.toPX(25, "vw"),
      },
    };
  },
  props: ["expDetailsShow", "chartDataSpent", "chartDataReceived", "daily_total_spent", "daily_total_received"],
  async created() {},
  methods: {},
  watch: {},
};
</script>
<style></style>
