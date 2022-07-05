"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccount = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.BankAccount = database_1.sequelize.define('BankAccount', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    bank_number: {
        type: Sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    branch: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    bank_provider_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'bank_account',
    timestamp: false
});
