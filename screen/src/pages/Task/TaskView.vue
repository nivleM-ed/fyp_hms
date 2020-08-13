<template>
  <div class="m-4">
    <addUpdateTaskDialog
      :addUpdateMenu.sync="addUpdateMenu"
      :addRecTask="addRecTask"
      :selectedTaskInner="selectedTaskInner"
      v-on:addTask="addTask"
      v-on:updateTask="updateTask"
      v-on:deleteTask="deleteTask"
    />

    <v-flex>
      <v-card flat min-height="60vh">
        <v-row>
          <v-col v-if="tasks.length != 0" cols="5">
            <v-row>
              <v-col cols="9">
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
              </v-col>
              <v-col cols="3">
                <v-tooltip right v-if="tasks.length != 0">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="success"
                      dark
                      large
                      v-on="on"
                      class="text-right"
                      @click.prevent="openAddMenu()"
                    >
                      Add Task
                    </v-btn>
                  </template>
                  <span>Add new task</span>
                </v-tooltip>
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
                              <v-badge
                                color="pink"
                                dot
                                v-if="checkNotifyTime(task)"
                              >
                                <span>{{
                                  utils.toFirstUpperCase(task.name, false)
                                }}</span>
                              </v-badge>
                              <span v-else>{{
                                utils.toFirstUpperCase(task.name, false)
                              }}</span>
                            </v-col>
                            <v-col>
                              <span>
                                {{
                                  utils.momentFormatDate(false, task.start_date)
                                }}</span
                              >
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
                v-model="task_page"
                :length="task_total_page"
                circle
                v-if="task_total_page > 1"
              />
            </v-flex>
          </v-col>
          <v-col v-else class="col-5">
            <v-card v-show="!taskDetailsShow" height="60vh" flat>
              <v-container fill-height fluid>
                <v-row align="center" justify="center">
                  <v-col class="text-center">
                    <p>
                      You have no tasks for now. <br />
                      Click the button to add a new task.
                    </p>
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="success"
                          dark
                          v-on="on"
                          @click.prevent="addUpdateMenu = true"
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
                      <h1 class="text-center">
                        Recommended Task
                      </h1>
                    </v-row>
                    <recommendAddTask v-on:selectAddTask="selectAddTask" />
                  </v-container>
                </v-card>
              </v-expand-transition>
              <viewTask
                :selectedTaskInner="selectedTaskInner"
                v-on:updateButton="updateButton"
                v-on:completeTask="completeTask"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
const moment = require("moment");
import utils from "@/js/utils.js";
import { CONST } from "@/js/const.js";

import recommendAddTask from "@/components/recommendAddTask";
import addUpdateTaskDialog from "@/components/addUpdateTaskDialog";
import viewTask from "@/components/viewTask";

export default {
  name: "TaskView",
  components: { recommendAddTask, addUpdateTaskDialog, viewTask },
  data() {
    return {
      cancel_icon: false,
      tab_open: 0,
      tab_open_clone: 0,
      utils: utils,
      // completeAuth: false,
      taskDetailsShow: false,
      addUpdateMenu: false,
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
    };
  },
  props: [
    "timestamp",
    "notifications",
    "logged",
    "tasks",
    "task_list",
    "selectedTask",
    "selectedEvent",
  ],
  async created() {
    // this.$emit("checkLogged");
    // this.setTaskPages(1);
  },
  methods: {
    openAddMenu() {
      try {
        if (this.selectedTaskInner) {
          this.item = null;
          setTimeout(() => {
            this.addUpdateMenu = true;
          }, 500);
        } else {
          this.addUpdateMenu = true;
        }
      } catch (err) {
        console.log(err);
      }
    },
    checkNotifyTime(selectedTask) {
      try {
        const past = "ago";
        const tmp = moment(selectedTask.start, "YYYYMMDD HH:mm").fromNow();
        if (tmp.includes(past)) {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    async setTaskPages(page) {
      try {
        if (this.tasks) {
          this.task_total_page = Math.ceil(
            this.tasks.length / CONST.CONST_page_limit
          );
          if (page <= this.task_total_page) {
            this.show_task = this.tasks.slice(
              CONST.CONST_page_limit * (page - 1),
              CONST.CONST_page_limit * page
            );

            this.task_page = parseInt(page);
          } else {
            this.show_task = this.tasks.slice(
              CONST.CONST_page_limit * (this.task_total_page - 1),
              CONST.CONST_page_limit * this.task_total_page
            );
            this.task_page = parseInt(this.task_total_page);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async completeTask(selectedTask) {
      this.$emit("completeTask", selectedTask);
      await this.setTaskPages(this.task_page);
      // this.completeAuth = false;
    },
    async deleteTask(selectedTask) {
      this.$emit("deleteTask", selectedTask);
    },
    async addTask(selectedTask) {
      this.$emit("addTask", selectedTask);
    },
    async updateTask(selectedTask) {
      this.$emit("updateTask", selectedTask);
    },
    async updateButton() {
      this.addUpdateMenu = true;
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
    async checkPage(find) {
      // this.$emit("updateData", 1);
      try {
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
    selectAddTask(task) {
      this.addRecTask = task;
      this.addUpdateMenu = true;
    },
  },
  watch: {
    item: async function(val) {
      if (val == null) {
        this.selectedTaskInner = null;
      } else {
        this.setDetails(false, val);
      }
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
      if (this.selectedTaskInner) {
        this.taskDetailsShow = true;
      } else {
        this.taskDetailsShow = false;
      }
    },
    async selectedTask(val) {
      if (val) {
        this.item = null;
        let index = await this.checkPage(val);
        this.item = index < -2 ? null : index;
      } else {
        this.selectedTaskInner = null;
      }
    },
    async selectedEvent(val) {
      this.item = await this.checkPage(val.selectedEvent);
      if (val.isUpdate) {
        setTimeout(() => {
          this.selectedTaskInner = val.selectedEvent;
          this.addUpdateMenu = true;
        }, 100);
      }
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
