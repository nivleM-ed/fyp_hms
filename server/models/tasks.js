'use strict';
module.exports = (sequelize, DataTypes) => {
    var tasks = sequelize.define('tasks', {
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
        tasks: {
            type: DataTypes.JSON,
            allowNull: true
        },
        completed_tasks: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });

    return tasks;
}
