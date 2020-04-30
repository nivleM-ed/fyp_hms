<template>
  <div class="content">
    <v-container>
      <v-card v-if="!isMobile()">
        <div class="pa-2">
          <h3 class="pl-4">Add Recipe</h3>
          <form>
            <div
              v-if="error"
              style="background-color: #edd2d1"
              class="border border-danger rounded m-3 p-2 text-center"
            >
              <h4
                slot="header"
                class="card-title">{{ error }}</h4>
              <p v-if="error == 'Network Error'">
                If you see this, it means there is a problem with reaching the
                server
              </p>
              <p>Please contact the person in charge to fix this problem</p>
            </div>
            <div
              v-if="man_desc || man_title || man_ing || man_step"
              style="background-color: #edd2d1"
              class="border border-danger rounded m-3 p-2 text-center"
            >
              <h4
                slot="header"
                class="card-title">
                No input for mandatory fields
              </h4>
              <p class="text-center">
                Please fill in the parts indicated with a red box
              </p>
            </div>
            <div class="pa-4">
              <div
                v-if="inputPage==1"
                class="mb-4">
                <v-row class="d-flex">
                  <v-col>
                    <h5
                      v-if="pic_path">
                      Title
                    </h5>
                    <v-text-field
                      v-model="title"
                      :rules="rules"
                      type="text"
                      placeholder="Title"
                  /></v-col>
                  <v-col
                    class="ml-4">
                    <h5
                      v-if="pic_path">
                      Change Picture
                    </h5>
                    <h5
                      v-else
                      slot="header"
                      class="card-title">
                      Upload Picture
                    </h5>
                    <form
                      enctype="multipart/form-data"
                      class="form-control"
                      style="width: 90%"
                    >
                      <input
                        ref="file"
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        label="Upload picture"
                        @change="onSelect"
                      >
                    </form>
                  </v-col>
                  <v-col v-if="pic_path">
                    <div >
                      <v-img
                        slot="image"
                        :src="'/img/uploads/' + pic_path"
                        alt="pic_path"
                        class="text-center"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h5>Description</h5>
                    <v-text-field
                      v-model="description"
                      :rules="rules"
                      type="text"
                      placeholder="Description"
                    />
                  </v-col>
                </v-row>
              </div>
              <v-card
                v-if="inputPage==2"
                class="ma-4">
                <h3 class="pa-2">Ingredients</h3>
                <v-data-table
                  :headers="headersIng"
                  :items="itemIng"
                  dense
                  class="ml-4"
                  hide-actions>
                  <template
                    slot="headerIng"
                    slot-scope="{ header }">
                    <span
                      class="subheading font-weight-light text-success text--darken-3"
                      v-text="header.text"
                    />
                  </template>
                  <template
                    slot="items"
                    slot-scope="{ item , index }">
                    <td>
                      <v-text-field
                        v-model="item.ingredient"
                        :rules="rules"
                        type="text"
                        placeholder="Ingredient"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="item.quantity"
                        :rules="rules"
                        type="Quantity"
                      />
                    </td>
                    <td>
                      <v-select
                        v-model="item.quantity_type"
                        :items="item_types"
                        menu-props="auto"
                        label="Select"
                        hide-details
                        single-line
                      />
                    </td>
                    <td class="text-xs-right">
                      <v-btn
                        small
                        color="danger"
                        @click="remove(itemIng, index)">Remove</v-btn>
                    </td>
                  </template>
                </v-data-table>

                <v-btn
                  color="green"
                  class="pa-2 ma-4"
                  @click.prevent="addNewItem()"
                >
                  Add Ingredient
                </v-btn>
              </v-card>

              <v-card
                v-if="inputPage==3"
                class="ma-4">
                <h3 class="pa-2">Methods</h3>
                <v-data-table
                  :headers="headersMethods"
                  :items="method"
                  dense
                  class="ml-4"
                  hide-actions>
                  <template
                    slot="headerIng"
                    slot-scope="{ header }">
                    <span
                      class="subheading font-weight-light text-success text--darken-3"
                      v-text="header.text"
                    />
                  </template>
                  <template
                    slot="items"
                    slot-scope="{ item , index }">
                    <td>
                      {{ (item.step = index + 1) }}
                    </td>
                    <td>
                      <v-textarea
                        v-model="item.description"
                        :rules="rules"
                        placeholder="Description"
                      />
                    </td>
                    <td class="text-xs-right">
                      <v-btn
                        small
                        color="danger"
                        @click="remove(method, index)">Remove</v-btn>
                    </td>
                  </template>
                </v-data-table>

                <v-btn
                  color="green"
                  class="pa-2 ma-4"
                  @click.prevent="addNewStep()"
                >
                  Add Step
                </v-btn>
              </v-card>

              <v-row v-if="inputPage==3">
                <v-col class="p-2 text-center">
                  <v-btn
                    color="green"
                    class="btn btn-warning btn-fill float-right"
                    @click.prevent="inpPage('back')"
                  >
                    Go Back
                  </v-btn>
                </v-col>
                <v-col class="p-2 ml-2 text-center">
                  <v-btn
                    v-if="is_update"
                    color="warning"
                    class="btn btn-warning btn-fill float-right"
                    @click.prevent="updateRecipe()"
                  >
                    Update Recipe
                  </v-btn>
                  <v-btn
                    v-else
                    color="green"
                    class="btn btn-success btn-fill float-right"
                    @click.prevent="addRecipe()"
                  >
                    Add Recipe
                  </v-btn>
                </v-col>
                <v-col class="p-2 ml-2 text-center">
                  <v-btn
                    v-if="is_update"
                    color="danger"
                    class="btn btn-danger btn-fill float-right"
                    @click.prevent="deleteRecipe()"
                  >
                    Delete Recipe
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col class="p-2 text-center">
                  <v-btn
                    v-if="inputPage==1"
                    color="green"
                    class="btn btn-warning btn-fill float-right"
                    @click.prevent="$router.go(-1)"
                  >
                    Go Back
                  </v-btn>
                </v-col>
                <v-col class="p-2 text-center">
                  <v-btn
                    v-if="inputPage==2"
                    color="green"
                    class="btn btn-warning btn-fill float-right"
                    @click.prevent="inpPage('back')"
                  >
                    Go Back
                  </v-btn>
                </v-col>
                <v-col
                  v-if="inputPage==1"
                  class="p-2 ml-2 text-center">
                  <v-btn
                    color="green"
                    class="btn btn-danger btn-fill float-right"
                    @click.prevent="inpPage('add')"
                  >
                    Go to Ingredients
                  </v-btn>
                </v-col>
                <v-col
                  v-if="inputPage==2"
                  class="p-2 ml-2 text-center">
                  <v-btn
                    color="green"
                    class="btn btn-danger btn-fill float-right"
                    @click.prevent="inpPage('add')"
                  >
                    Go to Methods
                  </v-btn>
                </v-col>
              </v-row>

            </div>
            <div class="clearfix"/>
          </form>
        </div>
      </v-card>
      <v-card v-else>
        <p>Adding recipes for mobile is still in development</p>
        <img
          src="img/patience_20200222.png"
          alt=""
          class="img-fluid" >
      </v-card>
    </v-container>
  </div>
