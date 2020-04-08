<template>
  <div>
    <v-snackbar v-model="notifications_snackbar" :timeout="0" top>
      {{ notify_message }}
      <v-btn color="pink" text @click="setNotifyAcknowledge()">
        Close
      </v-btn>
    </v-snackbar>
    <NavDraw :notifications="notifications"></NavDraw>
    <Toolbar :notifications="notifications"></Toolbar>
    <div>
      <router-view
        :timestamp="timestamp"
        :notifications="notifications"
        v-on:setChangesTask="task_change"
        v-on:setChangesComTask="com_task_change"
      ></router-view>
    </div>

    <Footer :timestamp="timestamp"></Footer>
  </div>
</template>
<script>
import NavDraw from "@/layout/NavDraw";
import Toolbar from "@/layout/Toolbar";
import Footer from "@/layout/Footer";

const moment = require("moment");
// import { CONST } from "@/api/const.js";
import tasksApi from "@/api/task_api.js";
import taskClass from "@/model/task_class.js";

export default {
  components: { NavDraw, Toolbar, Footer },
  data() {
    return {
      timestamp: "",
      tasks: [],
      completed_tasks: [],
      com_tasks: "",
      notifications: [],
      notify_message: null,
      notifications_snackbar: false,
      notifyTask: null,
      taskObj: new taskClass(),
      notification_sound: new Audio("sound/notification-sound.mp3"),
    };
  },
  async created() {
    this.taskObj = new taskClass();
    const task_data = await tasksApi.getTasks();
    if (task_data[0].tasks != null) {
      this.taskObj.tasks = task_data[0].tasks;
      this.tasks = this.taskObj.tasks;
    }
    if (task_data[0].completed_tasks != null) {
      this.taskObj.completed_tasks = task_data[0].completed_tasks;
      this.completed_tasks = this.taskObj.completed_tasks;
    }
    setInterval(() => {
      this.getTime();
      this.setTimeNotify();
    }, 1000);
  },
  methods: {
    getTime: function() {
      const today = new Date();
      const date =
        today.getDate().toString() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      this.timestamp = dateTime;
    },
    task_change(val) {
      this.tasks = val;
    },
    com_task_change(val) {
      this.com_tasks = val;
    },
    setTimeNotify() {
      this.notifications = [];
      const past = "ago";
      // const future = "in";
      for (var i = 0; i < this.tasks.length; i++) {
        const tmp = moment(this.tasks[i].start, "YYYYMMDD HH:mm").fromNow();
        this.tasks[i].timeToNotify = tmp;
        if (tmp.includes(past)) {
          this.notifications.push(this.tasks[i]);
        }
        if (tmp === "a few seconds ago") {
          this.notifySnackbar(this.tasks[i]);
        }
      }
    },
    notifySnackbar(notify) {
      if (!notify.notify_ack) {
        this.notifyTask = notify;
        this.notify_message = "You have a task to be done";
        this.notifications_snackbar = true;
        this.notification_sound.play();
      }
    },
    setNotifyAcknowledge() {
      this.notifications_snackbar = false;
      this.tasks[
        this.tasks.findIndex(x => x === this.notifyTask)
      ].notify_ack = true;
      this.notifyTask = null;
    },
  }
};
</script>
