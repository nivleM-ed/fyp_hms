/* eslint-disable no-async-promise-executor */
import axios from "axios";
import {
  CONST
} from './const';
const url = CONST.CONST_URL.concat('/recipe/');

class recipeApi {
  static add(recipeObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}add`, {
          recipeObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static update(recipeObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}update`, {
          recipeObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static delete(recipeObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}delete`, {
          recipeObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static search(recipeObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}search`, {
          recipeObj
        }, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static uploadPic(file) {
    const formData = new FormData()
    formData.append('file', file);
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${CONST.CONST_URL}/upload`, formData, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static recipe_titles() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${url}recipe_titles`, {
          withCredentials: true
        });
        resolve(res.data);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default recipeApi;