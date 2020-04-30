<template>
  <v-card class="m-2" min-height="80vh" flat>
    <!-- <v-card flat> -->
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
                  <!-- <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item> -->
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
              max-width="500px"
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon @click="viewEvent()">mdi-eye-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>View</span>
                  </v-tooltip>
                  <v-tooltip v-if="!selectedEvent.completed" left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon @click="editEvent()">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>
                  <v-dialog v-if="!selectedEvent.completed" v-model="deleteAuth" width="500">
                    <template v-slot:activator="{ on: dialog }">
                      <v-tooltip left>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn icon v-on="{ ...tooltip, ...dialog }">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
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
                          @click="deleteEvent(selectedEvent)"
                        >
                          Yes
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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
    <!-- </v-card> -->
  </v-card>
</template>
<script>
import utils from "@/js/utils.js";
import taskClass from "@/js/task_class.js";

export default {
  name: "TaskCalendar",
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      utils: utils,
      deleteAuth: false,
      addUpdateMenu: false,
      loading: false,
      selectedTask: null,
      item: null,
      taskObj: new taskClass(),
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        // "4day": "4 Days",
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
    };
  },
  props: ["logged","tasks","completed_tasks","events"],
  async created() {
    this.$emit("checkLogged", 1);
  },
  mounted: function() {
    // this.$refs.calendar.checkChange();
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
        month: "long",
      });
    },
  },
  methods: {
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
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    async viewEvent() {
      this.selectedOpen = false;
      if (this.selectedEvent.completed) {
        this.openTab(1, this.selectedEvent, false);
      } else {
        this.openTab(0, this.selectedEvent, false);
      }
    },
    async editEvent() {
      this.selectedOpen = false;
      if (!this.selectedEvent.completed) {
        this.openTab(0, this.selectedEvent, true);
      } else {
          alert('You cannot edit a completed task')
      }
    },
    openTab(tab, selectedEvent, isUpdate) {
      this.$emit("changeTab", tab);
        this.$emit("setSelectedEvent", {selectedEvent,isUpdate});
        
    },
    async deleteEvent(data) {
        await this.$emit("deleteTask", data);
        this.selectedOpen = false;
    },
  },
};
</script>
<style></style>
