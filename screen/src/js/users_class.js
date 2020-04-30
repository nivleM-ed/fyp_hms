/* eslint-disable no-unused-vars */
import axios from "axios";
import { CONST } from './const';
const moment = require("moment");
const url = CONST.CONST_URL.concat('/users/');

export default class userClass {
  constructor() {
    var username = null;
    var password = null;
    var firstname = null;
    var lastname = null;
  }
  get username() {
    return this._username;
  }
  set username(in_username) {
    this._username = in_username;
  }

  get password() {
    return this._password;
  }
  set password(in_password) {
    this._password = in_password;
  }

  get firstname() {
    return this._firstname;
  }
  set firstname(in_firstname) {
    this._firstname = in_firstname;
  }

  get lastname() {
    return this._lastname;
  }
  set lastname(in_lastname) {
    this._lastname = in_lastname;
  }


  //methods

  async login(username, password) {
    try {
      const res = await axios.post(`${url}login`, {
        username,
        password
      }, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async check_logged() {
    try {
      const res = await axios.post(`${url}check_logged`, { "check": "check" }, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async logout() {
    try {
      const res = await axios.post(`${url}logout`, { "check": "check" }, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async register() {
    let userObj = this.toJson();
    try {
      const res = await axios.post(`${url}register`, {
        userObj
      }, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  async versionB() {
    try {
      const res = await axios.get(`${url}version`, { "check": "check" }, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  toJson() {
    let temp = JSON.stringify(this);
    return JSON.parse(temp);
  }
}
