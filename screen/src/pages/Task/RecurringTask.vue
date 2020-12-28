<template>
  <div class="m-4">
    <v-overlay :value="addUpdateMenu"></v-overlay>

    <v-dialog v-model="addUpdateMenu" persistent max-width="400px">
      <v-card color="grey lighten-4" min-width="400px" flat>
        <v-toolbar :color="new_rec_task.color" dark>
          <v-toolbar-title v-if="!isUpdate">New Recurring Task</v-toolbar-title>
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
              v-model="new_rec_task.color"
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
            v-model="new_rec_task.name"
            :rules="inputRules"
            label="Title"
            required
          ></v-text-field>

          <v-text-field
            v-model="new_rec_task.description"
            :rules="inputRules"
            label="Description"
            required
          ></v-text-field>

          <v-select
            :items="utils.toFirstUpperCase(payment_type, true)"
            label="Category"
            v-model="new_rec_task.category"
            outlined
            :rules="inputRules"
          ></v-select>

          <v-expand-transition>
            <v-select
              v-show="new_rec_task.category"
              :items="
                new_rec_task.category == 'Weekly'
                  ? [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ]
                  : select_rec_day
              "
              label="Day"
              v-model="new_rec_task.day"
              outlined
              :rules="inputRules"
            ></v-select>
          </v-expand-transition>

          <v-expand-transition>
            <v-select
              v-show="new_rec_task.category == 'Annually'"
              :items="select_rec_month"
              label="Month"
              v-model="new_rec_task.month"
              outlined
              :rules="new_rec_task.category == 'Annually' ? inputRules : false"
            ></v-select>
          </v-expand-transition>

          <v-dialog
            ref="start_dialog"
            v-model="start_time_modal"
            :return-value.sync="new_rec_task.start_time"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="new_rec_task.start_time"
                label="Start time"
                prepend-icon="mdi-clock-outline"
                :rules="inputRules"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="start_time_modal"
              v-model="new_rec_task.start_time"
              full-width
              scrollable
              color="#228B22"
            >
              <v-spacer></v-spacer>
              <v-btn text color="#228B22" @click="start_time_modal = false"
                >Cancel</v-btn
              >
              <v-btn
                text
                color="#228B22"
                @click="$refs.start_dialog.save(new_rec_task.start_time)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>

          <p class="caption font-italic">
            ( If 31st is chosen and the month does not have a 31st, it will
            recur on the last available date - 30th. *Same concept applies with
            February* )
          </p>

          <v-btn
            color="success"
            v-if="!isUpdate"
            :disabled="!add_valid"
            @click.prevent="validate()"
          >
            Add
          </v-btn>
          <v-btn
            v-else
            color="success"
            :disabled="!add_valid"
            class="mr-2"
            @click.prevent="validate()"
          >
            Update
          </v-btn>
          <v-dialog v-model="deleteAuth" v-if="isUpdate" width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="red" dark v-on="on">
                Delete
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="p-4">
                Are you sure you want to delete this?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="deleteExp(selectedTask)">
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
          <v-col class="col-4">
            <v-row v-if="rec_task.length > 0">
              <v-card outlined height="60vh" width="100%">
                <v-card flat class="vuebar-element" v-bar>
                  <v-list dense width="100%">
                    <v-list-item-group v-model="item" color="primary">
                      <template v-for="(task, index) in rec_task">
                        <v-list-item :key="index">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row>
                                <v-col cols="5">
                                  {{ utils.toFirstUpperCase(task.name, false) }}
                                </v-col>
                                <v-col v-if="task.category" cols="auto">
                                  (
                                  {{
                                    task.category
                                      ? utils.toFirstUpperCase(
                                          task.category,
                                          false
                                        )
                                      : null
                                  }}
                                  )
                                </v-col>
                                <v-col v-else cols="auto">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <div v-on="on">
                                        <v-icon color="red"
                                          >mdi-exclamation</v-icon
                                        >
                                        Update category
                                      </div>
                                    </template>
                                    <span
                                      >Uncategorised expense will not show up in
                                      the overview</span
                                    >
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-card>
              </v-card>
            </v-row>

            <v-row v-else>
              <v-card v-show="!taskDetailsShow" height="60vh" flat width="100%">
                <v-container fill-height fluid>
                  <v-row align="center" justify="center">
                    <v-col class="text-center">
                      <p>
                        You have not set any recurring task.
                      </p>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            v-on="on"
                            @click.prevent="addUpdateMenu = true"
                          >
                            Add
                          </v-btn>
                        </template>
                        <span>Add Recurring Task</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>

            <v-row v-if="rec_task.length > 0">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="success"
                    dark
                    v-on="on"
                    class="ml-4 mt-4"
                    @click.prevent="addUpdateMenu = true"
                  >
                    Add
                  </v-btn>
                </template>
                <span>Add Reccuring payment</span>
              </v-tooltip>
            </v-row>
          </v-col>

          <v-divider class="mx-4" vertical></v-divider>

          <v-col>
            <v-card height="100%" flat min-height="70vh">
              <v-expand-transition>
                <v-card v-show="!taskDetailsShow" height="60vh" flat>
                  <v-container fill-height fluid>
                    <v-row align="center" justify="center">
                      <h3 class="text-center">
                        Click to view details
                      </h3>
                    </v-row>
                  </v-container>
                </v-card>
              </v-expand-transition>
              <v-expand-transition>
                <v-card v-show="selectedTask" outlined height="70vh">
                  <div
                    v-if="selectedTask"
                    class="d-flex align-start flex-column mb-6 ma-4"
                    height="100%"
                  >
                    <div class="mb-auto">
                      <h3>
                        {{ utils.toFirstUpperCase(selectedTask.name, false) }}
                      </h3>
                      <p>
                        <b>Description:</b> {{ selectedTask.description }}
                        <br />
                        <b>Recurrence Type:</b>
                        {{ selectedTask.category }} Recurrence <br />
                        <b>Next Task Scheduled:</b>
                        {{ utils.momentFormatDate(false, selectedTask.date) }}
                        <br />
                        <span v-if="getTaskAdded(selectedTask).length > 0"
                          ><b>Task was added on: </b>
                          <span
                            v-for="item in getTaskAdded(selectedTask)"
                            :key="item.id"
                          >
                            <br /><b>-</b>
                            {{ utils.momentFormatDate(false, new Date(item)) }}
                          </span></span
                        >
                        <span v-else
                          ><br />A task have not been added for this recurring
                          task</span
                        >
                      </p>
                    </div>
                    <div class="mb-auto">
                      <div class="align-self-end">
                        <div>
                          <v-btn
                            class="mr-2"
                            color="orange"
                            dark
                            @click.prevent="updateButton()"
                          >
                            Update
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
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
import utils from "@/js/utils.js";
import taskClass from "@/js/task_class.js";

