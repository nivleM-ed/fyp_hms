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
                        :rules="inputRules"
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
                        :rules="inputRules"
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
  </div>
</template>
<script>
// const moment = require("moment");
import utils from "@/js/utils.js";
// import { CONST } from "@/js/const.js";

export default {
  name: "addUpdateTaskDialog",
  data() {
    return {
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
        start_time: "00:00",
        end_date: new Date().toISOString().substr(0, 10),
        end_time: "24:00",
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
      taskDetailsShow: false,
      loading: false,
    };
  },
  props: [
    "selectedTask",
    "selectedEvent",
    "selectedTaskInner",
    "addUpdateMenu",
    "addRecTask",
    "shopping_list",
  ],
  async created() {
    this.new_task.format_start_date = utils.formatDate(this.today_date);
    this.new_task.format_end_date = utils.formatDate(this.tmr_date);
    this.start_dateFormatted = utils.formatDate(this.today_date);
    this.end_dateFormatted = utils.formatDate(this.tmr_date);
    this.start_date = utils.parseDate(this.start_dateFormatted);
    this.end_date = utils.parseDate(this.end_dateFormatted);

    if (this.shopping_list) {
      this.new_task.name = "Buy groceries (Shop list)";
      this.new_task.description = "Shopping list: " + this.shopping_list.name;
      this.new_task.one_day = true;
      this.new_task.list_id = this.shopping_list.id;
      this.new_task.type = "shopping_list";
    }
  },
  methods: {
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
          new_task.type = null;
          new_task.recur_id = null;
          if (this.shopping_list) {
            new_task.type = "shopping_list";
            new_task.shopping_list = this.shopping_list.data;
          }
          await this.$emit("addTask", new_task);
        } else {
          await this.$emit("updateTask", {
            selectedTask: JSON.parse(JSON.stringify(this.selectedTaskInner)),
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
      let start_date_split = utils.getSeperateDate(
        new Date(new_task.start_date)
      );
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
      } else {
        if (new_task.whole_day) {
          if (!new_task.start_time && !new_task.end_time) {
            return false;
          }
        }
      }
      return true;
    },
    async deleteTask(selectedTask) {
      this.$emit("deleteTask", selectedTask);
      this.addUpdateMenu = false;
      this.deleteAuth = false;
    },
    setDateBlur(task) {
      this.start_dateFormatted = utils.formatDate(task.start_date);
      this.end_dateFormatted = utils.formatDate(task.end_date);
      this.start_date = utils.parseDate(this.start_dateFormatted);
      this.end_date = utils.parseDate(this.end_dateFormatted);
    },
    resetDialog() {
      if (this.$refs.add_form) {
        if (!this.addUpdateMenu) {
          this.$refs.add_form.reset();
          this.isUpdate = false;
        }
        setTimeout(() => {
          if (!this.isUpdate) {
            this.color = "#228B22";
            this.new_task.format_start_date = utils.formatDate(this.today_date);
            this.new_task.format_end_date = utils.formatDate(this.tmr_date);
            this.new_task.start_time = "00:00";
            this.new_task.end_time = "24:00";
            this.start_dateFormatted = utils.formatDate(this.today_date);
            this.end_dateFormatted = utils.formatDate(this.tmr_date);
            this.start_date = utils.parseDate(this.start_dateFormatted);
            this.end_date = utils.parseDate(this.end_dateFormatted);
            this.new_task.type = null;
            // this.new_task.name = null;
            // this.new_task.description = null;
            if (this.shopping_list) {
              this.new_task.name = "Buy groceries based on shopping list";
              this.new_task.description =
                "Shopping list: " + this.shopping_list.name;
              this.new_task.one_day = true;
              this.new_task.list_id = this.shopping_list.id;
              this.new_task.type = "shopping_list";
            }
          }
        }, 500);
      }
    },
  },
  watch: {
    addUpdateMenu: function(val) {
      this.$emit("update:addUpdateMenu", val);
      this.resetDialog();
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
    selectedTaskInner(val) {
      // this.addUpdateMenu = true;
      if (val) {
        this.isUpdate = true;
        this.new_task = JSON.parse(JSON.stringify(val));
        this.setDateBlur(this.new_task);
      } else {
        this.isUpdate = false;
        this.resetDialog();
      }
    },
    addRecTask(val) {
      this.new_task.name = val.name;
      this.new_task.description = val.description;
      this.new_task.one_day = val.one_day;
      this.new_task.whole_day = val.whole_day;
      this.new_task.start_time = val.start_time;
      this.new_task.end_time = val.end_time;
    },
    shopping_list(val) {
      this.new_task.description = "Shopping list: " + val.name;
      this.new_task.list_id = val.id;
    },
  },
};
</script>
<style></style>
