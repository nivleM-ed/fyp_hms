<template>
  <v-container>
    <div
      v-if="error"
      style="background-color: #edd2d1"
      class="border border-danger rounded mt-3 p-2 text-center"
    >
      <h4
        slot="header"
        class="card-title">{{ error }}</h4>
      <p v-if="error == 'Network Error'">
        If you see this, it means there is a problem with reaching the server
      </p>
      <p>Please contact the person in charge to fix this problem</p>
    </div>
    <div v-else>
      <form>
        <div v-if="!isMobile()">
          <v-card>
            <div class="pa-2 ml-4">
              <div class="row">
                <h2 class="card-title">{{ recipe.title }}</h2>
              </div>
              <div class="row mt-3">
                {{ recipe.description }}
              </div>
            </div>

            <v-row class="d-flex mb-4">
              <v-col
                cols="4"
                class="pa-2 ml-4">
                <v-data-table
                  :headers="headersIng"
                  :items="recipe.ingredients"
                  style="max-width: 60%"
                  dense
                  hide-actions>
                  <template
                    slot="headerCell"
                    slot-scope="{ header }">
                    <span
                      class="subheading font-weight-light text-success text--darken-3"
                      v-text="header.text"
                    />
                  </template>
                  <template
                    slot="items"
                    slot-scope="{ item }">
                    <td>{{ item.ingredient }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.quantity_type }}</td>
                  </template>
                </v-data-table>
              </v-col>
              <v-col
                cols="8"
                class="pa-2 mr-4">
                <v-card>
                  <v-img
                    :src="'/img/uploads/'+ recipe.pic_path"
                /></v-card>
              </v-col>
            </v-row>
          </v-card>
          <v-data-table
            :headers="headersMethods"
            :items="recipe.methods"
            class="mb-2"
            hide-actions>
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text-success text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }">
              <td>{{ item.step }}</td>
              <td>{{ item.description }}</td>
            </template>
          </v-data-table>
        </div>

        <div class="float-right">
          <v-row>
            <v-col>
              <v-btn
                color="warning"
                @click.prevent="$router.go(-1)"
              >
                Go back
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
              class="ml-2"
                color="success"
                @click.prevent="updateRecipe"
              >
                Update Recipe
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <div class="clearfix"/>
      </form>
    </div>
  </v-container>
</template>
<script>
import recipeApi from '@/api/recipe_api.js'
import recipeClass from '@/model/recipe_class.js'
import userApi from '@/api/users_api.js'
import utils from '@/api/utils.js'

export default {
  data () {
    return {
      is_update: this.$route.query.id,
      recipe: {},
      recipeObj: new recipeClass(),
      error: '',
      headersIng: [
        {
          sortable: false,
          text: 'Ingredient'
        },
        {
          sortable: false,
          text: 'Quantity'
        },
        {
          sortable: false,
          text: 'Type'
        }
      ],
      headersMethods: [
        {
          sortable: false,
          text: 'Step'
        },
        {
          sortable: false,
          text: 'Description'
        }
      ]
    }
  },
  async created () {
    try {
      let logToken = false
      let check_logged = await userApi.check_logged()
      console.log('Check Login: ', check_logged)
      if (check_logged.err) {
        this.$router.push('/login?err=notLogged')
      } else {
        logToken = true
      }

      if (logToken) {
        this.recipeObj.in_param_2 = this.$route.query.id
        this.recipeObj.in_page = 1
        const search = await recipeApi.search(this.recipeObj.toJson())
        this.recipe = search.result[0][0]
        console.log(this.recipe.pic_path)
      }
    } catch (err) {
      this.error = err.message
    }
  },
  methods: {
    updateRecipe () {
      let path = '/recipe/entry?id=' + this.$route.query.id
      this.$router.push(path)
    },

    isMobile () {
      return utils.isMobile()
    }
  }
}
</script>
<style></style>
