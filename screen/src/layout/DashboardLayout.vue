<template>
  <div>
    <v-snackbar v-model="notifications_snackbar" top>
      {{ notify_message }}
      <v-btn color="pink" text @click="setNotifyAcknowledge()">
        Close
      </v-btn>
    </v-snackbar>
    <viewAlert :data="alertData" />
    <errorAlert :error="error" />
    <NavDraw
      :notifications="latest_notification"
      :task_notify="task_notify"
      :user="user"
    ></NavDraw>
    <Toolbar :notifications="latest_notification"></Toolbar>
    <div>
      <router-view
        :timestamp="timestamp"
        :notifications="latest_notification"
        :task_notify="task_notify"
        :logged="logged"
        v-on:checkLogged="checkLogged"
        v-on:updateData="updateData"
        v-on:viewAlert="viewAlert"
        v-on:errorAlert="errorAlert"
      ></router-view>
    </div>

    <Footer :timestamp="timestamp"></Footer>
  </div>
</template>
<script>
import NavDraw from "@/layout/NavDraw";
import Toolbar from "@/layout/Toolbar";
import Footer from "@/layout/Footer";
import viewAlert from "@/components/viewAlert";
import errorAlert from "@/components/errorAlert";

// const moment = require("moment");
import taskClass from "@/js/task_class.js";
import expClass from "@/js/expense_class.js";
import notificationClass from "@/js/notification.js";
import syncClass from "@/js/sync.js";
import utils from "@/js/utils.js";

export default {
  components: { NavDraw, Toolbar, Footer, viewAlert, errorAlert },
  data() {
    return {
      taskObj: new taskClass(),
      expObj: new expClass(),
      notifyObj: new notificationClass(),

      timestamp: "",
      tasks: [],
      completed_tasks: [],
      recurring_task: [],
      com_tasks: "",
      task_notify: 0,
      expenses: [],
      recurring_payment: [],
      utils: utils,
      futureTask: [],

      notification: [],
      latest_notification: [],
      notify_message: null,
      notifications_snackbar: false,
      notifyTask: null,
      notification_sound: new Audio("sound/notification-sound.mp3"),
      logged: true,
      intervalSet: null,
      intervalSet2: null,
      alertData: {},
    };
  },
  props: ["user"],
  async created() {
    this.taskObj = new taskClass();
    this.expObj = new expClass();
    this.notifyObj = new notificationClass();

    this.syncObj = new syncClass();
    this.backgroundProcess();
    await this.updateData();

    this.futureTask = [];

    this.intervalSet = setInterval(() => {
      // this.timestamp = utils.getToday(true);
      // this.notifications = this.syncObj.latest_notification;
      // this.syncObj.runSync();
      this.setNotifyOuter();
      // this.setExpNotify();
    }, 120000); //120000
  },
  methods: {
    async checkLogged() {
      this.$emit("checkLogged");
    },
    async updateData(type) {
      console.log("MAIN UPDATED");
      try {
        let notify_res = await this.notifyObj.getNotifyDB();
        let task_res = await this.taskObj.getTaskDB();
        let exp_res = await this.expObj.getExpDB();

        this.notification = notify_res.notification;
        this.latest_notification = notify_res.latest_notification;

        this.expenses = exp_res.expenses;
        this.recurring_payment = exp_res.recurring_payment;
        this.tasks = task_res[0].tasks == null ? [] : task_res[0].tasks;
        this.recurring_task =
          task_res[0].recurring_task == null ? [] : task_res[0].recurring_task;
        this.completed_tasks = task_res[0].completed_tasks;
        if (!type) this.setNotifyOuter();
      } catch (err) {
        console.log(err);
        this.errorAlert(err);
      }
    },
    backgroundProcess() {
      console.log("BACKGROUND PROCRESS: START")
      this.intervalSet2 = setInterval(() => {
        this.timestamp = utils.getToday(true);
        this.setTaskNotify();
      }, 1000);
    },
    viewAlert(data) {
      this.alertData = data;
    },
    errorAlert(error) {
      this.error = error;
    },
    async setTaskNotify() {
      if (this.futureTask) {
        for (var i = 0; i < this.futureTask.length; i++) {
          if (utils.checkTime(this.futureTask[i].start, "second")) {
            // if (!this.futureTask[i].notify_ack) {
            if (!this.notifications_snackbar) {
              this.notifyTask = this.futureTask[i];
              this.notify_message =
                "You have a task to be done: " + this.notifyTask.name;
              this.notifications_snackbar = true;
            }
            this.notification_sound.play();
          }
          // }
        }
      }
    },
    async setNotifyOuter() {
      // every 10 minutes or if updated
      
      try {
        if (this.tasks.length > 0) {
          for (var i = 0; i < this.tasks.length; i++) {
            if (
              !utils.checkTime(this.tasks[i].start, "ago") &&
              utils.checkTime(this.tasks[i].start, "hour") &&
              this.futureTask.findIndex(
                (x) =>
                  x.id === this.tasks[i].id &&
                  new Date(x.start).getTime() ==
                    new Date(this.tasks[i].start).getTime()
              ) < 0 &&
              !this.tasks[i].notify_ack
            ) {
              this.futureTask.push(this.tasks[i]);
              console.log("NEW TASK ADDED TO NOTIFICATION")
              //add to notification
              await this.notifyObj.addNotification(
                this.tasks[i],
                "upcoming_task"
              );
              await this.taskObj.confirmAddToNotification(this.tasks[i]);
              await this.updateData(true);
            }
          }
        }

        console.log("FUTURE TASK: " + this.futureTask.length);

        if (this.recurring_payment) {
          for (var j = 0; j < this.recurring_payment.length; j++) {
            // await this.expObj.checkMissedRecur(this.recurring_payment[j]);
            if (
              await this.expObj.checkRecurAvailability(
                this.recurring_payment[j]
              )
            ) {
              // this.futureTask.push(this.tasks[j]);
              await this.expObj.addRecurTask(
                this.recurring_payment[j],
                this.recurring_payment[j].date
              );
              await this.updateData(true);
            }
          }
        }

        if (this.recurring_task) {
          for (var k = 0; k < this.recurring_task.length; k++) {
            // await this.taskObj.checkMissedRecur(this.recurring_task[k]);
            if (
              await this.taskObj.checkRecurAvailability(this.recurring_task[k])
            ) {
              // this.futureTask.push(this.tasks[j]);
              await this.taskObj.addRecurTask(this.recurring_task[k]);
              await this.updateData(true);
            }
          }
        }
      } catch (err) {
        this.errorAlert(err);
        console.log(err);
      }
    },
    setNotifyAcknowledge() {
      try {
        this.notifications_snackbar = false;
        let index = this.futureTask.findIndex(
          (x) => x.id === this.notifyTask.id
        );
        this.futureTask.splice(index, 1);
        this.notifyTask = null;
      } catch (err) {
        console.log(err);
        this.errorAlert(err);
      }
    },
  },
  watch: {},
  destroyed() {
    console.log("BACKGROUND PROCRESS: STOP")
    clearInterval(this.intervalSet);
    clearInterval(this.intervalSet2);
  },
};
</script>
