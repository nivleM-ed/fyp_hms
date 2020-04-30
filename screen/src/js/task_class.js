/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import axios from "axios";
import { CONST } from './const';
import expenseClass from './expense_class';
import notificationClass from "@/js/notification.js";
const url = CONST.CONST_URL.concat('/tasks/');


export default class taskClass {
  constructor() {
    var tasks = [];
    var completed_tasks = [];
  }

  get tasks() {
    return this._tasks;
  }
  set tasks(in_tasks) {
    this._tasks = in_tasks;
  }

  get completed_tasks() {
    return this._completed_tasks;
  }
  set completed_tasks(in_completed_tasks) {
    this._completed_tasks = in_completed_tasks;
  }

  //methods
  async deleteTask(selectedTask) {
    try {
      await this.getTaskDB();
      const index = await this.getIndex(selectedTask);
      this.tasks.splice(index, 1);

      const tmp = await this.updateTaskDB();
      return this.tasks;
    } catch (err) {
      return err;
    }
  }

  async addNewTask(new_task) {
    try {
      await this.getTaskDB();
      const tmpData = await this.toData(new_task);
      if (!this.tasks) {
        this.tasks = [];
        this.tasks[0] = tmpData;
      } else {
        this.tasks.push(tmpData);
      }
      const tmp = await this.updateTaskDB();
      return tmpData;
    } catch (err) {
      return err;
    }
  }

  async updateTask(selectedTask, new_task) {
    try {
      await this.getTaskDB();
      const tmpData = await this.toData(new_task);
      const index = await this.getIndex(selectedTask);
      this.tasks[index] = tmpData;

      const tmp = await this.updateTaskDB();
      return tmpData;
    } catch (err) {
      return err;
    }
  }

  async completeTask(selectedTask) {
    try {
      await this.getTaskDB();
      const index = await this.getIndex(selectedTask);
      selectedTask.completed = true;
      selectedTask.completed_date = new Date();
      if (!this.completed_tasks) {
        this.completed_tasks = [];
        this.completed_tasks[0] = selectedTask;
      } else {
        this.completed_tasks.push(selectedTask);
      }
      this.tasks.splice(index, 1);
      await this.updateTaskDB();
      return 1;
    } catch (err) {
      return err;
    }
  }

  async completeRecurTask(selectedTask) {
    try {
      await this.getTaskDB();
      const index = await this.getIndex(selectedTask);
      selectedTask.completed = true;
      if (!this.completed_tasks) {
        this.completed_tasks = [];
        this.completed_tasks[0] = selectedTask;
      } else {
        this.completed_tasks.push(selectedTask);
      }
      this.tasks.splice(index, 1);

      let expObj = new expenseClass();
      let tmpData = { recur_id: selectedTask.recur_id, type: 'recur_expense', date: new Date(), title: selectedTask.name, amount: selectedTask.amount, description: selectedTask.description, money_in: false, color: selectedTask.color, category: 'Recurring Payment' };
      let tmp = await expObj.addNewExpense(tmpData);
      console.log(tmp)
      await this.updateTaskDB();
      return 1;
    } catch (err) {
      return err;
    }
  }

  async addToNotify(data) {
    try {
      let notifyObj = new notificationClass();
      await this.getTaskDB();
      const index = await this.getIndex(data);
      data.hourNotify = true;
      this.tasks[index] = data;

      await notifyObj.addNotification(data, 'task');
      await this.updateTaskDB();
      return this.tasks;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateTaskDB() {
    try {
      let taskObj = this.toJson();
      const res = await axios.post(`${url}update`, {
        taskObj
      }, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async getTaskDB() {
    try {
      const res = await axios.get(`${url}get`, {
        withCredentials: true
      });

      if (res.data.err == 'notLoggedIn') {
        return { err: 'notLoggedIn' };
      }

      this.tasks = res.data[0].tasks != null ? res.data[0].tasks : [];
      this.completed_tasks = res.data[0].completed_tasks != null ? res.data[0].completed_tasks : [];

      return res.data;
    } catch (err) {
      return err;
    }
  }

  async toData(data) {
    try {
      let id = data.id == null ? await utils.getHashId(`${Date.now()}-${JSON.stringify(data)}`) : data.id;
      let time = await this.setTime(data);

      return { id: id, type: data.type ? data.type : 'task', name: data.name, description: data.description, start: time.start, end: time.end, start_date: data.start_date, start_time: data.start_time, end_date: data.end_date, end_time: data.end_time, one_day: data.one_day, whole_day: data.whole_day, color: data.color, format_start_date: time.format_start_date, format_end_date: time.format_end_date, notify_ack: data.notify_ack, completed: data.completed, amount: data.amount, recur_id: data.recur_id };
    } catch (err) {
      console.log(err);
      return err;
    }

  }

  async setTime(data) {
    try {
      let time = {};
    if (data.one_day) {
      if (data.whole_day) {
        time.start = data.start_date;
        time.end = data.start_date;
      } else {
        time.start = data.start_date + " " + data.start_time;
        time.end = data.start_date + " " + data.end_time;
      }
    } else {
      time.start = data.start_date + " " + data.start_time;
      time.end = data.end_date + " " + data.end_time;
    }

    time.format_start_date = utils.formatDate(data.start_date);
    time.format_end_date = utils.formatDate(data.end_date);
    return time;
    } catch(err) {
      console.log(err);
      return err;
    }
  }

  async getIndex(selectedTask) {
    try {
      return this.tasks.findIndex(x => x.id === selectedTask.id);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getTitles() {
    try {
      var tmp = [];
    var com_tmp = [];
    if (this.tasks) {
      for (var i = 0; i < this.tasks.length; i++) {
        tmp.push(this.tasks[i].name);
      }
    }

    if (this.completed_tasks) {
      for (var j = 0; j < this.completed_tasks.length; j++) {
        com_tmp.push(this.completed_tasks[j].name);
      }
    }
    return { tmp, com_tmp };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  setObj(data) {
    this.tasks = data._tasks;
    this.completed_tasks = data._completed_tasks;
    return this;
  }

  toJson() {
    let temp = JSON.stringify(this);
    return JSON.parse(temp);
  }
}
