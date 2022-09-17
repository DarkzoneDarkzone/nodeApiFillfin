"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccount = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.BankAccount = database_1.sequelize.define('BankAccount', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    bank_number: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    branch: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    bank_provider_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'bank_account',
    timestamp: false
});
