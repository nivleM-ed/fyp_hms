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
          <p v-if="!isUpdate">Date: {{ date }}</p>
          <p v-else>
            Date: {{ utils.momentFormatDate(false, new_expense.date) }}
          </p>
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
              :items="
                new_expense.category == 'Recurring Payment'
                  ? ['Recurring Payment']
                  : new_expense.category == 'Shopping List'
                  ? ['Shopping List']
                  : utils.toFirstUpperCase(all_categories, true)
              "
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
            class="mr-2"
            @click.prevent="validate()"
          >
            Add
          </v-btn>
          <v-btn
            v-else
            color="orange"
            :disabled="!add_valid"
            class="mr-2"
            @click.prevent="validate()"
          >
            Update
          </v-btn>
          <v-dialog v-model="deleteAuth" v-if="isUpdate" width="500">
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
                  @click="deleteExp(selectedExpInner)"
                >
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import utils from "@/js/utils.js";
// import expenseClass from "@/js/expense_class.js";

export default {
  name: "addUpdateExpenseDialog",
  props: ["addUpdateMenu", "date_pick", "selectedExpInner"],
  data() {
    return {
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
      utils: utils,
      all_categories: [
        "Transportation",
        "Food",
        "Utilities",
        "Insurance",
        "Housing",
        "Healthcare",
        "Entertainment",
        "Miscellaneous",
      ],
    };
  },
  async created() {},
  computed: {
    date() {
      return utils.momentFormatDate(false, this.date_pick);
    },
  },
  methods: {
    async validate() {
      this.$refs.add_form.validate();
      let new_expense = JSON.parse(JSON.stringify(this.new_expense));
      if (new_expense.title && new_expense.description && new_expense.amount) {
        new_expense.date = new Date(this.date_pick);
        if (!this.isUpdate) {
          this.$emit("addNewExpense", new_expense);
        } else {
          try {
            let selectedExp = JSON.parse(JSON.stringify(this.selectedExpInner));
            this.$emit("updateExpenses", { selectedExp, new_expense });
          } catch (err) {
            alert(err);
          }
        }
        setTimeout(() => {
          this.addUpdateMenu = false;
        }, 100);
      }
    },
    deleteExp(selectedExpInner) {
      try {
        this.addUpdateMenu = false;
        this.deleteAuth = false;
        this.$emit("deleteExp", JSON.parse(JSON.stringify(selectedExpInner)));
      } catch (err) {
        alert(err);
      }
    },
    resetDialog() {
      if (!this.selectedTaskInner) {
        if (!this.addUpdateMenu) {
          this.$refs.add_form.reset();
          this.isUpdate = false;
        }
        setTimeout(() => {
          if (!this.isUpdate) {
            this.new_expense.color = "#228B22";
          }
        }, 500);
      }
    },
  },
  watch: {
    selectedExpInner(val) {
      if (val) {
        this.isUpdate = true;
        this.new_expense = JSON.parse(JSON.stringify(val));
      } else {
        this.resetDialog();
      }
    },
    addUpdateMenu: function(val) {
      this.$emit("update:addUpdateMenu", val);
      if (!this.addUpdateMenu) {
        this.resetDialog();
        this.isUpdate = false;
      }
    },
  },
};
</script>
<style></style>
