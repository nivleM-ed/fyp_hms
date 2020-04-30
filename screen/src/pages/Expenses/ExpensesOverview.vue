<template>
  <v-card flat>
    <v-tabs
      background-color="white"
      v-model="tab_open"
      color="deep-purple accent-4"
    >
      <v-tab>Overview</v-tab>
      <v-tab>Daily Expenses</v-tab>
      <v-tab>Recurring Payment</v-tab>

      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col v-for="i in 6" :key="i" cols="12" md="4">
              <v-img
                :src="`https://picsum.photos/500/300?image=${i * 1 * 5 + 10}`"
                :lazy-src="`https://picsum.photos/10/6?image=${i * 1 * 5 + 10}`"
                aspect-ratio="1"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <DailyExpenses
          :logged="logged"
          :expenses="expenses"
          :all_categories="all_categories"
          v-on:update="updateData"
          />
      </v-tab-item>
      <v-tab-item>
          <RecurringExpenses
          :logged="logged"
          :recurring_payment="recurring_payment"
          v-on:update="updateData"
          />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import utils from "@/js/utils.js";
import expenseClass from "@/js/expense_class.js";

import DailyExpenses from "@/pages/Expenses/DailyExpenses";
import RecurringExpenses from "@/pages/Expenses/RecurringExpenses";

export default {
  components: {DailyExpenses, RecurringExpenses},
  data() {
    return {
      tab_open: 2,
      utils: utils,

      expObj: new expenseClass(),
      expenses: [],
      all_categories: [],
      recurring_payment: [],
    };
  },
  props: ["logged"],
  async created() {
    this.$emit("checkLogged", 1);
    if (this.logged) {
      this.expObj = new expenseClass();
      await this.updateData();
    }
  },
  mounted: function() {},
  computed: {},
  methods: {
    async updateData() {
      const data = await this.expObj.getExpDB();
      this.expenses = data.expenses;
      this.all_categories = data.all_categories;
      this.recurring_payment = data.recurring_payment
      await this.$emit("updateData",1);
    }
  },
  watch: {
    async tab_open() {
      await this.$emit("checkLogged", 1);
      await this.updateData();
    }
  },
};
</script>
<style></style>
