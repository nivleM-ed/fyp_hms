let models = require('../models');
let bcrypt = require('bcrypt');
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
const {
    isEmpty
} = require('lodash');
const {
    validateUser
} = require('../validators/signup');
var sequelize = require('sequelize');
const op = sequelize.Op;
var CONST = require('../const');

const generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//login
exports.login = function (req, res, next) {
    passport.authenticate('local', {
        session: true
    }, function (err, user, info) {
        if (err) {
            res.send(err);
        } else if (!user) {
            res.send(info);
        } else {
            req.logIn(user, function (err) {
                res.send(user);
            });
        }
    })(req, res, next);
};

//check if logged in
exports.check_logged = function (req, res, next) {
    try {
        res.status(200).send(req.user);
    } catch (err) {
        res.send(err);
    }
};

//logout
exports.logout = function (req, res, next) {
    try {
        req.logout();
        req.session.destroy();
        
        res.status(200).send({
            logout: "logout"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.add_user = function (req, res, next) {
    let errors = {};
    return validateUser(errors, req).then(errors => {
        if (!isEmpty(errors)) {
            res.send(errors);
        } else {
            newUser = models.users.build({
                username: req.body.userObj._username,
                password: generateHash(req.body.userObj._password),
                firstname: req.body.userObj._firstname,
                lastname: req.body.userObj._lastname
            });
            return newUser.save().then(result => {
                console.log("results",result.id);
                setNewUser(result);
                res.status(200).send();
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    });
};

setNewUser = (data) => {
    const setTasks = (data) => {
        return new Promise((resolve, reject) => {
            return models.tasks.create({
                user_id: data.id
            }).then(psr => {
                resolve(psr);
            }).catch(err => {
                reject(err);
            });
        });
    };

    const setExpenses = (data) => {
        return new Promise((resolve, reject) => {
            return models.expenses.create({
                user_id: data.id,
                all_categories: ['transportation', 'food', 'utilities', 'insurance', 'housing', 'healthcare', 'entertainment', 'miscellaneous'],
                all_time_spending: 0
            }).then(psr => {
                resolve(psr);
            }).catch(err => {
                reject(err);
            });
        });
    };

    const setInventory = (data) => {
        return new Promise((resolve, reject) => {
            return models.inventory.create({
                user_id: data.id
            }).then(psr => {
                resolve(psr);
            }).catch(err => {
                reject(err);
            });
        });
    };

    const setNotification = (data) => {
        return new Promise((resolve, reject) => {
            return models.notification.create({
                user_id: data.id
            }).then(psr => {
                resolve(psr);
            }).catch(err => {
                reject(err);
            });
        });
    };

    Promise.all([setExpenses(data), setInventory(data), setTasks(data), setNotification(data)])
        .then(result => {
            console.log("New user added:", data.id, "(", data.username,")");
        }).catch(err => {
            console.log(err); //delete user if fail
        });
};

exports.version = function (req, res, next) {
    try {
        let version = CONST.version;
        res.send(version);
    } catch (err) {
        res.status(500).send(err);
    }
};
