let models = require('../models');
var sequelize = require('sequelize');
const db = require('../models/index');
var CONST = require('../const');
const op = sequelize.Op;

exports.update = function (req, res, next) {
    return models.notification.update({
        notification: req.body.notifyObj._notification,
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.get = function (req, res, next) {
    return models.notification.findAll({
        include: [{
            model: models.users,
            required: true,
            as: 'user_notify',
            attributes: ["username"]
        }],
        where: {
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err)
        res.status(500).send(err);
    });
};