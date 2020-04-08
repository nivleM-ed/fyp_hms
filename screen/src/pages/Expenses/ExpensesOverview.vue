<template>
  <v-card flat>
    <v-tabs background-color="white" color="deep-purple accent-4">
      <v-tab>Overview</v-tab>
      <v-tab>Daily Expenses</v-tab>
      <v-tab>Recurring Bills</v-tab>

      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col v-for="i in 6" :key="i" cols="12" md="4">
              <v-img
                :src="`https://picsum.photos/500/300?image=${i * 1 * 5 + 10}`"
                :lazy-src="`https://picsum.photos/10/6?image=${i * 1 * 5 + 10}`"
                aspect-ratio="1"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item>
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

            <v-form
              ref="add_form"
              v-model="add_valid"
              class="p-4"
              lazy-validation
            >
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
                          new_task.start_date = parseDate(start_dateFormatted)
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
                    <v-card
                      v-show="!new_task.one_day"
                      color="grey lighten-4"
                      flat
                    >
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
                              new_task.end_date = parseDate(end_dateFormatted)
                            "
                            v-on="on"
                            readonly
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="end_date"
                          no-title
                          :min="new_task.start_date"
                          @input="end_menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-card>
                  </v-expand-transition>
                </v-col>
              </v-row>

              <v-expand-transition>
                <v-card
                  flat
                  v-show="!new_task.whole_day"
                  color="grey lighten-4"
                >
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
                          v-model="start_time"
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
                            @click="
                              $refs.start_dialog.save(new_task.start_time)
                            "
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
            </v-form>
          </v-card>
        </v-dialog>

        <v-flex>
          <v-card flat min-height="60vh">
            <v-row>
              <v-col v-if="tasks.length != 0" class="col-4">
                <v-row>
                  <v-autocomplete
                    v-model="select"
                    :append-outer-icon="'mdi-send'"
                    :loading="loading"
                    :items="items"
                    :search-input.sync="search"
                    cache-items
                    class="mx-4"
                    flat
                    hide-no-data
                    hide-details
                    label="Search tasks"
                    solo-inverted
                    @click:append-outer="searchTask()"
                  ></v-autocomplete>
                </v-row>
                <v-row>
                  <v-list dense width="100%">
                    <v-list-item-group v-model="item" color="primary">
                      <v-list-item v-for="(task, index) in tasks" :key="index">
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="task.name"
                          ></v-list-item-title>
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
                      v-if="page > 1"
                    />
                  </v-flex>
                </v-row>
              </v-col>
              <v-col v-else class="col-4">
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
                          <span>Add new task</span>
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
                  <v-expand-transition>
                    <v-card v-show="selectedTask" outlined height="60vh">
                      <div
                        v-if="selectedTask"
                        class="d-flex align-start flex-column mb-6 ma-4"
                        height="100%"
                      >
                        <div class="mb-auto">
                          <h3>
                            {{ selectedTask.name }}
                          </h3>
                        </div>
                        <div class="mb-auto">
                          <p v-if="!selectedTask.one_day">
                            {{ momentFormatDate(true, selectedTask.start) }}
                            <span
                              >to
                              {{
                                momentFormatDate(true, selectedTask.end)
                              }}</span
                            >
                          </p>
                          <p v-else>
                            {{ momentFormatDate(false, selectedTask.start) }}
                            <span v-if="!selectedTask.whole_day"
                              >to
                              {{
                                momentFormatDate(false, selectedTask.end)
                              }}</span
                            >

                            <span v-else>(Whole Day)</span>
                          </p>
                        </div>
                        <div class="mb-auto">
                          <div class="align-self-end">
                            <div>
                              <v-btn
                                class="mr-2"
                                color="yellow"
                                dark
                                @click.prevent="updateButton()"
                              >
                                Update
                              </v-btn>
                              <v-dialog v-model="deleteAuth" width="500">
                                <template v-slot:activator="{ on }">
                                  <v-btn color="red" dark v-on="on">
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
                                      @click="deleteTask(selectedTask)"
                                    >
                                      I accept
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
            <v-tooltip right v-if="tasks.length != 0">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="success"
                  dark
                  v-on="on"
                  class="m-4 text-right"
                  @click.prevent="addUpdateMenu = true"
                >
                  Add Task
                </v-btn>
              </template>
              <span>Add new task</span>
            </v-tooltip>
          </v-card>
        </v-flex>
        </div>
      </v-tab-item>
      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col v-for="i in 6" :key="i" cols="12" md="4">
              <v-img
                :src="`https://picsum.photos/500/300?image=${i * 3 * 5 + 10}`"
                :lazy-src="`https://picsum.photos/10/6?image=${i * 3 * 5 + 10}`"
                aspect-ratio="1"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
const moment = require("moment");
import tasksApi from "@/api/task_api.js";
import taskClass from "@/model/task_class.js";

