/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import axios from "axios";
import {
    CONST
} from './const';
import taskClass from './task_class';
import notificationClass from './notification';
const url = CONST.CONST_URL.concat('/expenses/');

export default class expenseClass {
    constructor() {
        var expenses = [];
        var recurring_payment = [];
        var all_categories = ['Transportation', 'Food', 'Utilities', 'Insurance', 'Housing', 'Healthcare', 'Entertainment', 'Miscellaneous', 'Recurring Payment'];
        var all_time_amount_spent = {
            total: 0
        };
        var all_time_amount_received = {
            total: 0
        };
    }

    get expenses() {
        return this._expenses;
    }
    set expenses(in_expenses) {
        this._expenses = in_expenses;
    }

    get recurring_payment() {
        return this._recurring_payment;
    }
    set recurring_payment(in_recurring_payment) {
        this._recurring_payment = in_recurring_payment;
    }

    get all_categories() {
        return this._all_categories;
    }
    set all_categories(in_all_categories) {
        this._all_categories = in_all_categories;
    }

    get all_time_amount_spent() {
        return this._all_time_amount_spent;
    }
    set all_time_amount_spent(in_all_time_amount_spent) {
        this._all_time_amount_spent = in_all_time_amount_spent;
    }

    get all_time_amount_received() {
        return this._all_time_amount_received;
    }
    set all_time_amount_received(in_all_time_amount_received) {
        this._all_time_amount_received = in_all_time_amount_received;
    }

