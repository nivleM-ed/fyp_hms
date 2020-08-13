<template>
  <v-card flat>
    <v-tabs
      background-color="white"
      color="deep-purple accent-4"
      v-model="tab_open"
    >
      <v-tab key="food">Food</v-tab>
      <v-tab key="shoppinglist">Shopping List</v-tab>
      <v-tab key="recipe">Recipe</v-tab>

      <v-tab-item key="food">
        <FoodInventory 
        :food="food"
        :shopping_list="shopping_list"
        :low_food_setting="low_food_setting"
        :all_categories="all_categories"
        v-on:updateFood="updateFood"
        v-on:addToList="addToList"
        />
      </v-tab-item>

      <v-tab-item key="shoppinglist"> </v-tab-item>

      <v-tab-item key="recipe"> </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import FoodInventory from "@/pages/Inventory/FoodInventory.vue";
import invClass from "@/js/inventory_class.js";

export default {
  components: { FoodInventory },
  data() {
    return {
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      assets: [],
      food: [],
      shopping_list: [],
      low_food_setting: {},
      all_categories: [],
      invObj: null,
    };
  },
  props: ["timestamp", "logged"],
  async created() {
    //axios to get data for inventory overview
    this.$emit("checkLogged");
    if (this.logged) {
      this.invObj = new invClass();
      await this.updateData();
    }
  },
  mounted: function() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    async updateData() {
      await this.invObj.getInvDB();
      this.food = this.invObj.food;
      this.shopping_list = this.invObj.shopping_list;
      this.low_food_setting = this.invObj.low_food_setting;
      this.all_categories = this.invObj.all_categories;
    },

    async updateFood(data){
      await this.invObj.updateFood(data);
      await this.updateData();
    },

    async addToList(data) {
      await this.invObj.addShoppingList(data, false);
      await this.updateData();
    },

    toPage(page, id) {
      var tmp = "";
      if (id) {
        tmp = "/main/" + page + "?id=" + id;
      } else {
        tmp = "/main/" + page;
      }

      this.$router.push(tmp);
    },
  },
};
</script>
<style></style>
