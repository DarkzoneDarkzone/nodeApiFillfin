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
    bank_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    slip: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    status_confirm: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    total_pay: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date_pay: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders_payment',
    timestamp: false,
});
