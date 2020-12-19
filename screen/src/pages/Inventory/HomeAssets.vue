<template>
  <div class="m-4" ref="ovref">
    <v-overlay :absolute="true" :value="addMenu"></v-overlay>
    <v-menu v-model="addMenu" :position-x="x" :position-y="y" z-index="100">
      <v-card>
        <v-form ref="form" class="p-4" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :counter="10"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-btn color="success" class="mr-4" @click="validate">
            Validate
          </v-btn>
        </v-form>
      </v-card>
    </v-menu>

    <v-card flat>
      <v-card-title class="headline">Inventory - Home Assets</v-card-title>
      <v-row>
        <v-col class="col-4">
          <!-- <v-card-title class="headline">Home Assets</v-card-title> -->
          <v-list dense>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item v-for="asset in assets" :key="asset.id">
                <v-list-item-content>
                  <v-list-item-title v-text="asset.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-flex text-xs-center>
            <v-pagination
              class="m-2"
              v-model="page"
              :length="total_page"
              circle
            />
          </v-flex>
        </v-col>

        <v-divider class="mx-4" vertical></v-divider>

        <v-col>
          <v-card height="100%" min-height="60vh">
            <p v-if="test" class="text-center">{{ test }}</p>
            <p v-else class="text-center">
              Click on an asset to see the details
            </p>
            <!-- Add to show details of assets -->
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              color="success"
              dark
              v-on="on"
              class="m-4 text-right"
              @click.prevent="addMenu = !addMenu"
            >
              Add Task
            </v-btn>
          </template>
          <span>Add new task</span>
        </v-tooltip>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addMenu: false,
      x: 0,
      y: 0,
      page: 1,
      total_page: 1,
      test: null,
      item: 1,
      assets: [
        {
          name: "Frozen Yogurt",
          id: 159,
        },
        {
          name: "Ice cream sandwich",
          id: 237,
        },
        {
          name: "Eclair",
          id: 262,
        },
        {
          name: "Cupcake",
          id: 305,
        },
        {
          name: "Gingerbread",
          id: 356,
        },
        {
          name: "Jelly bean",
          id: 375,
        },
        {
          name: "Lollipop",
          id: 392,
        },
        {
          name: "Honeycomb",
          id: 408,
        },
        {
          name: "Donut",
          id: 452,
        },
        {
          name: "KitKat",
          id: 518,
        },
      ],
      food: [],
    };
  },
  async created() {
    // this.test = this.$route.query.id;
    this.item = parseInt(this.$route.query.id);
    this.setDetails(true, this.$route.query.id);
    //axios to get data for assets
  },
  mounted: function() {
    document.documentElement.style.overflow = "auto";
    var rect = this.$refs.ovref.getBoundingClientRect();
    this.x = rect.width / 2 - 100;
    this.y = rect.height / 2 - 100;
  },
  methods: {
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    setDetails(created, id) {
      if (created) {
        for (var i = 0; i < this.assets.length; i++) {
          if (this.assets[i].id == id) {
            this.item = i;
          }
        }
      } else {
        this.test = this.assets[id].name;
      }
    },
  },
  watch: {
    item: async function(val) {
      console.log(val);
      if (val == null) {
        this.test = null;
      } else {
        this.setDetails(false, val);
      }
    },
  },
};
</script>
<style></style>
