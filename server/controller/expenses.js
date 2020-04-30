let models = require('../models');
var sequelize = require('sequelize');
const db = require('../models/index');
var CONST = require('../const');
const op = sequelize.Op;

exports.update = function (req, res, next) {
    return models.expenses.update({
        expenses: req.body.expObj._expenses,
        recurring_payment: req.body.expObj._recurring_payment,
        all_time_amount_spent: req.body.expObj._all_time_amount_spent != null ? parseInt(req.body.expObj._all_time_amount_spent) : 0,
        all_time_amount_received: req.body.expObj._all_time_amount_received != null ? parseInt(req.body.expObj._all_time_amount_received) : 0,
        all_categories: req.body.expObj._all_categories
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
}

exports.get = function (req, res, next) {
    return models.expenses.findOne({
        include: [{
            model: models.users,
            required: true,
            as: 'user_expenses',
            attributes: ['username']
        }],
        where: {
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err)
        res.status(500).send(err);
    })
}