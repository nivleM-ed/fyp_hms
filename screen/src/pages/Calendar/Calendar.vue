<template>
  <v-card class="m-2" flat>
    <v-dialog v-model="addUpdateMenu" persistent max-width="600px">
      <v-card color="grey lighten-4" min-width="600px" flat>
        <v-toolbar :color="new_task.color" dark>
          <v-toolbar-title>Update Task</v-toolbar-title>
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
                    @blur="new_task.start_date = parseDate(start_dateFormatted)"
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
                        @blur="new_task.end_date = parseDate(end_dateFormatted)"
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
            :disabled="!add_valid"
            class="mt-8"
            @click.prevent="validate()"
          >
            Update
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-card flat>
      <v-card-title class="headline">Calendar</v-card-title>
      <v-row class="fill-height mx-4">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
              >
                Today
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on }">
                  <v-btn outlined color="grey darken-2" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>

          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :now="today"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon @click="editEvent()">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon @click="deleteEvent(selectedEvent)"
                          >mdi-delete</v-icon
                        >
                      </v-btn>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <span v-html="selectedEvent.start"></span><br />
                  <span v-html="selectedEvent.end"></span><br />
                  <span v-html="selectedEvent.description"></span>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import tasksApi from "@/api/task_api.js";
import taskClass from "@/model/task_class.js";

export default {
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      x: 0,
      y: 0,
      details: ["Test1", "Test2", "Test3", "Test4", "Test5"],
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      taskObj: new taskClass(),
      tasks: [],

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
        format_start_date: this.formatDateTask(this.today_date),
        format_end_date: this.formatDateTask(this.today_date)
      },

      today_date: new Date().toISOString().substr(0, 10),
      start_dateFormatted: this.formatDateTask(
        new Date().toISOString().substr(0, 10)
      ),
      start_menu: false,
      end_dateFormatted: this.formatDateTask(
        new Date().toISOString().substr(0, 10)
      ),
      end_menu: false,

      start_date: null,
      end_date: null,
      start_time: null,

      start_time_modal: false,
      end_time_modal: false,
      min_time: null,
      deleteAuth: false,
      addUpdateMenu: false,
      loading: false,
      selectedTask: null
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
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    async validate() {
      this.$refs.add_form.validate();
      if (
        this.new_task.name &&
        this.new_task.start_date &&
        this.new_task.description
      ) {
        try {
          const tmp = await this.taskObj.updateTask(
            this.selectedEvent,
            this.new_task
          );
          if (tmp.err) {
            alert(tmp);
          } else {
            this.tasks = tmp.tasks;
            this.events = tmp.tasks;
            
          }
        } catch (err) {
          alert(err);
        }
      }
      setTimeout(() => {
        this.$refs.calendar.checkChange()
        this.addUpdateMenu = false;
      }, 100);
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        console.log(this.selectedEvent)
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
      this.events = this.tasks;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },
    editEvent() {
      this.selectedOpen = false;
      this.addUpdateMenu = true;
      this.new_task = JSON.parse(JSON.stringify(this.selectedEvent));
    },
    async deleteEvent(data) {
      try {
        const tmp = await this.taskObj.deleteTask(data);
        if (tmp.err) {
          console.log(tmp);
        } else {
          this.tasks = tmp;
        }
        console.log(this.tasks);
        this.selectedOpen = false;
      } catch (err) {
        alert(err);
      }
      
    },
    formatDateTask(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    }
  },
  watch: {
    tasks() {
      this.events = this.tasks;
    }
  }
};
</script>
<style></style>
