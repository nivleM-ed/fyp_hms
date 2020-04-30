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
        all_time_amount_spent: {
            type: DataTypes.JSON,
            allowNull: true
        },
        all_time_amount_received: {
            type: DataTypes.JSON,
            allowNull: true
        },
        all_categories: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        recurring_payment: {
            type: DataTypes.JSON,
            allowNull: true
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
