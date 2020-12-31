/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import axios from "axios";
import {
  CONST
} from './const';
import expenseClass from './expense_class';
import inventoryClass from './inventory_class';
import notificationClass from "@/js/notification.js";
const url = CONST.CONST_URL.concat('/tasks/');


export default class taskClass {
  constructor() {
    var tasks = [];
    var recurring_task = [];
    var completed_tasks = [];
    var formatted_completed_tasks = [];
  }
  get tasks() {
    return this._tasks;
  }
  set tasks(in_tasks) {
    this._tasks = in_tasks;
  }

  get recurring_task() {
    return this._recurring_task;
  }
  set recurring_task(in_recurring_task) {
    this._recurring_task = in_recurring_task;
  }

  get completed_tasks() {
    return this._completed_tasks;
  }
  set completed_tasks(in_completed_tasks) {
    this._completed_tasks = in_completed_tasks;
  }

  get formatted_completed_tasks() {
    return this._formatted_completed_tasks;
  }
  set formatted_completed_tasks(in_formatted_completed_tasks) {
    this._formatted_completed_tasks = in_formatted_completed_tasks;
  }


  //methods
  async deleteTask(selectedTask) {
    try {
      await this.getTaskDB();
      const index = await this.getIndex(selectedTask, false);
      this.tasks.splice(index, 1);

      if (selectedTask.type === 'shopping_list') {
        let invObj = new inventoryClass();
        await invObj.removeTaskId(selectedTask.shopping_list_id);
      }

      const tmp = await this.updateTaskDB();
      return this.tasks;
    } catch (err) {
      return err;
    }
  }

