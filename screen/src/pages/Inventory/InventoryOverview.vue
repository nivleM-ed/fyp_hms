<template>
  <div class="m-2">
    <v-card flat>
      <v-card-title class="headline">Inventory</v-card-title>
      <v-row>
        <v-col>
          <v-row>
            <v-col class="mx-4 mt-n4">
              <material-stats-card
                color="green"
                icon="mdi-store"
                title="Total Assets"
                value="30"
                sub-icon="mdi-calendar"
                sub-text="Last 24 Hours"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-4 mt-n8">
              <v-flex md12 sm12 lg8>
                <material-chart-card
                  :data="dailySalesChart.data"
                  :options="dailySalesChart.options"
                  color="info"
                  type="Line"
                >
                  <h4 class="title font-weight-light">Total Asset Value</h4>
                  <p class="category d-inline-flex font-weight-light">
                    <v-icon color="green" small>
                      mdi-arrow-up
                    </v-icon>
                    <span class="green--text">55%</span>&nbsp; increase in
                    today's sales
                  </p>

                  <template slot="actions">
                    <v-icon class="mr-2" small>
                      mdi-clock-outline
                    </v-icon>
                    <span class="caption grey--text font-weight-light"
                      >updated 4 minutes ago</span
                    >
                  </template>
                </material-chart-card>
              </v-flex>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-card class="ml-4" flat>
            <v-card-title class="headline">Home Assets</v-card-title>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Assets</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in desserts" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            text
                            small
                            v-on="on"
                            @click="toPage('inv_assets', item.id)"
                          >
                            View Details
                          </v-btn>
                        </template>
                        <span>Click to view details</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="success"
                  dark
                  v-on="on"
                  class="m-4 text-right"
                  @click="toPage('inv_assets')"
                >
                  View More
                </v-btn>
              </template>
              <span>Click to view more</span>
            </v-tooltip>
          </v-card>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col>
          <v-card class="mr-4" flat>
            <v-card-title class="headline">Food Inventory</v-card-title>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Ingredient</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in desserts" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            text
                            small
                            v-on="on"
                            @click="toPage('inv_assets', item.id)"
                          >
                            View Details
                          </v-btn>
                        </template>
                        <span>Click to view details</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="success"
                  dark
                  v-on="on"
                  class="m-4 text-right"
                  @click="toPage('inv_food')"
                >
                  View More
                </v-btn>
              </template>
              <span>Click to view more</span>
            </v-tooltip>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      desserts: [
        {
          name: "Frozen Yogurt",
          id: 159
        },
        {
          name: "Ice cream sandwich",
          id: 237
        },
        {
          name: "Eclair",
          id: 262
        },
        {
          name: "Cupcake",
          id: 305
        },
        {
          name: "Gingerbread",
          id: 356
        },
        {
          name: "Jelly bean",
          id: 375
        },
        {
          name: "Lollipop",
          id: 392
        },
        {
          name: "Honeycomb",
          id: 408
        },
        {
          name: "Donut",
          id: 452
        },
        {
          name: "KitKat",
          id: 518
        }
      ],
      assets: [],
      food: []
    };
  },
  async created() {
    //axios to get data for inventory overview
  },
  mounted: function() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    toPage(page, id) {
      var tmp = "";
      if (id) {
        tmp = "/main/" + page + "?id=" + id;
      } else {
        tmp = "/main/" + page;
      }

      this.$router.push(tmp);
    }
  }
};
</script>
<style></style>
