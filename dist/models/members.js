"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Members = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Members = database_1.sequelize.define('Members', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    member_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    access_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    gender: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    isStore: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    note: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    statusMember: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'members',
    timestamp: false,
});
