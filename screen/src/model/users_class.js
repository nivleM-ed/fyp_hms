/* eslint-disable no-unused-vars */
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
  toJson() {
    let temp = JSON.stringify(this);
    return JSON.parse(temp);
  }
}
