"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagePayment = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.PackagePayment = database_1.sequelize.define('PackagePayment', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    pack_order_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    slip: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    status_confirm: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    user_confirm: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    bank_ref: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package_payment',
    timestamp: false,
});
