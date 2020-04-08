let models = require('../models');
var sequelize = require('sequelize');
const db = require('../models/index');
var CONST = require('../const');
const op = sequelize.Op;

exports.update = function (req, res, next) {
    return models.tasks.update({
        tasks: req.body.taskObj._tasks,
        completed_tasks: req.body.taskObj._completed_tasks
    }, {
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

//delete
exports.update_complete = function (req, res, next) {
    return models.tasks.update({
        completed_tasks: req.body.taskObj._completed_tasks
    }, {
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

exports.get = function (req, res, next) {
    return models.tasks.findAll({
        include: [{
            model: models.users,
            required: true,
            as: 'user_task',
            attributes: ["username"]
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