</template>
<script>
import recipeApi from '@/api/recipe_api.js'
import recipeClass from '@/js/recipe_class.js'
import userApi from '@/api/users_api.js'
// import { CONST } from '@/api/const.js'
import utils from '@/js/utils.js'
// import axios from 'axios'

export default {
  data () {
    return {
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
      ],
      is_update: this.$route.query.id,
      title: null,
      description: null,
      ingredients: '',
      method: [
        {
          step: 1,
          description: ''
        }
      ],
      itemIng: [
        {
          ingredient: null,
          quantity: 0,
          quantity_type: ''
        }
      ],
      recipe: {},
      pic_path: null,
      recipeObj: new recipeClass(),
      error: '',
      file: '',
      man_title: false,
      man_desc: false,
      man_ing: false,
      man_step: false,
      rules: [
        value => !!value || 'Required.'
      ],
      item_types: [
        { text: '-' },
        { text: 'Grams' },
        { text: 'mL' },
        { text: 'Teaspoon/s' },
        { text: 'Tablespoon/s' },
        { text: 'Cup/s' },
        { text: 'Oz' }
      ],
      inputPage: 1
    }
  },
  async created () {
    try {
      // eslint-disable-next-line no-unused-vars
      let logToken = false
      let check_logged = await userApi.check_logged()
      console.log('Check Login: ', check_logged)
      if (check_logged.err) {
        this.$router.push('/?err=notLogged')
      } else {
        logToken = true
      }

      if (this.is_update) {
        try {
          this.recipeObj.in_param_2 = this.$route.query.id
          this.recipeObj.in_page = 1
          const search = await recipeApi.search(this.recipeObj.toJson())
          this.recipe = search.result[0][0]
          this.title = this.recipe.title
          this.description = this.recipe.description
          this.method = this.recipe.methods
          this.itemIng = this.recipe.ingredients
          this.pic_path = this.recipe.pic_path
        } catch (err) {
          this.error = err.message
        }
      }
    } catch (err) {
      this.error = err.message
    }
  },
  methods: {
    addNewItem () {
      this.itemIng.push({
        ingredient: null,
        quantity: 0,
        quantity_type: null
      })
    },

    addNewStep () {
      this.method.push({
        step: this.method.length + 1,
        description: null
      })
    },

    remove (item, index) {
      console.log(item.length)
      if (item.length > 1) {
        item.splice(index, 1)
      } else {
        alert('Cannot remove')
      }
    },

    async addRecipe () {
      console.log('Adding recipe...')
      let token = false
      let mandatory = await this.checkMandatory()
      if (!mandatory) {
        if (this.file) {
          console.log('Uploading picture...')
          try {
            let picture = await recipeApi.uploadPic(this.file)
            this.pic_path = picture.file.filename
            token = true
          } catch (err) {
            this.error = err.message
          }
        } else {
          token = true
        }

        if (token) {
          try {
            this.setClass()
            const add = await recipeApi.add(this.recipeObj.toJson())
            let nextPage = '/main/view_recipe?id=' + add[0].id
            this.$router.push(nextPage)
          } catch (err) {
            this.error = err.message
          }
        }
      }
    },

    async updateRecipe () {
      console.log('Updating recipe...')
      let token = false
      let mandatory = await this.checkMandatory()
      if (!mandatory) {
        if (this.file) {
          try {
            let picture = await recipeApi.uploadPic(this.file)
            this.pic_path = picture.file.filename
            token = true
          } catch (err) {
            this.error = err.message
          }
        } else {
          token = true
        }

        if (token) {
          try {
            this.setClass()
            this.recipeObj.in_param_1 = this.$route.query.id
            const update = await recipeApi.update(this.recipeObj.toJson())
            // console.log(update); //can be ignored
            let nextPage = '/main/view_recipe?id=' + update[0].id
            this.$router.push(nextPage)
          } catch (err) {
            this.error = err.message
          }
        }
      }
    },

    async deleteRecipe () {
      let token = false
      if (
        confirm(
          'This recipe will be deleted forever. Are you sure you want to proceed?'
        )
      ) {
        token = true
      }

      console.log('Deleting recipe...')
      if (token) {
        try {
          this.recipeObj.in_param_1 = this.$route.query.id
          await recipeApi.delete(this.recipeObj.toJson())
          let nextPage = '/recipe'
          this.$router.push(nextPage)
        } catch (err) {
          this.error = err.message
        }
      }
    },

    async setClass () {
      this.recipeObj.title = this.title
      this.recipeObj.description = this.description
      this.recipeObj.ingredients = this.itemIng
      this.recipeObj.methods = this.method
      this.recipeObj.pic_path = this.pic_path
    },

    async checkMandatory () {
      try {
        if (this.title == null || this.title.split('') < 1) {
          this.man_title = true
        } else {
          this.man_title = false
        }

        if (this.description == null || this.description.split('') < 1) {
          this.man_desc = true
        } else {
          this.man_desc = false
        }

        this.man_ing = await this.checkMandatoryId('ingredient')
        this.man_step = await this.checkMandatoryId('step')
      } catch (err) {
        this.error = err.message
      }

      if (this.man_desc || this.man_title || this.man_ing || this.man_step) {
        return true
      } else {
        return false
      }
    },

    async checkMandatoryId (setid) {
      let token = false
      let length = parseInt(document.getElementById(setid).rows.length) - 1
      for (var i = 0; i < length; i++) {
        let id = setid + '_' + i
        let el = document.getElementById(id)
        if (el.value == null || el.value.split('') < 1) {
          el.classList.add('border')
          el.classList.add('border-danger')
          token = true
        } else {
          el.classList.remove('border')
          el.classList.remove('border-danger')
        }
      }
      return token
    },

    onSelect () {
      const file = this.$refs.file.files[0]
      this.file = file
      console.log(this.file)
    },

    isMobile () {
      return utils.isMobile()
    },

    toIngTypeArray (in_type) {
      for (var i = 0; i < in_type.length; i++) {
        this.titles.push(this.formatWord(in_type[i].title))
      }
    },

    inpPage (choose) {
      if (choose === 'add') {
        this.inputPage++
        window.scrollTo(0, top)
      } else {
        this.inputPage--
        window.scrollTo(0, top)
      }
    }
  }
}
</script>
<style></style>
