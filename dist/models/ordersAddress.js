"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersAddress = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.OrdersAddress = database_1.sequelize.define('OrdersAddress', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    district: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    subdistrict: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    province: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    note: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders_address',
    timestamp: false,
});
