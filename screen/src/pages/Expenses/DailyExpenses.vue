<template>
  <div class="m-4">
    <v-overlay :value="addUpdateMenu"></v-overlay>

    <v-dialog v-model="addUpdateMenu" persistent max-width="400px">
      <v-card color="grey lighten-4" min-width="400px" flat>
        <v-toolbar :color="new_expense.color" dark>
          <v-toolbar-title v-if="!isUpdate">New Expense</v-toolbar-title>
          <v-toolbar-title v-else>Update Expense</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-menu offset-y>
            <template v-slot:activator="{ on: menu }">
              <v-tooltip left>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    icon
                    v-on="{ ...tooltip, ...menu }"
                    class="float-right"
                  >
                    <v-icon>mdi-format-color-fill</v-icon>
                  </v-btn>
                </template>
                <span>Change color</span>
              </v-tooltip>
            </template>
            <v-color-picker
              v-model="new_expense.color"
              mode.sync="hexa"
              hide-inputs
            ></v-color-picker>
          </v-menu>

          <v-btn icon @click="addUpdateMenu = false" class="float-right">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form ref="add_form" v-model="add_valid" class="p-4" lazy-validation>
          <p>Date: {{ date }}</p>
          <v-text-field
            v-model="new_expense.title"
            :rules="inputRules"
            label="Title"
            required
          ></v-text-field>

          <v-text-field
            v-model="new_expense.description"
            :rules="inputRules"
            label="Description"
            required
          ></v-text-field>

          <v-row>
            <v-select
              :items="utils.toFirstUpperCase(all_categories, true)"
              label="Category"
              v-model="new_expense.category"
              outlined
              :rules="inputRules"
              class="ma-2"
            ></v-select>
          </v-row>

          <v-row>
            <v-col cols="2">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    outlined
                    :disabled="!new_expense.money_in"
                    small
                    v-on="on"
                    color="red"
                    @click="new_expense.money_in = !new_expense.money_in"
                    ><v-icon>
                      mdi-minus
                    </v-icon></v-btn
                  >
                </template>
                <span>Spend</span>
              </v-tooltip>
            </v-col>
            <v-col cols="2">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    outlined
                    :disabled="new_expense.money_in"
                    small
                    v-on="on"
                    @click="new_expense.money_in = !new_expense.money_in"
                    color="green"
                    ><v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Receive</span>
              </v-tooltip>
            </v-col>
            <v-col>
              <v-text-field
                v-model="new_expense.amount"
                :rules="inputRulesNum"
                :label="
                  new_expense.money_in ? 'Amount received' : 'Amount spent'
                "
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            color="success"
            v-if="!isUpdate"
            :disabled="!add_valid"
            @click.prevent="validate()"
          >
            Add
          </v-btn>
          <v-btn
            v-else
            color="success"
            :disabled="!add_valid"
            class="mt-8"
            @click.prevent="validate()"
          >
            Update
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <v-flex>
      <v-card flat min-height="60vh">
        <v-row>
          <v-col class="col-4">
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
                    <v-btn outlined v-on="on">{{
                      date
                    }}</v-btn>
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

              <!-- <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="success"
                          dark
                          v-on="on"
                          class="ml-4 mt-4"
                          @click.prevent="addUpdateMenu = true"
                        >
                          Add Expense
                        </v-btn>
                      </template>
                      <span>Add Expense</span>
                    </v-tooltip> -->
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
                            @click.prevent="addUpdateMenu = true"
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
                    @click.prevent="addUpdateMenu = true"
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
              <v-expand-transition>
                <v-card v-show="selectedExp" outlined height="70vh">
                  <div
                    v-if="selectedExp"
                    class="d-flex align-start flex-column mb-6 ma-4"
                    height="100%"
                  >
                    <div class="mb-auto">
                      <h3>
                        {{ selectedExp.title }}
                      </h3>
                      <p>
                        {{ selectedExp.amount }} <br />{{
                          selectedExp.description
                        }}
                        <br />{{ new Date(selectedExp.date) }} <br />
                        {{ selectedExp.money_in }} <br />
                        {{ selectedExp.category }}
                      </p>
                    </div>
                    <div class="mb-auto">
                      <div class="align-self-end">
                        <div>
                          <v-btn
                            class="mr-2"
                            color="yellow"
                            dark
                            @click.prevent="updateButton()"
                          >
                            Update
                          </v-btn>
                          <v-dialog v-model="deleteAuth" width="500">
                            <template v-slot:activator="{ on }">
                              <v-btn color="red" dark v-on="on">
                                Delete
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-text class="p-4">
                                Are you sure you want to delete this?
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="primary"
                                  text
                                  @click="deleteExp(selectedExp)"
                                >
                                  I accept
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-expand-transition>
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

