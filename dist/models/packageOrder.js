"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageOrder = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.PackageOrder = database_1.sequelize.define('PackageOrder', {
    pack_order_id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    begin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    expire: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status_expire: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status_confirm: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    status_payment: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    member_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package_order',
    timestamp: false,
});
