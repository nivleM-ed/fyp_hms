/* eslint-disable no-async-promise-executor */
import axios from "axios";
import {
  CONST
} from './const';
const url = CONST.CONST_URL.concat('/expenses/');

class expenseApi {
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

  static update(expObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}update`, {
            expObj
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

export default expenseApi;