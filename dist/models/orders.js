"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Orders = database_1.sequelize.define('Orders', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    payment_status: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    totalprice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    netprice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    member_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    isReview: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders',
    timestamp: false,
});
