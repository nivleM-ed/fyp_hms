<template>
  <div>
    <v-snackbar v-model="notifications_snackbar" :timeout="0" top>
      {{ notify_message }}
      <v-btn color="pink" text @click="setNotifyAcknowledge()">
        Close
      </v-btn>
    </v-snackbar>
    <NavDraw
      :notifications="notifications"
      :task_notify="task_notify"
      :user="user"
    ></NavDraw>
    <Toolbar 
      :notifications="notifications" 
      v-on:updateData="updateData"
    ></Toolbar>
    <div>
      <router-view
        :timestamp="timestamp"
        :notifications="notifications"
        :task_notify="task_notify"
        :logged="logged"
        v-on:checkLogged="checkLogged"
        v-on:updateData="updateData"
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
import taskClass from "@/js/task_class.js";
import expClass from "@/js/expense_class.js";
// import notificationClass from "@/js/notification.js";
import syncClass from "@/js/sync.js";
import utils from "@/js/utils.js";

export default {
  components: { NavDraw, Toolbar, Footer },
  data() {
    return {
      taskObj: new taskClass(),
      expObj: new expClass(),

      timestamp: "",
      tasks: [],
      completed_tasks: [],
      com_tasks: "",
      task_notify: 0,
      expenses: [],
      recurring_payment: [],

      notifications: [],
      notify_message: null,
      notifications_snackbar: false,
      notifyTask: null,
      notification_sound: new Audio("sound/notification-sound.mp3"),
      logged: true,
      intervalSet : null,
    };
  },
  props: ["user"],
  async created() {
    this.taskObj = new taskClass();
    this.expObj = new expClass();
    this.syncObj = new syncClass();
    await this.updateData();
    
    this.intervalSet = setInterval(() => {
      this.timestamp = utils.getToday(true);
      this.notifications = this.syncObj.latest_notification;
      this.syncObj.runSync();
      // this.setTaskNotify();
      // this.setExpNotify();
    }, 1000);
  },
  methods: {
    async checkLogged() {
      this.$emit("checkLogged", 1);
    },
    test(data) {
      return data++
    },
    async updateData() {
      console.log("DashboardLayout UPDATED");
      await this.taskObj.getTaskDB();
      await this.expObj.getExpDB();

      this.tasks = this.taskObj.tasks;
      this.completed_tasks = this.taskObj.completed_tasks;

      this.expenses = this.expObj.expenses;
      this.recurring_payment = this.expObj.recurring_payment;
      await this.syncObj.updateSync();

      // console.log('Task',this.tasks)
      // console.log('Completed Task',this.completed_tasks)
      // console.log('Expenses',this.expenses)
      // console.log('Recurring Payment',this.recurring_payment)
    },
    async setTaskNotify() {
      if (this.tasks) {
        for (var i = 0; i < this.tasks.length; i++) {
          const tmp = moment(this.tasks[i].start, "YYYYMMDD HH:mm").fromNow();
          if (tmp === "a few seconds ago") {
            this.notifySnackbar(this.tasks[i]);
          }
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
        this.tasks.findIndex((x) => x.id === this.notifyTask.id)
      ].notify_ack = true;
      this.notifyTask = null;
    },
  },
  watch: {},
};
</script>
