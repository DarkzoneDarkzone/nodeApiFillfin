"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Orders = database_1.sequelize.define('Orders', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    payment_status: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    totalPrice: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    netPrice: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    store_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    member_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    note: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders',
    timestamp: false,
});
