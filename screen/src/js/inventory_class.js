/* eslint-disable no-unused-vars */
import utils from "@/js/utils.js";
import axios from "axios";
import {
    CONST
} from './const';
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

    async updateLowSetting(data) {
        try {
            await this.getInvDB();
            this.low_food_setting = data;
            await this.updateInvDB();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async updateShoppingList(data) {
        try {
            await this.getInvDB();
            this.shopping_list = data;
            await this.updateInvDB();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async setShopListComplete(id) {
        try {
            await this.getInvDB();
            this.shopping_list[this.shopping_list.findIndex(x => x.id == id)].completed = true;
            
            await this.topUpFood(this.shopping_list[this.shopping_list.findIndex(x => x.id == id)].data);

            await this.updateInvDB();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async topUpFood(data) {
        console.log(data)
        for(let item in data) {
            let itemNo = this.food.findIndex((x)=> x.id == data[item].id);
            if(itemNo > -1) {
                this.food[itemNo].quantity = parseInt(this.food[itemNo].quantity) + parseInt(data[item].shoplist_quantity);
            }
             
        }
    }

    async removeTaskId(id) {
        try {
            await this.getInvDB();
            this.shopping_list[this.shopping_list.findIndex(x => x.id == id)].task_id = null;

            await this.updateInvDB();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async addShoppingList(list_id, data, array) {
        let list_index = this.shopping_list.findIndex(x => x.id === list_id);
        if (array) {
            for (var i = 0; i < data.length; i++) {
                let index = this.shopping_list[list_index].data.findIndex(x => x.id === data[i].id);
                if (index < 0) {
                    data[i].shoplist_quantity = data[i].add_quantity;
                    this.shopping_list[list_index].data.push(data[i]);
                } else {
                    this.shopping_list[list_index].data[index].shoplist_quantity = parseInt(this.shopping_list[list_index].data[index].shoplist_quantity == null ? 0 : this.shopping_list[list_index].data[index].shoplist_quantity) + parseInt(data[i].add_quantity);
                }
                this.food[this.food.findIndex(x => x.id === data[i].id)].add_quantity = 0;
            }
        } else {
            let index = this.shopping_list[list_index].data.findIndex(x => x.id === data.id);
            if (index < 0) {
                data.shoplist_quantity = data.add_quantity;
                this.shopping_list[list_index].data.push(data);
            } else {
                this.shopping_list[list_index].data[index].shoplist_quantity = parseInt(this.shopping_list[list_index].data[index].shoplist_quantity == null ? 0 : this.shopping_list[list_index].data[index].shoplist_quantity) + parseInt(data.add_quantity);
            }
            this.food[this.food.findIndex(x => x.id === data.id)].add_quantity = 0;
        }
        await this.updateInvDB();
    }

    async addShoppingTask(data) { //todo almsot there   
        try {
            await this.getInvDB();
            let taskObj = new taskClass();
            let tmpData = {
                shopping_list_id: data.list_id,
                shopping_list: data.shopping_list,
                type: data.type,
                name: data.name,
                description: data.description,
                start_date: data.start_date,
                end_date: data.end_date,
                start_time: data.start_time,
                end_time: data.end_time,
                one_day: data.one_day,
                whole_day: data.whole_day,
                color: data.color,
                amount: data.amount
            };
            let taskTmp = await taskObj.addNewTask(tmpData);
            this.shopping_list[this.shopping_list.findIndex(x => x.id === data.list_id)].task_id = taskTmp.id;
            await this.updateInvDB();
        } catch (err) {
            console.log(err);
            return err;
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
            this.shopping_list = res.data.shopping_list != null ? res.data.shopping_list : [];
            this.all_categories = res.data.all_categories != null ? res.data.all_categories : [];
            this.low_food_setting = res.data.low_food_setting != null ? res.data.low_food_setting : {};
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