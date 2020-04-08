let models = require('../models');
var sequelize = require('sequelize');
const db = require('../models/index');
var CONST = require('../const');
const op = sequelize.Op;

exports.assets_update = function (req, res, next) {
    return models.inventory.update({
        assets: req.body.invObj._assets
    }, {
        where: {
            id: req.body.invObj._id,
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
}

exports.food_update = function (req, res, next) {
    return models.inventory.update({
        food: req.body.invObj._food
    }, {
        where: {
            id: req.body.invObj._id,
            user_id: req.user.id
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    })
}

exports.get = function (req, res, next) {
    return models.inventory.findOne({
        include: [{
            model: models.Users,
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
        res.status(500).send(err);
    })
}