"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenLog = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.TokenLog = database_1.sequelize.define('TokenLog', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    reset_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    section: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'token_log',
    timestamp: false
});
