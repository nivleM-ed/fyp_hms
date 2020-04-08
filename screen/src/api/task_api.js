/* eslint-disable no-async-promise-executor */
import axios from "axios";
import {
  CONST
} from './const';
const url = CONST.CONST_URL.concat('/tasks/');

class tasksApi {
  static getTasks() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}get`, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static update(taskObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}update`, {
            taskObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static updateComplete(taskObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}complete_update`, {
            taskObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default tasksApi;