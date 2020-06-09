<template>
  <div class="m-4">
    <v-overlay :value="addUpdateMenu"></v-overlay>

    <v-dialog v-model="addUpdateMenu" persistent max-width="400px">
      <v-card color="grey lighten-4" min-width="400px" flat>
        <v-toolbar :color="new_rec_payment.color" dark>
          <v-toolbar-title v-if="!isUpdate"
            >New Recurring Payment</v-toolbar-title
          >
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
              v-model="new_rec_payment.color"
              mode.sync="hexa"
              hide-inputs
            ></v-color-picker>
          </v-menu>

          <v-btn icon @click="addUpdateMenu = false" class="float-right">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form ref="add_form" v-model="add_valid" class="p-4" lazy-validation>
          <v-text-field
            v-model="new_rec_payment.title"
            :rules="inputRules"
            label="Title"
            required
          ></v-text-field>

          <v-text-field
            v-model="new_rec_payment.description"
            :rules="inputRules"
            label="Description"
            required
          ></v-text-field>

          <v-select
            :items="utils.toFirstUpperCase(payment_type, true)"
            label="Category"
            v-model="new_rec_payment.category"
            outlined
            :rules="inputRules"
          ></v-select>

          <v-expand-transition>
            <v-select
              v-show="new_rec_payment.category"
              :items="
                new_rec_payment.category == 'Weekly'
                  ? [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ]
                  : select_rec_day
              "
              label="Day"
              v-model="new_rec_payment.day"
              outlined
              :rules="inputRules"
            ></v-select>
          </v-expand-transition>

          <v-expand-transition>
            <v-select
              v-show="new_rec_payment.category == 'Annually'"
              :items="select_rec_month"
              label="Month"
              v-model="new_rec_payment.month"
              outlined
              :rules="
                new_rec_payment.category == 'Annually' ? inputRules : false
              "
            ></v-select>
          </v-expand-transition>

          <v-text-field
            v-model="new_rec_payment.amount"
            :rules="inputRulesNum"
            label="Amount"
            required
          ></v-text-field>

          <p class="caption font-italic">
            ( If 31st is chosen and the month does not have a 31st, it will
            recur on the last available date - 30th. *Same concept applies with
            February* )
          </p>

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
            <v-row v-if="rec_payment">
              <v-card outlined height="60vh" width="100%">
                <v-card flat class="vuebar-element" v-bar>
                  <v-list dense width="100%">
                    <v-list-item-group v-model="item" color="primary">
                      <template v-for="(expense, index) in rec_payment">
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
                        You have not set any recurring payment.
                      </p>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            v-on="on"
                            @click.prevent="addUpdateMenu = true"
                          >
                            Add
                          </v-btn>
                        </template>
                        <span>Add Recurring Payment</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>

            <v-row v-if="rec_payment">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="success"
                    dark
                    v-on="on"
                    class="ml-4 mt-4"
                    @click.prevent="addUpdateMenu = true"
                  >
                    Add
                  </v-btn>
                </template>
                <span>Add Reccuring payment</span>
              </v-tooltip>
            </v-row>
          </v-col>

          <v-divider class="mx-4" vertical></v-divider>

          <v-col>
            <v-card height="100%" flat min-height="70vh">
              <v-expand-transition>
                <v-card v-show="!expDetailsShow" height="60vh" flat>
                  <v-container fill-height fluid>
                    <p>Recurring Payment</p>
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
                        Amount: {{ selectedExp.amount }} <br />{{
                          selectedExp.description
                        }}
                        <br />Next Payment:
                        {{ utils.momentFormatDate(false, selectedExp.date) }}
                        <br />
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
  name: "RecurringExpenses",
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

      new_rec_payment: {
        title: null,
        description: null,
        amount: null,
        category: "Monthly",
        color: "#228B22",
        day: null,
        month: null,
      },
      selectedExp: null,
      expDetailsShow: false,

      date_menu: false,
      tab_open: 1,
      utils: utils,

      date_pick: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),

      expObj: new expenseClass(),
      expenses: [],
      rec_payment: {},
      daily_total_spent: 0,
      daily_total_received: 0,
      payment_type: ["Weekly", "Monthly", "Annually"],
      payment_type_show: true,
      select_rec_day: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
      ],
      select_rec_month: [
        { text: "January", value: 1 },
        { text: "February", value: 2 },
        { text: "March", value: 3 },
        { text: "April", value: 4 },
        { text: "May", value: 5 },
        { text: "June", value: 6 },
        { text: "July", value: 7 },
        { text: "August", value: 8 },
        { text: "September", value: 9 },
        { text: "October", value: 10 },
        { text: "November", value: 11 },
        { text: "December", value: 12 },
      ],

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
  props: ["recurring_payment"],
  async created() {
    // this.$emit("checkLogged");
  },
  methods: {
    async validate() {
      this.$refs.add_form.validate();
      let new_recur = JSON.parse(JSON.stringify(this.new_rec_payment));
      if (new_recur.title && new_recur.description && new_recur.amount) {
        if (!this.isUpdate) {
          try {
            await this.expObj.addNewRecur(new_recur);
            await this.$emit("update", 1);
          } catch (err) {
            alert(err);
          }
        } else {
          try {
            const tmp = await this.expObj.updateRecur(
              this.selectedExp,
              new_recur
            );
            if (tmp.err) {
              alert(tmp.err);
            } else {
              await this.$emit("update", 1);
              this.selectedExp = tmp;
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
        const tmp = await this.expObj.deleteRecur(selectedExp);
        if (tmp.err) {
          alert(tmp.err);
        } else {
          await this.$emit("update", 1);
          this.selectedExp = null;
        }
      } catch (err) {
        alert(err);
      }
      this.deleteAuth = false;
    },
    setDetails(created, id) {
      if (created) {
        alert("NO GO SET DETAILS");
      } else {
        this.selectedExp = this.rec_payment[id];
      }
    },
    updateButton() {
      this.addUpdateMenu = true;
      this.isUpdate = true;
      this.new_rec_payment = JSON.parse(JSON.stringify(this.selectedExp));
      this.new_rec_payment.category = utils.toFirstUpperCase(
        this.new_rec_payment.category,
        false
      );
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
    addUpdateMenu: function() {
      if (!this.addUpdateMenu) {
        this.$refs.add_form.reset();
        setTimeout(() => {
          this.new_rec_payment.category = "Monthly";
          this.isUpdate = false;
        }, 100);
      }
    },
    recurring_payment(val) {
      this.rec_payment = val;
    },
  },
};
</script>
