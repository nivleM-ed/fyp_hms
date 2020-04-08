'use strict';
module.exports = (sequelize, DataTypes) => {
    var inventory = sequelize.define('inventory', {
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
        assets: {
            type: DataTypes.JSON,
            allowNull: true
        },
        food: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });

    return inventory;
}
