"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Log = database_1.sequelize.define('Log', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    user_code: {
        type: sequelize_1.DataTypes.TEXT
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    details: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    ip_address: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    section: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'log',
    timestamp: false
});
