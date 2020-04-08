'use strict';
module.exports = (sequelize, DataTypes) => {
    var recipe = sequelize.define('recipe', {
        id: {
            type: DataTypes.STRING, //UUID
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pic_path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ingredients: {
            type: DataTypes.JSON,
            allowNull: true
        },
        methods: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });

    return recipe;
}