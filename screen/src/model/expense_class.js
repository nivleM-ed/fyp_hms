/* eslint-disable no-unused-vars */
import expenseApi from "@/api/expense_api.js";
import utils from "@/api/utils.js";

export default class expenseClass {
    constructor() {
        var expenses = [];
        var date = null;
        var title = null;
        var spending = null;
        var description = null;
    }
    
    
    //methods
    toJson() {
        let temp = JSON.stringify(this);
        return JSON.parse(temp);
      }
}