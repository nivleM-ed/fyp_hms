<template>
  <v-card flat>
    <v-tabs
      background-color="white"
      color="deep-purple accent-4"
      v-model="tab_open"
    >
      <v-tab key="food">Food</v-tab>
      <v-tab key="shoppinglist">Shopping List</v-tab>
      <!-- <v-tab key="recipe">Recipe</v-tab> -->

      <v-tab-item key="food">
        <FoodInventory 
        :food="food"
        :shopping_list="shopping_list"
        :low_food_setting="low_food_setting"
        :all_categories="all_categories"
        :shopping_list_titles="shopping_list_titles"
        v-on:updateFood="updateFood"
        v-on:addToList="addToList"
        v-on:updateLowSetting="updateLowSetting"
        v-on:viewAlert="viewAlert"
        />
      </v-tab-item>

      <v-tab-item key="shoppinglist"> 
        <ShoppingList
        :food="food"
        :shopping_list="shopping_list"
        :all_categories="all_categories"
        v-on:updateShoppingList="updateShoppingList"
        v-on:addToTask="addToTask"
        v-on:viewAlert="viewAlert"
        />
      </v-tab-item>

      <!-- <v-tab-item key="recipe"> </v-tab-item> -->
    </v-tabs>
  </v-card>
</template>
<script>
import FoodInventory from "@/pages/Inventory/FoodInventory.vue";
import ShoppingList from "@/pages/Inventory/ShoppingList.vue";
import invClass from "@/js/inventory_class.js";

export default {
  components: { FoodInventory, ShoppingList },
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
      shopping_list_titles: [],
      invObj: null,
      tab_open: 0,
    };
  },
  props: ["timestamp", "logged"],
  async created() {
    //axios to get data for inventory overview
    this.$emit("checkLogged");
    if (this.logged) {
      this.invObj = new invClass();
      await this.updateData();
      this.tab_open = this.$route.query.tab == null ? 0 : parseInt(this.$route.query.tab);
    }
  },
  mounted: function() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    async updateData() {
      await this.invObj.getInvDB();
      this.food = this.invObj._food;
      this.shopping_list = this.invObj._shopping_list;
      this.shopping_list_titles = await this.getShoppingListTitles(this.invObj._shopping_list);
      this.low_food_setting = this.invObj._low_food_setting;
      this.all_categories = this.invObj._all_categories;
    },

    async updateFood(data){
      await this.invObj.updateFood(data);
      await this.updateData();
    },

    async updateLowSetting(data) {
      await this.invObj.updateLowSetting(data);
      await this.updateData();
    },

    async updateShoppingList(data) {
      await this.invObj.updateShoppingList(data);
      await this.updateData();
    },

    async getShoppingListTitles(data) {
      let tmp = [];
      for (let item in data) {
        if(!data[item].completed) tmp.push({text: data[item].name, value: data[item].id});
      }
      return tmp;
    },

    async addToList(data) {
      await this.invObj.addShoppingList(data.list_id, data.data, data.array);
      await this.updateData();
      this.$emit("viewAlert", {type:"food_add_to_list",data:data})
    },

    async addToTask(data) {
      await this.invObj.addShoppingTask(data);
      await this.updateData();
      this.$emit("viewAlert", {type:"shopping_add_to_task",data:data})
    },

    async viewAlert(data) {
      this.$emit("viewAlert", data);
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
  watch: {
  }
};
</script>
<style></style>
