"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersProduct = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.OrdersProduct = database_1.sequelize.define('OrdersProduct', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    product_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    product_content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    gross_profit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders_product',
    timestamp: false,
});
