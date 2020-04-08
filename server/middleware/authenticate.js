let createError = require('http-errors');

exports.isLoggedIn = function (req, res, next) {
    try {
        if (req.user) {
            next();
        }
        else {
            res.send({
                err: "notLoggedIn"
            });
        }
    } catch (error) {
        res.send({
            err: "systemErr"
        })
    }
}

