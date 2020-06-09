<template>
  <v-card flat>
    <v-tabs
      background-color="white"
      v-model="tab_open"
      color="deep-purple accent-4"
    >
      <v-tab key="exp_ov">Overview</v-tab>
      <v-tab key="daily_exp">Daily Expenses</v-tab>
      <v-tab key="recur_pay">Recurring Payment</v-tab>

      <v-tab-item>
        <ExpenseStatistics />
      </v-tab-item>

      <v-tab-item>
        <DailyExpenses
          :expenses="expenses"
          :selectedExp="selectedExp"
          v-on:update="updateData"
          v-on:addNewExpense="addNewExpense"
          v-on:updateExpenses="updateExpenses"
          v-on:deleteExp="deleteExp"
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
import ExpenseStatistics from "@/pages/Expenses/ExpenseStatistics";

export default {
  components: { DailyExpenses, RecurringExpenses, ExpenseStatistics },
  data() {
    return {
      tab_open: 1,
      utils: utils,

      expObj: new expenseClass(),
      selectedExp: null,
      expenses: [],
      all_categories: [],
      recurring_payment: [],
    };
  },
  props: ["logged"],
  async created() {
    this.$emit("checkLogged");
    if (this.logged) {
      this.expObj = new expenseClass();
      await this.updateData();
    }
  },
  methods: {
    async updateData() {
      const data = await this.expObj.getExpDB();
      this.expenses = data.expenses;
      this.all_categories = data.all_categories;
      this.recurring_payment = data.recurring_payment;
      await this.$emit("updateData", 1);
    },
    async addNewExpense(new_expense) {
      console.log("ADD EPXENSE OUTER 2");
      try {
        const tmp = await this.expObj.addNewExpense(new_expense);
        if (tmp.err) {
          alert(tmp.err);
        } else {
          await this.updateData();
          console.log(tmp);
          this.selectedExp = tmp;
        }
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },
    async updateExpenses(data) {
      try {
        const tmp = await this.expObj.updateExpense(
          data.selectedExp,
          data.new_expense
        );
        if (tmp.err) {
          console.log(tmp);
          alert(tmp.err);
        } else {
          await this.updateData();
          this.selectedExp = tmp;
        }
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },
    async deleteExp(selectedExp) {
      try {
        const tmp = await this.expObj.deleteExpense(selectedExp);
        if (tmp.err) {
          alert(tmp);
        } else {
          this.updateData();
          this.selectedExp = null;
        }
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },
  },
  watch: {
    async tab_open() {
      await this.$emit("checkLogged");
      await this.updateData();
    },
  },
};
</script>
<style></style>
