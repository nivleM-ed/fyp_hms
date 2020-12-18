<template>
  <div class="p-4">
    <addUpdateTaskDialog
      :addUpdateMenu.sync="addListToTask"
      :shopping_list.sync="shopping_list_items_inner"
      v-on:addTask="addToTask"
    />

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
          <v-btn color="green" text @click="deleteShoppingItem()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog to confirm shopping list deletion -->
    <v-dialog v-model="deleteAuth2" width="500">
      <v-card>
        <v-card-text class="p-4">
          Are you sure you want to delete this list?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteAuth2 = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="deleteList()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog to add shopping list -->
    <v-dialog v-model="addShoppingItem" width="500">
      <v-card>
        <v-card-text class="p-4">
          <p>Enter list name:</p>

          <v-text-field
            v-model="listName"
            label="Name"
            placeholder="Name"
            :rules="inputRules"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="addShoppingItem = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="newShoppingList(listName)">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog to add shopping list item-->
    <v-dialog v-model="addShoppingItem2" width="500">
      <v-card>
        <v-card-text class="p-4">
          <p>Item: {{ shopping_list_items_inner.name }}</p>

          <v-text-field
            v-model="editedItem.name"
            label="Name"
            placeholder="Name"
            :rules="inputRules"
            required
          ></v-text-field>

          <v-text-field
            v-model="editedItem.description"
            label="Description"
            placeholder="Description"
            :rules="inputRules"
            required
          ></v-text-field>

          <v-text-field
            v-model="editedItem.shoplist_quantity"
            label="Quantity"
            placeholder="Quantity"
            :rules="inputRulesNum"
            required
          ></v-text-field>

          <v-select
            :items="utils.toFirstUpperCase(all_categories, true)"
            label="Quantity Type"
            v-model="editedItem.category"
            outlined
            :rules="inputRules"
            class="ma-2"
            required
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="addShoppingItem2 = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="addToList()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog to edit item quantity -->
    <v-dialog v-model="editQuant" width="500">
      <v-card>
        <v-toolbar :color="editedItem.color" dark>
          <span class="headline">Edit Quantity - {{ editedItem.name }}</span>
          <v-spacer></v-spacer>

          <v-btn icon @click="editQuant = !editQuant" class="float-right">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="p-4">
          <v-row>
            <v-col>
              <v-text-field
                v-model="editedItem.shoplist_quantity"
                label="Quantity"
                placeholder="Food Quantity"
                :rules="inputRulesNum"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                :items="editedItem.category"
                label="Quantity Type"
                v-model="editedItem.category"
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
          <v-btn color="red darken-1" text @click="editQuant = false"
            >Cancel</v-btn
          >
          <v-btn color="green" text @click="save()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- main UI -->
    <div>
      <v-flex>
        <v-card flat min-height="70vh">
          <v-row>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="success"
                  dark
                  v-if="shopping_list_items.length > 0"
                  v-on="on"
                  @click.prevent="addShoppingItem = true"
                >
                  Add New List
                </v-btn>
              </template>
              <span>Add New List</span>
            </v-tooltip>
          </v-row>
          <v-row>
            <v-col v-if="shopping_list_items.length > 0">
              <v-row>
                <v-card width="100%" min-height="55vh" flat>
                  <v-list dense>
                    <v-list-item-group v-model="item" color="primary">
                      <v-list-item
                        v-for="(item, index) in shopping_list_items"
                        :key="index"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-row>
                              <v-col>
                                <span>{{
                                  utils.toFirstUpperCase(item.name, false)
                                }}</span>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card>
              </v-row>
              <v-flex text-xs-center>
                <v-pagination
                  class="m-2"
                  v-model="shopping_list_page"
                  :length="shopping_list_total_page"
                  circle
                  v-if="shopping_list_total_page > 1"
                />
              </v-flex>
            </v-col>
            <v-col v-else class="col-5">
              <v-card height="60vh" flat>
                <v-container fill-height fluid>
                  <v-row align="center" justify="center">
                    <v-col class="text-center">
                      <p>
                        You have no shopping list for now. <br />
                        Click the button to add a new shopping list.
                      </p>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            v-on="on"
                            @click.prevent="addShoppingItem = true"
                          >
                            Add Shopping List
                          </v-btn>
                        </template>
                        <span>Add Shopping List</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>

            <v-divider class="mx-4" vertical></v-divider>

            <v-col>
              <v-card height="100%" flat min-height="70vh">
                <v-expand-transition>
                  <v-card v-show="showItems" flat outlined height="65vh">
                    <v-card-title>
                      <p v-if="shopping_list_items_inner">
                        {{ utils.toFirstUpperCase(shopping_list_items_inner.name) }}
                      </p>
                    </v-card-title>
                    <v-card-text>
                      <p v-if="!shopping_list_items_inner.task_id">
                        This shopping list has not been added to your tasklist.
                      </p>
                      <p v-else>
                        You have added this shopping list to your tasklist.
                        <span v-if="shopping_list_items_inner.completed"> The task related to this shopping list has been completed.</span>
                      </p>
                      <v-btn
                        color="green"
                        v-if="!shopping_list_items_inner.task_id"
                        @click="addListToTask = true"
                        >Add to Task</v-btn
                      >
                      <v-btn color="yellow" v-else @click="viewTask()"
                        >View Task</v-btn
                      >
                      <v-btn
                      v-if="!shopping_list_items_inner.completed"
                        color="blue"
                        class="ml-2"
                        @click="addShoppingItem2 = true"
                        >Add Item to List</v-btn
                      >
                      <v-btn
                        class="ml-2"
                        color="red"
                        @click="deleteAuth2 = true"
                        >Delete List</v-btn
                      >
                    </v-card-text>
                    <v-card class="p-4" flat height="40vh">
                      <v-data-table
                        :headers="headers"
                        :items="shopping_list_items_inner.data"
                        sort-by="quantity"
                        hide-default-footer
                        :items-per-page="5"
                        :page.sync="page"
                        @page-count="pageCount = $event"
                        :search="search"
                        :single-expand="true"
                        :expanded.sync="expanded"
                        show-expand
                      >
                        <template v-slot:[`item.quantity`]="{ item }">
                          <v-chip dark>{{ item.quantity }}</v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-tooltip left>
                            <template v-slot:activator="{ on: tooltip }">
                              <v-icon
                                small
                                color="blue"
                                class="mr-2"
                                v-on="{ ...tooltip }"
                                @click="editShopListItem(item)"
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
                        </template>
                        <template v-slot:no-data>
                          <span>No Items Added</span><br /><br />
                        </template>
                        <template v-slot:expanded-item="{ headers, item }" >
                          <td :colspan="headers.length" class="p-2">
                            <v-sheet
                              color="rgba(0, 0, 0, .12)"
                              class="p-2"
                            >
                              <b>Food:</b>
                              {{ utils.toFirstUpperCaseInner(item.name) }}
                              <br />
                              <b>Description:</b>
                              {{
                                utils.toFirstUpperCaseInner(item.description)
                              }}
                              <br />
                              <b>Date created:</b>
                              {{
                                utils.momentFormatDate(false, item.date_created)
                              }}
                              <br />
                              <b>Quantity:</b> {{ item.shoplist_quantity }}
                              <br />
                              <b>Quantity Type:</b> {{ item.category }}
                            </v-sheet>
                          </td>
                        </template>
                      </v-data-table>
                    </v-card>
                    <div class="text-center mb-4">
                      <v-pagination
                        v-model="page"
                        :length="pageCount"
                      ></v-pagination>
                    </div>
                  </v-card>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-flex>
    </div>
  </div>
