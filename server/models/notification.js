'use strict';
module.exports = (sequelize, DataTypes) => {
    var notification = sequelize.define('notification', {
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
        notification: {
            type: DataTypes.JSON,
            allowNull: true
        },
    }, {
        freezeTableName: true
    });

    return notification;
}