/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import axios from "axios";
import { CONST } from './const';
import taskClass from './task_class';
const url = CONST.CONST_URL.concat('/inventory/');

export default class inventoryClass {
    constructor() {
        var food = [];
        var recipe = [];
        var shopping_list = [];
        var low_food_setting = {};
        var all_categories = [];
    }
    get food() {
        return this._food;
    }
    set food(in_food) {
        this._food = in_food;
    }

    get recipe() {
        return this._recipe;
    }
    set recipe(in_recipe) {
        this._recipe = in_recipe;
    }

    get shopping_list() {
        return this._shopping_list;
    }
    set shopping_list(in_shopping_list) {
        this._shopping_list = in_shopping_list;
    }

    get low_food_setting() {
        return this._low_food_setting;
    }
    set low_food_setting(in_low_food_setting) {
        this._low_food_setting = in_low_food_setting;
    }

    get all_categories() {
        return this._all_categories;
    }
    set all_categories(in_all_categories) {
        this._all_categories = in_all_categories;
    }

    //methods
    async updateFood(data) {
        try {
            await this.getInvDB();
            this.food = data;
            await this.updateInvDB();
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    
    async addShoppingList(data, array) {
        if(array) {

        } else {
            
        }
    }

    async updateInvDB() {
        let invObj = this.toJson();
        try {
            const res = await axios.post(`${url}update`, {
                invObj
            }, {
                withCredentials: true
            });
        } catch (err) {
            return err;
        }
    }

    async getInvDB() {
        try {
            const res = await axios.get(`${url}get`, {
                withCredentials: true
            });
            this.food = res.data.food != null ? res.data.food : [];
            this.recipe = res.data.recipe != null ? res.data.recipe : [];
            this.shopping_list = res.shopping_list != null ? res.data.shopping_list : [];
            this.all_categories = res.all_categories != null ? res.data.all_categories : [];
            this.low_food_setting = res.low_food_setting != null ? res.low_food_setting : {};
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