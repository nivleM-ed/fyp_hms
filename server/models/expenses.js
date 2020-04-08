'use strict';
module.exports = (sequelize, DataTypes) => {
    var expenses = sequelize.define('expenses', {
        id: {
            type: DataTypes.STRING, //UUID
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expenses: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });

    return expenses;
}
