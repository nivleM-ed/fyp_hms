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
        <ExpenseStatistics
          :expenses="expenses"
          :recurring_payment="recurring_payment"
          v-on:errorAlert="errorAlert"
        />
      </v-tab-item>

      <v-tab-item>
        <DailyExpenses
          :expenses="expenses"
          :selectedExp="selectedExp"
          v-on:update="updateData"
          v-on:addNewExpense="addNewExpense"
          v-on:updateExpenses="updateExpenses"
          v-on:deleteExp="deleteExp"
          v-on:errorAlert="errorAlert"
        />
      </v-tab-item>

      <v-tab-item>
        <RecurringExpenses
          :logged="logged"
          :recurring_payment="recurring_payment"
          v-on:update="updateData"
          v-on:errorAlert="errorAlert"
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
      tab_open: 0,
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
      this.tab_open =
        this.$route.query.tab == null ? 0 : parseInt(this.$route.query.tab);
    }
  },
  methods: {
    async updateData() {
      const data = await this.expObj.getExpDB();
      this.expenses = data.expenses;
      this.all_categories = data.all_categories;
      this.recurring_payment =
        data.recurring_payment == null ? [] : data.recurring_payment;

      await this.$emit("updateData", 1);
    },
    async addNewExpense(new_expense) {
      try {
        const tmp = await this.expObj.addNewExpense(new_expense);
        if (tmp.err) {
          alert(tmp.err);
        } else {
          await this.updateData();
          this.$emit("viewAlert", { type: "new_expense", data: new_expense });
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
          this.$emit("viewAlert", {
            type: "update_daily_exp",
            data: data.new_expense,
          });
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
          this.$emit("viewAlert", {
            type: "delete_daily_exp",
            data: selectedExp,
          });
          this.selectedExp = null;
        }
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },
    async errorAlert(err) {
      this.$emit("errorAlert", err);
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
