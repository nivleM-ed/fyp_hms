/* eslint-disable no-async-promise-executor */
import axios from "axios";
import {
  CONST
} from './const';
const url = CONST.CONST_URL.concat('/users/');

class usersApi {
  static register(userObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}register`, {
          userObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static login(username, password) {
    console.log('Login URL: '+ url)
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}login`, {
          username,
          password
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static check_logged() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}check_logged`, { "check": "check" }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static logout() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}logout`, { "check": "check" }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static versionB() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}version`, { "check": "check" }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default usersApi;