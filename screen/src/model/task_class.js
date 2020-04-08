/* eslint-disable no-unused-vars */
import tasksApi from "@/api/task_api.js";
import utils from "@/api/utils.js";
const moment = require("moment");


export default class taskClass {
  constructor() {
    var tasks = [];
    var completed_tasks = [];
    var name = null;
    var start = null;
    var end = null;
    var one_day = false;
    var whole_day = false;
    var description = false;
    var color = null;
    var start_date = null;
    var start_time = null;
    var end_date = null;
    var end_time = null;
    var format_start_date = null;
    var format_end_date = null;
    var notify_ack = false;
    var completed = false;
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

  get name() {
    return this._name;
  }
  set name(in_name) {
    this._name = in_name;
  }

  get start() {
    return this._start;
  }
  set start(in_start) {
    this._start = in_start;
  }

  get end() {
    return this._end;
  }
  set end(in_end) {
    this._end = in_end;
  }

  get one_day() {
    return this._one_day;
  }
  set one_day(in_one_day) {
    this._one_day = in_one_day;
  }

  get whole_day() {
    return this._whole_day;
  }
  set whole_day(in_whole_day) {
    this._whole_day = in_whole_day;
  }

  get description() {
    return this._description;
  }
  set description(in_description) {
    this._description = in_description;
  }

  get color() {
    return this._color;
  }
  set color(in_color) {
    this._color = in_color;
  }

  get start_date() {
    return this._start_date;
  }
  set start_date(in_start_date) {
    this._start_date = in_start_date;
  }

  get start_time() {
    return this._start_time;
  }
  set start_time(in_start_time) {
    this._start_time = in_start_time;
  }

  get end_date() {
    return this._end_date;
  }
  set end_date(in_end_date) {
    this._end_date = in_end_date;
  }

  get end_time() {
    return this._end_time;
  }
  set end_time(in_end_time) {
    this._end_time = in_end_time;
  }

  get format_start_date() {
    return this._format_start_date;
  }
  set format_start_date(in_format_start_date) {
    this._format_start_date = in_format_start_date;
  }

  get format_end_date() {
    return this._format_end_date;
  }
  set format_end_date(in_format_end_date) {
    this._format_end_date = in_format_end_date;
  }

  get notify_ack() {
    return this._notify_ack;
  }
  set notify_ack(in_notify_ack) {
    this._notify_ack = in_notify_ack;
  }

  get completed() {
    return this._completed;
  }
  set completed(in_completed) {
    this._completed = in_completed;
  }

  

  //methods
  async deleteTask(selectedTask) {
    const index = await this.getIndex(selectedTask);
    this.tasks.splice(index, 1);

    const tmp = this.updateTaskDB();
    if (tmp.err) {
      return tmp;
    } else {
      return this.tasks;
    }
  }

  async addNewTask(new_task) {
    const tmpData = await this.toData(new_task);
    console.log(tmpData)
    if(!this.tasks) {
      this.tasks = []
      this.tasks[0] = tmpData
    } else {
      this.tasks.push(tmpData);
    }

    const tmp = this.updateTaskDB();
    if (tmp.err) {
      return tmp;
    } else {
      return this.tasks;
    }
  }

  async updateTask(selectedTask, new_task) {
    const tmpData = await this.toData(new_task);
    const index = await this.getIndex(selectedTask);
    console.log(index)
    this.tasks[index] = tmpData;

    const tmp = this.updateTaskDB();
    if (tmp.err) {
      return tmp;
    } else {
      return {tasks:this.tasks, index: index};
    }
  }

  async completeTask(selectedTask) {
    const index = await this.getIndex(selectedTask);
    selectedTask.completed = true;
    if(!this.completed_tasks) {
      this.completed_tasks = []
      this.completed_tasks[0] = selectedTask;
    } else {
      this.completed_tasks.push(selectedTask);
    }
    this.tasks.splice(index, 1);

    const tmp = this.updateTaskDB();
    if (tmp.err) {
      return tmp;
    } else {
      return {tasks:this.tasks,completed_tasks:this.completed_tasks, index: index};
    }
  }

  async updateTaskDB() {
    const errMsg = { "err": "Something went wrong. Data not saved" }
    try {
      const update = await tasksApi.update(this.toJson());
      if (update.err) {
        return errMsg
      }
    } catch (err) {
      return { "err": err }
    }
  }

  async toData(new_task) {
    this.name = new_task.name;
    this.description = new_task.description;
    this.start_date = new_task.start_date;
    this.end_date = new_task.end_date;
    this.start_time = new_task.start_time;
    this.end_time = new_task.end_time;
    this.one_day = new_task.one_day;
    this.whole_day = new_task.whole_day;
    this.color = new_task.color;
    this.setTime();

    return { name: this.name, description: this.description, start: this.start, end: this.end, start_date: this.start_date, start_time: this.start_time, end_date: this.end_date, end_time: this.end_time, one_day: this.one_day, whole_day: this.whole_day, color: this.color, format_start_date: this.format_start_date, format_end_date: this.format_end_date, notify_ack: this.notify_ack, completed: this.completed };
  }

  setTime() {
    if (this.one_day) {
      if (this.whole_day) {
        this.start = this.start_date;
        this.end = this.start_date;
      } else {
        this.start = this.start_date + " " + this.start_time;
        this.end = this.start_date + " " + this.end_time;
      }
    } else {
      this.start = this.start_date + " " + this.start_time;
      this.end = this.end_date + " " + this.end_time;
    }

    this.format_start_date = utils.formatDate(this.start_date);
    this.format_end_date = utils.formatDate(this.end_date);
  }

  async getIndex(selectedTask) {
    return this.tasks.findIndex(x => x === selectedTask)
  }

  async getTitles() {
    var tmp = [];
    var com_tmp = [];
    if(this.tasks) {
      for(var i=0; i<this.tasks.length; i++) {
        tmp.push(this.tasks[i].name)
      }
    }
    
    if(this.completed_tasks) {
      for(var j=0; j<this.completed_tasks.length; j++) {
        com_tmp.push(this.completed_tasks[j].name)
      }
    }
    return {tmp,com_tmp};
  }

  setObj(data) {
    this.tasks = data._tasks;
    this.completed_tasks = data._completed_tasks
    return this;
  }

  toJson() {
    let temp = JSON.stringify(this);
    return JSON.parse(temp);
  }
}
