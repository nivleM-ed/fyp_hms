<template>
  <div class="m-4">
    <v-flex>
      <v-card flat min-height="60vh">
        <v-row>
          <v-col v-if="tasks.length != 0" class="col-5">
            <v-row>
              <v-col>
                <v-row>
                  <v-autocomplete
                    v-model="select"
                    :append-outer-icon="'mdi-send'"
                    :loading="loading"
                    :items="items"
                    :search-input.sync="search"
                    ref="task_search"
                    class="mx-4"
                    flat
                    hide-no-data
                    hide-details
                    label="Search tasks"
                    solo-inverted
                    ><template slot="append-outer">
                      <v-icon @click="resetSearch()" v-if="cancel_icon"
                        >mdi-close-box</v-icon
                      >
                      <v-icon @click="searchTask()">mdi-send</v-icon>
                    </template></v-autocomplete
                  >
                </v-row>
                <v-row>
                  <v-col>
                    <v-sheet height="64">
                      <v-toolbar flat color="white">
                        <v-btn outlined class="mr-4" @click="setToday">
                          Today
                        </v-btn>
                        <v-btn
                          fab
                          text
                          small
                          color="grey darken-2"
                          @click="date_pick = utils.prevDay(date_pick)"
                        >
                          <v-icon small>mdi-chevron-left</v-icon>
                        </v-btn>

                        <v-menu
                          ref="date_menu"
                          v-model="date_menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn outlined v-on="on">{{ date }}</v-btn>
                          </template>
                          <v-date-picker
                            v-model="date_pick"
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="date_menu = false"
                              >Cancel</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="$refs.date_menu.save(date_pick)"
                              >OK</v-btn
                            >
                          </v-date-picker>
                        </v-menu>

                        <v-btn
                          fab
                          text
                          small
                          color="grey darken-2"
                          @click="date_pick = utils.nextDay(date_pick)"
                        >
                          <v-icon small>mdi-chevron-right</v-icon>
                        </v-btn>
                      </v-toolbar>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card width="100%" min-height="55vh" flat>
                <v-list dense width="100%">
                  <v-list-item-group v-model="item" color="primary">
                    <v-list-item
                      v-for="(task, index) in show_task"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-row>
                            <v-col>
                              <span>{{ task.name }}</span>
                            </v-col>
                            <v-col
                              ><b>Started on: </b
                              >{{
                                utils.momentFormatDate(false, task.start_date)
                              }}</v-col
                            >
                            <v-col
                              ><b>Completed on: </b
                              >{{
                                utils.momentFormatDate(
                                  false,
                                  task.completed_date
                                )
                              }}</v-col
                            >
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
                v-model="task_page"
                :length="task_total_page"
                circle
                v-if="task_total_page > 1"
              />
            </v-flex>
          </v-col>
          <v-col v-else class="col-4">
            <v-card v-show="!taskDetailsShow" height="60vh" flat>
              <v-container fill-height fluid>
                <v-row align="center" justify="center">
                  <v-col class="text-center">
                    <p>
                      You have not completed any task yet.
                    </p>
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="success"
                          dark
                          v-on="on"
                          @click.prevent="openTab(0)"
                        >
                          Add Task
                        </v-btn>
                      </template>
                      <span>Add Task</span>
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
                <v-card v-show="!taskDetailsShow" height="60vh" flat>
                  <v-container fill-height fluid>
                    <v-row align="center" justify="center">
                      <v-col>
                        <p class="text-center">
                          Click on any task to see the details
                        </p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-expand-transition>
              <viewTask
                :selectedTaskInner="selectedTaskInner"
                :completed="true"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import { CONST } from "@/js/const.js";
import viewTask from "@/components/viewTask";