  async addNewTask(new_task) {
    try {
      await this.getTaskDB();
      new_task.id = null;
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

  async addNewRecurTask(new_task) {
    try {
      await this.getTaskDB();

      new_task.id = null;
      new_task.type = 'recur_task';

      const tmpData = await this.toData(new_task);
      if (!this.recurring_task) {
        this.recurring_task = [];
        this.recurring_task[0] = tmpData;
      } else {
        this.recurring_task.push(tmpData);
      }

      await this.setRecurTaskNext();
      const tmp = await this.updateTaskDB();
      return tmpData;
    } catch (err) {
      return err;
    }
  }

  async addRecurTask(new_task) {
    try {
      await this.getTaskDB();
      let notifyObj = new notificationClass();
      let index = this.recurring_task.findIndex(x => x.id === new_task.id);

      new_task.recur_task_id = new_task.id;
      await this.addNewTask(new_task);
      await this.recordRecur(index);
      await notifyObj.addNotification(new_task, 'recur_task');

      const tmp = await this.updateTaskDB();
    } catch (err) {
      return err;
    }
  }

  async recordRecur(index) {
    try {
      await this.getTaskDB();
      this.recurring_task[index].taskAdded = this.recurring_task[index].taskAdded == null ? [] : this.recurring_payment[index].taskAdded;
      this.recurring_task[index].taskAdded.push(new Date(this.recurring_task[index].date));
    } catch (err) {
      console.log(err);
      return err;
    }

  }

  async updateRecurTask(selectedTask, new_task) {
    try {
      await this.getTaskDB();
      const tmpData = await this.toData(new_task);
      const index = this.recurring_task.findIndex(x => x.id === selectedTask.id);
      this.recurring_task[index] = tmpData;

      await this.setRecurTaskNext();
      const tmp = await this.updateTaskDB();
      return tmpData;
    } catch (err) {
      return err;
    }
  }

  async setRecurTaskNext() {
    try {
      let today = new Date();
      for (var i = 0; i < this.recurring_task.length; i++) {
        if (this.recurring_task[i].category === 'Weekly') {
          let date = await utils.getNextSelectDay(this.recurring_task[i].day);
          this.recurring_task[i].date = date;
        } else if (this.recurring_task[i].category === 'Monthly') {
          let date = new Date(today.getFullYear(), today.getMonth(), this.recurring_task[i].day);
          if (date.getTime() > today.getTime()) {
            this.recurring_task[i].date = date;
          } else {
            // while(today.getTime() > date.getTime()) {
            //     date = date.setMonth(date.getMonth()+1);
            //     console.log(new Date(date))
            // }
            this.recurring_task[i].date = date.setMonth(date.getMonth() + 1);
          }
        } else { //this.recurring_task[i].category === 'Annually
          let date = new Date(today.getFullYear(), parseInt(this.recurring_task[i].month) - 1, this.recurring_task[i].day);
          if (date.getTime() > today.getTime()) {
            this.recurring_task[i].date = date;
          } else {
            this.recurring_task[i].date = date.setFullYear(date.getFullYear() + 1);
          }
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async checkMissedRecur(data) {
    try {
      let taskAdded = data.taskAdded == null ? [] : data.taskAdded;
      if (taskAdded.length <= 0) return false;
      else {
        let latestDate = new Date(data.taskAdded[taskAdded.length == 0 ? 0 : taskAdded.length - 1]);
        // let expDate = new Date(data.date);
        switch (data.category) {
          case 'Weekly':
            if (utils.checkDateBefore('Weekly', latestDate)) {
              if (taskAdded.findIndex((x) => new Date(x).getTime() === utils.getNextSelectDay(latestDate.getDay().getTime()) >= 0)) {
                this.addRecurTask(data, utils.getNextSelectDay(latestDate.getDay()));
              }
            }
            break;
          case 'Monthly':
            if (utils.checkDateBefore('Monthly', latestDate)) {
              latestDate.setMonth(latestDate.getMonth() + 1)
              if (taskAdded.findIndex((x) => new Date(x).getTime() === latestDate.getTime()) >= 0) {
                this.addRecurTask(data, latestDate.setMonth(latestDate.getMonth() + 1));
              }
            }
            break;
          case 'Yearly':
            if (utils.checkDateBefore('Yearly', latestDate)) {
              latestDate.setFullYear(latestDate.getFullYear() + 1)
              if (taskAdded.findIndex((x) => new Date(x).getTime() === latestDate.getTime()) >= 0) {
                this.addRecurTask(data, latestDate.setFullYear(latestDate.getFullYear() + 1));
              }
            }
            break;
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async checkRecurAvailability(data) { // return true to add
    try {
      await this.getTaskDB();
      let index = this.recurring_task.findIndex(x => x.id === data.id);
      let token = false;
      //check if task has already been added
      let taskAdded = this.recurring_task[index].taskAdded == null ? [] : this.recurring_task[index].taskAdded;
      let tmpDate = new Date(this.recurring_task[index].date);
      if (taskAdded.length <= 0) token = true;
      else {
        if (taskAdded.findIndex((x) => new Date(x).getTime() === tmpDate.getTime()) >= 0) token = false;
      }

      //check if almost time to recurring date
      token = token == false ? false : utils.checkRange(data, 'day');

      return token;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateTask(selectedTask, new_task) {
    try {
      await this.getTaskDB();
      const tmpData = await this.toData(new_task);
      const index = await this.getIndex(selectedTask, false);
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
      const index = await this.getIndex(selectedTask, false);
      selectedTask.completed = true;
      selectedTask.completed_date = new Date();
      selectedTask.color = "#EF5350";

      if (!this.completed_tasks) {
        this.completed_tasks = [];
        this.completed_tasks[0] = selectedTask;
      } else {
        this.completed_tasks.push(selectedTask);
      }

      await this.formatCompleteTask(selectedTask);
      this.tasks.splice(index, 1);
      await this.updateTaskDB();
      return 1;
    } catch (err) {
      return err;
    }
  }

  async deleteRecur(data) {
    try {
      await this.getTaskDB();
      let index = this.recurring_task.findIndex(x => x.id === data.id);
      this.recurring_task.splice(index, 1);
      console.log(this.recurring_task)
      const tmp = await this.updateTaskDB();
      return tmp;
    } catch (err) {
      return err;
    }
  }

  async formatCompleteTask(selectedTask) {
    try {
      let {
        yearIndex,
        monthIndex,
        dayIndex
      } = await this.getIndex(selectedTask, true);
      if (yearIndex < 0) {
        await this.addObj('year', selectedTask);
      } else if (monthIndex < 0) {
        await this.addObj('month', selectedTask);
      } else if (dayIndex < 0) {
        await this.addObj('day', selectedTask);
      }

      let index = await this.getIndex(selectedTask, true);
      this.formatted_completed_tasks[index.yearIndex].data[index.monthIndex].data[index.dayIndex].data.push(selectedTask);
      return 1;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async addObj(string, data) {
    try {
      let {
        day,
        month,
        year
      } = utils.getSeperateDate(new Date());
      let {
        yearIndex,
        monthIndex,
        dayIndex,
        dataIndex
      } = await this.getIndex(data, true);
      if (string === 'year') {
        if (!this.formatted_completed_tasks) {
          this.formatted_completed_tasks = [];
        }
        this.formatted_completed_tasks.push({
          year: year,
          data: [{
            month: month,
            data: [{
              day: day,
              date: new Date(),
              data: []
            }]
          }],
        });
      } else if (string === 'month') {
        this.formatted_completed_tasks[yearIndex].data.push({
          month: month,
          data: [{
            day: day,
            date: new Date(),
            data: []
          }],
        });
      } else if (string === 'day') {
        this.formatted_completed_tasks[yearIndex].data[monthIndex].data.push({
          day: day,
          date: new Date(),
          data: [],
        });
      }

    } catch (err) {
      console.log(err);
    }
  }

  async confirmAddToNotification(task) {
    await this.getTaskDB();
    try {
      const index = await this.getIndex(task, false);
      this.tasks[index].notify_ack = true;
      await this.updateTaskDB();
    } catch (err) {
      console.log(err);
    }

  }

  async completeShopListTask(selectedTask) {
    try {
      await this.getTaskDB();
      const index = await this.getIndex(selectedTask, false);

      selectedTask.completed = true;
      selectedTask.completed_date = new Date();
      selectedTask.color = "#EF5350";

      if (!this.completed_tasks) {
        this.completed_tasks = [];
        this.completed_tasks[0] = selectedTask;
      } else {
        this.completed_tasks.push(selectedTask);
      }
      this.tasks.splice(index, 1);
      await this.formatCompleteTask(selectedTask);

      let invObj = new inventoryClass();
      await invObj.setShopListComplete(selectedTask.shopping_list_id);

      await this.updateTaskDB();
      return 1;
    } catch (err) {
      return err;
    }
  }

  async completeRecurTask(selectedTask) {
    try {
      await this.getTaskDB();
      const index = await this.getIndex(selectedTask, false);

      selectedTask.completed = true;
      selectedTask.completed_date = new Date();
      selectedTask.color = "#EF5350";

      if (!this.completed_tasks) {
        this.completed_tasks = [];
        this.completed_tasks[0] = selectedTask;
      } else {
        this.completed_tasks.push(selectedTask);
      }
      this.tasks.splice(index, 1);
      await this.formatCompleteTask(selectedTask);

      let expObj = new expenseClass();
      let tmpData = {
        recur_id: selectedTask.recur_id,
        type: 'recur_expense',
        date: new Date(),
        title: selectedTask.name,
        amount: selectedTask.amount,
        description: selectedTask.description,
        money_in: false,
        color: selectedTask.color,
        category: 'Recurring Payment'
      };
      let tmp = await expObj.addNewExpense(tmpData);
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
      const index = await this.getIndex(data, false);
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
        return {
          err: 'notLoggedIn'
        };
      }

      this.tasks = res.data[0].tasks != null ? res.data[0].tasks : [];
      this.recurring_task = res.data[0].recurring_task != null ? res.data[0].recurring_task : [];
      this.completed_tasks = res.data[0].completed_tasks != null ? res.data[0].completed_tasks : [];
      this.formatted_completed_tasks = res.data[0].formatted_completed_tasks != null ? res.data[0].formatted_completed_tasks : [];

      await this.setRecurTaskNext();
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async toData(data) {
    try {
      let id = data.id == null ? await utils.getHashId(`${new Date()}-${JSON.stringify(data)}`) : data.id;
      let time = await this.setTime(data);

      return {
        id: id,
        type: data.type ? data.type : 'task',
        name: data.name,
        description: data.description,
        start: time.start,
        end: time.end,
        start_date: time.start_date,
        start_time: data.start_time,
        end_date: time.end_date,
        end_time: data.end_time,
        one_day: data.one_day,
        whole_day: data.whole_day,
        color: data.color,
        format_start_date: time.format_start_date,
        format_end_date: time.format_end_date,
        notify_ack: data.notify_ack,
        completed: data.completed,
        amount: data.amount,
        recur_id: data.recur_id,
        shopping_list_id: data.shopping_list_id,
        shopping_list: data.shopping_list,
        category: data.category,
        day: data.day,
        month: data.month,
        date: data.date,
        date_created_on: new Date()
      };
    } catch (err) {
      console.log(err);
      return err;
    }

  }

  async setTime(data) {
    try {
      let time = {};

      if (data.type != "recur_task") {
        if (data.one_day) {
          if (data.whole_day) {
            time.start = data.start_date;
            time.end = data.start_date;
            time.start_date = data.start_date;
          } else {
            time.start = data.start_date + " " + data.start_time;
            time.end = data.start_date + " " + data.end_time;
            time.start_date = data.start_date;

          }
        } else {
          time.start = data.start_date + " " + data.start_time;
          time.end = data.end_date + " " + data.end_time;
          time.start_date = data.start_date;
          time.end_date = data.end_date;
        }

        time.format_start_date = utils.formatDate(data.start_date);
        time.format_end_date = utils.formatDate(data.end_date);
      } else {
        time.start_date = data.date;
        time.end_date = data.date;

        time.start = utils.parseDate(utils.formatDate2(data.date)) + " " + data.start_time;
        time.end = utils.parseDate(utils.formatDate2(data.date)) + " 24:00";

        time.format_start_date = utils.formatDate2(data.date);
        time.format_end_date = utils.formatDate2(data.date);
      }

      return time;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getIndex(selectedTask, format) {
    try {
      if (format) {
        let {
          day,
          month,
          year
        } = utils.getSeperateDate(new Date(selectedTask.completed_date));
        let yearIndex = this.formatted_completed_tasks == null || this.formatted_completed_tasks.length < 1 ? parseInt('-1') : this.formatted_completed_tasks.findIndex(x => x.year == year);
        let monthIndex = yearIndex < 0 ? parseInt('-1') : this.formatted_completed_tasks[yearIndex].data.findIndex(x => x.month == month);
        let dayIndex = monthIndex < 0 ? parseInt('-1') : this.formatted_completed_tasks[yearIndex].data[monthIndex].data.findIndex(x => x.day == day);
        let dataIndex = dayIndex < 0 ? parseInt('-1') : this.formatted_completed_tasks[yearIndex].data[monthIndex].data[dayIndex].data.findIndex(x => x.id == selectedTask.id);
        return {
          yearIndex,
          monthIndex,
          dayIndex,
          dataIndex
        };
      } else {
        return this.tasks.findIndex(x => x.id === selectedTask.id);
      }
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
      return {
        tmp,
        com_tmp
      };
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