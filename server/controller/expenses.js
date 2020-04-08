let models = require('../models');
var sequelize = require('sequelize');
const db = require('../models/index');
var CONST = require('../const');
const op = sequelize.Op;

exports.update = function (req, res, next) {
    return models.expenses.update({
        expenses: req.body.expObj._expenses
    }, {
        where: {
            id: req.body.expObj._id,
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
            model: models.Users,
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
        res.status(500).send(err);
    })
}