export default {
  name: "TaskView",
  components: { viewTask },
  data() {
    return {
      cancel_icon: false,
      utils: utils,
      completeAuth: false,
      taskDetailsShow: false,
      task_day: {},
      loading: false,
      items: [],
      search: null,
      select: null,
      task_page: 1,
      task_total_page: 1,
      selectedTaskInner: null,
      addRecTask: {},

      item: null,
      show_task: [],
      date_pick: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),
    };
  },
  props: [
    "tasks",
    "task_list",
    // "selectedTask",
    "selectedEvent",
    "tasks_formatted",
  ],
  async created() {
    await this.getComTaskDay();
  },
  methods: {
    async setTaskPages(page) {
      try {
        await this.getComTaskDay();
        if (this.task_day.length > 0) {
          this.task_total_page = Math.ceil(
            this.task_day.length / CONST.CONST_page_limit
          );
          if (page <= this.task_total_page) {
            this.show_task = this.task_day.slice(
              CONST.CONST_page_limit * (page - 1),
              CONST.CONST_page_limit * page
            );

            this.task_page = parseInt(page);
          } else {
            this.show_task = this.task_day.slice(
              CONST.CONST_page_limit * (this.task_total_page - 1),
              CONST.CONST_page_limit * this.task_total_page
            );
            this.task_page = parseInt(this.task_total_page);
          }
        } else {
          this.show_task = null;
        }
      } catch (err) {
        console.log(err);
      }
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    setDetails(created, id) {
      try {
        if (created) {
          for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == id) {
              this.item = i;
            }
          }
        } else {
          this.selectedTaskInner = this.show_task[id];
        }
      } catch (err) {
        console.log(err);
      }
    },
    querySelections(v) {
      try {
        this.loading = true;
        setTimeout(() => {
          this.items = this.task_list.filter((e) => {
            return (
              (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
            );
          });
          this.loading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },
    async resetSearch() {
      try {
        this.cancel_icon = false;
        this.select = null;
        this.search = null;
        this.item = null;
        await this.setTaskPages(1);
      } catch (err) {
        console.log(err);
      }
    },
    searchTask() {
      //to be changed
      try {
        this.show_task = [];
        this.show_task = this.tasks.reduce((data, x) => {
          if (x.name == this.search) {
            data.push(x);
          }
          return data;
        }, []);

        this.item = 0;
      } catch (err) {
        console.log(err);
      }
    },
    async getComTaskDay() { 
      try {
        if (this.tasks_formatted && this.tasks_formatted.length > 0) { 
          let {
            year_index,
            month_index,
            day_index,
            data_index,
          } = await this.findIndexFromDateOrId(this.date_pick, null);

          if (day_index < 0) this.task_day = [];
          else
            this.task_day = this.tasks_formatted[year_index].data[
              month_index
            ].data[day_index].data == null ? [] : this.tasks_formatted[year_index].data[
              month_index
            ].data[day_index].data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async findIndexFromDateOrId(date, id) {
      try {
        let { day, month, year } = await utils.getSeperateDate(new Date(date));

        let year_index = this.tasks_formatted.findIndex((x) => x.year == year);
        let month_index = this.tasks_formatted[year_index].data.findIndex(
          (x) => x.month == month
        );
        let day_index = this.tasks_formatted[year_index].data[
          month_index
        ].data.findIndex((x) => x.day == day);
        let data_index =
          id == null
            ? -1
            : this.tasks_formatted[year_index].data[month_index].data[
                day_index
              ].data.findIndex((x) => x.id == id);

        return { year_index, month_index, day_index, data_index };
      } catch (err) {
        console.log(err);
      }
    },
    async checkPage(find) {
      try {
        // this.$emit("updateData", 1);
        let {
          year_index,
          month_index,
          day_index,
          data_index,
        } = await this.findIndexFromDateOrId(find.completed_date, find.id);
        console.log(year_index, month_index, day_index, data_index);
        this.date_pick = find.completed_date;
        for (var i = 1; i <= this.task_total_page; i++) {
          await this.setTaskPages(i);
          const tmpShowTask = this.show_task.findIndex((x) => x.id === find.id);
          if (tmpShowTask > -1) {
            return tmpShowTask;
          }
        }
        return -1; //should never happen
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    openTab(tab) {
      this.$emit("changeTab", tab);
    },
    setToday() {
      this.date_pick = this.today;
    },
  },
  computed: {
    date() {
      return utils.momentFormatDate(false, this.date_pick);
    },
  },
  watch: {
    item: async function(val) {
      this.getComTaskDay();
      if (val == null) {
        this.selectedTaskInner = null;
      } else {
        this.setDetails(false, val);
      }
    },
    date_pick: async function() {
      await this.resetSearch();
      this.item = null;
      // this.setTaskPages(1);
    },
    itemOuter: async function(val) {
      this.item = val;
    },
    search(val) {
      if (val != null) {
        this.cancel_icon = true;
      }
      val && val !== this.select && this.querySelections(val);
    },
    selectedTaskInner() {
      try {
        if (this.selectedTaskInner) {
          this.taskDetailsShow = true;
        } else {
          this.taskDetailsShow = false;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async selectedEvent(val) {
      this.item = await this.checkPage(val.selectedEvent);
    },
    async task_page(val) {
      this.item = null;
      await this.setTaskPages(val);
    },
    tasks() {
      this.setTaskPages(this.task_page);
    },
  },
};
</script>
<style></style>
