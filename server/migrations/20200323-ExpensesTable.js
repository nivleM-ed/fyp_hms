'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('expenses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING, //UUID
                defaultValue: Sequelize.UUIDV4,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            user_id: {
                allowNull: false,
                type: Sequelize.STRING
            },
            all_time_amount_spent: {
                type: Sequelize.JSON,
                allowNull: true
            },
            all_time_amount_received: {
                type: Sequelize.JSON,
                allowNull: true
            },
            all_categories: {
                allowNull: true,
                type: Sequelize.ARRAY(Sequelize.STRING)
            },
            recurring_payment: {
                allowNull: true,
                type: Sequelize.JSON
            },
            expenses: {
                allowNull: true,
                type: Sequelize.JSON
            }
        }, {
            freezeTableName: true
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('expenses');
    }
};