</template>
<script>
// const moment = require("moment");
import utils from "@/js/utils.js";
import addUpdateTaskDialog from "@/components/addUpdateTaskDialog";
// import { CONST } from "@/js/const.js";

export default {
  name: "ShoppingList",
  components: { addUpdateTaskDialog },
  data() {
    return {
      utils: utils,
      page: 1,
      pageCount: 0,
      inputRules: [(v) => !!v || "Required!"],
      inputRulesNum: [
        (v) => !!v || "Required!",
        (v) => !isNaN(v) || "Must be a number!",
      ],
      headers: [
        {
          text: "Food ",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Quantity", value: "shoplist_quantity" },
        { text: "Type", value: "category" },
        { text: "Actions", value: "actions", sortable: false },
        { text: "", value: "data-table-expand" },
      ],
      editedIndex: -1,
      editedItem: {
        name: "",
        description: null,
        quantity: null,
        category: "",
        shoplist_quantity: 0,
        color: "#228B22",
      },
      defaultItem: {
        name: "",
        description: null,
        quantity: null,
        category: "",
        shoplist_quantity: 0,
        color: "#228B22",
      },
      deleteAuth: false,
      deleteAuth2: false,
      addShoppingItem: false,
      addShoppingItem2: false,
      addListToTask: false,
      editQuant: false,
      shopping_list_items: [],
      shopping_list_page: 1,
      shopping_list_total_page: 1,
      shopping_list_items_inner: [],
      item: null,
      showItems: false,
      listName: null,
    };
  },
  props: ["food", "shopping_list", "all_categories"],
  async created() {
    this.shopping_list_items =
      this.shopping_list == null ? [] : this.shopping_list;
    if (this.shopping_list_items.length > 0) {
      let id = this.$route.query.id == null ? 0 : this.$route.query.id;
      this.item = this.shopping_list_items.findIndex((x) => x.id == id) == -1 ? 0 : this.shopping_list_items.findIndex((x) => x.id == id);
      this.shopping_list_items_inner = this.shopping_list_items[this.item];
      this.showItems = true;
    }
    
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  methods: {
    setTmpItem(item, type) {
      if (type === "delete") {
        this.foodTmp = item;
        this.deleteAuth = true;
      } else if (type === "list") {
        this.shoppingListTmp = item;
        this.addList = true;
        this.shoppingListTmp.add_quantity = 0;
      }
    },

    async save() {
      let editedItem = JSON.parse(JSON.stringify(this.editedItem));
      if (this.editedIndex > -1) {
        this.editedItem.date_editted = new Date();
        Object.assign(
          this.shopping_list_items[this.item].data[this.editedIndex],
          editedItem
        );
      }
      await this.updateShoppingList();
      this.editQuant = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async deleteShoppingItem() {
      this.deleteAuth = false;
      const index = this.shopping_list_items[this.item].data.findIndex(
        (x) => x.id === this.foodTmp.id
      );
      this.shopping_list_items[this.item].data.splice(index, 1);
      this.foodTmp = null;
      await this.updateShoppingList();
    },

    async updateShoppingList() {
      this.$emit("updateShoppingList", this.shopping_list_items);
    },

    async editShopListItem(item) {
      this.editedIndex = this.shopping_list_items[this.item].data.findIndex(
        (x) => x.id === item.id
      );
      this.editedItem = Object.assign({}, item);
      this.editQuant = true;
      // await this.updateShoppingList();
    },

    async newShoppingList(data) {
      let id = await utils.getHashId(`${Date.now()}-${JSON.stringify(data)}`);
      this.shopping_list_items.push({ id: id, name: data, data: [] });
      await this.updateShoppingList();
      this.addShoppingItem = false;
      this.item = this.shopping_list_items.length - 1;
      this.$emit("viewAlert", {type:"add_shopping_list",data:data});
    },

    async addToList() {
      let editedItem = JSON.parse(JSON.stringify(this.editedItem));
      let id = await utils.getHashId(
        `${Date.now()}-${JSON.stringify(editedItem)}`
      );
      editedItem.id = id;
      this.shopping_list_items[this.item].data.push(editedItem);

      await this.updateShoppingList();
      this.addShoppingItem2 = false;
      this.editedItem = Object.assign({}, this.defaultItem);
    },

    addToTask(data) {
      this.$emit("addToTask", data);
    },

    async deleteList() {
      this.shopping_list_items.splice(this.item, 1);
      this.item = this.item - 1;
      await this.updateShoppingList();
      this.deleteAuth2 = false;
      this.$emit("viewAlert", {type:"delete_shopping_list",data:this.editedItem});
    },

    viewTask() {
      let task_id = this.shopping_list_items_inner.task_id;
      let url = "";
      if(this.shopping_list_items_inner.completed) url = "/main/task_ov?tab=1&task_id=" + task_id;
      else url = "/main/task_ov?task_id=" + task_id;
      this.$router.push(url);
    },
  },
  watch: {
    item(val) {
      if (val == null) {
        this.showItems = false;
        this.$nextTick(() => {
          this.shopping_list_items_inner = null;
        });
      } else {
        this.shopping_list_items_inner = this.shopping_list_items[val];
        this.$nextTick(() => {
          this.showItems = true;
        });
      }
    },
    shopping_list(val) {
      this.shopping_list_items = val == null ? [] : val;
      if(val != null) this.shopping_list_items_inner = this.shopping_list_items[this.item];
      console.log(this.shopping_list_items_inner)
    },
  },
};
</script>
<style></style>
