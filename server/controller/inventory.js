let models = require('../models');
var sequelize = require('sequelize');
const db = require('../models/index');
var CONST = require('../const');
const op = sequelize.Op;

exports.update = function (req, res, next) {
    return models.inventory.update({
        food: req.body.invObj._food,
        assets: req.body.invObj._assets,
        shopping_list: req.body.invObj._shopping_list,
        // all_categories: req.body.invObj._all_categories,
        low_food_setting: req.body.invObj._low_food_setting,
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
}

exports.get = function (req, res, next) {
    return models.inventory.findOne({
        include: [{
            model: models.users,
            required: true,
            as: 'user_inv',
            attributes: ['username']
        }],
        where: {
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
}