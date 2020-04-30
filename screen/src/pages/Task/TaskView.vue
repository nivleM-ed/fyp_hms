<template>
  <div class="m-4">
    <v-overlay :value="addUpdateMenu"></v-overlay>

    <v-dialog v-model="addUpdateMenu" persistent max-width="600px">
      <v-card color="grey lighten-4" min-width="600px" flat>
        <v-toolbar :color="new_task.color" dark>
          <v-toolbar-title v-if="!isUpdate">New Task</v-toolbar-title>
          <v-toolbar-title v-else>Update Task</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-menu offset-y>
            <template v-slot:activator="{ on: menu }">
              <v-tooltip left>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    icon
                    v-on="{ ...tooltip, ...menu }"
                    class="float-right"
                  >
                    <v-icon>mdi-format-color-fill</v-icon>
                  </v-btn>
                </template>
                <span>Change color</span>
              </v-tooltip>
            </template>
            <v-color-picker
              v-model="new_task.color"
              mode.sync="hexa"
              hide-inputs
            ></v-color-picker>
          </v-menu>

          <v-btn icon @click="addUpdateMenu = false" class="float-right">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form ref="add_form" v-model="add_valid" class="p-4" lazy-validation>
          <v-text-field
            v-model="new_task.name"
            :rules="inputRules"
            label="Task Title"
            required
          ></v-text-field>

          <v-text-field
            v-model="new_task.description"
            :rules="inputRules"
            label="Description"
            required
          ></v-text-field>

          <v-row>
            <v-card
              color="grey lighten-4"
              flat
              class="d-flex justify-start ml-2"
            >
              <v-checkbox
                v-model="new_task.one_day"
                class="mx-2"
                label="One day Event"
              ></v-checkbox>
              <v-expand-transition>
                <v-checkbox
                  class="mx-2"
                  v-model="new_task.whole_day"
                  label="Whole day Event"
                  v-show="new_task.one_day"
                ></v-checkbox>
              </v-expand-transition>
            </v-card>
          </v-row>
          <v-divider horizontal></v-divider>
          <v-row>
            <v-col>
              <v-menu
                ref="start_menu"
                v-model="start_menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="new_task.format_start_date"
                    :rules="inputRules"
                    label="Start Date"
                    hint="DD/MM/YYYY format"
                    persistent-hint
                    prepend-icon="mdi-calendar-range"
                    @blur="
                      new_task.start_date = utils.parseDate(start_dateFormatted)
                    "
                    v-on="on"
                    readonly
                    required
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="start_date"
                  no-title
                  :min="today_date"
                  @input="start_menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col>
              <v-expand-transition>
                <v-card v-show="!new_task.one_day" color="grey lighten-4" flat>
                  <v-menu
                    ref="end_menu"
                    v-model="end_menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="new_task.format_end_date"
                        label="End Date"
                        hint="DD/MM/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar-range"
                        @blur="
                          new_task.end_date = utils.parseDate(end_dateFormatted)
                        "
                        v-on="on"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="end_date"
                      no-title
                      :min="new_task.end_date"
                      @input="end_menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-card>
              </v-expand-transition>
            </v-col>
          </v-row>

          <v-expand-transition>
            <v-card flat v-show="!new_task.whole_day" color="grey lighten-4">
              <v-divider horizontal></v-divider>
              <v-row>
                <v-col cols="6">
                  <v-dialog
                    ref="start_dialog"
                    v-model="start_time_modal"
                    :return-value.sync="new_task.start_time"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="new_task.start_time"
                        label="Start time"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="start_time_modal"
                      v-model="new_task.start_time"
                      full-width
                      scrollable
                      :max="new_task.end_time"
                      color="#228B22"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="#228B22"
                        @click="start_time_modal = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="#228B22"
                        @click="$refs.start_dialog.save(new_task.start_time)"
                        >OK</v-btn
                      >
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="6">
                  <v-dialog
                    ref="end_dialog"
                    v-model="end_time_modal"
                    :return-value.sync="new_task.end_time"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="new_task.end_time"
                        label="End time"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="end_time_modal"
                      v-model="new_task.end_time"
                      full-width
                      scrollable
                      :min="min_time"
                      color="#228B22"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="#228B22"
                        @click="end_time_modal = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="#228B22"
                        @click="$refs.end_dialog.save(new_task.end_time)"
                        >OK</v-btn
                      >
                    </v-time-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-card>
          </v-expand-transition>

          <v-btn
            color="success"
            v-if="!isUpdate"
            :disabled="!add_valid"
            class="mt-8"
            @click.prevent="validate()"
          >
            Add Task
          </v-btn>
          <v-btn
            v-else
            color="success"
            :disabled="!add_valid"
            class="mt-8"
            @click.prevent="validate()"
          >
            Update
          </v-btn>
          <v-dialog v-model="deleteAuth" v-if="isUpdate" width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="red" dark class="mt-8 ml-2" v-on="on">
                Delete
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="p-4">
                Are you sure you want to delete this task?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="deleteTask(selectedTaskInner)"
                >
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-card>
    </v-dialog>

    <v-flex>
      <v-card flat min-height="60vh">
        <v-row>
          <v-col v-if="tasks.length != 0" class="col-4">
            <v-row>
              <v-col>
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
              <v-col v-if="!completed" class="col-3">
                <v-tooltip right v-if="tasks.length != 0">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="success"
                      dark
                      v-on="on"
                      class="text-right"
                      @click.prevent="addUpdateMenu = true"
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
                          <v-badge
                            color="pink"
                            dot
                            v-if="checkNotifyTime(task) && !completed"
                          >
                            <span>{{ task.name }}</span>
                          </v-badge>
                          <span v-else>{{ task.name }}</span>
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
                    <p v-if="!completed">
                      You have no tasks for now. <br />
                      Click the button to add a new task.
                    </p>
                    <p v-else>
                      You have not completed any task yet.
                    </p>
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="success"
                          dark
                          v-on="on"
                          @click.prevent="
                            !completed ? (addUpdateMenu = true) : openTab(0)
                          "
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
                          {{ timestamp }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-expand-transition>
              <v-expand-transition>
                <v-card
                  v-show="selectedTaskInner"
                  v-if="selectedTaskInner"
                  outlined
                  height="70vh"
                >
                  <v-card-title class="font-weight-black headline">
                    {{ selectedTaskInner.name }}
                  </v-card-title>

                  <v-card-subtitle class="font-weight-medium title">
                    <p v-if="!selectedTaskInner.one_day">
                      <span
                        >{{
                          utils.momentFormatDate(true, selectedTaskInner.start)
                        }}
                        to
                        {{
                          utils.momentFormatDate(true, selectedTaskInner.end)
                        }}</span
                      >
                    </p>
                    <p v-else>
                      <span v-if="selectedTaskInner.whole_day"
                        >{{
                          utils.momentFormatDate(false, selectedTaskInner.start)
                        }}
                        (Whole Day)</span
                      >
                      <span v-else>
                        {{
                          utils.momentFormatDate(true, selectedTaskInner.start)
                        }}
                        to
                        {{
                          utils.momentFormatDate(true, selectedTaskInner.end)
                        }}</span
                      >
                    </p>
                  </v-card-subtitle>
                  <v-divider class="mx-4" :inset="true"></v-divider>

                  <v-card min-height="30vh" flat>
                    <v-card-text>
                      <p class="font-regular title">Description</p>
                      {{ selectedTaskInner.description }}
                      {{ selectedTaskInner.type }}
                    </v-card-text>
                  </v-card>

                  <v-divider class="mx-4" :inset="true"></v-divider>
                  <v-card-actions v-if="!completed">
                    <v-btn
                      class="mr-2"
                      color="yellow"
                      dark
                      @click.prevent="updateButton(selectedTaskInner)"
                    >
                      Update
                    </v-btn>
                    <v-dialog
                      v-model="completeAuth"
                      v-if="checkNotifyTime(selectedTaskInner)"
                      width="500"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn color="green" dark v-on="on">
                          Complete task
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-text class="p-4">
                          Have you completed this task?
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            text
                            @click="completeTask(selectedTaskInner)"
                          >
                            Yes
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
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
import taskClass from "@/js/task_class.js";

export default {
  name: "TaskView",
  data() {
    return {
      cancel_icon: false,
      tab_open: 0,
      tab_open_clone: 0,
      inputRules: [(v) => !!v || "Required!"],
      add_valid: false,
      new_task: {
        name: null,
        start: null, // if(!whole_day) start_date + start_time else start_date
        end: null, // if(!whole_day) end_date + end_time else end_date
        one_day: false,
        whole_day: false,
        description: null,
        color: "#228B22",
        start_date: new Date().toISOString().substr(0, 10),
        start_time: null,
        end_date: new Date().toISOString().substr(0, 10),
        end_time: null,
        format_start_date: utils.formatDate(this.today_date),
        format_end_date: utils.formatDate(this.today_date),
      },
      today: new Date().toISOString().substr(0, 10),
      today_date: new Date().toISOString().substr(0, 10),
      tmr_date: utils.nextDay(new Date().toISOString().substr(0, 10)),
      start_dateFormatted: utils.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      start_menu: false,
      end_dateFormatted: utils.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      end_menu: false,

      start_date: null,
      end_date: null,
      start_time: null,
      utils: utils,
      start_time_modal: false,
      end_time_modal: false,
      min_time: null,
      isUpdate: false,
      deleteAuth: false,
      completeAuth: false,
      taskDetailsShow: false,
      addUpdateMenu: false,
      loading: false,
      items: [],
      search: null,
      select: null,
      task_page: 1,
      task_total_page: 1,
      selectedTaskInner: null,

      item: null,
      show_task: [],
      taskObj: new taskClass(),
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
    "completed",
  ],
  async created() {
    this.$emit("checkLogged", 1);
    // this.setTaskPages(1);
    
  },
  methods: {
    checkNotifyTime(selectedTask) {
      const past = "ago";
      const tmp = moment(selectedTask.start, "YYYYMMDD HH:mm").fromNow();
      if (tmp.includes(past)) {
        return true;
      }
      return false;
    },
    async setTaskPages(page) {
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
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async validate() {
      this.$refs.add_form.validate();
      const new_task = JSON.parse(JSON.stringify(this.new_task));
      let check = await this.checkTask(new_task);

      if (
        new_task.name &&
        new_task.start_date &&
        new_task.description &&
        check
      ) {
        if (!this.isUpdate) {
          await this.$emit("addTask", new_task);
          // let index = await this.checkPage(new_task);
          // this.item = index;
        } else {
          await this.$emit("updateTask", {
            selectedTask: this.selectedTaskInner,
            new_task: new_task,
          });
        }
        setTimeout(() => {
          this.addUpdateMenu = false;
        }, 100);
      }
    },
    async checkTask(new_task) {
      //validation
      let start_date_split = utils.getSeperateDate(new Date(new_task.start_date));
      let end_date_split = utils.getSeperateDate(new Date(new_task.end_date));
      if (!new_task.one_day) {
        if (
          start_date_split.day > end_date_split.day ||
          start_date_split.month > end_date_split.month ||
          start_date_split.year > end_date_split.year
        ) {
          alert("Start date need to be before the End date");
          return false;
        }
      }
      return true;
    },
    async completeTask(selectedTask) {
      this.$emit("completeTask", selectedTask);
      await this.setTaskPages(this.task_page);
      this.completeAuth = false;
    },
    async deleteTask(selectedTask) {
      this.$emit("deleteTask", selectedTask);
      this.addUpdateMenu = false;
      this.deleteAuth = false;
    },
    updateButton(task) {
      this.addUpdateMenu = true;
      this.isUpdate = true;
      this.new_task = JSON.parse(JSON.stringify(task));
      this.setDateBlur(this.new_task);
    },
    setDetails(created, id) {
      if (created) {
        for (var i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].id == id) {
            this.item = i;
          }
        }
      } else {
        this.selectedTaskInner = this.show_task[id];
      }
    },
    querySelections(v) {
      this.loading = true;
      setTimeout(() => {
        this.items = this.task_list.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    async resetSearch() {
      this.cancel_icon = false;
      this.select = null;
      this.search = null;
      this.item = null;
      await this.setTaskPages(1);
    },
    searchTask() {
      this.show_task = [];
      this.show_task = this.tasks.reduce((data, x) => {
        if (x.name == this.search) {
          data.push(x);
        }
        return data;
      }, []);

      this.item = 0;
    },
    setDateBlur(task) {
      this.start_dateFormatted = utils.formatDate(task.start_date);
      this.end_dateFormatted = utils.formatDate(task.end_date);
      this.start_date = utils.parseDate(this.start_dateFormatted);
      this.end_date = utils.parseDate(this.end_dateFormatted);
    },
    async checkPage(find) {
      // this.$emit("updateData", 1);
      for (var i = 1; i <= this.task_total_page; i++) {
        await this.setTaskPages(i);
        const tmpShowTask = this.show_task.findIndex((x) => x.id === find.id);
        if (tmpShowTask > -1) {
          return tmpShowTask;
        }
      }
      return -1; //should never happen
    },
    openTab(tab) {
      this.$emit("changeTab", tab);
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
    addUpdateMenu: function() {
      if (!this.addUpdateMenu) {
        this.$refs.add_form.reset();
        this.isUpdate = false;
      }
      setTimeout(() => {
        //BUG - end_date should be 1 day ahead
        if (!this.isUpdate) {
          this.new_task.format_start_date = utils.formatDate(this.today_date);
          this.new_task.format_end_date = utils.formatDate(this.tmr_date);
          this.start_dateFormatted = utils.formatDate(this.today_date);
          this.end_dateFormatted = utils.formatDate(this.tmr_date);
          this.start_date = utils.parseDate(this.start_dateFormatted);
          this.end_date = utils.parseDate(this.end_dateFormatted);
        }
      }, 500);
    },
    start_date: function() {
      this.new_task.start_date = this.start_date;
      this.new_task.format_start_date = utils.formatDate(this.start_date);
      this.start_dateFormatted = utils.formatDate(this.new_task.start_date);
    },
    end_date() {
      this.new_task.end_date = this.end_date;
      this.new_task.format_end_date = utils.formatDate(this.end_date);
      this.end_dateFormatted = utils.formatDate(this.new_task.end_date);
    },
    one_day: function() {
      if (!this.new_task.one_day) {
        this.new_task.whole_day = false;
        this.min_time = null;
      } else {
        this.min_time = this.new_task.start_time;
      }
    },
    start_time() {
      this.new_task.start_time = this.start_time;
      if (this.new_task.one_day) {
        this.min_time = this.new_task.start_time;
      }
    },
    selectedTaskInner() {
      if (this.selectedTaskInner) {
        this.taskDetailsShow = true;
      } else {
        this.taskDetailsShow = false;
      }
    },
    async selectedTask(val) {
      // this.selectedTaskInner = val;
      this.item = null;
      let index = await this.checkPage(val);
      this.item = index < -2 ? null : index;
    },
    async selectedEvent(val) {
      this.item = await this.checkPage(val.selectedEvent);
      if (val.isUpdate) {
        setTimeout(() => {
          this.updateButton(val.selectedEvent);
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
