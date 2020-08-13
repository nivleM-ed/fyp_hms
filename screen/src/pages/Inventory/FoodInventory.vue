<template>
  <div class="m-4">
    <!-- dialog to confirm item deletion -->
    <v-dialog v-model="deleteAuth" width="500">
      <v-card>
        <v-card-text class="p-4">
          Are you sure you want to delete this food item?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteAuth = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="deleteItem()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog for adding item to shopping list -->
    <v-dialog v-model="addList" width="500">
      <v-card v-if="shoppingListTmp != null">
        <v-card-title>
          Add to Shopping List
        </v-card-title>
        <v-card-text class="p-4">
          {{ utils.toFirstUpperCase(shoppingListTmp.name, false) }}
          <br/><span v-if="checkExistInList(shoppingListTmp)">You have already added this into the shoppping list. Adding here will add extra quantity to the food item in the shopping list.</span>
          <v-row>
            <v-col>
              <v-text-field
                v-model="shoppingListTmp.quantity"
                label="Quantity"
                placeholder="Food Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                :items="shoppingListTmp.category"
                label="Quantity Type"
                v-model="shoppingListTmp.category"
                outlined
                :rules="inputRules"
                class="ma-2"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="addList = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="addToList()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- main UI code -->
    <v-flex>
      <v-card flat min-height="60vh" height="100%">
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="9">
                <v-autocomplete
                  v-model="select"
                  :append-outer-icon="'mdi-send'"
                  :loading="loading"
                  :items="items"
                  :search-input.sync="search"
                  ref="task_search"
                  flat
                  hide-no-data
                  hide-details
                  label="Search tasks"
                  solo-inverted
                  ><template slot="append-outer">
                    <v-icon @click="resetSearch()" v-if="cancel_icon"
                      >mdi-close-box</v-icon
                    >
                    <v-icon @click="searchTask()">mdi-send</v-icon>
                  </template></v-autocomplete
                >
              </v-col>
              <v-col cols="auto">
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="green"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      >New Food</v-btn
                    >
                  </template>
                  <v-card flat>
                    <!-- <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title> -->

                    <v-toolbar :color="editedItem.color" dark>
                      <span class="headline">{{ formTitle }}</span>
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
                          v-model="editedItem.color"
                          mode.sync="hexa"
                          hide-inputs
                        ></v-color-picker>
                      </v-menu>

                      <v-btn icon @click="close" class="float-right">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>

                    <v-form ref="add_form" v-model="add_valid" lazy-validation>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name"
                              placeholder="Food Name"
                              :rules="inputRules"
                              required
                            ></v-text-field>
                          </v-row>
                          <v-row>
                            <v-text-field
                              v-model="editedItem.description"
                              label="Description"
                              placeholder="Food Description"
                              :rules="inputRules"
                              required
                            ></v-text-field>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="editedItem.quantity"
                                label="Quantity"
                                placeholder="Food Quantity"
                                :rules="inputRulesNum"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-select
                                :items="
                                  utils.toFirstUpperCase(all_categories, true)
                                "
                                label="Quantity Type"
                                v-model="editedItem.category"
                                outlined
                                :rules="inputRules"
                                class="ma-2"
                                required
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-form>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn color="blue darken-1" text @click="close"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                        :disabled="!add_valid"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <v-card flat height="85%">
              <v-data-table
                :headers="headers"
                :items="food_items"
                sort-by="quantity"
                hide-default-footer
                :items-per-page="10"
                :page.sync="page"
                @page-count="pageCount = $event"
                :search="search"
                :single-expand="true"
                :expanded.sync="expanded"
                show-expand
              >
                <template v-slot:item.quantity="{ item }">
                  <v-chip :color="getColor(item.quantity)" dark>{{
                    item.quantity
                  }}</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-tooltip left>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-icon
                        small
                        color="blue"
                        class="mr-2"
                        v-on="{ ...tooltip }"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-icon
                        small
                        class="mr-2"
                        color="red"
                        v-on="{ ...tooltip }"
                        @click.stop="setTmpItem(item, 'delete')"
                        >mdi-delete</v-icon
                      >
                    </template>
                    <span>Delete</span>
                  </v-tooltip>

                  <v-tooltip right>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-icon
                        color="green"
                        small
                        v-on="{ ...tooltip }"
                        @click="setTmpItem(item, 'list')"
                      >
                        mdi-cart
                      </v-icon>
                    </template>
                    <span>Add to shopping list</span>
                  </v-tooltip>
                </template>
                <template v-slot:no-data>
                  <span>No data available</span>
                  <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    Description: <br />{{ item.description }} <br />
                    Date created: {{ item.date_created }} <br />
                    Date editted: {{ item.date_editted }}
                  </td>
                </template>
              </v-data-table>
            </v-card>
            <div class="text-center mb-4">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </v-col>

          <v-divider class="mx-4" vertical></v-divider>

          <v-col>
            <v-card height="100%" flat min-height="70vh">
              <foodAnalysis :food="food" />
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
// const moment = require("moment");
import utils from "@/js/utils.js";
// import { CONST } from "@/js/const.js";

