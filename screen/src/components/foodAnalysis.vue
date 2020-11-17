<template>
  <v-container>
    <!-- dialog for settings -->
    <v-dialog v-model="lowSetting" width="500">
      <v-card>
        <v-card-title
          >Set notification for items that are running low:</v-card-title
        >
        <v-card-text class="p-4">
          <v-row>
            <v-col>
              <p>Remind me when type <b>Grams(g)</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_g"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Remind me when type <b>Kilograms(g)</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_kg"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Remind me when type <b>bottles</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_bottle"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Remind me when type <b>boxes</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_box"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Remind me when type <b>millilitres(ml)</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_ml"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Remind me when type <b>litres(l)</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_l"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>Remind me when type <b>packets</b> goes less than:</p>
            </v-col>
            <v-col>
              <v-text-field
                v-model="low_food_setting_tmp.low_packet"
                label="Quantity"
                placeholder="Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="lowSetting = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="updateLowSetting()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog to choose shopping list -->
    <v-dialog v-model="chooseShoppingList" width="500">
      <v-card>
        <v-card-text class="p-4">
          <p>Choose shopping list:</p>
          <v-select
            :items="shopping_list_titles"
            label="List name"
            v-model="sListChoose"
            outlined
            :rules="inputRules"
            class="ma-2"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="chooseShoppingList = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="addToShopList(foodTmp, true)">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog for adding multiple items to shopping cart -->
    <v-dialog v-model="addList" width="600">
      <v-card>
        <v-card-title>
          Add to Shopping List
        </v-card-title>
        <v-card-text class="p-4">
          <v-list dense width="100%">
            <div v-for="item in foodTmp" :key="item.id">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="item.name"
                    solo
                    dense
                    flat
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col class="pb-2">
                  <v-text-field
                    v-model="item.add_quantity"
                    label="Quantity"
                    placeholder="Food Quantity"
                    solo
                    dense
                    :rules="inputRulesNum"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="item.category"
                    solo
                    dense
                    flat
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-icon @click="removeFoodTmp(item)" color="red"
                    >mdi-close</v-icon
                  >
                  <v-tooltip
                    bottom
                    max-width="400"
                    v-if="checkExistInList(item)"
                  >
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                        icon
                        v-on="{ ...tooltip, ...menu }"
                        class="float-right"
                      >
                        <v-icon color="red">mdi-exclamation</v-icon>
                      </v-btn>
                    </template>
                    {{ item.shoplist_quantity }}
                    <span
                      >This item has already been added to the shopping list.
                      However, you can still add more to the list.</span
                    >
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="addList = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="chooseShoppingList = true">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card flat height="">
      <v-card flat>
        <v-card-title>
          Food Item running low:
          <v-tooltip right>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn v-if="!overview" icon color="green">
                <v-icon v-on="{ ...tooltip }" @click="openAddList()">
                  mdi-cart
                </v-icon>
              </v-btn>
            </template>
            <span>Add all to shopping list</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn v-if="!overview" icon color="grey">
                <v-icon v-on="{ ...tooltip }" @click="lowSetting = true">
                  mdi-cog
                </v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <div v-for="item in getLow(food)" :key="item.id">
            {{ item.name }} - {{ item.quantity }} {{ item.category }} left
          </div>
        </v-card-text>
      </v-card>
      <v-divider v-if="!overview" class="mx-4" :inset="true"></v-divider>
      <v-card></v-card>
    </v-card>
  </v-container>
</template>
<script>
// const moment = require("moment");
import utils from "@/js/utils.js";
// import inventoryClass from "@/js/inventory_class.js";

export default {
  name: "foodAnalysis",
  data() {
    return {
      height: "70vh",
      addList: false,
      lowSetting: false,
      utils: utils,
      addUpdateMenu: false,
      loading: false,
      chooseShoppingList: false,
      addRecFood: {},
      foodTmp: {},
      sListChoose: null,
      inputRules: [(v) => !!v || "Required!"],
      inputRulesNum: [
        (v) => !!v || "Required!",
        (v) => !isNaN(v) || "Must be a number!",
      ],

      item: null,
      show_Food: [],
      low_food_setting_tmp: []
    };
  },
  props: [
    "timestamp",
    "food",
    "low_food_setting",
    "shopping_list",
    "shopping_list_titles",
    "overview"
  ],
  async created() {},
  methods: {
    getLow() {
      let tmp = this.food.filter((x) => {
        //should i use switch case here?
        if (x.category === "Grams(g)") {
          return x.quantity <= this.low_food_setting.low_g;
        } else if (x.category === "Kilograms(kg)") {
          return x.quantity <= this.low_food_setting.low_kg;
        } else if (x.category === "Packets") {
          return x.quantity <= this.low_food_setting.low_packet;
        } else if (x.category === "Bottles") {
          return x.quantity <= this.low_food_setting.low_bottle;
        } else if (x.category === "Boxes") {
          return x.quantity <= this.low_food_setting.low_box;
        } else if (x.category === "Millilitres(ml)") {
          return x.quantity <= this.low_food_setting.low_ml;
        } else if (x.category === "Litres(l)") {
          return x.quantity <= this.low_food_setting.low_l;
        } else {
          console.log("error: getLow (this shouldn't happen)");
        }
      });
      return tmp;
    },
    addToShopList(data, array) {
      this.$emit("addToList", {
        list_id: this.sListChoose,
        data: { data: data, array: array },
      });
      this.addList = false;
      this.chooseShoppingList = false;
      this.sListChoose = null;
    },
    openAddList() {
      this.foodTmp = JSON.parse(JSON.stringify(this.getLow(this.food)));
      this.addList = true;
    },
    checkExistInList(data) {
      for (let i in this.shopping_list) {
        if (this.shopping_list[i].data.findIndex((x) => x.id === data.id) >= 0)
          return true;
        return false;
      }
    },
    removeFoodTmp(item) {
      this.foodTmp.splice(
        this.foodTmp.findIndex((x) => x.id === item.id),
        1
      );
    },
    updateLowSetting() {
      this.$emit("updateLowSetting", this.low_food_setting_tmp);
      this.lowSetting = false;
    }
  },
  watch: {
    low_food_setting(val) {
      this.low_food_setting_tmp = JSON.parse(JSON.stringify(val));
    }
  },
};
</script>
<style></style>