export default {
  name: "DailyExpenses",
  data() {
    return {
      addUpdateMenu: false,

      item: null,
      inputRules: [(v) => !!v || "Required!"],
      inputRulesNum: [
        (v) => !!v || "Required!",
        (v) => !isNaN(v) || "Must be a number!",
      ],
      add_valid: false,
      isUpdate: false,
      deleteAuth: false,

      new_expense: {
        title: null,
        description: null,
        amount: null,
        category: null,
        color: "#228B22",
        money_in: true,
        date: null,
      },
      selectedExp: null,
      expDetailsShow: false,

      date_menu: false,
      tab_open: 1,
      utils: utils,

      date_pick: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),

      expObj: new expenseClass(),
      // expenses: [],
      now_expense: {},
      daily_total_spent: 0,
      daily_total_received: 0,
      // all_categories: [],

      chartDataSpent: [],
      chartDataReceived: [],
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
  props: ["logged","expenses","all_categories"],
  async created() {
    this.$emit("checkLogged", 1);
    // if (this.logged) {
      this.expObj = new expenseClass();
    //   const data = await this.expObj.getExpDB();
    //   this.expenses = data.expenses;
    //   this.all_categories = data.all_categories;
      await this.getDailyExp();
    // }
  },
  mounted: function() {
    //deleted
  },
  computed: {
    date() {
      return utils.momentFormatDate(false, this.date_pick);
    },
  },
  methods: {
    setToday() {
      this.date_pick = this.today;
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async validate() {
      this.$refs.add_form.validate();
      let new_expense = JSON.parse(JSON.stringify(this.new_expense));
      if (
        new_expense.title &&
        new_expense.description &&
        new_expense.amount
      ) {
        new_expense.date = new Date(this.date_pick);
        if (!this.isUpdate) {
          try {
            await this.expObj.addNewExpense(new_expense);
            this.$emit("update",1);
            await this.getDailyExp();
          } catch (err) {
            alert(err);
          }
        } else {
          try {
            const tmp = await this.expObj.updateExpense(
              this.selectedExp,
              new_expense
            );
            if (tmp.err) {
              console.log(tmp);
            } else {
              this.$emit("update",1);
              await this.getDailyExp();
              this.selectedExp = this.now_expense.data[tmp.dataIndex];
            }
          } catch (err) {
            alert(err);
          }
        }
        setTimeout(() => {
          this.addUpdateMenu = false;
        }, 100);
      }
    },
    async deleteExp(selectedExp) {
      try {
        const tmp = await this.expObj.deleteExpense(selectedExp);
        if (tmp.err) {
          console.log(tmp);
        } else {
          this.$emit("update",1);
          await this.getDailyExp();
          this.selectedExp = null;
        }
      } catch (err) {
        alert(err);
      }
      this.deleteAuth = false;
    },
    updateButton() {
      this.addUpdateMenu = true;
      this.isUpdate = true;
      this.new_expense = JSON.parse(JSON.stringify(this.selectedExp));
      this.new_expense.category = utils.toFirstUpperCase(
        this.new_expense.category,
        false
      );
    },
    async getDailyExp() {
      let date = new Date(this.date_pick);
      let daily = await this.expObj.getDailyExp(date);
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
    setDetails(created, id) {
      if (created) {
        console.log("NO GO SET DETAILS");
      } else {
        this.selectedExp = this.now_expense.data[id];
      }
    },
  },
  watch: {
    item: async function(val) {
      if (val == null) {
        this.selectedExp = null;
      } else {
        this.setDetails(false, val);
      }
    },
    selectedExp() {
      if (this.selectedExp) {
        this.expDetailsShow = true;
      } else {
        this.expDetailsShow = false;
      }
    },
    date_pick: async function() {
      this.item = null;
      this.getDailyExp();
    },
    addUpdateMenu: function() {
      if (!this.addUpdateMenu) {
        this.$refs.add_form.reset();
        this.isUpdate = false;
      }
    },
  },
};
</script>
<style></style>
