'use strict';
module.exports = (sequelize, DataTypes) => {
    var users = sequelize.define('users', {
        id: {
            type: DataTypes.STRING, //UUID
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });

    return users;
}
