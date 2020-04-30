/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import axios from "axios";
import { CONST } from './const';
const moment = require("moment");
const url = CONST.CONST_URL.concat('/notification/');

export default class notificationClass {
    constructor() {
        var notification = {};
        var latest_notification = {};
    }
    get notification() {
        return this._notification;
    }
    set notification(in_notification) {
        this._notification = in_notification;
    }

    get latest_notification() {
        return this._latest_notification;
    }
    set latest_notification(in_latest_notification) {
        this._latest_notification = in_latest_notification;
    }

    //methods
    async addNotification(data, type) {
        try {
            await this.getNotifyDB();
            data.notify_date = new Date();
            let { yearIndex, monthIndex, dayIndex } = await this.getIndex(data);

            if (yearIndex < 0) {
                await this.addObj('year', data);
            } else if (monthIndex < 0) {
                await this.addObj('month', data);
            } else if (dayIndex < 0) {
                await this.addObj('day', data);
            }

            let index = await this.getIndex(data);
            let tmpData;
            let id = await utils.getHashId(`${Date.now()}-${JSON.stringify(data)}`);

            if (type === 'task') {
                tmpData = { id: id, data_id: data.id, name: data.name, description: data.description, notify_date: data.notify_date, msg: 'You have a task scheduled', start: data.start, end: data.end, seen: false, page: `task_ov/?tid=${data.id}` };
            } else if (type === 'recur_expense') {
                tmpData = { id: id, data_id: data.id, name: data.title, description: data.description, notify_date: data.notify_date, msg: 'A recurring payment task has been set', date: data.date, seen: false, page: `task_ov/?tid=${data.id}` };
            } else {
                return 'noTypeSet'; // should not happen
            }
            this.notification[index.yearIndex].data[index.monthIndex].data[index.dayIndex].data.push(tmpData);
            await this.updateNotifyDB();
            return 1;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getLatestNotification() {
        try {
            let tmp = [];
            if (this.notification.length > 0) {
                for (var i = this.notification.length - 1; i >= 0; i--) {
                    for (var j = this.notification[i].data.length - 1; j >= 0; j--) {
                        for (var k = this.notification[i].data[j].data.length - 1; k >= 0; k--) {
                            for (var l = this.notification[i].data[j].data[k].data.length - 1; l >= 0; l--) {
                                tmp.push(this.notification[i].data[j].data[k].data[l]);
                                if (tmp.length === 10) break;
                            }
                        }
                    }
                }
            }
            this.latest_notification = tmp;
            return this.latest_notification;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async addObj(string, data) {
        try {
            let { day, month, year } = utils.getSeperateDate(data.notify_date);
            let { yearIndex, monthIndex, dayIndex, dataIndex } = await this.getIndex(data);
            if (string === 'year') {
                if (!this.notification) {
                    this.notification = [];
                }
                this.notification.push(
                    {
                        year: year,
                        data: [
                            {
                                month: month,
                                data: [
                                    {
                                        day: day,
                                        date: data.notify_date,
                                        data: []
                                    }
                                ]
                            }
                        ],
                    }
                );
            } else if (string === 'month') {
                this.notification[yearIndex].data.push(
                    {
                        month: month,
                        data: [
                            {
                                day: day,
                                date: data.notify_date,
                                data: []
                            }
                        ],
                    }
                );
            } else if (string === 'day') {
                this.notification[yearIndex].data[monthIndex].data.push(
                    {
                        day: day,
                        date: data.notify_date,
                        data: [],
                    }
                );
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async setSeen(data) {
        try {
            await this.getNotifyDB();
            let index = await this.getIndex(data);
            this.notification[index.yearIndex].data[index.monthIndex].data[index.dayIndex].data[index.dataIndex].seen = true;
            let tmp = await this.getLatestNotification();
            await this.updateNotifyDB();
            return this.latest_notification;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getIndex(data) {
        try {
            let { day, month, year } = utils.getSeperateDate(new Date(data.notify_date));
            let yearIndex = this.notification == null ? parseInt('-1') : this.notification.findIndex(x => x.year == year);
            let monthIndex = yearIndex < 0 ? parseInt('-1') : this.notification[yearIndex].data.findIndex(x => x.month == month);
            let dayIndex = monthIndex < 0 ? parseInt('-1') : this.notification[yearIndex].data[monthIndex].data.findIndex(x => x.day == day);
            let dataIndex = dayIndex < 0 ? parseInt('-1') : this.notification[yearIndex].data[monthIndex].data[dayIndex].data.findIndex(x => x.id == data.id);
            return { yearIndex, monthIndex, dayIndex, dataIndex };
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getNotifyDB() {
        try {
            const res = await axios.get(`${url}get`, {
                withCredentials: true
            });
            this.notification = res.data[0].notification != null ? res.data[0].notification : [];
            await this.getLatestNotification();
            return { notification: res.data[0].notification, latest_notification: this.latest_notification };
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async updateNotifyDB() {
        let notifyObj = this.toJson();
        try {
            const res = await axios.post(`${url}update`, {
                notifyObj
            }, {
                withCredentials: true
            });
            return res.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    toJson() {
        let temp = JSON.stringify(this);
        return JSON.parse(temp);
    }
}