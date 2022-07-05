"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankProvider = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.BankProvider = database_1.sequelize.define('BankProvider', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    short_name: {
        type: Sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    image: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'bank_provider',
    timestamp: false
});