import foodAnalysis from "@/components/foodAnalysis";

export default {
  name: "FoodInventory",
  components: { foodAnalysis },
  data() {
    return {
      deleteAuth: false,
      addList: false,
      inputRules: [(v) => !!v || "Required!"],
      inputRulesNum: [
        (v) => !!v || "Required!",
        (v) => !isNaN(v) || "Must be a number!",
      ],
      cancel_icon: false,
      tab_open: 0,
      utils: utils,
      loading: false,
      items: [],
      search: null,
      select: null,
      selectedFoodInner: null,

      page: 1,
      pageCount: 0,

      item: null,
      show_food: [],

      dialog: false,
      all_categories: ["grams", "packet(s)", "bottle(s)"],
      headers: [
        {
          text: "Food ",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Quantity", value: "quantity" },
        { text: "Type", value: "category" },
        { text: "Actions", value: "actions", sortable: false },
        { text: "", value: "data-table-expand" },
      ],
      food_items: [],
      food_titles: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        description: null,
        quantity: null,
        color: "#228B22",
      },
      defaultItem: {
        name: "",
        description: null,
        quantity: null,
        color: "#228B22",
      },
      foodTmp: null,
      shoppingListTmp: null,
    };
  },
  props: ["food", "shopping_list"],
  async created() {
    this.initialize();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  methods: {
    initialize() {
      this.food_items = this.food == null ? [] : this.food;
      this.setTitles();
    },

    updateFood() {
      this.$emit("updateFood", this.food_items);
    },

    editItem(item) {
      this.editedIndex = this.food_items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.updateFood();
    },

    setTmpItem(item, type) {
      if (type === "delete") {
        this.foodTmp = item;
        this.deleteAuth = true;
      } else if (type === "list") {
        this.shoppingListTmp = item;
        this.addList = true;
      }
    },

    deleteItem() {
      this.deleteAuth = false;
      const index = this.food_items.indexOf(this.foodTmp);
      // confirm("Are you sure you want to delete this item?") &&
      this.food_items.splice(index, 1);
      this.foodTmp = null;
      this.updateFood();
    },

    addToList() {
      let tmp = JSON.parse(JSON.stringify(this.shoppingListTmp));
      this.$emit("addToList", tmp);
      this.addList = false;
    },

    checkExistInList(data) {
      if(this.shopping_list.findIndex(x => x.id === data.id) > 0) return true;
      return false;
    },

    close() {
      this.$refs.add_form.reset();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.$refs.add_form.validate();
      let editedItem = JSON.parse(JSON.stringify(this.editedItem));
      if (
        editedItem.name &&
        editedItem.description &&
        editedItem.quantity &&
        editedItem.category
      ) {
        if (this.editedIndex > -1) {
          this.editedItem.date_editted = new Date();
          Object.assign(this.food_items[this.editedIndex], editedItem);
        } else {
          editedItem.id = await utils.getHashId(
            `${Date.now()}-${JSON.stringify(editedItem)}`
          );
          editedItem.date_created = new Date();
          console.log(editedItem);
          this.food_items.push(editedItem);
        }
        this.updateFood();
        this.close();
      }
    },

    querySelections(v) {
      try {
        this.loading = true;
        setTimeout(() => {
          this.items = this.food_titles.filter((e) => {
            return (
              (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
            );
          });
          this.loading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },

    openTab(tab) {
      this.$emit("changeTab", tab);
    },

    setTitles() {
      for (var item of this.food_items) {
        this.food_titles.push(item.name);
      }
    },

    async resetSearch() {
      try {
        this.cancel_icon = false;
        this.select = null;
        this.search = null;
        this.item = null;
        this.food_items = this.food;
      } catch (err) {
        console.log(err);
      }
    },
    searchTask() {
      try {
        this.food_items = [];
        this.food_items = this.food.reduce((data, x) => {
          if (x.name == this.search) {
            data.push(x);
          }
          return data;
        }, []);

        this.item = 0;
      } catch (err) {
        console.log(err);
      }
    },
    getColor(quantity) {
      if (quantity <= 1) return "red";
      else if (quantity <= 10) return "orange";
      else return "green";
    },
    test() {
      console.log("test123");
    },
  },
  watch: {
    search(val) {
      if (val != null) {
        this.cancel_icon = true;
      }
      val && val !== this.select && this.querySelections(val);
    },
    food(val) {
      this.food_items = val == null ? [] : val;
      this.setTitles();
    },
    dialog(val) {
      val || this.close();
    },
    deleteAuth(val) {
      console.log(val);
    },
  },
};
</script>
<style></style>
