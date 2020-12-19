/* eslint-disable no-useless-escape */
/* eslint-disable no-constant-condition*/
/* eslint-disable no-unused-vars*/

// const moment = require("moment");
import taskClass from "@/js/task_class.js";
import expClass from "@/js/expense_class.js";
import notificationClass from "@/js/notification.js";
import utils from './utils';

class syncClass {
    constructor() {
        var notification = {};
        var latest_notification = {};
        var expenses = {};
        var recurring_payment = {};
        var tasks = {};
        var completed_tasks = {};
        var futureTask = {};
    }

    async runSync() {
        try {
            // this.setExpNotify();
            // this.setTaskNotify();
            this.setTaskNotifyOuter();
        } catch (err) {
            return err;
        }
    }

    async setTaskNotifyOuter() { // every 10 minutes or if updated
        if (this.tasks) {
            for (var i = 0; i < this.tasks.length; i++) {
                if (!utils.checkTime(this.tasks[i].start, 'ago') && utils.checkTime(this.tasks[i].start, 'hour')) {
                    if (this.futureTask.findIndex((x) => x.id === this.tasks[i].id) < 0 || !this.futureTask) {
                        this.futureTask.push(this.tasks[i]);
                    }
                }
            }
        }
    }

    async setExpNotify() {
        try {
            let expObj = new expClass();

            if (this.recurring_payment) {
                for (var i = 0; i < this.recurring_payment.length; i++) {
                    // console.log(expObj.checkRecurAvailability(this.recurring_payment[i]))
                    // if (
                    //     utils.checkRange(this.recurring_payment[i], 'day') &&
                    //     !utils.findExist(this.recurring_payment[i])) {
                    //     console.log("NEW RECUR TASK ADDED");
                    //     await expObj.addRecurTask(this.recurring_payment[i]);
                    //     await this.updateSync();
                    // }
                }
            }
        } catch (err) {
            return err;
        }
    }

    async setTaskNotify() {
        try {
            let taskObj = new taskClass();
            if (this.tasks) {
                for (var i = 0; i < this.tasks.length; i++) {
                    if (
                        utils.checkRange(this.tasks[i], 'hour') &&
                        !this.tasks[i].hourNotify) {
                        console.log("NOTIFY TASK IN 2 HOURS", this.task[i].name);
                        await taskObj.addToNotify(this.tasks[i]);
                        await this.updateSync();
                    }
                }
            }
        } catch (err) {
            return err;
        }
    }

    async updateSync() {
        try {
            var notifyObj = new notificationClass();
            var taskObj = new taskClass();
            var expObj = new expClass();

            let notify_res = await notifyObj.getNotifyDB();
            let task_res = await taskObj.getTaskDB();
            let exp_res = await expObj.getExpDB();

            this.notification = notify_res.notification;
            this.latest_notification = notify_res.latest_notification;

            this.expenses = exp_res.expenses;
            this.recurring_payment = exp_res.recurring_payment;
            this.tasks = task_res[0].tasks;
            this.completed_tasks = task_res[0].completed_tasks;
            this.setTaskNotifyOuter();
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

export default syncClass;