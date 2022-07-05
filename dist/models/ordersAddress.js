"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersAddress = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.OrdersAddress = database_1.sequelize.define('OrdersAddress', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    address: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    district: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    subdistrict: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    province: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    code: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    note: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders_address',
    timestamp: false,
});
