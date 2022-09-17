"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Settings = database_1.sequelize.define('Settings', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    setting_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    setting_value: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    display: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'settings',
    timestamp: false,
});