export default {
  data() {
    return {
      inputRules: [v => !!v || "Required!"],
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
        format_start_date: this.formatDate(this.today_date),
        format_end_date: this.formatDate(this.today_date)
      },

      today_date: new Date().toISOString().substr(0, 10),
      start_dateFormatted: this.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      start_menu: false,
      end_dateFormatted: this.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      end_menu: false,

      start_date: null,
      end_date: null,
      start_time: null,

      start_time_modal: false,
      end_time_modal: false,
      min_time: null,
      isUpdate: false,
      deleteAuth: false,
      taskDetailsShow: false,
      addUpdateMenu: false,
      loading: false,
      items: [],
      search: null,
      select: null,
      page: 1,
      total_page: 1,
      selectedTask: null,

      item: null,
      tasks: [],
      task_list: [],
      taskObj: new taskClass()
    };
  },
  async created() {
    this.taskObj = new taskClass();
    //axios to get data for tasks
    const task_data = await tasksApi.getTasks();
    if (task_data[0].tasks != null) {
      this.taskObj.tasks = task_data[0].tasks;
      this.tasks = this.taskObj.tasks;
    }

    if (this.$route.query.id) {
      this.item = parseInt(this.$route.query.id);
      this.setDetails(true, this.$route.query.id);
    }
  },
  mounted: function() {
    //deleted
  },
  computed: {
    //removed
  },
  methods: {
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async validate() {
      this.$refs.add_form.validate();
      if (
        this.new_task.name &&
        this.new_task.start_date &&
        this.new_task.description
      ) {
        if (!this.isUpdate) {
          try {
            const tmp = await this.taskObj.addNewTask(this.new_task);
            if (tmp.err) {
              console.log(tmp);
            } else {
              this.tasks = tmp;
            }
          } catch (err) {
            alert(err);
          }
        } else {
          try {
            console.log(this.new_task);
            const tmp = await this.taskObj.updateTask(
              this.selectedTask,
              this.new_task
            );
            if (tmp.err) {
              console.log(tmp);
            } else {
              this.tasks = tmp.tasks;
              this.selectedTask = this.tasks[tmp.index];
            }
          } catch (err) {
            alert(err);
          }
        }
      }
      setTimeout(() => {
        this.addUpdateMenu = false;
      }, 100);
    },
    async deleteTask(selectedTask) {
      try {
        const tmp = await this.taskObj.deleteTask(selectedTask);
        if (tmp.err) {
          console.log(tmp);
        } else {
          this.tasks = tmp;
        }
        console.log(this.tasks);
        this.selectedTask = null;
      } catch (err) {
        alert(err);
      }
      this.deleteAuth = false;
    },
    updateButton() {
      this.addUpdateMenu = true;
      this.isUpdate = true;
      this.new_task = JSON.parse(JSON.stringify(this.selectedTask));
      console.log(this.new_task);
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
        this.selectedTask = this.tasks[id];
      }
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.task_list.filter(e => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    searchTask() {
      console.log("Search Task WORKS");
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    momentFormatDate(withTime, date) {
      if (withTime) {
        return date != null
          ? moment(date).format("dddd, Do MMMM YYYY, h:mm a")
          : null;
      } else {
        return date != null ? moment(date).format("dddd, Do MMMM YYYY") : null;
      }
    },
    setDateBlur(task) {
      this.start_dateFormatted = this.formatDate(task.start_date);
      this.end_dateFormatted = this.formatDate(task.end_date);
      this.start_date = this.parseDate(this.start_dateFormatted);
      this.end_date = this.parseDate(this.end_dateFormatted);
    }
  },
  watch: {
    item: async function(val) {
      if (val == null) {
        this.selectedTask = null;
      } else {
        this.setDetails(false, val);
      }
    },
    search(val) {
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
          this.new_task.format_start_date = this.formatDate(this.today_date);
          this.new_task.format_end_date = this.formatDate(this.today_date);
          this.start_dateFormatted = this.formatDate(this.today_date);
          this.end_dateFormatted = this.formatDate(this.today_date);
          this.start_date = this.parseDate(this.start_dateFormatted);
          this.end_date = this.parseDate(this.end_dateFormatted);
        }
      }, 500);
    },
    start_date: function() {
      this.new_task.start_date = this.start_date;
      this.new_task.format_start_date = this.formatDate(this.start_date);
      this.start_dateFormatted = this.formatDate(this.new_task.start_date);
    },
    end_date() {
      this.new_task.end_date = this.end_date;
      this.new_task.format_end_date = this.formatDate(this.end_date);
      this.end_dateFormatted = this.formatDate(this.new_task.end_date);
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
    selectedTask() {
      if (this.selectedTask) {
        this.taskDetailsShow = true;
      } else {
        this.taskDetailsShow = false;
      }
    }
  }
};
</script>
<style></style>
