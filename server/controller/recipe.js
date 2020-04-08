const db = require('../models/index');
const CONST = require('../const');
const fs = require('fs');

exports.add = function (req, res, next) {
    return db.sequelize
        .query('SELECT * from F_RECIPE_ADD(:a, :b, :c, :d, :e)', {
            replacements: {
                a: req.body.recipeObj._title, //in_title
                b: req.body.recipeObj._description, //in_description
                c: req.body.recipeObj._pic_path,
                d: JSON.stringify(req.body.recipeObj._ingredients), //in_ingredients
                e: JSON.stringify(req.body.recipeObj._methods), //in_methods
            }
        })
        .then(data => {
            res.send(data[0]);
        }).catch(err => {
            res.status(500).send(err);
        });
}

exports.update = function (req, res, next) {
    return db.sequelize
        .query('SELECT * from F_RECIPE_UPDATE(:a, :b, :c, :d, :e, :f)', {
            replacements: {
                a: (req.body.recipeObj._in_param_1 == null ? null : req.body.recipeObj._in_param_1), //recipe_id
                b: req.body.recipeObj._title, //in_title
                c: req.body.recipeObj._pic_path,
                d: req.body.recipeObj._description, //in_description
                e: JSON.stringify(req.body.recipeObj._ingredients), //in_ingredients
                f: JSON.stringify(req.body.recipeObj._methods), //in_methods
            }
        })
        .then(data => {
            res.send(data[0]);
        }).catch(err => {
            res.status(500).send(err);
        });
}

exports.delete = function (req, res, next) {
    const runSP = (req, res, next) => {
        return new Promise((resolve, reject) => {
            return db.sequelize
                .query('SELECT * from F_RECIPE_DELETE(:a)', {
                    replacements: {
                        a: (req.body.recipeObj._in_param_1 == null ? null : req.body.recipeObj._in_param_1), //recipe_id
                    }
                })
                .then(data => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(500).send(err);
                });
        })
    }

    return runSP(req, res, next).then(data => {
        if (data[0].remove_file != null) {
            let link = './public/img/uploads/' + data[0].remove_file;
            fs.unlinkSync(link);
        }

        res.send({
            data
        });
    }).catch(err => {
        res.status(500).send(err);
    })
}

exports.search = function (req, res, next) {
    const pageLim = (req.body.recipeObj._in_param_3 == null ? parseInt(CONST.CONST_page_limit) : parseInt(req.body.recipeObj._in_param_3));
    const runSP = (req, res, next) => {
        return new Promise((resolve, reject) => {
            return db.sequelize
                .query('SELECT * from F_RECIPE_SEARCH(:a, :b, :c, :d)', {
                    replacements: {
                        a: (req.body.recipeObj._in_param_1 == null ? null : req.body.recipeObj._in_param_1),
                        b: (req.body.recipeObj._in_param_2 == null ? null : req.body.recipeObj._in_param_2),
                        c: parseInt(req.body.recipeObj._in_page) - 1,
                        d: pageLim
                    }
                })
                .then(data => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(err);
                });
        })
    }

    return runSP(req, res, next).then(data => {
        let totalpage = (data[0] == null ? parseInt(1) : Math.ceil(parseInt(data[0].totalrecords) / pageLim));
        let result = [data, totalpage];
        res.send({
            result
        });
    }).catch(err => {
        res.status(500).send(err);
    })
}