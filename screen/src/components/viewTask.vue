<template>
  <v-container>
    <v-expand-transition>
      <v-card
        v-show="selectedTaskInner"
        v-if="selectedTaskInner"
        outlined
        height="70vh"
      >
        <v-card-title class="font-weight-black headline">
          {{ utils.toFirstUpperCase(selectedTaskInner.name, false) }}
        </v-card-title>

        <v-card-subtitle class="font-weight-medium title">
          <p v-if="!selectedTaskInner.one_day">
            <span
              >{{ utils.momentFormatDate(true, selectedTaskInner.start) }}
              to
              {{ utils.momentFormatDate(true, selectedTaskInner.end) }}</span
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
              {{ utils.momentFormatDate(true, selectedTaskInner.start) }}
              to
              {{ utils.momentFormatDate(true, selectedTaskInner.end) }}</span
            >
          </p>
          <p v-if="completed">Task Completed on: {{ utils.momentFormatDate(true, selectedTaskInner.completed_date)}}</p>
        </v-card-subtitle>
        <v-divider class="mx-4" :inset="true"></v-divider>

        <v-card min-height="30vh" flat>
          <v-card-text>
            <p class="font-regular title">Description</p>
            {{ selectedTaskInner.description }}
            {{ selectedTaskInner.type }}
            <br/>{{selectedTaskInner.id}}
          </v-card-text>
        </v-card>

        <v-divider class="mx-4" :inset="true"></v-divider>
        <v-card-actions v-if="!completed">
          <v-btn
            class="mr-2"
            color="orange"
            dark
            @click.prevent="updateButton()"
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
                  @click="completeAuth = !completeAuth"
                >
                  Cancel
                </v-btn>
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
  </v-container>
</template>
<script>
const moment = require("moment");
import utils from "@/js/utils.js";
import taskClass from "@/js/task_class.js";

export default {
  name: "viewTask",
  data() {
    return {
      utils: utils,
      completeAuth: false,
      addUpdateMenu: false,
      loading: false,
      addRecTask: {},

      item: null,
      show_task: [],
      taskObj: new taskClass(),
    };
  },
  props: [
    "timestamp",
    "selectedTask",
    "selectedEvent",
    "completed",
    "selectedTaskInner",
  ],
  async created() {},
  methods: {
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
    async completeTask(selectedTask) {
      this.$emit("completeTask", JSON.parse(JSON.stringify(selectedTask)));
      this.completeAuth = false;
    },
    async updateButton() {
      this.$emit("updateButton");
    },
  },
  watch: {},
};
</script>
<style></style>
