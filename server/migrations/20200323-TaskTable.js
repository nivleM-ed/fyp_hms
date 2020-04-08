'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tasks', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING, //UUID
                defaultValue: Sequelize.UUIDV4,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            user_id: {
                allowNull: false,
                type: Sequelize.STRING
            },
            tasks: {
                allowNull: true,
                type: Sequelize.JSON
            },
            completed_tasks: {
                allowNull: true,
                type: Sequelize.JSON
            }
        }, {
            freezeTableName: true
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('tasks');
    }
};


