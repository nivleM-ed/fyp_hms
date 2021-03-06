'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('inventory', {
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
            assets: {
                allowNull: true,
                type: Sequelize.JSON
            },
            food: {
                allowNull: true,
                type: Sequelize.JSON
            },
            recipe: {
                allowNull: true,
                type: Sequelize.JSON
            },
            all_categories: {
                allowNull: true,
                type: Sequelize.JSON
            },
            low_food_setting: {
                allowNull: true,
                type: Sequelize.JSON
            },
            shopping_list: {
                allowNull: true,
                type: Sequelize.JSON
            },
        }, {
            freezeTableName: true
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('inventory');
    }
};


