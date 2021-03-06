/* eslint-disable no-useless-escape */
/* eslint-disable no-constant-condition*/
const moment = require("moment");
const crypto = require('crypto');

class utils {
    static isMobile() {
        var check = false;
        (function (a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                    a
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                    a.substr(0, 4)
                )
            )
                check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    static toPX(value, type) {
        try {
            var w = window,
                d = document,
                e = d.documentElement,
                x = w.innerWidth || e.clientWidth,
                y = w.innerHeight || e.clientHeight;

            if (type == 'vw') {
                return (x * value) / 100;
            } else if (type == 'vh') {
                return (y * value) / 100;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static countDecimals(value) {
        try {
            if (Math.floor(value) === value) return 0;
            return value.toString().split(".")[1].length || 0;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static setFloat2Decimal(value) {
        return (Math.round((parseFloat(value)) * 100) / 100).toFixed(2);
    }

    static toFirstUpperCase(word, isArray) {
        try {
            if (isArray) {
                let formatted = [];
                for (var i = 0; i < word.length; i++) {
                    formatted.push(this.toFirstUpperCaseInner(word[i]));
                }
                return formatted;
            } else {
                return this.toFirstUpperCaseInner(word);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static toFirstUpperCaseInner(word) {
        try {
            if (word) {
                let wordSplit = word.toLowerCase().split(' ');
                let formatted = '';
                for (var i = 0; i < wordSplit.length; i++) {
                    formatted += wordSplit[i].charAt(0).toUpperCase() + wordSplit[i].substring(1) + ' ';
                }
                return formatted.trim();
            }
            return null;
        } catch (err) {
            console.log(err)
            return false;
        }

    }

    static formatDate(date) {
        try {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static formatDate2(date) {
        try {
            let temp = this.getSeperateDate(date);
            return `${temp.day}/${temp.month}/${temp.year}`;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static parseDate(date) {
        try {
            if (!date) return null;
            const [day, month, year] = date.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static momentFormatDate(withTime, date) {
        try {
            if (withTime) {
                return date != null ?
                    moment(date).format("dddd, Do MMMM YYYY, h:mm a") :
                    null;
            } else {
                return date != null ? moment(date).format("dddd, Do MMMM YYYY") : null;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    //Not moment time input (ISOString with substr 10)
    static nextDay(current) {
        try {
            let tmp = moment(current, 'YYYY-MM-DD').add(1, 'days');
            return moment(tmp).format('YYYY-MM-DD');
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    //Not moment time input (ISOString with substr 10)
    static prevDay(current) {
        try {
            let tmp = moment(current, 'YYYY-MM-DD').subtract(1, 'days');
            return moment(tmp).format('YYYY-MM-DD');
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static getToday(withTime) {
        try {
            const today = new Date();
            const tmpdate = today.getDate().toString() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
            if (withTime) {
                let tmptime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                let dateTime = tmpdate + " " + tmptime;
                return dateTime;
            } else {
                return tmpdate;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    //number to string (month)
    static changeToMonth(num) {
        try {
            switch (num) {
                case 1:
                    return "January";
                case 2:
                    return "February";
                case 3:
                    return "March";
                case 4:
                    return "April";
                case 5:
                    return "May";
                case 6:
                    return "June";
                case 7:
                    return "July";
                case 8:
                    return "August";
                case 9:
                    return "September";
                case 10:
                    return "October";
                case 11:
                    return "November";
                case 12:
                    return "December";
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    //Not moment time input (new Date)
    static getSeperateDate(date) {
        try {
            date = new Date(date);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            return {
                day,
                month,
                year
            };
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static async getNextSelectDay(day) {
        try {
            let dayNum = null,
                today = new Date().getTime(),
                d = new Date();
            // month = d.getMonth();
            d.setDate(dayNum);
            if (isNaN(day)) {
                switch (day.toLowerCase()) {
                    case 'monday':
                        dayNum = 1;
                        break;
                    case 'tuesday':
                        dayNum = 2;
                        break;
                    case 'wednesday':
                        dayNum = 3;
                        break;
                    case 'thursday':
                        dayNum = 4;
                        break;
                    case 'friday':
                        dayNum = 5;
                        break;
                    case 'saturday':
                        dayNum = 6;
                        break;
                    case 'sunday':
                        dayNum = 7;
                        break;
                }
            } else {
                dayNum = day;
            }

            while (d.getDay() !== dayNum) {
                d.setDate(d.getDate() + 1);
            }
            while (true) {
                if (d.getTime() > today) {
                    return new Date(d.getTime());
                }
                d.setDate(d.getDate() + 7);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static async getHashId(blockString) {
        try {
            const hashFunction = crypto.createHash('sha256');
            hashFunction.update(blockString);
            return hashFunction.digest('hex');
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static async previousDate(date, change) {
        try {
            if (change == "day") {
                return moment(date).subtract(1, 'days');
            } else if (change == "month") {
                // console.log(date,"===",(moment(date).subtract(1, 'month'))._d)
                return moment(date).subtract(1, 'months');
            } else if (change == "year") {
                return moment(date).subtract(1, 'years');
            }
            return 'error';
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static checkRange(data, choose) {
        try {
            var prevDay = null,
                rangeDay = null,
                today = moment();
            if (choose === 'day') { //1 days range
                prevDay = moment(data.date).subtract(1, 'days');
                rangeDay = moment(data.date).add(1, 'minutes');
            } else if (choose === 'hour') { //2 hours range
                prevDay = moment(data.date).subtract(2, 'hours');
                rangeDay = moment(data.date).add(1, 'hours');
            }
            return today.isBetween(prevDay, rangeDay);
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static checkTime(time, type) {
        try {
            time = new Date(time);
            let prevDay = null,
                rangeDay = null,
                today = moment();
            const tmp = moment(time, "YYYYMMDD HH:mm").fromNow();
            if (type == "second") {
                if (tmp === "a few seconds ago") return true;
                else return false;
            } else if (type == "hour") {
                prevDay = moment(time).subtract(1, 'hours');
                rangeDay = moment(time).add(1, 'minutes');
                return today.isBetween(prevDay, rangeDay);
            } else if (type === "ago") {
                return tmp.includes('ago');
            } else if (type === "day") {
                prevDay = moment(time).subtract(1, 'days');
                rangeDay = moment(time).add(1, 'minutes');
                return today.isBetween(prevDay, rangeDay);
            }
            return false;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static checkTimePast(task) {
        try {
            const past = "ago";
            const tmp = moment(task.start, "YYYYMMDD HH:mm").fromNow();
            if (tmp.includes(past)) {
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static checkDateBefore(type, date) {
        try {
            if (type === 'Weekly') {
                date = this.getNextSelectDay(date.getDay());
                if (moment().diff(date, "days") > -7) return true;
            } else if (type === 'Monthly') {
                date.setMonth(date.getMonth() + 1);
                if (moment().diff(date, "months") > -1) return true;
            } else if (type === 'Yearly') {
                date.setFullYear(date.getFullYear() + 1);
                if (moment().diff(date, "years") > -1) return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static dateDiff(first, second, day) {
        try {
            if (day) return moment(first).diff(moment(second), 'days');
            else return moment(first).diff(moment(second), 'hours');
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static findExist(data) {
        try {
            data.taskAdded = data.taskAdded == null ? [] : data.taskAdded;
            let tmpDate = new Date(data.date);
            if (data.taskAdded == null) return false;
            if (data.taskAdded.findIndex((x) => new Date(x).getTime() === tmpDate.getTime()) >= 0) return true;
            return false;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static formatTaskTypeName(type) {
        try {
            switch (type) {
                case 'shopping_list':
                    return 'Shopping List';
                case 'task':
                    return 'Home Task';
                case 'recur_expense':
                    return 'Recurring Bill';
                case 'recur_task':
                    return 'Recurring Task';
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

export default utils;