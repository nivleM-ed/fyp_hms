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