    //methods
    async addNewExpense(data) {
        try {
            await this.getExpDB();
            data.id = null;
            let {
                yearIndex,
                monthIndex,
                dayIndex
            } = await this.getIndex(data);
            let tmpData = await this.toData(data);

            if (yearIndex < 0) {
                await this.addObj('year', data);
            } else if (monthIndex < 0) {
                await this.addObj('month', data);
            } else if (dayIndex < 0) {
                await this.addObj('day', data);
            }

            let index = await this.getIndex(data);
            this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].data.push(tmpData);
            await this.syncTotalSpending();
            const tmp = await this.updateExpDB();
            return tmpData;
        } catch (err) {
            return err;
        }
    }

    async updateExpense(old_data, new_data) {
        try {
            await this.getExpDB();
            let index = await this.getIndex(old_data);
            let tmpData = await this.toData(new_data);
            this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].data[index.dataIndex] = tmpData;

            await this.syncTotalSpending();
            await this.updateExpDB();
            return new_data;
        } catch (err) {
            return err;
        }
    }

    async deleteExpense(data) {
        try {
            await this.getExpDB();
            let {
                yearIndex,
                monthIndex,
                dayIndex,
                dataIndex
            } = await this.getIndex(data);
            this.expenses[yearIndex].data[monthIndex].data[dayIndex].data.splice(dataIndex, 1);

            await this.syncTotalSpending();
            const tmp = await this.updateExpDB();
            return tmp;
        } catch (err) {
            return err;
        }
    }

    async addRecurTask(data, date) {
        try {
            await this.getExpDB();
            let notifyObj = new notificationClass();
            let taskObj = new taskClass();
            let index = await this.getRecurIndex(data);
            let tmpData = {
                recur_id: data.id,
                type: data.type,
                name: data.title,
                description: data.description,
                start_date: new Date(date).toISOString().substr(0, 10),
                end_date: new Date(date).toISOString().substr(0, 10),
                one_day: true,
                whole_day: true,
                color: 'green',
                amount: data.amount
            };

            await taskObj.addNewTask(tmpData);
            await this.recordRecur(index);
            await notifyObj.addNotification(data, 'recur_expense');
            await this.updateExpDB();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async addNewRecur(data) {
        try {
            await this.getExpDB();
            let tmpData = await this.toRecurData(data);
            this.recurring_payment.push(tmpData);
            await this.setRecurNext();
            const tmp = await this.updateExpDB();
            return tmp;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async updateRecur(old_data, new_data) {
        try {
            await this.getExpDB();
            let index = await this.getRecurIndex(old_data);
            let tmpData = await this.toRecurData(new_data);
            this.recurring_payment[index] = tmpData;
            await this.setRecurNext();
            await this.updateExpDB();
            return tmpData;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async deleteRecur(data) {
        try {
            await this.getExpDB();
            let index = await this.getRecurIndex(data);
            this.recurring_payment.splice(index, 1);
            const tmp = await this.updateExpDB();
            return tmp;
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
            } = utils.getSeperateDate(data.date);
            let {
                yearIndex,
                monthIndex,
                dayIndex,
                dataIndex
            } = await this.getIndex(data);
            if (string === 'year') {
                if (!this.expenses) {
                    this.expenses = [];
                }
                this.expenses.push({
                    year: year,
                    year_total_spent: {
                        total: 0
                    },
                    year_total_received: {
                        total: 0
                    },
                    data: [{
                        month: month,
                        month_total_spent: {
                            total: 0
                        },
                        month_total_received: {
                            total: 0
                        },
                        data: [{
                            day: day,
                            day_total_spent: {
                                total: 0
                            },
                            day_total_received: {
                                total: 0
                            },
                            date: data.date,
                            data: []
                        }]
                    }],
                    total: {}
                });
            } else if (string === 'month') {
                this.expenses[yearIndex].data.push({
                    month: month,
                    data: [{
                        day: day,
                        day_total_spent: {
                            total: 0
                        },
                        day_total_received: {
                            total: 0
                        },
                        date: data.date,
                        data: []
                    }],
                    month_total_spent: {
                        total: 0
                    },
                    month_total_received: {
                        total: 0
                    },
                });
            } else if (string === 'day') {
                this.expenses[yearIndex].data[monthIndex].data.push({
                    day: day,
                    day_total_spent: {
                        total: 0
                    },
                    day_total_received: {
                        total: 0
                    },
                    date: data.date,
                    data: [],
                });
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    //TO ADD CATEGORIES
    async syncTotalSpending() {
        try {
            await this.setTotalNull();

            for (var i = 0; i < this.expenses.length; i++) {
                for (var j = 0; j < this.expenses[i].data.length; j++) {
                    for (var k = 0; k < this.expenses[i].data[j].data.length; k++) {
                        for (var l = 0; l < this.expenses[i].data[j].data[k].data.length; l++) {
                            let current = this.expenses[i].data[j].data[k].data;
                            if (current[l].category != null) {
                                if (current[l].money_in) {
                                    this.expenses[i].data[j].data[k].day_total_received[current[l].category] += parseFloat(current[l].amount);
                                    this.expenses[i].data[j].data[k].day_total_received.total += parseFloat(current[l].amount);
                                } else {
                                    this.expenses[i].data[j].data[k].day_total_spent[current[l].category] += parseFloat(current[l].amount);
                                    this.expenses[i].data[j].data[k].day_total_spent.total += parseFloat(current[l].amount);
                                }
                            }
                        }
                        let current = this.expenses[i].data[j].data;
                        for (var n = 0; n < this.all_categories.length; n++) {
                            this.expenses[i].data[j].month_total_received[this.all_categories[n]] += parseFloat(current[k].day_total_received[this.all_categories[n]]);
                            this.expenses[i].data[j].month_total_spent[this.all_categories[n]] += parseFloat(current[k].day_total_spent[this.all_categories[n]]);
                        }
                        this.expenses[i].data[j].month_total_received.total += parseFloat(current[k].day_total_received.total);
                        this.expenses[i].data[j].month_total_spent.total += parseFloat(current[k].day_total_spent.total);
                    }
                    let current = this.expenses[i].data;
                    for (var o = 0; o < this.all_categories.length; o++) {
                        this.expenses[i].year_total_received[this.all_categories[o]] += parseFloat(current[j].month_total_received[this.all_categories[o]]);
                        this.expenses[i].year_total_spent[this.all_categories[o]] += parseFloat(current[j].month_total_spent[this.all_categories[o]]);
                    }
                    this.expenses[i].year_total_spent.total += parseFloat(current[j].month_total_spent.total);
                    this.expenses[i].year_total_received.total += parseFloat(current[j].month_total_received.total);
                }
                this.all_time_amount_spent.total += parseFloat(this.expenses[i].year_total_spent.total);
                this.all_time_amount_received.total += parseFloat(this.expenses[i].year_total_received.total);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async setTotalNull() {
        try {
            for (var i = 0; i < this.expenses.length; i++) {
                for (var j = 0; j < this.expenses[i].data.length; j++) {
                    for (var k = 0; k < this.expenses[i].data[j].data.length; k++) {
                        for (var l = 0; l < this.expenses[i].data[j].data[k].data.length; l++) {
                            this.expenses[i].data[j].data[k].day_total_received = {
                                total: 0
                            };
                            this.expenses[i].data[j].data[k].day_total_spent = {
                                total: 0
                            };
                            for (var m = 0; m < this.all_categories.length; m++) {
                                this.expenses[i].data[j].data[k].day_total_received[this.all_categories[m]] = 0;
                                this.expenses[i].data[j].data[k].day_total_spent[this.all_categories[m]] = 0;
                            }
                        }
                        this.expenses[i].data[j].month_total_received = {
                            total: 0
                        };
                        this.expenses[i].data[j].month_total_spent = {
                            total: 0
                        };
                        for (var n = 0; n < this.all_categories.length; n++) {
                            this.expenses[i].data[j].month_total_received[this.all_categories[n]] = 0;
                            this.expenses[i].data[j].month_total_spent[this.all_categories[n]] = 0;
                        }
                    }
                    this.expenses[i].year_total_spent = {
                        total: 0
                    };
                    this.expenses[i].year_total_received = {
                        total: 0
                    };
                    for (var o = 0; o < this.all_categories.length; o++) {
                        this.expenses[i].year_total_received[this.all_categories[o]] = 0;
                        this.expenses[i].year_total_spent[this.all_categories[o]] = 0;
                    }
                }
                this.all_time_amount_spent = {
                    total: 0
                };
                this.all_time_amount_received = {
                    total: 0
                };
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async setRecurNext() {
        try {
            let today = new Date();
            for (var i = 0; i < this.recurring_payment.length; i++) {
                if (this.recurring_payment[i].category === 'Weekly') {
                    let date = await utils.getNextSelectDay(this.recurring_payment[i].day);
                    this.recurring_payment[i].date = date;
                } else if (this.recurring_payment[i].category === 'Monthly') {
                    let date = new Date(today.getFullYear(), today.getMonth(), this.recurring_payment[i].day);
                    if (date.getTime() > today.getTime()) {
                        this.recurring_payment[i].date = date;
                    } else {
                        // while(today.getTime() > date.getTime()) {
                        //     date = date.setMonth(date.getMonth()+1);
                        //     console.log(new Date(date))
                        // }
                        this.recurring_payment[i].date = date.setMonth(date.getMonth() + 1);
                    }
                } else { //this.recurring_payment[i].category === 'Annually
                    let date = new Date(today.getFullYear(), parseInt(this.recurring_payment[i].month) - 1, this.recurring_payment[i].day);
                    if (date.getTime() > today.getTime()) {
                        this.recurring_payment[i].date = date;
                    } else {
                        this.recurring_payment[i].date = date.setFullYear(date.getFullYear() + 1);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getIndex(data) {
        try {
            let {
                day,
                month,
                year
            } = utils.getSeperateDate(new Date(data.date));
            let yearIndex = this.expenses == null ? parseInt('-1') : this.expenses.findIndex(x => x.year == year);
            let monthIndex = yearIndex < 0 ? parseInt('-1') : this.expenses[yearIndex].data.findIndex(x => x.month == month);
            let dayIndex = monthIndex < 0 ? parseInt('-1') : this.expenses[yearIndex].data[monthIndex].data.findIndex(x => x.day == day);
            let dataIndex = dayIndex < 0 ? parseInt('-1') : this.expenses[yearIndex].data[monthIndex].data[dayIndex].data.findIndex(x => x.id == data.id);
            return {
                yearIndex,
                monthIndex,
                dayIndex,
                dataIndex
            };
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getRecurIndex(data) {
        return this.recurring_payment.findIndex(x => x.id == data.id);
    }

    async checkRecurAvailability(data) { // return true to add
        try {
            let token = false;
            //check if task has already been added
            let taskAdded = data.taskAdded == null ? [] : data.taskAdded;
            let tmpDate = new Date(data.date);
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

    async getDailyExp(date) {
        try {
            await this.getExpDB();
            let tmp = {
                date: date
            };
            let index = await this.getIndex(tmp);
            if ((index.yearIndex < 0 || index.monthIndex < 0 || index.dayIndex < 0) || this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].data.length == 0) {
                return 'noData';
            } else {
                let chart = await this.getChartData(index, 'daily');
                return {
                    expense: this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex],
                    spent: chart.spent,
                    received: chart.received,
                    total_spent: this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].day_total_spent.total,
                    total_received: this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].day_total_received.total
                };
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getExpDB() {
        try {
            const res = await axios.get(`${url}get`, {
                withCredentials: true
            });
            this.expenses = res.data.expenses != null ? res.data.expenses : [];
            this.all_time_amount_spent = res.data.all_time_amount_spent != null ? parseInt(res.data.all_time_amount_spent) : {
                total: 0
            };
            this.all_time_amount_received = res.data.all_time_amount_received != null ? parseInt(res.data.all_time_amount_received) : {
                total: 0
            };
            // this.all_categories = utils.toFirstUpperCase(res.data.all_categories, true);
            this.all_categories = ['Transportation', 'Food', 'Utilities', 'Insurance', 'Housing', 'Healthcare', 'Entertainment', 'Miscellaneous', 'Recurring Payment'];
            this.recurring_payment = res.data.recurring_payment != null ? res.data.recurring_payment : [];
            await this.setRecurNext();
            return res.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getChartData(index, type) {
        try {
            let spent = [];
            let received = [];
            if (type == 'daily') {
                spent = [
                    ["Category", "Total"]
                ];
                received = [
                    ["Category", "Total"]
                ];
                for (var i = 0; i < this.all_categories.length; i++) {
                    let tmp_spent = [];
                    let tmp_received = [];
                    tmp_spent.push(this.all_categories[i]);
                    tmp_spent.push(this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].day_total_spent[this.all_categories[i]]);

                    tmp_received.push(this.all_categories[i]);
                    tmp_received.push(this.expenses[index.yearIndex].data[index.monthIndex].data[index.dayIndex].day_total_received[this.all_categories[i]]);
                    spent.push(JSON.parse(JSON.stringify(tmp_spent)));
                    received.push(JSON.parse(JSON.stringify(tmp_received)));
                }
            }
            return {
                spent,
                received
            };
        } catch (err) {
            console.log(err);
            return err;
        }

    }

    async updateExpDB() {
        let expObj = this.toJson();
        try {
            const res = await axios.post(`${url}update`, {
                expObj
            }, {
                withCredentials: true
            });
            return res.data;
        } catch (err) {
            return err;
        }
    }

    async recordRecur(index) {
        await this.getExpDB();
        try {
            this.recurring_payment[index].taskAdded = this.recurring_payment[index].taskAdded == null ? [] : this.recurring_payment[index].taskAdded;
            this.recurring_payment[index].taskAdded.push(new Date(this.recurring_payment[index].date));
        } catch (err) {
            console.log(err);
            return err;
        }

    }

    async toData(data) {
        let id = data.id == null ? await utils.getHashId(`${Date.now()}-${JSON.stringify(data)}`) : data.id;
        return {
            id: id,
            type: data.type ? data.type : 'expense',
            date: data.date,
            amount: utils.setFloat2Decimal(data.amount),
            title: data.title,
            description: data.description,
            category: data.category,
            money_in: data.money_in,
            color: data.color
        };
    }

    async toRecurData(data) {
        let id = data.id == null ? await utils.getHashId(`${Date.now()}-${JSON.stringify(data)}`) : data.id;
        return {
            id: id,
            type: 'recur_expense',
            title: data.title,
            description: data.description,
            amount: utils.setFloat2Decimal(data.amount),
            category: data.category,
            color: data.color,
            day: data.day,
            month: data.month
        };
    }

    toJson() {
        let temp = JSON.stringify(this);
        return JSON.parse(temp);
    }

    //methods for processing statistics
    async setGraphData() {
        try {
            await this.getExpDB();
            let graph_expenditure_year = [];
            let graph_savings_year = [];
            let graph_expenditure_month = [];
            let graph_savings_month = [];
            let graph_expenditure_day = [];
            let graph_savings_day = [];

            let time = await utils.getSeperateDate(new Date());
            let time_static = new Date();
            let graph_year = [];
            let graph_month = [];
            let graph_day = [];

            while (graph_year.length < 5) {
                let year = this.expenses.findIndex((x) => x.year === time.year);
                if (year >= 0) {
                    graph_year.push(this.expenses[year]);
                } else {
                    graph_year.push(0);
                }
                time_static = await utils.previousDate(time_static, "year");
                time = await utils.getSeperateDate(new Date(time_static));
            }

            time = await utils.getSeperateDate(new Date());
            time_static = new Date();
            // console.log(time)
            while (graph_month.length < 6) {
                let year = this.expenses.findIndex((x) => x.year === time.year);
                if (year >= 0) {
                    let month = this.expenses[year].data.findIndex(
                        (x) => x.month === time.month
                    );
                    if (month >= 0) {
                        graph_month.push(this.expenses[year].data[month]);
                    } else {
                        graph_month.push(0);
                    }
                    time_static = await utils.previousDate(time_static, "month");
                    time = await utils.getSeperateDate(new Date(time_static));
                } else {
                    while (graph_month.length < 10) {
                        graph_month.push(0);
                    }
                }
            }

            time = await utils.getSeperateDate(new Date());
            let tmp_date = new Date();
            while (graph_day.length < 10) {
                let year = this.expenses.findIndex((x) => x.year === time.year);
                if (year >= 0) {
                    let month = this.expenses[year].data.findIndex(
                        (x) => x.month === time.month
                    );
                    if (month >= 0) {
                        let day = this.expenses[year].data[month].data.findIndex(
                            (x) => x.day === time.day
                        );
                        if (day >= 0) {
                            graph_day.push(this.expenses[year].data[month].data[day]);
                        } else {
                            graph_day.push(0);
                        }
                        tmp_date = await utils.previousDate(tmp_date, "day");
                        time.day = await utils.getSeperateDate(new Date(tmp_date)).day;
                    } else {
                        while (graph_day.length < 10) {
                            graph_day.push(0);
                        }
                    }
                } else {
                    while (graph_day.length < 10) {
                        graph_day.push(0);
                    }
                }
            }

            //year
            for (var i = graph_year.length - 1; i >= 0; i--) {
                if (graph_year[i] == 0) {
                    graph_expenditure_year.push(0);
                    graph_savings_year.push(0);
                } else {
                    graph_expenditure_year.push(
                        graph_year[i].year_total_spent.total
                    );
                    graph_savings_year.push(graph_year[i].year_total_received.total);
                }
            }

            //month
            for (var j = graph_month.length - 1; j >= 0; j--) {
                if (graph_month[j] == 0) {
                    graph_expenditure_month.push(0);
                    graph_savings_month.push(0);
                } else {
                    graph_expenditure_month.push(
                        graph_month[j].month_total_spent.total
                    );
                    graph_savings_month.push(
                        graph_month[j].month_total_received.total
                    );
                }
            }

            //day
            for (var k = graph_day.length - 1; k >= 0; k--) {
                if (graph_day[k] == 0) {
                    graph_expenditure_day.push(0);
                    graph_savings_day.push(0);
                } else {
                    graph_expenditure_day.push(graph_day[k].day_total_spent.total);
                    graph_savings_day.push(graph_day[k].day_total_received.total);
                }
            }

            return {
                graph_expenditure_year,
                graph_savings_year,
                graph_expenditure_month,
                graph_savings_month,
                graph_expenditure_day,
                graph_savings_day
            };
            //   graph_savings = graph_savings_year;
            //   graph_expenditure = graph_expenditure_year;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getStatsData() {
        try {
            await this.getExpDB();
            let stats_tmp = [];
            let year, month, day;
            let time = await utils.getSeperateDate(new Date());
            let tmp;
            var i;

            year = this.expenses.findIndex((x) => x.year === time.year);
            if (year >= 0) {
                month = this.expenses[year].data.findIndex((x) => x.month === time.month);
                if (month >= 0) {
                    day = this.expenses[year].data[month].data.findIndex((x) => x.day === time.day);
                }

                //find most amount spend this year (month)
                tmp = this.expenses[year].data;
                let year_spend_highest = {
                    month_total_spent: {
                        total: 0
                    }
                };
                let year_received_highest = {
                    month_total_received: {
                        total: 0
                    }
                };
                for (i = 0; i < tmp.length; i++) {
                    if (tmp[i].month_total_spent.total > year_spend_highest.month_total_spent.total) {
                        year_spend_highest = tmp[i];
                    }
                    if (tmp[i].month_total_received.total > year_received_highest.month_total_received.total) {
                        year_received_highest = tmp[i];
                    }

                }
                stats_tmp.push(`You spent the most in ${utils.changeToMonth(year_spend_highest.month)} with an amount of RM${year_spend_highest.month_total_spent.total}`);
                stats_tmp.push(`You received the most money in ${utils.changeToMonth(year_received_highest.month)} with an amount of RM${year_received_highest.month_total_received.total}`);

            }


            //check if any amount spend today
            if (day < 0 || month < 0 || year < 0) {
                stats_tmp.push("You have not spent or received anything today.");
            } else {
                if (this.expenses[year].data[month].data[day].day_total_spent.total == 0) {
                    stats_tmp.push("You have not spend anything today.");
                } else {
                    //find amount spend today compared to the day before
                    let yesterday = this.expenses[year].data[month].data.findIndex((x) => x.day === (time.day - 1));
                    if (yesterday >= 0) {
                        if (this.expenses[year].data[month].data[yesterday].day_total_spent.total > 0) {
                            let today = this.expenses[year].data[month].data[day].day_total_spent.total;
                            let before = this.expenses[year].data[month].data[yesterday].day_total_spent.total;

                            if (today > before) {
                                stats_tmp.push(`You have spent ${((today-before)/before)*100}% more compared to yesterday.`);
                            } else {
                                stats_tmp.push(`You have spent ${((before-today)/today)*100}% less compared to yesterday.`);
                            }

                        }
                    }
                }
                if (this.expenses[year].data[month].data[day].day_total_received.total == 0) {
                    stats_tmp.push("You have not received anything today.");
                }


            }

            //find most amount spend this month (day)
            if (month < 0 || year < 0) {
                return stats_tmp;
            } else {
                tmp = this.expenses[year].data[month].data;
                let month_spend_highest = {
                    day_total_spent: {
                        total: 0
                    }
                };
                let month_received_highest = {
                    day_total_received: {
                        total: 0
                    }
                };
                for (i = 0; i < tmp.length; i++) {
                    if (tmp[i].day_total_spent.total > month_spend_highest.day_total_spent.total) {
                        month_spend_highest = tmp[i];
                    }
                    if (tmp[i].day_total_received.total > month_received_highest.day_total_received.total) {
                        month_received_highest = tmp[i];
                    }

                }
                if (month_spend_highest.day_total_spent.total != 0) stats_tmp.push(`You spent the most amount on ${utils.formatDate2(new Date(month_spend_highest.date))} with an amount of RM${month_spend_highest.day_total_spent.total}`);
                if (month_received_highest.day_total_received.total != 0) stats_tmp.push(`You received the most money on ${utils.formatDate2(new Date(month_received_highest.date))} with an amount of RM${month_received_highest.day_total_received.total}`);
            }


            return stats_tmp;
        } catch (err) {
            console.log(err);
            return false;
        }

    }
}