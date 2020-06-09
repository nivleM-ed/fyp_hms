<template>
  <v-container>
    <v-row>
      <v-row>
        <v-col cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-1" max-width="200">
                <v-img
                  src="img/wash_clothes.jpg"
                  height="100"
                ></v-img>
                <v-card-title>
                  <h2 class="title primary--text text-center">Do Laundry</h2>
                </v-card-title>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click.prevent="addTask('doLaundry')"
                    color="green darken-4"
                      >Add Task</v-btn
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-1" max-width="200">
                <v-img
                  src="img/cooking.jpg"
                  height="100"
                ></v-img>
                <v-card-title>
                  <h2 class="title primary--text text-center">Prepare Meal</h2>
                </v-card-title>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click.prevent="addTask('prepareMeal')"
                    color="green darken-4"
                      >Add Task</v-btn
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-1" max-width="200">
                <v-img
                  src="img/shopping.jpg"
                  height="100"
                ></v-img>
                <v-card-title>
                  <h2 class="title primary--text text-center">Buy Groceries</h2>
                </v-card-title>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click.prevent="addTask('buyGroceries')"
                    color="green darken-4"
                      >Add Task</v-btn
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-1" max-width="200">
                <v-img
                  src="img/trash.jpg"
                  height="100"
                ></v-img>
                <v-card-title>
                  <h2 class="title primary--text text-center">
                    Take out Trash
                  </h2>
                </v-card-title>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click.prevent="addTask('takeTrash')"
                    color="green darken-4"
                      >Add Task</v-btn
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-1" max-width="200">
                <v-img
                  src="img/water_plants.jpg"
                    height="100"
                ></v-img>
                <v-card-title>
                  <h2 class="title primary--text text-center">Water Plants</h2>
                </v-card-title>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click.prevent="addTask('waterPlants')"
                    color="green darken-4"
                      >Add Task</v-btn
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-1" max-width="200">
                <v-img
                  src="img/clean_room.jpg"
                  height="100"
                ></v-img>
                <v-card-title>
                  <h2 class="title primary--text text-center">
                    Clean Room
                  </h2>
                </v-card-title>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click.prevent="addTask('cleanRoom')"
                    color="green darken-4"
                    >Add Task</v-btn>
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "recommendAddTask",
  data() {
    return {};
  },
  async created() {},
  methods: {
    addTask(type) {
      let task = {};
      switch (type) {
        case "doLaundry":
          task.name = "Do Laundry";
          task.one_day = true;
          task.whole_day = false;
          task.description = "Wash the dirty clothes";
          task.start_time = "12:00"
          task.end_time = "14:00"
          break;
        case "prepareMeal":
          task.name = "Prepare Meal";
          task.one_day = true;
          task.whole_day = false;
          task.description = "Cook dishes for breakfast/lunch/dinner";
          break;
        case "buyGroceries":
          task.name = "Buy Groceries";
          task.one_day = true;
          task.whole_day = false;
          task.description = "Buy groceries for food inventory";
          break;
        case "takeTrash":
          task.name = "Take out thrash";
          task.one_day = true;
          task.whole_day = false;
          task.description = "Throw out the smelly rubbish";
          break;
        case "waterPlants":
          task.name = "Water the plants";
          task.one_day = true;
          task.whole_day = false;
          task.description = "Water the plants that is needed for transporting nutrient thorughout the plant";
          break;
        case "cleanRoom":
          task.name = "Clean the living room";
          task.one_day = true;
          task.whole_day = false;
          task.description = "Clean the living room so it is not dusty and dirty";
          break;
      }
      this.$emit("selectAddTask", task);
    },
  },
};
</script>
<style></style>
