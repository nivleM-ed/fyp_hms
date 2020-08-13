<template>
  <v-container>
    <!-- dialog for settings -->
    <v-dialog v-model="lowSetting" width="500">
      <v-card>
        <v-card-text class="p-4">
          Are you sure you want to delete this food item?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="lowSetting = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="deleteItem()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card outlined height="70vh">
      <v-card flat>
        <v-card-title>
          Food Item running low:
          <v-tooltip right>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon color="green">
                <v-icon
                  v-on="{ ...tooltip }"
                  @click="addToList(getLow(food), 'multiple')"
                >
                  mdi-cart
                </v-icon>
              </v-btn>
            </template>
            <span>Add all to shopping list</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon color="grey">
                <v-icon
                  v-on="{ ...tooltip }"
                  @click="lowSetting = true"
                >
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
      <v-divider class="mx-4" :inset="true"></v-divider>
      <v-card> 

      </v-card>
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
      lowSetting: false,
      utils: utils,
      addUpdateMenu: false,
      loading: false,
      addRecFood: {},
      low_food_setting: {},

      item: null,
      show_Food: [],
      // invObj: new inventoryClass(),
    };
  },
  props: ["timestamp", "food"],
  async created() {},
  methods: {
    getLow() {
      let tmp = this.food.filter((x) => x.quantity <= 1);
      return tmp;
    },
  },
  watch: {},
};
</script>
<style></style>
