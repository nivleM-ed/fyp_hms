<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <!-- <v-card> -->
          <h2 class="pa-4">Search Recipe</h2>
          <v-toolbar flat>
            <v-autocomplete
              v-model="select"
              :loading="loading"
              :items="search_items"
              :search-input.sync="search"
              cache-items
              class="mx-4"
              flat
              hide-no-data
              hide-details
              label="Search recipe"
            />
            <v-btn color="success" class="mr-4" @click="searchRecipe()">
              Search
            </v-btn>
            <v-btn color="warning" class="mr-4" @click="addRecipe()">
              Add Recipe
            </v-btn>
          </v-toolbar>

          <v-simple-table class="mt-4">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Title</th>
                  <th class="text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recipe" :key="item.id">
                  <td>{{ item.title }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <v-btn small color="primary" @click="viewRecipe(item.id)"
                      >View</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-flex text-xs-center>
            <v-pagination v-model="page" :length="total_page" circle />
          </v-flex>
        <!-- </v-card> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import recipeApi from "@/api/recipe_api.js";
import userApi from "@/api/users_api.js";
import recipeClass from "@/js/recipe_class.js";
import utils from "@/js/utils.js";

export default {
  data() {
    return {
      in_param: null,
      recipeObj: new recipeClass(),
      recipe: {},
      page: 1,
      total_page: 1,
      error: "",
      titles: [],
      headers: [
        {
          sortable: false,
          text: "Title",
          value: "name"
        },
        {
          sortable: false,
          text: "Description",
          value: "description"
        }
      ],
      loading: false,
      search_items: [],
      search: null,
      select: null
    };
  },
  watch: {
    page: async function(val) {
      if (!isNaN(val)) {
        console.log("Change page...");
        console.log("Search Input:", this.in_param);
        try {
          this.setClass();
          this.recipeObj.in_page = val;
          if (this.isMobile()) {
            this.recipeObj.in_param_3 = 3;
          }
          const search = await recipeApi.search(this.recipeObj.toJson());
          this.recipe = search.result[0].map(recipes => ({
            ...recipes
          }));
          this.total_page = search.result[1];
        } catch (err) {
          this.error = err.message;
        }
      }
    },
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  async created() {
    try {
      let logToken = false;
      let check_logged = await userApi.check_logged();
      console.log("Check Login: ", check_logged);
      if (check_logged.err) {
        this.$router.push("/login");
      } else {
        logToken = true;
      }

      if (logToken) {
        var titles = await recipeApi.recipe_titles();
        this.toTitleArray(titles);
        console.log(this.titles);
        this.setClass();
        this.recipeObj.in_page = this.page;
        if (this.isMobile()) {
          this.recipeObj.in_param_3 = 3;
        }
        const search = await recipeApi.search(this.recipeObj.toJson());
        this.recipe = search.result[0].map(recipes => ({
          ...recipes
        }));
        this.total_page = search.result[1];
      }
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async searchRecipe() {
      console.log("Searching recipe...");
      console.log("Search Input:", this.in_param);
      try {
        this.setClass();
        this.recipeObj.in_page = this.page;
        if (this.isMobile()) {
          this.recipeObj.in_param_3 = 3;
        }
        const search = await recipeApi.search(this.recipeObj.toJson());
        this.recipe = search.result[0].map(recipes => ({
          ...recipes
        }));
        this.total_page = search.result[1];
      } catch (err) {
        this.error = err.message;
      }
    },

    viewRecipe(id) {
      let path = "/main/view_recipe?id=" + id;
      this.$router.push(path);
    },

    async setClass() {
      this.recipeObj.in_param_1 = this.search.trim();
    },

    nextPage() {
      this.page = this.recipeObj.nextPage();
    },

    prevPage() {
      this.page = this.recipeObj.prevPage();
    },

    isMobile() {
      return utils.isMobile();
    },

    addRecipe() {
      this.$router.push("/recipe/entry");
    },

    formatWord(word) {
      return utils.toFirstUpperCase(word);
    },

    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.search_items = this.titles.filter(e => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },

    toTitleArray(in_titles) {
      for (var i = 0; i < in_titles.length; i++) {
        this.titles.push(this.formatWord(in_titles[i].title));
      }
    }
  }
};
</script>
<style></style>
