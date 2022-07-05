"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersPayment = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.OrdersPayment = database_1.sequelize.define('OrdersPayment', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    product_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    product_name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    product_content: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    incart: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders_product',
    timestamp: false,
});
