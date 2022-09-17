"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagePayment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.PackagePayment = database_1.sequelize.define('PackagePayment', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    package_order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    slip: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    status_confirm: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    user_confirm: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    bank_ref: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package_payment',
    timestamp: false,
});
