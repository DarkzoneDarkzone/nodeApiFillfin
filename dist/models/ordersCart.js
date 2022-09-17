"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersCart = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.OrdersCart = database_1.sequelize.define('OrdersCart', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    memberId: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders_cart',
    timestamp: false,
});