export default {
  name: "RecurringTask",
  data() {
    return {
      addUpdateMenu: false,

      item: null,
      inputRules: [(v) => !!v || "Required!"],
      inputRulesNum: [
        (v) => !!v || "Required!",
        (v) => !isNaN(v) || "Must be a number!",
      ],
      add_valid: false,
      isUpdate: false,
      deleteAuth: false,

      new_rec_task: {
        name: null,
        description: null,
        category: "Monthly",
        color: "#228B22",
        day: null,
        month: null,
        start_time: "00:00",
      },
      selectedTask: null,
      taskDetailsShow: false,
      start_time_modal: false,
      start_time: null,

      date_menu: false,
      tab_open: 1,
      utils: utils,

      date_pick: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),

      taskObj: new taskClass(),
      expenses: [],
      rec_task: {},
      daily_total_spent: 0,
      daily_total_received: 0,
      payment_type: ["Weekly", "Monthly", "Annually"],
      payment_type_show: true,
      select_rec_day: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
      ],
      select_rec_month: [
        { text: "January", value: 1 },
        { text: "February", value: 2 },
        { text: "March", value: 3 },
        { text: "April", value: 4 },
        { text: "May", value: 5 },
        { text: "June", value: 6 },
        { text: "July", value: 7 },
        { text: "August", value: 8 },
        { text: "September", value: 9 },
        { text: "October", value: 10 },
        { text: "November", value: 11 },
        { text: "December", value: 12 },
      ],
    };
  },
  props: ["recurring_task"],
  async created() {
    // this.$emit("checkLogged");
    try {
      let id = this.$route.query.id == null ? 0 : this.$route.query.id;
      this.rec_task = this.recurring_task;
      if (this.recurring_task != null) {
        this.item =
          this.recurring_task.findIndex((x) => x.id == id) == -1
            ? 0
            : this.recurring_task.findIndex((x) => x.id == id);
        this.setDetails(false, this.item);
        this.taskDetailsShow = true;
      }
    } catch (err) {
      console.log(err);
      this.$emit("errorAlert", err);
    }
  },
  methods: {
    async validate() {
      try {
        this.$refs.add_form.validate();
        let new_recur = JSON.parse(JSON.stringify(this.new_rec_task));
        if (new_recur.name && new_recur.description) {
          if (!this.isUpdate) {
            try {
              await this.taskObj.addNewRecurTask(new_recur);
              await this.$emit("update", 1);
            } catch (err) {
              alert(err);
            }
          } else {
            try {
              const tmp = await this.taskObj.updateRecurTask(
                this.selectedTask,
                new_recur
              );
              if (tmp.err) {
                alert(tmp.err);
              } else {
                await this.$emit("update", 1);
                this.selectedTask = tmp;
              }
            } catch (err) {
              alert(err);
            }
          }
          this.$emit("update");
          setTimeout(() => {
            this.addUpdateMenu = false;
          }, 100);
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async deleteExp(selectedTask) {
      try {
        const tmp = await this.taskObj.deleteRecur(selectedTask);

        if (tmp.err) {
          alert(tmp.err);
        } else {
          await this.$emit("update", 1);
          this.selectedTask = null;
        }

        this.deleteAuth = false;
        this.addUpdateMenu = false;
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    setDetails(created, id) {
      if (created) {
        alert("NO GO SET DETAILS");
      } else {
        this.selectedTask = this.rec_task[id];
      }
    },
    updateButton() {
      try {
        this.addUpdateMenu = true;
        this.isUpdate = true;
        this.new_rec_task = JSON.parse(JSON.stringify(this.selectedTask));
        this.new_rec_task.category = utils.toFirstUpperCase(
          this.new_rec_task.category,
          false
        );
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    getTaskAdded(data) {
      let tmp = data.taskAdded == null ? [] : data.taskAdded;
      return tmp;
    },
  },
  watch: {
    item: async function(val) {
      if (val == null) {
        this.selectedTask = null;
      } else {
        this.setDetails(false, val);
      }
    },
    selectedTask() {
      if (this.selectedTask) {
        this.taskDetailsShow = true;
      } else {
        this.taskDetailsShow = false;
      }
    },
    addUpdateMenu: function() {
      if (!this.addUpdateMenu) {
        this.$refs.add_form.reset();
        setTimeout(() => {
          this.new_rec_task.category = "Monthly";
          this.isUpdate = false;
        }, 100);
      }
    },
    recurring_task(val) {
      this.rec_task = val;
    },
  },
};
</script>
