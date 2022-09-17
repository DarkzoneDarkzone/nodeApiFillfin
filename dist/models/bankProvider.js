"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankProvider = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.BankProvider = database_1.sequelize.define('BankProvider', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    short_name: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'bank_provider',
    timestamp: false
});
