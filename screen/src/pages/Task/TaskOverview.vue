<template>
  <v-card flat>
    <v-tabs
      background-color="white"
      color="deep-purple accent-4"
      v-model="tab_open"
    >
      <v-tab key="task"
        ><v-badge
          :value="notifications.length > 0"
          color="pink"
          :content="notifications.length"
        >
          Tasks
        </v-badge></v-tab
      >
      <v-tab key="completed_task">Completed tasks</v-tab>
      <v-tab key="task_calendar">Calendar</v-tab>

      <v-tab-item key="task">
        <div class="m-4">
          <v-overlay :value="addUpdateMenu"></v-overlay>

          <v-dialog v-model="addUpdateMenu" persistent max-width="600px">
            <v-card color="grey lighten-4" min-width="600px" flat>
              <v-toolbar :color="new_task.color" dark>
                <v-toolbar-title v-if="!isUpdate">New Task</v-toolbar-title>
                <v-toolbar-title v-else>Update Task</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-menu offset-y>
                  <template v-slot:activator="{ on: menu }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          icon
                          v-on="{ ...tooltip, ...menu }"
                          class="float-right"
                        >
                          <v-icon>mdi-format-color-fill</v-icon>
                        </v-btn>
                      </template>
                      <span>Change color</span>
                    </v-tooltip>
                  </template>
                  <v-color-picker
                    v-model="new_task.color"
                    mode.sync="hexa"
                    hide-inputs
                  ></v-color-picker>
                </v-menu>

                <v-btn icon @click="addUpdateMenu = false" class="float-right">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-form
                ref="add_form"
                v-model="add_valid"
                class="p-4"
                lazy-validation
              >
                <v-text-field
                  v-model="new_task.name"
                  :rules="inputRules"
                  label="Task Title"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="new_task.description"
                  :rules="inputRules"
                  label="Description"
                  required
                ></v-text-field>

                <v-row>
                  <v-card
                    color="grey lighten-4"
                    flat
                    class="d-flex justify-start ml-2"
                  >
                    <v-checkbox
                      v-model="new_task.one_day"
                      class="mx-2"
                      label="One day Event"
                    ></v-checkbox>
                    <v-expand-transition>
                      <v-checkbox
                        class="mx-2"
                        v-model="new_task.whole_day"
                        label="Whole day Event"
                        v-show="new_task.one_day"
                      ></v-checkbox>
                    </v-expand-transition>
                  </v-card>
                </v-row>
                <v-divider horizontal></v-divider>
                <v-row>
                  <v-col>
                    <v-menu
                      ref="start_menu"
                      v-model="start_menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="new_task.format_start_date"
                          :rules="inputRules"
                          label="Start Date"
                          hint="DD/MM/YYYY format"
                          persistent-hint
                          prepend-icon="mdi-calendar-range"
                          @blur="
                            new_task.start_date = parseDate(start_dateFormatted)
                          "
                          v-on="on"
                          readonly
                          required
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="start_date"
                        no-title
                        :min="today_date"
                        @input="start_menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-expand-transition>
                      <v-card
                        v-show="!new_task.one_day"
                        color="grey lighten-4"
                        flat
                      >
                        <v-menu
                          ref="end_menu"
                          v-model="end_menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="new_task.format_end_date"
                              label="End Date"
                              hint="DD/MM/YYYY format"
                              persistent-hint
                              prepend-icon="mdi-calendar-range"
                              @blur="
                                new_task.end_date = parseDate(end_dateFormatted)
                              "
                              v-on="on"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="end_date"
                            no-title
                            :min="new_task.start_date"
                            @input="end_menu = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-card>
                    </v-expand-transition>
                  </v-col>
                </v-row>

                <v-expand-transition>
                  <v-card
                    flat
                    v-show="!new_task.whole_day"
                    color="grey lighten-4"
                  >
                    <v-divider horizontal></v-divider>
                    <v-row>
                      <v-col cols="6">
                        <v-dialog
                          ref="start_dialog"
                          v-model="start_time_modal"
                          :return-value.sync="new_task.start_time"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="new_task.start_time"
                              label="Start time"
                              prepend-icon="mdi-clock-outline"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="start_time_modal"
                            v-model="new_task.start_time"
                            full-width
                            scrollable
                            :max="new_task.end_time"
                            color="#228B22"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="#228B22"
                              @click="start_time_modal = false"
                              >Cancel</v-btn
                            >
                            <v-btn
                              text
                              color="#228B22"
                              @click="
                                $refs.start_dialog.save(new_task.start_time)
                              "
                              >OK</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="6">
                        <v-dialog
                          ref="end_dialog"
                          v-model="end_time_modal"
                          :return-value.sync="new_task.end_time"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="new_task.end_time"
                              label="End time"
                              prepend-icon="mdi-clock-outline"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="end_time_modal"
                            v-model="new_task.end_time"
                            full-width
                            scrollable
                            :min="min_time"
                            color="#228B22"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="#228B22"
                              @click="end_time_modal = false"
                              >Cancel</v-btn
                            >
                            <v-btn
                              text
                              color="#228B22"
                              @click="$refs.end_dialog.save(new_task.end_time)"
                              >OK</v-btn
                            >
                          </v-time-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-expand-transition>

                <v-btn
                  color="success"
                  v-if="!isUpdate"
                  :disabled="!add_valid"
                  class="mt-8"
                  @click.prevent="validate()"
                >
                  Add Task
                </v-btn>
                <v-btn
                  v-else
                  color="success"
                  :disabled="!add_valid"
                  class="mt-8"
                  @click.prevent="validate()"
                >
                  Update
                </v-btn>
                <v-dialog v-model="deleteAuth" v-if="isUpdate" width="500">
                  <template v-slot:activator="{ on }">
                    <v-btn color="red" dark class="mt-8 ml-2" v-on="on">
                      Delete
                    </v-btn>
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
                        @click="deleteTask(selectedTask)"
                      >
                        I accept
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-form>
            </v-card>
          </v-dialog>

          <v-flex>
            <v-card flat min-height="60vh">
              <v-row>
                <v-col v-if="tasks.length != 0" class="col-4">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        v-model="select"
                        :append-outer-icon="'mdi-send'"
                        :loading="loading"
                        :items="items"
                        :search-input.sync="search"
                        ref="task_search"
                        class="mx-4"
                        flat
                        hide-no-data
                        hide-details
                        label="Search tasks"
                        solo-inverted
                        ><template slot="append-outer">
                          <v-icon @click="resetSearch()" v-if="cancel_icon"
                            >mdi-close-box</v-icon
                          >
                          <v-icon @click="searchTask()">mdi-send</v-icon>
                        </template></v-autocomplete
                      >
                    </v-col>
                    <v-col class="col-3">
                      <v-tooltip right v-if="tasks.length != 0">
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="success"
                            dark
                            v-on="on"
                            class="text-right"
                            @click.prevent="addUpdateMenu = true"
                          >
                            Add Task
                          </v-btn>
                        </template>
                        <span>Add new task</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-card width="100%" min-height="55vh" flat>
                      <v-list dense width="100%">
                        <v-list-item-group v-model="item" color="primary">
                          <v-list-item
                            v-for="(task, index) in show_task"
                            :key="index"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-badge color="pink" dot :value="checkNotifyTime(task)">
                                  <span>{{ task.name }}</span>
                                </v-badge>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                  </v-row>
                  <v-flex text-xs-center>
                    <v-pagination
                      class="m-2"
                      v-model="task_page"
                      :length="task_total_page"
                      circle
                      v-if="task_total_page > 1"
                    />
                  </v-flex>
                </v-col>
                <v-col v-else class="col-4">
                  <v-card v-show="!taskDetailsShow" height="60vh" flat>
                    <v-container fill-height fluid>
                      <v-row align="center" justify="center">
                        <v-col class="text-center">
                          <p>
                            You have no tasks for now. <br />
                            Click the button to add a new task.
                          </p>
                          <v-tooltip right>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="success"
                                dark
                                v-on="on"
                                @click.prevent="addUpdateMenu = true"
                              >
                                Add Task
                              </v-btn>
                            </template>
                            <span>Add new task</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>

                <v-divider class="mx-4" vertical></v-divider>

                <v-col>
                  <v-card height="100%" flat min-height="70vh">
                    <v-expand-transition>
                      <v-card v-show="!taskDetailsShow" height="60vh" flat>
                        <v-container fill-height fluid>
                          <v-row align="center" justify="center">
                            <v-col>
                              <p class="text-center">
                                Click on any task to see the details
                                {{ timestamp }}
                              </p>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-expand-transition>
                    <v-expand-transition>
                      <v-card
                        v-show="selectedTask"
                        v-if="selectedTask"
                        outlined
                        height="70vh"
                      >
                        <v-card-title class="font-weight-black headline">
                          {{ selectedTask.name }}
                        </v-card-title>

                        <v-card-subtitle class="font-weight-medium title">
                          <p v-if="!selectedTask.one_day">
                            <span
                              >{{ momentFormatDate(true, selectedTask.start) }}
                              to
                              {{
                                momentFormatDate(true, selectedTask.end)
                              }}</span
                            >
                          </p>
                          <p v-else>
                            <span v-if="selectedTask.whole_day"
                              >{{
                                momentFormatDate(false, selectedTask.start)
                              }}
                              (Whole Day)</span
                            >
                            <span v-else>
                              {{ momentFormatDate(true, selectedTask.start) }}
                              to
                              {{
                                momentFormatDate(true, selectedTask.end)
                              }}</span
                            >
                          </p>
                        </v-card-subtitle>
                        <v-divider class="mx-4" :inset="true"></v-divider>

                        <v-card min-height="30vh" flat>
                          <v-card-text>
                            <p class="font-regular title">Description</p>
                            {{ selectedTask.description }}
                          </v-card-text>
                        </v-card>

                        <v-divider class="mx-4" :inset="true"></v-divider>
                        <v-card-actions>
                          <v-btn
                            class="mr-2"
                            color="yellow"
                            dark
                            @click.prevent="updateButton()"
                          >
                            Update
                          </v-btn>
                          <v-dialog
                            v-model="completeAuth"
                            v-if="checkNotifyTime(selectedTask)"
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
                                  @click="completeTask(selectedTask)"
                                >
                                  Yes
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-card-actions>
                      </v-card>
                    </v-expand-transition>
                  </v-card>
                </v-col>
              </v-row>
              <!-- <v-tooltip right v-if="tasks.length != 0">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="success"
                    dark
                    v-on="on"
                    class="m-4 text-right"
                    @click.prevent="addUpdateMenu = true"
                  >
                    Add Task
                  </v-btn>
                </template>
                <span>Add new task</span>
              </v-tooltip> -->
            </v-card>
          </v-flex>
        </div>
      </v-tab-item>

      <v-tab-item key="completed_task">
        <v-flex>
          <v-card flat class="m-4" min-height="60vh">
            <v-row>
              <v-col v-if="completed_tasks.length != 0" class="col-4">
                <v-row>
                  <v-autocomplete
                    v-model="select"
                    :loading="loading"
                    :items="items"
                    :search-input.sync="search"
                    class="mx-4"
                    flat
                    hide-no-data
                    hide-details
                    label="Search tasks"
                    solo-inverted
                    ><template slot="append-outer">
                      <v-icon @click="resetSearch()" v-if="cancel_icon"
                        >mdi-close-box</v-icon
                      >
                      <v-icon @click="searchTask()">mdi-send</v-icon>
                    </template></v-autocomplete
                  >
                </v-row>
                <v-row>
                  <v-list dense width="100%">
                    <v-list-item-group v-model="item" color="primary">
                      <v-list-item
                        v-for="(task, index) in completed_tasks"
                        :key="index"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="task.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                  <v-flex text-xs-center>
                    <v-pagination
                      class="m-2"
                      v-model="com_task_page"
                      :length="com_task_total_page"
                      circle
                      v-if="com_task_total_page > 1"
                    />
                  </v-flex>
                </v-row>
              </v-col>
              <v-col v-else class="col-4">
                <v-card v-show="!taskDetailsShow" height="60vh" flat>
                  <v-container fill-height fluid>
                    <v-row align="center" justify="center">
                      <v-col class="text-center">
                        <p>
                          You have not completed any tasks yet. <br />
                          Click the button to view tasks.
                        </p>
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              color="success"
                              dark
                              v-on="on"
                              @click.prevent="tab_open = 0"
                            >
                              View Task
                            </v-btn>
                          </template>
                          <span>Add new task</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>

              <v-divider class="mx-4" vertical></v-divider>

              <v-col>
                <v-card height="100%" flat min-height="70vh">
                  <v-expand-transition>
                    <v-card v-show="!taskDetailsShow" height="60vh" flat>
                      <v-container fill-height fluid>
                        <v-row align="center" justify="center">
                          <v-col>
                            <p class="text-center">
                              Click on any task to see the details
                              {{ timestamp }}
                            </p>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-expand-transition>
                  <v-expand-transition>
                    <v-card
                      v-show="selectedTask"
                      v-if="selectedTask"
                      outlined
                      height="70vh"
                    >
                      <v-card-title class="font-weight-black headline">
                        {{ selectedTask.name }}
                      </v-card-title>

                      <v-card-subtitle class="font-weight-medium title">
                        <p v-if="!selectedTask.one_day">
                          <span
                            >{{ momentFormatDate(true, selectedTask.start) }}
                            to
                            {{ momentFormatDate(true, selectedTask.end) }}</span
                          >
                        </p>
                        <p v-else>
                          <span v-if="selectedTask.whole_day"
                            >{{
                              momentFormatDate(false, selectedTask.start)
                            }}
                            (Whole Day)</span
                          >
                          <span v-else>
                            {{ momentFormatDate(true, selectedTask.start) }}
                            to
                            {{ momentFormatDate(true, selectedTask.end) }}</span
                          >
                        </p>
                      </v-card-subtitle>
                      <v-divider class="mx-4" :inset="true"></v-divider>

                      <v-card min-height="30vh" flat>
                        <v-card-text>
                          <p class="font-regular title">Description</p>
                          {{ selectedTask.description }}
                        </v-card-text>
                      </v-card>
                    </v-card>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-flex>
      </v-tab-item>

      <v-tab-item key="task_calendar">
        <v-card class="m-2" min-height="80vh" flat>
          <v-card flat>
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
                        <v-list-item @click="type = '4day'">
                          <v-list-item-title>4 days</v-list-item-title>
                        </v-list-item>
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
                              <v-icon @click="viewEvent()"
                                >mdi-eye-outline</v-icon
                              >
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
                        <v-dialog v-model="deleteAuth" width="500">
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
                        <!-- <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                              <v-icon @click="deleteEvent(selectedEvent)"
                                >mdi-delete</v-icon
                              >
                            </v-btn>
                          </template>
                          <span>Delete</span>
                        </v-tooltip> -->
                      </v-toolbar>
                      <v-card-text>
                        <span v-html="selectedEvent.start"></span><br />
                        <span v-html="selectedEvent.end"></span><br />
                        <span v-html="selectedEvent.description"></span>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          text
                          color="secondary"
                          @click="selectedOpen = false"
                        >
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <!-- <v-snackbar v-model="notifications_snackbar" :timeout="0" top>
      {{ notify_message }}
      <v-btn color="pink" text @click="setNotifyAcknowledge()">
        Close
      </v-btn>
    </v-snackbar> -->
  </v-card>
