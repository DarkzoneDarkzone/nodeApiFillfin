"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Review = database_1.sequelize.define('Review', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    member_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    order_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    star: {
        type: Sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    store_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'review',
    timestamp: false,
});
