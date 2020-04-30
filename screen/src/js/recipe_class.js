/* eslint-disable no-unused-vars */
export default class recipeClass {
    constructor() {
        var title = null;
        var description = null;
        var ingredients = null;
        var methods = null;
        var pic_path = null;
        var in_param_1 = null;
        var in_param_2 = null;
        var in_param_3 = null;
        var in_param_4 = null;
        var in_param_5 = null;
        var in_page = 0;
        var total_page = 0;
    }
    get title() {
        return this._title;
    }
    set title(in_title) {
        this._title = in_title;
    }

    get description() {
        return this._description;
    }
    set description(in_description) {
        this._description = in_description;
    }

    get ingredients() {
        return this._ingredients;
    }
    set ingredients(in_ingredients) {
        this._ingredients = in_ingredients;
    }

    get methods() {
        return this._methods;
    }
    set methods(in_methods) {
        this._methods = in_methods;
    }

    get pic_path() {
        return this._pic_path;
    }
    set pic_path(in_pic_path) {
        this._pic_path = in_pic_path;
    }

    get in_param_1() {
        return this._in_param_1;
    }
    set in_param_1(in_in_param_1) {
        this._in_param_1 = in_in_param_1;
    }

    get in_param_2() {
        return this._in_param_2;
    }
    set in_param_2(in_in_param_2) {
        this._in_param_2 = in_in_param_2;
    }

    get in_param_3() {
        return this._in_param_3;
    }
    set in_param_3(in_in_param_3) {
        this._in_param_3 = in_in_param_3;
    }

    get in_param_4() {
        return this._in_param_4;
    }
    set in_param_4(in_in_param_4) {
        this._in_param_4 = in_in_param_4;
    }

    get in_param_5() {
        return this._in_param_5;
    }
    set in_param_5(in_in_param_5) {
        this._in_param_5 = in_in_param_5;
    }

    get in_page() {
        return this._in_page;
    }
    set in_page(in_in_page) {
        this._in_page = in_in_page;
    }

    get total_page() {
        return this._total_page;
    }
    set total_page(in_total_page) {
        this._total_page = in_total_page;
    }

    
  //methods
  toJson() {
    let temp = JSON.stringify(this);
    return JSON.parse(temp);
  }

  //set next page
  nextPage() {
    this.in_page = this.in_page + 1;
    if (this.in_page > this.total_page) {
      this.in_page = this.total_page;
    }
    return this.in_page;
  }

  //set prev page
  prevPage() {
    this.in_page = this.in_page - 1;
    if (this.in_page <= 0) {
      this.in_page = 1;
    }
    return this.in_page;
  }

}