</template>
<script>
const moment = require("moment");
import { CONST } from "@/api/const.js";
import tasksApi from "@/api/task_api.js";
import taskClass from "@/model/task_class.js";

export default {
  data() {
    return {
      cancel_icon: false,
      tab_open: 0,
      tab_open_clone: 0,
      inputRules: [v => !!v || "Required!"],
      add_valid: false,
      new_task: {
        name: null,
        start: null, // if(!whole_day) start_date + start_time else start_date
        end: null, // if(!whole_day) end_date + end_time else end_date
        one_day: false,
        whole_day: false,
        description: null,
        color: "#228B22",
        start_date: new Date().toISOString().substr(0, 10),
        start_time: null,
        end_date: new Date().toISOString().substr(0, 10),
        end_time: null,
        format_start_date: this.formatDate(this.today_date),
        format_end_date: this.formatDate(this.today_date)
      },
      today: new Date().toISOString().substr(0, 10),
      today_date: new Date().toISOString().substr(0, 10),
      start_dateFormatted: this.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      start_menu: false,
      end_dateFormatted: this.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      end_menu: false,

      start_date: null,
      end_date: null,
      start_time: null,

      start_time_modal: false,
      end_time_modal: false,
      min_time: null,
      isUpdate: false,
      deleteAuth: false,
      completeAuth: false,
      taskDetailsShow: false,
      addUpdateMenu: false,
      loading: false,
      items: [],
      search: null,
      select: null,
      task_page: 1,
      task_total_page: 1,
      com_task_page: 1,
      com_task_total_page: 1,
      selectedTask: null,

      item: null,
      show_task: [],
      show_com_task: [],

      tasks: [],
      completed_tasks: [],
      task_list: [],
      com_task_list: [],
      taskObj: new taskClass(),

      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: []
      // notifications: [],
      // notify_message: null,
      // notifications_snackbar: false,
      // notifyTask: null
    };
  },
  props: ["timestamp", "notifications"],
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
    var { tmp, com_tmp } = await this.taskObj.getTitles();
    this.task_list = tmp;
    this.com_task_list = com_tmp;
    this.setTaskPages(1);
    this.setComTaskPages(1);
    
    if (this.$route.query.id) {
      this.item = parseInt(this.$route.query.id);
      this.setDetails(true, this.$route.query.id);
    }
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
        month: "long"
      });
    }
  },
  methods: {
    checkNotifyTime(selectedTask) {
      const past = "ago";
      const tmp = moment(selectedTask.start, "YYYYMMDD HH:mm").fromNow();
      if (tmp.includes(past)) {
        return true;
      }
      return false;
    },
    setTaskPages(page) {
      if (this.tasks) {
        this.task_total_page = Math.ceil(
          this.tasks.length / CONST.CONST_page_limit
        );
        if (page <= this.task_total_page) {
          this.show_task = this.tasks.slice(
            CONST.CONST_page_limit * (page - 1),
            CONST.CONST_page_limit * page
          );
          this.task_page = parseInt(page);
        } else {
          this.show_task = this.tasks.slice(
            CONST.CONST_page_limit * (this.task_total_page - 1),
            CONST.CONST_page_limit * this.task_total_page
          );
          this.task_page = parseInt(this.task_total_page);
        }
      }
    },
    setComTaskPages(page) {
      if (this.completed_tasks) {
        this.com_task_total_page = Math.ceil(
          this.completed_tasks.length / CONST.CONST_page_limit
        );

        if (page <= this.com_task_total_page) {
          this.show_com_task = this.completed_tasks.slice(
            CONST.CONST_page_limit * (page - 1),
            CONST.CONST_page_limit * page
          );
          this.com_task_page = parseInt(page);
        } else {
          this.show_com_task = this.completed_tasks.slice(
            CONST.CONST_page_limit * (this.com_task_total_page - 1),
            CONST.CONST_page_limit * this.com_task_total_page
          );
          this.com_task_page = parseInt(this.com_task_total_page);
        }
      }
    },
    toPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    },
    async validate() {
      this.$refs.add_form.validate();
      if (
        this.new_task.name &&
        this.new_task.start_date &&
        this.new_task.description
      ) {
        if (!this.isUpdate) {
          try {
            const new_task = JSON.parse(JSON.stringify(this.new_task));
            const tmp = await this.taskObj.addNewTask(this.new_task);
            if (tmp.err) {
              alert(tmp);
            } else {
              this.tasks = tmp;
              const index = this.checkPage(new_task);
              this.setTaskPages(this.task_page);
              this.item = index;
            }
          } catch (err) {
            alert(err);
          }
        } else {
          try {
            const tmp = await this.taskObj.updateTask(
              this.selectedTask,
              this.new_task
            );
            if (tmp.err) {
              alert(tmp);
            } else {
              this.tasks = tmp.tasks;
              this.selectedTask = this.tasks[tmp.index];
              this.setTaskPages(this.task_page);
            }
          } catch (err) {
            alert(err);
          }
        }
      }
      this.setChangesTask();
      setTimeout(() => {
        this.addUpdateMenu = false;
      }, 100);
    },
    async completeTask(selectedTask) {
      try {
        const tmp = await this.taskObj.completeTask(selectedTask);
        if (tmp.err) {
          alert(tmp);
        } else {
          this.tasks = tmp.tasks;
          this.completed_tasks = tmp.completed_tasks;
          this.setTaskPages(this.task_page);
        }
        this.selectedTask = null;
      } catch (err) {
        alert(err);
      }
      this.setChangesTask();
      this.setTaskPages(this.task_page);
      this.completeAuth = false;
    },
    async deleteTask(selectedTask) {
      try {
        const tmp = await this.taskObj.deleteTask(selectedTask);
        if (tmp.err) {
          alert(tmp);
        } else {
          this.tasks = tmp;
          this.setTaskPages(this.task_page);
        }
        this.selectedTask = null;
      } catch (err) {
        alert(err);
      }
      this.setChangesTask();
      this.addUpdateMenu = false;
      this.deleteAuth = false;
    },
    updateButton() {
      this.addUpdateMenu = true;
      this.isUpdate = true;
      this.new_task = JSON.parse(JSON.stringify(this.selectedTask));
      this.setDateBlur(this.new_task);
    },
    setDetails(created, id) {
      if (created) {
        for (var i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].id == id) {
            this.item = i;
          }
        }
      } else {
        if (this.tab_open === 0) {
          this.selectedTask = this.show_task[id];
        }
        if (this.tab_open === 1) {
          this.selectedTask = this.show_com_task[id];
        }
      }
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      if (this.tab_open == 0) {
        setTimeout(() => {
          this.items = this.task_list.filter(e => {
            return (
              (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
            );
          });
          this.loading = false;
        }, 500);
      }
      if (this.tab_open == 1) {
        setTimeout(() => {
          this.items = this.com_task_list.filter(e => {
            return (
              (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
            );
          });
          this.loading = false;
        }, 500);
      }
    },
    resetSearch() {
      this.cancel_icon = false;
      this.select = null;
      this.search = null;
      this.item = null;
      if (this.tab_open == 0) {
        this.setTaskPages(1);
      }
      if (this.tab_open == 1) {
        this.setComTaskPages(1);
      }
    },
    searchTask() {
      if (this.tab_open == 0) {
        this.show_task = [];
        this.show_task = this.tasks.reduce((data, x) => {
          if (x.name == this.search) {
            data.push(x);
          }
          return data;
        }, []);
      }
      if (this.tab_open == 1) {
        this.show_com_task = [];
        this.show_com_task = this.completed_tasks.reduce((data, x) => {
          if (x.name == this.search) {
            data.push(x);
          }
          return data;
        }, []);
      }

      this.item = 0;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    momentFormatDate(withTime, date) {
      if (withTime) {
        return date != null
          ? moment(date).format("dddd, Do MMMM YYYY, h:mm a")
          : null;
      } else {
        return date != null ? moment(date).format("dddd, Do MMMM YYYY") : null;
      }
    },
    setDateBlur(task) {
      this.start_dateFormatted = this.formatDate(task.start_date);
      this.end_dateFormatted = this.formatDate(task.end_date);
      this.start_date = this.parseDate(this.start_dateFormatted);
      this.end_date = this.parseDate(this.end_dateFormatted);
    },
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
      this.events = this.tasks.concat(this.completed_tasks);
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    async viewEvent() {
      this.selectedOpen = false;
      if (this.selectedEvent.completed) {
        this.tab_open = 1;
      } else {
        this.tab_open = 0;
      }
      const findData = await this.checkPage(this.selectedEvent);
      this.item = parseInt(findData);
    },
    async editEvent() {
      this.selectedOpen = false;
      if (!this.selectedEvent.completed) {
        this.tab_open = 0;
        const findData = await this.checkPage(this.selectedEvent);
        this.item = parseInt(findData);
        setTimeout(() => {
          this.addUpdateMenu = true;
          this.new_task = JSON.parse(JSON.stringify(this.selectedTask));
          this.isUpdate = true;
        }, 500);
      }
    },
    async checkPage(find) {
      if (this.tab_open == 0) {
        for (var i = 1; i <= this.task_total_page; i++) {
          this.setTaskPages(i);
          const tmpShowTask = this.show_task.findIndex(x => x === find);
          if (tmpShowTask > -1) {
            return tmpShowTask;
          }
        }
      }
      if (this.tab_open == 1) {
        for (var j = 1; j <= this.com_task_total_page; j++) {
          this.setTaskPages(j);
          const tmpShowTask = this.show_com_task.findIndex(x => x === find);
          if (tmpShowTask > -1) {
            return tmpShowTask;
          }
        }
      }

      return -1; //should never happen
    },
    async deleteEvent(data) {
      try {
        const tmp = await this.taskObj.deleteTask(data);
        if (tmp.err) {
          alert(tmp);
        } else {
          this.tasks = tmp;
        }
        this.selectedOpen = false;
      } catch (err) {
        alert(err);
      }
    },
    setChangesTask() {
      this.$emit("setChangesTask", this.tasks);
    },
    setChangesComTask() {
      this.$emit("setChangesComTask", this.completed_tasks);
    }
  },
  watch: {
    item: async function(val) {
      if (val == null) {
        this.selectedTask = null;
      } else {
        this.setDetails(false, val);
      }
    },
    search(val) {
      if (val != null) {
        this.cancel_icon = true;
      }
      val && val !== this.select && this.querySelections(val);
    },
    addUpdateMenu: function() {
      if (!this.addUpdateMenu) {
        this.$refs.add_form.reset();
        this.isUpdate = false;
      }
      setTimeout(() => {
        //BUG - end_date should be 1 day ahead
        if (!this.isUpdate) {
          this.new_task.format_start_date = this.formatDate(this.today_date);
          this.new_task.format_end_date = this.formatDate(this.today_date);
          this.start_dateFormatted = this.formatDate(this.today_date);
          this.end_dateFormatted = this.formatDate(this.today_date);
          this.start_date = this.parseDate(this.start_dateFormatted);
          this.end_date = this.parseDate(this.end_dateFormatted);
        }
      }, 500);
    },
    start_date: function() {
      this.new_task.start_date = this.start_date;
      this.new_task.format_start_date = this.formatDate(this.start_date);
      this.start_dateFormatted = this.formatDate(this.new_task.start_date);
    },
    end_date() {
      this.new_task.end_date = this.end_date;
      this.new_task.format_end_date = this.formatDate(this.end_date);
      this.end_dateFormatted = this.formatDate(this.new_task.end_date);
    },
    one_day: function() {
      if (!this.new_task.one_day) {
        this.new_task.whole_day = false;
        this.min_time = null;
      } else {
        this.min_time = this.new_task.start_time;
      }
    },
    start_time() {
      this.new_task.start_time = this.start_time;
      if (this.new_task.one_day) {
        this.min_time = this.new_task.start_time;
      }
    },
    selectedTask() {
      if (this.selectedTask) {
        this.taskDetailsShow = true;
      } else {
        this.taskDetailsShow = false;
      }
    },
    tasks() {
      this.events = this.tasks.concat(this.completed_tasks);
    },
    task_page(val) {
      this.item = null;
      this.setTaskPages(val);
    },
    com_task_page(val) {
      this.item = null;
      this.setComTaskPages(val);
    },
    tab_open() {
      if (
        (this.tab_open == 0 && this.tab_open_clone == 1) ||
        (this.tab_open == 1 && this.tab_open_clone == 0)
      ) {
        this.search = null;
        this.select = null;
        this.item = null;
        this.tab_open_clone = parseInt(JSON.stringify(this.tab_open));
        if (this.tab_open == 1) {
          this.resetSearch();
          this.items = this.com_task_list;
        }
        if (this.tab_open == 0) {
          this.resetSearch();
          this.items = this.task_list;
        }
      }
    }
  }
};
</script>
<style></style>
