let models = require('./models');
var sequelize = require('sequelize');

exports.run_db = function() {
    //Tasks
    models.users.hasOne(models.tasks, {
        as: 'tasks',
        foreignKey: 'user_id'
    });
    models.tasks.belongsTo(models.users, {
        as: 'user_task',
        foreignKey: 'user_id',
        targetKey: 'id'
    });

    //Inventory
    models.users.hasOne(models.inventory, {
        as: 'inventory',
        foreignKey: 'user_id'
    });
    models.inventory.belongsTo(models.users, {
        as: 'user_inv',
        foreignKey: 'user_id',
        targetKey: 'id'
    });

    //Expenses
    models.users.hasOne(models.expenses, {
        as: 'expenses',
        foreignKey: 'user_id'
    });
    models.expenses.belongsTo(models.users, {
        as: 'user_expenses',
        foreignKey: 'user_id',
        targetKey: 'id'
    });

    //Notification
    models.users.hasOne(models.notification, {
        as: 'notification',
        foreignKey: 'user_id'
    });
    models.notification.belongsTo(models.users, {
        as: 'user_notify',
        foreignKey: 'user_id',
        targetKey: 'id'
    });
}