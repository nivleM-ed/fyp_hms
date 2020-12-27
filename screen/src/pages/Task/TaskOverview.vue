<template>
  <v-card flat>
    <v-tabs
      background-color="white"
      color="deep-purple accent-4"
      v-model="tab_open"
    >
      <v-tab key="task"
        ><v-badge :value="task_notify > 0" color="pink" :content="task_notify">
          Tasks
        </v-badge></v-tab
      >
      <v-tab key="recur_task">Recurring Task</v-tab>
      <v-tab key="completed_task">Completed tasks</v-tab>
      <v-tab key="task_calendar">Calendar</v-tab>

      <v-tab-item key="task">
        <TaskView
          :tasks="tasks"
          :task_list="task_list"
          :selectedTask="selectedTask"
          :selectedEvent="selectedEvent"
          :timestamp="timestamp"
          :logged="logged"
          v-on:updateData="updateData"
          v-on:deleteTask="deleteTask"
          v-on:completeTask="completeTask"
          v-on:addTask="addTask"
          v-on:updateTask="updateTask"
          v-on:changeTab="tabChange"
        />
      </v-tab-item>

      <v-tab-item key="recur_task">
        <RecurringTask
          :recurring_task="recurring_task"
          v-on:update="updateData"
          v-on:errorAlert="errorAlert"
        />
      </v-tab-item>

      <v-tab-item key="completed_task">
        <CompletedTask
          :tasks="completed_tasks"
          :tasks_formatted="formatted_completed_tasks"
          :task_list="com_task_list"
          :selectedTask="selectedTask"
          :completed="true"
          :selectedEvent="selectedEvent"
          :logged="logged"
          v-on:updateTask="updateTask"
          v-on:changeTab="tabChange"
        />
      </v-tab-item>

      <v-tab-item key="task_calendar">
        <TaskCalendar
          :logged="logged"
          :tasks="tasks"
          :completed_tasks="completed_tasks"
          :events="tasks.concat(completed_tasks)"
          v-on:changeTab="tabChange"
          v-on:setSelectedEvent="setCalendarEvent"
          v-on:update="updateData"
          v-on:deleteTask="deleteTask"
        />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import utils from "@/js/utils.js";
import taskClass from "@/js/task_class.js";

import TaskCalendar from "@/pages/Task/TaskCalendar";
import TaskView from "@/pages/Task/TaskView";
import RecurringTask from "@/pages/Task/RecurringTask";
import CompletedTask from "@/pages/Task/CompletedTask";

export default {
  components: { TaskCalendar, TaskView, CompletedTask, RecurringTask },
  data() {
    return {
      tab_open: 0,
      utils: utils,
      selectedTask: null,
      show_task: [],
      show_com_task: [],
      selectedEvent: null,

      tasks: [],
      recurring_task: [],
      completed_tasks: [],
      formatted_completed_tasks: [],
      task_list: [],
      com_task_list: [],
      taskObj: new taskClass(),
    };
  },
  props: ["timestamp", "task_notify", "logged"],
  async created() {
    this.$emit("checkLogged");
    if (this.logged) {
      this.taskObj = new taskClass();
      await this.updateData();

      let task_id = this.$route.query.task_id;
      this.tab_open =
        this.$route.query.tab == null ? 0 : parseInt(this.$route.query.tab);
      if (task_id) this.selectedTask = { id: task_id };
    }
  },
  methods: {
    async updateData() {
      await this.taskObj.getTaskDB();
      this.tasks = this.taskObj.tasks;
      this.recurring_task = this.taskObj.recurring_task;
      this.completed_tasks = this.taskObj.completed_tasks;
      this.formatted_completed_tasks = this.taskObj.formatted_completed_tasks;

      var { tmp, com_tmp } = await this.taskObj.getTitles();
      this.task_list = tmp;
      this.com_task_list = com_tmp;
      this.$emit("updateData");
    },
    async tabChange(val) {
      this.tab_open = parseInt(val);
    },
    setCalendarEvent(val) {
      this.selectedEvent = val;
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async addTask(new_task) {
      try {
        const tmp = await this.taskObj.addNewTask(new_task);
        if (tmp.err) {
          this.$emit("errorAlert", tmp.err);
        } else {
          await this.updateData();
          this.$emit("viewAlert", { type: "new_task", data: new_task });
          this.selectedTask = tmp;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async updateTask(tasks) {
      try {
        const tmp = await this.taskObj.updateTask(
          tasks.selectedTask,
          tasks.new_task
        );
        if (tmp.err) {
          this.$emit("errorAlert", tmp.err);
        } else {
          await this.updateData();
          this.$emit("viewAlert", {
            type: "update_task",
            data: tasks.new_task,
          });
          this.selectedTask = tmp;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async completeTask(selectedTask) {
      try {
        let tmp;
        if (selectedTask.type === "recur_expense") {
          tmp = await this.taskObj.completeRecurTask(selectedTask);
        } else if (selectedTask.type === "shopping_list") {
          tmp = await this.taskObj.completeShopListTask(selectedTask);
        } else {
          tmp = await this.taskObj.completeTask(selectedTask);
        }

        if (tmp.err) {
          this.$emit("errorAlert", tmp.err);
        } else {
          await this.updateData();
          this.$emit("viewAlert", {
            type: "complete_task",
            data: selectedTask,
          });
          this.selectedTask = null;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
    async deleteTask(selectedTask) {
      try {
        let tmp = await this.taskObj.deleteTask(selectedTask);

        if (tmp.err) {
          alert(tmp);
        } else {
          this.updateData();
          this.$emit("viewAlert", { type: "delete_task", data: selectedTask });
          this.selectedTask = null;
        }
      } catch (err) {
        console.log(err);
        this.$emit("errorAlert", err);
      }
    },
  },
  watch: {
    async tab_open() {
      this.$emit("checkLogged");
      await this.updateData();
    },
  },
};
</script>
<style></style>
